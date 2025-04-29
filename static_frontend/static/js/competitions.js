// 竞赛数据管理与处理
let competitionData = {};

// 当前选择的竞赛ID
let currentCompetition = 'overall';

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
  // 设置Marked.js配置
  setupMarkedConfig();
  
  // 先获取所有比赛名称，然后初始化选择器
  fetchCompetitions();
  
  // 绑定按钮点击事件
  $('#competitionLoadBtn').click(function() {
    const competitionId = $('#competitionSelect').val();
    if (competitionId) {
      loadCompetitionData(competitionId);
    }
  });
  
  $('#top10Btn').click(function() {
    loadOverallData();
  });
  
  // 展示加载页面
  showLoading();
  
  // 默认加载整体数据
  loadOverallData();
});

// 从后端获取所有比赛名称
function fetchCompetitions() {
  fetch('http://localhost:8090/api/data/competitions')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(competitions => {
      // 初始化竞赛选择器
      initializeCompetitionSelector(competitions);
      
      // 默认选中"overall"
      selectCompetition('overall');
    })
    .catch(error => {
      console.error('获取比赛名称失败:', error);
      // 如果API调用失败，使用默认的选择器选项
      const defaultCompetitions = ['overall', 'IChO 2025', 'IPhO 2025', 'IBO 2025', 'IGeO 2025'];
      initializeCompetitionSelector(defaultCompetitions);
      selectCompetition('overall');
    });
}

// 初始化竞赛选择器
function initializeCompetitionSelector(competitions) {
  const container = document.querySelector('.competition-selector .selector-container');
  
  // 清空现有的选择器选项
  container.innerHTML = '';
  
  // 为每个比赛创建选择器选项
  competitions.forEach(competition => {
    // 格式化显示名称
    let displayName = competition;
    if (competition === 'overall') {
      displayName = 'Overall';
    }
    
    const button = document.createElement('button');
    button.className = 'selector-item';
    button.setAttribute('data-competition', competition);
    button.textContent = displayName;
    
    // 添加点击事件处理程序
    button.addEventListener('click', function() {
      selectCompetition(competition);
    });
    
    container.appendChild(button);
  });
}

// 选中指定的竞赛
function selectCompetition(competitionId) {
  // 更新UI，高亮显示选中的竞赛
  document.querySelectorAll('.selector-item').forEach(item => {
    if (item.getAttribute('data-competition') === competitionId) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
  
  // 更新当前竞赛ID
  currentCompetition = competitionId;
  
  // 如果已经有该竞赛的数据，直接重新加载表格
  if (competitionData[competitionId]) {
    reloadTableData(competitionId);
    return;
  }
  
  // 否则，从后端获取数据
  fetchCompetitionData(competitionId);
}

// 从后端获取指定竞赛的数据
function fetchCompetitionData(competitionId) {
  // 显示加载状态
  $('#myTopTable').html('<div class="loading-indicator">Loading data...</div>');
  
  // 确保先清除表格类
  $('#myTopTable').removeClass('overall-table').removeClass('non-overall-table');
  
  // 构建API URL
  let apiUrl = '';
  if (competitionId === 'overall') {
    apiUrl = 'http://localhost:8090/api/data/overall';
  } else {
    apiUrl = `http://localhost:8090/api/data/competition/${competitionId}`;
  }
  
  // 获取数据
  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // 存储数据并更新表格
      competitionData[competitionId] = data;
      
      // 清除加载指示器
      $('#myTopTable').empty();
      
      // 重新加载表格数据
      reloadTableData(competitionId);
    })
    .catch(error => {
      console.error('获取数据失败:', error);
      
      // 清除表格上的所有特定类，确保没有残留样式
      $('#myTopTable').removeClass('overall-table').removeClass('non-overall-table');
      
      // 如果是overall视图，显示通用错误消息
      if (competitionId === 'overall') {
        $('#myTopTable').html('<div class="error-message">Failed to load overall data. Please try again later.</div>');
        $('.tableHeading').html('<div style="text-align: center; font-weight: bold; font-size: 1.2rem; color: #276dff; margin-bottom: 1rem;">Overall model performance on scientific competitions.</div>');
      } 
      // 如果是非overall视图，创建一个模拟数据并应用非overall样式
      else {
        $('#myTopTable').html('<div class="error-message">The competition data could not be loaded. Please try again later.</div>');
        
        // 即使API失败，也确保添加非overall类
        $('#myTopTable').addClass('non-overall-table');
        
        // 设置比赛特定的表格标题，保持与成功加载时相同的样式
        $('.tableHeading').html(`<div style="text-align: center; font-weight: bold; font-size: 1.2rem; color: #276dff; margin-bottom: 1rem;">(${competitionId})</div>`);
      }
    });
}

