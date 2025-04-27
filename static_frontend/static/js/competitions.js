// 竞赛数据管理与处理
let competitionData = {};

// 当前选择的竞赛ID
let currentCompetition = 'overall';

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
  // 先获取所有比赛名称，然后初始化选择器
  fetchCompetitions();
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
    $('.tableHeading').html('<div style="text-align: center; font-weight: bold; font-size: 1.2rem; color: #276dff; margin-bottom: 1rem;">Overall model performance on scientific competitions.</div>');
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
        return '<div style="text-align: center; width: 100%;">' + data + '</div>';
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
    $('.tableHeading').html('<div style="text-align: center; font-weight: bold; font-size: 1.2rem; color: #276dff; margin-bottom: 1rem;">' + competitionId + ' model performance.</div>');
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
  
  // 发送API请求，但不显示返回的数据
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('获取模型回答详情失败');
      }
      return response.json();
    })
    .then(data => {
      console.log('已成功获取模型回答详情数据，但不显示', data);
    })
    .catch(error => {
      console.error('获取模型回答详情失败:', error);
    });
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
