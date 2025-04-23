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
      $('#myTopTable').html('<div class="error-message">Failed to load data. Please try again later.</div>');
      
      // 如果是非overall视图，且API尚未实现，显示提示信息
      if (competitionId !== 'overall') {
        $('#myTopTable').html('<div class="error-message">This competition data is not available yet.</div>');
      }
    });
}

// 根据选择的竞赛重新加载表格数据
function reloadTableData(competitionId) {
  // 获取选定竞赛的数据
  const data = competitionData[competitionId];
  
  // 如果表格已存在，销毁它
  if ($.fn.dataTable.isDataTable('#myTopTable')) {
    $('#myTopTable').DataTable().destroy();
    $('#myTopTable').empty();
  }
  
  // 创建表格列
  const columns = [
    { 
      title: "Model", 
      data: "model",
      className: competitionId === 'overall' ? "model-names" : "dt-center model-names"
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
  } 
  // 如果不是overall视图，添加问题列
  else if (competitionId !== 'overall' && data.models.length > 0 && data.models[0].problems) {
    // 添加Cost列
    columns.push({
      title: "Cost",
      data: "cost",
      className: "dt-center avg-cost"
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
          
          // 添加点击处理程序以显示模型输出
          $(cell).on('click', function() {
            const trace = rowData.problems[index].trace;
            const model = rowData.model;
            const problemId = rowData.problems[index].id;
            
            displayModelOutput(model, problemId, trace);
          });
        }
      });
    });
  }
  
  // 初始化数据表
  const tableConfig = {
    data: data.models,
    columns: columns,
    paging: false,
    searching: false,
    info: false,
    ordering: true,
    order: [[1, 'desc']], // 默认按准确率排序
    responsive: true,
    autoWidth: false,
    scrollX: true
  };
  
  // 为Overall表格添加特定的类和配置
  if (competitionId === 'overall') {
    // 添加Overall表格的自定义类
    $('#myTopTable').addClass('overall-table');
    
    // Overall表格不需要单元格点击事件
    tableConfig.createdRow = function(row) {
      $(row).find('td').off('click');
    };
    
    // Overall视图显示描述性文本，但不显示点击提示
    $('.tableHeading').text('Overall model performance on scientific competitions.');
  } else {
    // 非Overall表格移除特定类
    $('#myTopTable').removeClass('overall-table');
    
    // 非Overall视图显示提示文本
    $('.tableHeading').text(`Click on a cell to see the raw model output. ${data.title ? '(' + data.title + ')' : ''}`);
  }
  
  $('#myTopTable').DataTable(tableConfig);
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