// 根据选择的竞赛重新加载表格数据
function reloadTableData(competitionId) {
  // 获取选定竞赛的数据
  const data = competitionData[competitionId];
  
  // 清除之前的表格
  if ($.fn.DataTable.isDataTable('#myTopTable')) {
    $('#myTopTable').DataTable().destroy();
    $('#myTopTable').empty();
  }
  
  // 为表格容器添加或移除类
  if (competitionId === 'overall') {
    $('#myTopTable').addClass('overall-table').removeClass('non-overall-table');
  } else {
    $('#myTopTable').removeClass('overall-table').addClass('non-overall-table');
  }
  
  // 准备列定义
  const columns = [
    { 
      title: "Model", 
      data: "model",
      className: competitionId === 'overall' ? "model-names" : "dt-left model-names",
      width: competitionId === 'overall' ? null : "180px", 
      render: function(data, type, row) {
        // 检查模型是否在比赛后发布，如果是则添加警告标记
        if (row.is_published_after_competition) {
          return data + ' ';
        }
        return data;
      }
    },
    { 
      title: "Avg", 
      data: "avg",
      className: competitionId === 'overall' ? "avg-column" : "dt-center",
      render: function(data) {
        return (data * 100).toFixed(1) + "%";
      }
    }
  ];
  
  // 如果是overall视图，添加每个比赛列
  if (competitionId === 'overall' && data.competitions && data.competitions.length > 0) {
    data.competitions.forEach(competition => {
      columns.push({
        title: competition,
        data: competition,
        className: "competition-column",
        render: function(data) {
          if (data === undefined || data === null) {
            return "N/A";
          }
          return (data * 100).toFixed(1) + "%";
        }
      });
    });
    
    // Overall视图显示描述性文本，但不显示点击提示
    $('.tableHeading').html('<div class="table-heading">Overall model performance on scientific competitions.</div>');
  } 
  // 如果不是overall视图，添加问题列
  else if (competitionId !== 'overall' && data.models.length > 0 && data.models[0].problems) {
    // 添加Cost列
    columns.push({
      title: "Cost",
      data: "cost",
      className: "dt-center avg-cost",
      width: "100px", // 设置固定宽度
      render: function(data) {
        // 使用自定义渲染确保数据居中显示
        return '<div class="centered">' + data + '</div>';
      }
    });
    
    data.models[0].problems.forEach((problem, index) => {
      columns.push({
        title: problem.id,
        data: null,
        className: "dt-center problem-column",
        render: function(rowData) {
          const accuracy = rowData.problems[index].accuracy;
          return (accuracy * 100).toFixed(0) + "%";
        },
        createdCell: function(cell, cellData, rowData) {
          const accuracy = rowData.problems[index].accuracy;
          $(cell).addClass(formatCellColor(accuracy));
        }
      });
    });
    
    // 非Overall视图显示提示文本
    $('.tableHeading').html(`<div class="table-heading">${competitionId} model performance.</div>`);
  }
  
  // 构建表格配置
  const tableConfig = {
    data: data.models,
    columns: columns,
    paging: false,
    searching: false,
    info: false,
    ordering: true,
    order: [[1, 'desc']], // 默认按准确率排序
    responsive: false, // 禁用响应式功能以获得更好的固定列体验
    autoWidth: false,
    scrollX: true,
    scrollCollapse: true,
    stripeClasses: competitionId === 'overall' ? ['odd', 'even'] : [], // 为Overall视图启用条带化
    columnDefs: [
      { targets: 0, width: "180px" }, // Model列宽度
      { targets: 1, width: "80px" },  // Avg列宽度
      { targets: 2, width: "80px" }   // Cost列宽度（如果存在）
    ]
  };
  
  // 如果不是Overall视图，添加固定列配置
  if (competitionId !== 'overall') {
    tableConfig.fixedColumns = {
      left: 3 // 固定左侧3列
    };
  }
  
  // 如果是Overall视图，禁用单元格点击事件并添加奇偶行样式
  if (competitionId === 'overall') {
    tableConfig.createdRow = function(row, data, index) {
      // 禁用单元格点击事件
      $(row).find('td').off('click');
      
      // 添加奇偶行类
      if (index % 2 === 0) {
        $(row).addClass('dt-row-odd');
      } else {
        $(row).addClass('dt-row-even');
      }
    };
  }
  
  // 初始化表格
  const table = $('#myTopTable').DataTable(tableConfig);
  
  // 如果不是Overall视图，添加单元格点击事件处理
  if (competitionId !== 'overall') {
    $('#myTopTable tbody').on('click', 'td', function() {
      handleCellClick(this, table, competitionId);
    });
  }
  
  // 修复表格样式问题
  if (competitionId !== 'overall') {
    // 使用setTimeout确保DOM已完全渲染
    setTimeout(function() {
      // 关键修复 - 应用样式调整
      $('.dataTables_scrollHead').css({
        'margin-bottom': '0',
        'border-bottom': 'none'
      });
      
      $('.dataTables_scrollBody').css({
        'margin-top': '0',
        'border-top': 'none'
      });
      
      // 修复固定列样式
      $('.dtfc-fixed-left-top, .dtfc-fixed-left-bottom').css({
        'background-color': 'white'
      });
      
      $('.dtfc-fixed-left').css({
        'border-right': '2px solid #ddd',
        'box-shadow': '5px 0 5px -5px rgba(0, 0, 0, 0.1)'
      });
      
      // 确保表格边框一致
      $('#myTopTable').closest('.dataTables_wrapper').css({
        'border': '1px solid #ddd',
        'border-radius': '4px',
        'overflow': 'hidden'
      });
    }, 100); // 短延迟确保DOM已更新
  } else {
    // 在Overall视图中直接设置奇偶行背景色
    setTimeout(function() {
      // 使用nth-child选择器而不是:odd/:even
      $('#myTopTable tbody tr:nth-child(odd)').css('background-color', '#ffffff');
      $('#myTopTable tbody tr:nth-child(even)').css('background-color', '#f5f5f5');
      
      // 添加悬停效果
      $('#myTopTable tbody tr').hover(
        function() { $(this).css('background-color', '#eef2f8'); },
        function() { 
          // 恢复原来的背景色
          if ($(this).index() % 2 === 0) {
            $(this).css('background-color', '#ffffff');
          } else {
            $(this).css('background-color', '#f5f5f5');
          }
        }
      );
    }, 100); // 增加延迟确保DOM完全加载
  }
}

// 处理表格单元格点击事件
function handleCellClick(cell, table, competitionId) {
  // 获取单元格信息
  const cellIndex = table.cell(cell).index();
  if (!cellIndex) return; // 防止点击非单元格区域
  
  const colIdx = cellIndex.column;
  const rowIdx = cellIndex.row;
  
  // 跳过模型名称列(0)和Avg列(1)
  if (colIdx <= 1) return;
  
  // 获取模型名称（第一列）
  const rowData = table.row(rowIdx).data();
  if (!rowData) return;
  const modelName = rowData.model;
  
  // 获取问题ID - 从列标题中提取
  const columnHeader = $(table.column(colIdx).header());
  const questionText = columnHeader.text().trim();
  
  // 提取题号 - 假设题号是数字，位于列标题的开头或结尾
  // 这里需要根据实际的题号格式进行调整
  let questionId = questionText;
  
  // 如果是非Overall视图，记录点击并获取模型详情
  console.log(`用户点击了: 比赛=${competitionId}, 模型=${modelName}, 问题=${questionId}`);
  
  // 触发获取模型回答详情的函数
  fetchModelAnswer(competitionId, modelName, questionId);
}

// 获取模型对特定问题的回答详情
function fetchModelAnswer(competitionId, modelName, questionId) {
  // 清理参数，移除可能的后缀
  const cleanQuestionId = questionId.replace(/_exam$/, '');
  
  // 构建API URL
  const url = `http://localhost:8090/api/data/modelAnswer?competitionId=${encodeURIComponent(competitionId)}&modelName=${encodeURIComponent(modelName)}&questionId=${encodeURIComponent(cleanQuestionId)}`;
  
  console.log(`发送请求: ${url}`);
  
  // 显示加载状态
  const detailPanel = getOrCreateDetailPanel();
  detailPanel.html('<div class="loading-indicator">正在加载模型回答详情...</div>');
  
  // 显示遮罩层和详情面板
  $('#modalOverlay').show();
  detailPanel.show();
  
  // 发送API请求
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('获取模型回答详情失败');
      }
      return response.json();
    })
    .then(data => {
      displayModelAnswerDetail(data);
    })
    .catch(error => {
      console.error('获取模型回答详情失败:', error);
      detailPanel.html(`
        <div id="traces">
          <h2 class="tracesHeading">获取模型回答详情失败</h2>
          <div class="marked box response-box">
            ${error.message || '服务器连接失败，请稍后再试'}
            <br><br>
            请求参数:<br>
            - 比赛: ${competitionId}<br>
            - 模型: ${modelName}<br>
            - 问题: ${cleanQuestionId}
          </div>
        </div>
        <button class="close-detail">关闭</button>
      `);
      
      // 添加关闭按钮事件
      $('.close-detail').on('click', function() {
        hideModelAnswerDetail();
      });
    });
}

// 显示模型回答详情 - matharena风格
function displayModelAnswerDetail(data) {
  const detailPanel = getOrCreateDetailPanel();
  
  // 创建HTML结构 - 精确匹配matharena风格并添加适当间距
  let html = `
    <div id="traces" style="display: inline-block; margin:0; padding:0;">
      <h1 id="model-answer-header-title" style="font-size:30px !important; font-weight:bold !important; color:#276dff !important; text-align:center !important; margin-bottom:20px !important;">Solution: Model ${data.modelName} for Problem #${data.questionId}</h1>
      <div class="model-answer-section">
        <h4 style="font-weight: bold; margin:0; padding:0;">Problem</h4>
        <div style="position: relative; margin:0; padding:0;">
          <div class="marked box problem-box" style="white-space: pre-wrap; tab-size: 4;">${processContent(data.originalQuestion)}</div>
        </div>
      </div>
      <div class="model-answer-section">
        <h4 style="font-weight: bold; margin:0; padding:0;">Correct Answer</h4>
        <div class="marked box solution-box">${processContent(data.correctAnswer)}</div>
      </div>
  `;
  
  // 创建包含标签和内容的包装容器
  html += '<div class="tab-wrapper">';
  
  // 创建标签页
  html += '<div class="tab">';
  data.details.forEach((detail, index) => {
    html += `<button class="tablinks${index === 0 ? ' active' : ''}" onclick="openTab(event, 'tab${index}')">${formatRunLabel(detail.run)}</button>`;
  });
  html += '</div>';
  
  // 创建每个标签页的内容
  data.details.forEach((detail, index) => {
    const isCorrect = detail.parsedAnswer === data.correctAnswer;
    
    html += `
      <div class="tabcontent" id="tab${index}" style="display:${index === 0 ? 'block' : 'none'};">
        <div class="model-answer-section">
          <h4 style="font-weight: bold;">Parsed Answer</h4>
          <div class="marked box parsed-answer-box ${isCorrect ? 'correct' : 'incorrect'}" style="white-space: pre-wrap; tab-size: 4;">${processContent(detail.parsedAnswer)}</div>
        </div>
        <div class="model-answer-section">
          <h4 style="font-weight: bold;">Full Model Solution</h4>
          <div class="marked box response-box" style="white-space: pre-wrap; tab-size: 4;">${processContent(detail.fullSolution)}</div>
        </div>
      </div>
    `;
  });
  
  // 关闭tab-wrapper容器
  html += '</div>';
  
  html += '</div>'; // 关闭traces容器
  
  // 添加关闭按钮
  html += '<button class="close-detail">关闭</button>';
  
  detailPanel.html(html);
  
  // 使用setTimeout确保DOM已完全加载
  setTimeout(function() {
    try {
      const headerElement = document.getElementById('model-answer-header-title');
      if (headerElement) {
        headerElement.style.fontSize = '30px';
        headerElement.style.fontWeight = 'bold';
        headerElement.style.color = '#276dff';
        headerElement.style.textAlign = 'center';
        headerElement.style.marginBottom = '20px';
        headerElement.style.display = 'block';
        console.log('标题样式已应用!');
      } else {
        console.error('找不到标题元素!');
      }
    } catch (e) {
      console.error('应用标题样式时出错:', e);
    }
  }, 100);
  
  // 显示遮罩层和详情面板
  $('#modalOverlay').show();
  detailPanel.show();
  
  // 初始化标签页功能
  window.openTab = function(evt, tabId) {
    // 隐藏所有标签页内容
    document.querySelectorAll('.tabcontent').forEach(tab => {
      tab.style.display = 'none';
    });
    
    // 移除所有标签按钮的活动状态
    document.querySelectorAll('.tablinks').forEach(button => {
      button.className = button.className.replace(' active', '');
    });
    
    // 显示当前标签页并设置活动状态
    document.getElementById(tabId).style.display = 'block';
    evt.currentTarget.className += ' active';
    
    // 当切换标签页时重新渲染数学公式
    if (window.MathJax) {
      MathJax.typesetPromise([document.getElementById(tabId)]).catch(function (err) {
        console.log('MathJax渲染失败:', err);
      });
    }
  };
  
  // 渲染数学公式
  if (window.MathJax) {
    try {
      MathJax.typesetPromise([detailPanel[0]]).catch(function (err) {
        console.log('MathJax渲染失败:', err);
      });
    } catch (e) {
      console.error('MathJax渲染失败:', e);
    }
  }
  
  // 更彻底的间距修复 - 使用DOM操作直接处理
  setTimeout(function() {
    // 移除标签内容顶部的空白
    document.querySelectorAll('.tabcontent').forEach(content => {
      content.style.margin = '0';
      content.style.padding = '0';
      content.style.border = 'none';
      
      // 确保第一个子元素没有顶部边距
      if (content.firstElementChild) {
        content.firstElementChild.style.marginTop = '0';
        content.firstElementChild.style.paddingTop = '0';
      }
    });
    
    // 移除任何可能存在的空文本节点
    const cleanWhitespace = (node) => {
      for (let i = 0; i < node.childNodes.length; i++) {
        const child = node.childNodes[i];
        if (child.nodeType === 3 && child.nodeValue.trim() === '') { // 文本节点且为空白
          node.removeChild(child);
          i--;
        } else if (child.nodeType === 1) { // 元素节点
          cleanWhitespace(child);
        }
      }
    };
    
    cleanWhitespace(detailPanel[0]);
    
    // 强制刷新布局
    detailPanel[0].offsetHeight;
  }, 100);
  
  // 添加关闭按钮事件
  $('.close-detail').on('click', function() {
    hideModelAnswerDetail();
  });
}

// 获取或创建详情面板
function getOrCreateDetailPanel() {
  let detailPanel = $('#modelAnswerDetail');
  let overlay = $('#modalOverlay');
  
  // 创建遮罩层（如果不存在）
  if (overlay.length === 0) {
    overlay = $('<div id="modalOverlay" class="modal-overlay"></div>');
    $('body').append(overlay);
    
    // 点击遮罩层关闭详情面板
    overlay.on('click', function() {
      hideModelAnswerDetail();
    });
  }
  
  // 创建详情面板（如果不存在）
  if (detailPanel.length === 0) {
    detailPanel = $('<div id="modelAnswerDetail" class="model-answer-detail-panel"></div>');
    $('body').append(detailPanel);
  }
  
  return detailPanel;
}

// 隐藏模型回答详情面板
function hideModelAnswerDetail() {
  $('#modelAnswerDetail').hide();
  $('#modalOverlay').hide();
}

// 显示模型输出
function displayModelOutput(model, problemId, trace) {
  // 显示模型输出区域
  $('#traces').show();
  
  // 清除现有的模型输出
  $('#traces').empty();
  
  // 添加模型输出标题
  const title = document.createElement('h3');
  title.textContent = `${model} on ${problemId}`;
  $('#traces').append(title);
  
  // 添加模型输出内容
  const content = document.createElement('pre');
  content.textContent = trace;
  $('#traces').append(content);
}

// 显示加载指示器
function showLoading(show) {
  if (show) {
    // 如果有必要，可以添加加载指示器的HTML
    $('.tableHeading').text('Loading data...');
  } else {
    // 恢复正常标题
    $('.tableHeading').text('Click on a cell to see the raw model output.');
  }
}

// 显示错误消息
function showError(message) {
  alert(message);
}

// 更新二级表格(token使用情况)
function updateSecondaryTable(competitionId) {
  // 如果在FAQ中展开了token信息，则更新二级表格
  if ($('#secondaryTable').is(':visible')) {
    const data = competitionData[competitionId];
    // 二级表格更新逻辑...
  }
}

// 格式化运行标签
function formatRunLabel(runLabel) {
  const match = runLabel.match(/run_(\d+)/);
  return match ? `Run ${parseInt(match[1]) + 1}` : runLabel;
}

// 处理HTML和Markdown内容
function processContent(text) {
  if (!text) return '';
  
  let processed = '';
  
  // 检查是否包含Markdown格式的标题，需要在其他预处理前进行
  const containsMarkdownHeading = /^#{1,6}\s+.+$/m.test(text);
  
  // 先进行内容类型判断
  let contentType = determineContentType(text);
  
  // 基于内容类型选择处理方式
  if (contentType === 'markdown' || containsMarkdownHeading) {
    // Markdown内容处理
    try {
      // 首先用DOMPurify清洁原始文本，防止XSS
      const cleanText = DOMPurify.sanitize(text, { ALLOWED_TAGS: [] });
      
      // 配置marked选项，确保正确处理Markdown标题
      marked.use({
        headerIds: false,
        mangle: false
      });
      
      // 使用marked解析Markdown
      processed = marked.parse(cleanText);
      
      // 再次用DOMPurify清洁生成的HTML
      processed = DOMPurify.sanitize(processed, {
        ALLOWED_TAGS: ['table', 'thead', 'tbody', 'tr', 'th', 'td', 'br', 'p', 'div', 'span', 'b', 'i', 'strong', 'em', 'sup', 'sub', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'a', 'img', 'figure', 'figcaption'],
        ALLOWED_ATTR: ['style', 'class', 'id', 'colspan', 'rowspan', 'align', 'href', 'src', 'alt', 'title']
      });
    } catch (e) {
      console.error('Markdown解析错误:', e);
      // 解析失败，回退到基本处理
      processed = preprocessComplexContent(text);
    }
  } else if (contentType === 'html') {
    // HTML内容，使用DOMPurify清洁
    processed = DOMPurify.sanitize(text, {
      ALLOWED_TAGS: ['table', 'thead', 'tbody', 'tr', 'th', 'td', 'br', 'p', 'div', 'span', 'b', 'i', 'strong', 'em', 'sup', 'sub', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'figure', 'figcaption', 'img'],
      ALLOWED_ATTR: ['style', 'class', 'id', 'colspan', 'rowspan', 'align', 'src', 'alt', 'title']
    });
  } else {
    // 复杂文本内容，进行预处理后显示
    processed = preprocessComplexContent(text);
  }
  
  return processed;
}

// 确定内容类型
function determineContentType(text) {
  if (!text) return 'plain';
  
  // 检查是否包含HTML标签
  if (text.includes('<table') || 
      (text.includes('<') && text.includes('>') && 
       !text.includes('##') && !text.includes('**'))) {
    return 'html';
  }
  
  // 检查是否包含Markdown格式
  const markdownPatterns = [
    /^#{1,6}\s+.+$/m,         // 标题: # Heading
    /\*\*[\s\S]+?\*\*/,       // 粗体: **bold**
    /\*[\s\S]+?\*/,           // 斜体: *italic*
    /^>\s+.+$/m,              // 引用: > quote
    /^-\s+.+$/m,              // 无序列表: - item
    /^[0-9]+\.\s+.+$/m,       // 有序列表: 1. item
    /\[.+?\]\(.+?\)/,         // 链接: [text](url)
    /!\[.+?\]\(.+?\)/,        // 图片: ![alt](src)
    /^```[\s\S]*?```$/m,      // 代码块: ```code```
    /`[^`]+`/                 // 行内代码: `code`
  ];
  
  for (const pattern of markdownPatterns) {
    if (pattern.test(text)) {
      return 'markdown';
    }
  }
  
  // 检查关键字或短语
  if (text.includes('## ') || 
      text.includes('**') || 
      text.includes('- ') || 
      text.includes('* ') || 
      (text.includes('[') && text.includes('](')) ||
      /Mark the statements as true \(T\) or false \(F\)/.test(text)) {
    return 'markdown';
  }
  
  return 'complex';
}

// 预处理复杂内容，包括LaTeX公式、图表引用和列表结构
function preprocessComplexContent(text) {
  if (!text) return '';
  
  // 标题处理 (处理 ## 风格的标题)
  text = text.replace(/^##\s+(.*?)$/gm, '<h2>$1</h2>');
  text = text.replace(/^###\s+(.*?)$/gm, '<h3>$1</h3>');
  text = text.replace(/^####\s+(.*?)$/gm, '<h4>$1</h4>');
  
  // 1. 清理双重转义的反斜杠
  text = text.replace(/\\\\/g, '\\');
  
  // 2. 处理LaTeX公式
  text = cleanupLatexFormat(text);
  
  // 3. 处理图表引用
  text = processImageReferences(text);
  
  // 4. 处理列表结构
  text = processLists(text);
  
  // 5. 处理段落结构
  text = processParagraphs(text);
  
  // 6. 处理True/False选项
  text = processTrueFalseOptions(text);
  
  return text;
}

// 处理True/False选项
function processTrueFalseOptions(text) {
  // 识别以字母加点开头的True/False题选项
  const optionPattern = /([A-Z])\.\s+(.*?(?:true|false|True|False|TRUE|FALSE).*?)(?=\s*[A-Z]\.|$)/gs;
  
  return text.replace(optionPattern, function(match, letter, content) {
    // 转换为带样式的选项
    return `<div class="answer-option"><span class="answer-option-label">${letter}.</span>${content}</div>`;
  });
}

// 清理LaTeX公式格式
function cleanupLatexFormat(text) {
  if (!text) return '';
  
  // 临时变量，用于跟踪我们是否在LaTeX环境内
  let inLatexBlock = false;
  let latexContent = '';
  let result = '';
  let lines = text.split('\n');
  
  // 如果只有一行文本且包含完整的LaTeX标记，直接返回
  if (lines.length === 1 && 
      ((text.match(/\$\$/g) || []).length % 2 === 0)) {
    return text;
  }
  
  // 首先修复不完整的LaTeX分隔符
  for (let i = 0; i < lines.length; i++) {
    // 如果一行中有奇数个$$，在行尾添加一个$$
    const dollarCount = (lines[i].match(/\$\$/g) || []).length;
    if (dollarCount % 2 !== 0) {
      if (i < lines.length - 1 && lines[i+1].includes('$$')) {
        // 如果下一行有$$，则不添加
      } else {
        lines[i] += ' $$';
      }
    }
  }
  
  // 处理多行LaTeX
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    
    // 跳过空行
    if (line === '') {
      result += '\n';
      continue;
    }
    
    // 检测LaTeX块的开始
    if (line.includes('$$') && !inLatexBlock) {
      // 寻找所有$$出现的位置
      let positions = [];
      let pos = line.indexOf('$$');
      while (pos !== -1) {
        positions.push(pos);
        pos = line.indexOf('$$', pos + 2);
      }
      
      // 如果有偶数个$$，表示这一行包含完整的LaTeX块
      if (positions.length % 2 === 0) {
        result += line + '\n';
        continue;
      }
      
      // 找到第一个$$的位置
      const startPos = positions[0];
      
      // 把$$之前的内容添加到结果中
      if (startPos > 0) {
        result += line.substring(0, startPos);
      }
      
      inLatexBlock = true;
      
      // 从这一行的$$后面开始收集LaTeX内容
      latexContent = line.substring(startPos + 2) + ' ';
    } 
    // 检测LaTeX块的结束
    else if (line.includes('$$') && inLatexBlock) {
      // 找到最后一个$$的位置
      const endPos = line.indexOf('$$');
      
      // 把这一行直到$$的内容添加到LaTeX内容中
      latexContent += line.substring(0, endPos);
      
      // 清理LaTeX内容，删除多余的空格和换行
      latexContent = cleanupMathExpression(latexContent);
      
      // 添加清理后的LaTeX块到结果中
      result += '$$' + latexContent + '$$';
      
      // 把$$之后的内容添加到结果中
      if (endPos + 2 < line.length) {
        result += line.substring(endPos + 2);
      }
      
      result += '\n';
      
      inLatexBlock = false;
      latexContent = '';
    }
    // 继续收集LaTeX块内容
    else if (inLatexBlock) {
      latexContent += line + ' ';
    }
    // 处理包含LaTeX块和文本混合的行
    else if (line.includes('$$')) {
      // 将所有连续的$$对之间的内容进行清理
      let parts = line.split('$$');
      let newLine = '';
      
      for (let j = 0; j < parts.length; j++) {
        if (j % 2 === 0) {
          // 文本部分
          newLine += parts[j];
        } else {
          // LaTeX部分
          newLine += '$$' + cleanupMathExpression(parts[j]) + '$$';
        }
      }
      
      result += newLine + '\n';
    }
    // 普通行，直接添加到结果中
    else {
      result += line + '\n';
    }
  }
  
  // 如果处理完所有行后，还在LaTeX环境内，则关闭它
  if (inLatexBlock) {
    // 清理LaTeX内容，删除多余的空格
    latexContent = cleanupMathExpression(latexContent);
    result += '$$' + latexContent + '$$\n';
  }
  
  return result;
}

// 清理数学表达式
function cleanupMathExpression(expr) {
  if (!expr) return '';
  
  // 删除多余的空格和换行
  expr = expr.replace(/\s+/g, ' ').trim();
  
  // 修复常见的LaTeX错误
  expr = expr
    // 修复化学式下标
    .replace(/\_(\d+)/g, '_{$1}')
    // 修复不成对的大括号
    .replace(/(\{)([^{}]*)(?!\})/g, '$1$2}')
    .replace(/(?<!\{)([^{}]*)(\})/g, '{$1$2')
    // 修复mathrm命令
    .replace(/\\mathrm\{\{([^}]*)\}\}/g, '\\mathrm{$1}')
    // 删除连续的分号和空格
    .replace(/;\s*;/g, ';')
    // 修复意外中断的命令
    .replace(/\\([a-zA-Z]+)$/g, '\\$1 ')
    // 简化连续空格
    .replace(/\s{2,}/g, ' ');
  
  return expr;
}

// 处理图表引用
function processImageReferences(text) {
  // 将[figureX]格式转换为HTML图形占位符
  return text.replace(/\[figure(\d+)\]/g, 
    '<div class="figure-placeholder"><span class="figure-label">Figure $1 Placeholder</span></div>');
}

// 处理列表结构
function processLists(text) {
  // 1. 处理分号分隔的编号列表
  let result = text;
  
  // 寻找类似 "1. item; 2. item; 3. item" 这样的模式
  const listPattern = /(\d+\.\s*[^;.]+)((?:;\s*\d+\.\s*[^;.]+)+)(?:[;.]|$)/g;
  
  // 用于匹配单个列表项
  const itemPattern = /;\s*(\d+)\.\s*([^;.]+)/g;
  
  result = result.replace(listPattern, function(match, firstItem, otherItems) {
    // 提取第一个列表项的编号和内容
    const firstNumber = firstItem.match(/(\d+)\./)[1];
    const firstContent = firstItem.replace(/\d+\.\s*/, '');
    
    // 开始构建HTML列表
    let listHTML = '<ol class="structured-list" start="' + firstNumber + '">\n';
    listHTML += '<li>' + firstContent.trim() + '</li>\n';
    
    // 处理其他列表项
    let item;
    while ((item = itemPattern.exec(otherItems)) !== null) {
      listHTML += '<li>' + item[2].trim() + '</li>\n';
    }
    
    listHTML += '</ol>';
    return listHTML;
  });
  
  return result;
}

// 处理段落结构
function processParagraphs(text) {
  // 将连续的换行符转换为段落分隔
  return text.replace(/\n{2,}/g, '\n\n')
             .replace(/([^\n])\n([^\n])/g, '$1<br>$2');
}

// 基本HTML转义（不处理Markdown，仅转义HTML特殊字符并保留换行）
function escapeHtmlBasic(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/\n/g, '<br>');
}

// 根据准确率格式化单元格颜色
function formatCellColor(accuracy) {
  if (accuracy >= 0.9) {
    return 'correct';
  } else if (accuracy >= 0.7) {
    return 'partially-correct';
  } else {
    return 'incorrect';
  }
}

// 设置Marked.js配置
function setupMarkedConfig() {
  if (typeof marked !== 'undefined') {
    // 配置Marked
    marked.setOptions({
      gfm: true, // 启用GitHub风格的Markdown
      breaks: true, // 转换回车符为<br>
      headerIds: false, // 不生成标题ID
      mangle: false, // 不转义HTML实体
      sanitize: false, // 不进行内置的消毒，我们将使用DOMPurify
      smartLists: true, // 使用更智能的列表行为
      smartypants: true, // 使用更智能的标点符号
      xhtml: false // 不关闭没有结束标签的HTML标签
    });
    
    console.log('Marked.js已配置完成');
  } else {
    console.error('Marked.js尚未加载');
  }
}

// 其他初始化代码
console.log('准备加载比赛数据...');
