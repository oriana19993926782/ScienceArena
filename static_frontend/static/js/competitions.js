// 竞赛数据管理与处理
const competitionData = {
  // 整体表现数据占位符 - 将动态加载
  overall: {
    title: "Overall Model Performance on Science Competitions",
    models: [],
    competitions: [],
    tokens: []
  },
  
  // 国际化学奥林匹克数据
  icho2025: {
    title: "IChO 2025 Competition Results",
    models: [
      {
        model: "GPT-4o",
        accuracy: 0.82,
        cost: "$2.10",
        problems: [
          { id: "C1", accuracy: 1.0, trace: "这里是GPT-4o解答C1的详细过程..." },
          { id: "C2", accuracy: 0.75, trace: "这里是GPT-4o解答C2的详细过程..." },
          { id: "C3", accuracy: 0.5, trace: "这里是GPT-4o解答C3的详细过程..." },
          { id: "C4", accuracy: 1.0, trace: "这里是GPT-4o解答C4的详细过程..." },
          { id: "C5", accuracy: 0.75, trace: "这里是GPT-4o解答C5的详细过程..." }
        ]
      },
      {
        model: "Claude 3 Opus",
        accuracy: 0.77,
        cost: "$2.85",
        problems: [
          { id: "C1", accuracy: 1.0, trace: "这里是Claude 3 Opus解答C1的详细过程..." },
          { id: "C2", accuracy: 1.0, trace: "这里是Claude 3 Opus解答C2的详细过程..." },
          { id: "C3", accuracy: 0.25, trace: "这里是Claude 3 Opus解答C3的详细过程..." },
          { id: "C4", accuracy: 0.75, trace: "这里是Claude 3 Opus解答C4的详细过程..." },
          { id: "C5", accuracy: 0.75, trace: "这里是Claude 3 Opus解答C5的详细过程..." }
        ]
      },
      {
        model: "Gemini 1.5 Pro",
        accuracy: 0.72,
        cost: "$1.60",
        problems: [
          { id: "C1", accuracy: 1.0, trace: "这里是Gemini 1.5 Pro解答C1的详细过程..." },
          { id: "C2", accuracy: 0.75, trace: "这里是Gemini 1.5 Pro解答C2的详细过程..." },
          { id: "C3", accuracy: 0.25, trace: "这里是Gemini 1.5 Pro解答C3的详细过程..." },
          { id: "C4", accuracy: 1.0, trace: "这里是Gemini 1.5 Pro解答C4的详细过程..." },
          { id: "C5", accuracy: 0.5, trace: "这里是Gemini 1.5 Pro解答C5的详细过程..." }
        ]
      },
      {
        model: "Llama 3 70B",
        accuracy: 0.62,
        cost: "$0.52",
        problems: [
          { id: "C1", accuracy: 1.0, trace: "这里是Llama 3 70B解答C1的详细过程..." },
          { id: "C2", accuracy: 0.5, trace: "这里是Llama 3 70B解答C2的详细过程..." },
          { id: "C3", accuracy: 0.25, trace: "这里是Llama 3 70B解答C3的详细过程..." },
          { id: "C4", accuracy: 0.75, trace: "这里是Llama 3 70B解答C4的详细过程..." },
          { id: "C5", accuracy: 0.5, trace: "这里是Llama 3 70B解答C5的详细过程..." }
        ]
      },
      {
        model: "DeepSeek Coder",
        accuracy: 0.50,
        cost: "$0.40",
        problems: [
          { id: "C1", accuracy: 0.75, trace: "这里是DeepSeek Coder解答C1的详细过程..." },
          { id: "C2", accuracy: 0.5, trace: "这里是DeepSeek Coder解答C2的详细过程..." },
          { id: "C3", accuracy: 0, trace: "这里是DeepSeek Coder解答C3的详细过程..." },
          { id: "C4", accuracy: 0.75, trace: "这里是DeepSeek Coder解答C4的详细过程..." },
          { id: "C5", accuracy: 0.5, trace: "这里是DeepSeek Coder解答C5的详细过程..." }
        ]
      }
    ],
    tokens: []
  },
  
  // 国际物理奥林匹克数据
  ipho2025: {
    title: "IPhO 2025 Competition Results",
    models: [
      {
        model: "GPT-4o",
        accuracy: 0.88,
        cost: "$2.60",
        problems: [
          { id: "P1", accuracy: 1.0, trace: "这里是GPT-4o解答P1的详细过程..." },
          { id: "P2", accuracy: 1.0, trace: "这里是GPT-4o解答P2的详细过程..." },
          { id: "P3", accuracy: 0.75, trace: "这里是GPT-4o解答P3的详细过程..." },
          { id: "P4", accuracy: 0.75, trace: "这里是GPT-4o解答P4的详细过程..." }
        ]
      },
      {
        model: "Claude 3 Opus",
        accuracy: 0.81,
        cost: "$3.40",
        problems: [
          { id: "P1", accuracy: 1.0, trace: "这里是Claude 3 Opus解答P1的详细过程..." },
          { id: "P2", accuracy: 0.75, trace: "这里是Claude 3 Opus解答P2的详细过程..." },
          { id: "P3", accuracy: 0.75, trace: "这里是Claude 3 Opus解答P3的详细过程..." },
          { id: "P4", accuracy: 0.75, trace: "这里是Claude 3 Opus解答P4的详细过程..." }
        ]
      },
      {
        model: "Gemini 1.5 Pro",
        accuracy: 0.81,
        cost: "$1.95",
        problems: [
          { id: "P1", accuracy: 1.0, trace: "这里是Gemini 1.5 Pro解答P1的详细过程..." },
          { id: "P2", accuracy: 1.0, trace: "这里是Gemini 1.5 Pro解答P2的详细过程..." },
          { id: "P3", accuracy: 0.5, trace: "这里是Gemini 1.5 Pro解答P3的详细过程..." },
          { id: "P4", accuracy: 0.75, trace: "这里是Gemini 1.5 Pro解答P4的详细过程..." }
        ]
      },
      {
        model: "Llama 3 70B",
        accuracy: 0.69,
        cost: "$0.65",
        problems: [
          { id: "P1", accuracy: 1.0, trace: "这里是Llama 3 70B解答P1的详细过程..." },
          { id: "P2", accuracy: 0.75, trace: "这里是Llama 3 70B解答P2的详细过程..." },
          { id: "P3", accuracy: 0.25, trace: "这里是Llama 3 70B解答P3的详细过程..." },
          { id: "P4", accuracy: 0.75, trace: "这里是Llama 3 70B解答P4的详细过程..." }
        ]
      },
      {
        model: "DeepSeek Coder",
        accuracy: 0.56,
        cost: "$0.48",
        problems: [
          { id: "P1", accuracy: 0.75, trace: "这里是DeepSeek Coder解答P1的详细过程..." },
          { id: "P2", accuracy: 0.75, trace: "这里是DeepSeek Coder解答P2的详细过程..." },
          { id: "P3", accuracy: 0.25, trace: "这里是DeepSeek Coder解答P3的详细过程..." },
          { id: "P4", accuracy: 0.5, trace: "这里是DeepSeek Coder解答P4的详细过程..." }
        ]
      }
    ],
    tokens: []
  },
  
  // 国际生物奥林匹克数据
  ibo2025: {
    title: "IBO 2025 Competition Results",
    models: [
      {
        model: "GPT-4o",
        accuracy: 0.86,
        cost: "$2.50",
        problems: [
          { id: "B1", accuracy: 1.0, trace: "这里是GPT-4o解答B1的详细过程..." },
          { id: "B2", accuracy: 0.75, trace: "这里是GPT-4o解答B2的详细过程..." },
          { id: "B3", accuracy: 1.0, trace: "这里是GPT-4o解答B3的详细过程..." },
          { id: "B4", accuracy: 0.75, trace: "这里是GPT-4o解答B4的详细过程..." },
          { id: "B5", accuracy: 0.75, trace: "这里是GPT-4o解答B5的详细过程..." }
        ]
      },
      {
        model: "Claude 3 Opus",
        accuracy: 0.85,
        cost: "$3.30",
        problems: [
          { id: "B1", accuracy: 1.0, trace: "这里是Claude 3 Opus解答B1的详细过程..." },
          { id: "B2", accuracy: 1.0, trace: "这里是Claude 3 Opus解答B2的详细过程..." },
          { id: "B3", accuracy: 0.75, trace: "这里是Claude 3 Opus解答B3的详细过程..." },
          { id: "B4", accuracy: 0.75, trace: "这里是Claude 3 Opus解答B4的详细过程..." },
          { id: "B5", accuracy: 0.75, trace: "这里是Claude 3 Opus解答B5的详细过程..." }
        ]
      },
      {
        model: "Gemini 1.5 Pro",
        accuracy: 0.75,
        cost: "$1.85",
        problems: [
          { id: "B1", accuracy: 1.0, trace: "这里是Gemini 1.5 Pro解答B1的详细过程..." },
          { id: "B2", accuracy: 0.75, trace: "这里是Gemini 1.5 Pro解答B2的详细过程..." },
          { id: "B3", accuracy: 0.75, trace: "这里是Gemini 1.5 Pro解答B3的详细过程..." },
          { id: "B4", accuracy: 0.5, trace: "这里是Gemini 1.5 Pro解答B4的详细过程..." },
          { id: "B5", accuracy: 0.75, trace: "这里是Gemini 1.5 Pro解答B5的详细过程..." }
        ]
      },
      {
        model: "Llama 3 70B",
        accuracy: 0.65,
        cost: "$0.58",
        problems: [
          { id: "B1", accuracy: 0.75, trace: "这里是Llama 3 70B解答B1的详细过程..." },
          { id: "B2", accuracy: 0.75, trace: "这里是Llama 3 70B解答B2的详细过程..." },
          { id: "B3", accuracy: 0.5, trace: "这里是Llama 3 70B解答B3的详细过程..." },
          { id: "B4", accuracy: 0.5, trace: "这里是Llama 3 70B解答B4的详细过程..." },
          { id: "B5", accuracy: 0.75, trace: "这里是Llama 3 70B解答B5的详细过程..." }
        ]
      },
      {
        model: "DeepSeek Coder",
        accuracy: 0.60,
        cost: "$0.50",
        problems: [
          { id: "B1", accuracy: 0.75, trace: "这里是DeepSeek Coder解答B1的详细过程..." },
          { id: "B2", accuracy: 0.75, trace: "这里是DeepSeek Coder解答B2的详细过程..." },
          { id: "B3", accuracy: 0.5, trace: "这里是DeepSeek Coder解答B3的详细过程..." },
          { id: "B4", accuracy: 0.25, trace: "这里是DeepSeek Coder解答B4的详细过程..." },
          { id: "B5", accuracy: 0.75, trace: "这里是DeepSeek Coder解答B5的详细过程..." }
        ]
      }
    ],
    tokens: []
  },
  
  // 国际地理奥林匹克数据
  igeo2025: {
    title: "IGeO 2025 Competition Results",
    models: [
      {
        model: "GPT-4o",
        accuracy: 0.83,
        cost: "$2.30",
        problems: [
          { id: "G1", accuracy: 1.0, trace: "这里是GPT-4o解答G1的详细过程..." },
          { id: "G2", accuracy: 0.75, trace: "这里是GPT-4o解答G2的详细过程..." },
          { id: "G3", accuracy: 1.0, trace: "这里是GPT-4o解答G3的详细过程..." },
          { id: "G4", accuracy: 0.75, trace: "这里是GPT-4o解答G4的详细过程..." },
          { id: "G5", accuracy: 0.75, trace: "这里是GPT-4o解答G5的详细过程..." },
          { id: "G6", accuracy: 0.75, trace: "这里是GPT-4o解答G6的详细过程..." }
        ]
      },
      {
        model: "Claude 3 Opus",
        accuracy: 0.79,
        cost: "$3.10",
        problems: [
          { id: "G1", accuracy: 1.0, trace: "这里是Claude 3 Opus解答G1的详细过程..." },
          { id: "G2", accuracy: 0.75, trace: "这里是Claude 3 Opus解答G2的详细过程..." },
          { id: "G3", accuracy: 0.75, trace: "这里是Claude 3 Opus解答G3的详细过程..." },
          { id: "G4", accuracy: 0.75, trace: "这里是Claude 3 Opus解答G4的详细过程..." },
          { id: "G5", accuracy: 1.0, trace: "这里是Claude 3 Opus解答G5的详细过程..." },
          { id: "G6", accuracy: 0.5, trace: "这里是Claude 3 Opus解答G6的详细过程..." }
        ]
      },
      {
        model: "Gemini 1.5 Pro",
        accuracy: 0.71,
        cost: "$1.75",
        problems: [
          { id: "G1", accuracy: 0.75, trace: "这里是Gemini 1.5 Pro解答G1的详细过程..." },
          { id: "G2", accuracy: 0.75, trace: "这里是Gemini 1.5 Pro解答G2的详细过程..." },
          { id: "G3", accuracy: 0.75, trace: "这里是Gemini 1.5 Pro解答G3的详细过程..." },
          { id: "G4", accuracy: 0.5, trace: "这里是Gemini 1.5 Pro解答G4的详细过程..." },
          { id: "G5", accuracy: 1.0, trace: "这里是Gemini 1.5 Pro解答G5的详细过程..." },
          { id: "G6", accuracy: 0.5, trace: "这里是Gemini 1.5 Pro解答G6的详细过程..." }
        ]
      },
      {
        model: "Llama 3 70B",
        accuracy: 0.63,
        cost: "$0.55",
        problems: [
          { id: "G1", accuracy: 0.75, trace: "这里是Llama 3 70B解答G1的详细过程..." },
          { id: "G2", accuracy: 0.5, trace: "这里是Llama 3 70B解答G2的详细过程..." },
          { id: "G3", accuracy: 0.75, trace: "这里是Llama 3 70B解答G3的详细过程..." },
          { id: "G4", accuracy: 0.5, trace: "这里是Llama 3 70B解答G4的详细过程..." },
          { id: "G5", accuracy: 0.75, trace: "这里是Llama 3 70B解答G5的详细过程..." },
          { id: "G6", accuracy: 0.5, trace: "这里是Llama 3 70B解答G6的详细过程..." }
        ]
      },
      {
        model: "DeepSeek Coder",
        accuracy: 0.54,
        cost: "$0.42",
        problems: [
          { id: "G1", accuracy: 0.5, trace: "这里是DeepSeek Coder解答G1的详细过程..." },
          { id: "G2", accuracy: 0.5, trace: "这里是DeepSeek Coder解答G2的详细过程..." },
          { id: "G3", accuracy: 0.75, trace: "这里是DeepSeek Coder解答G3的详细过程..." },
          { id: "G4", accuracy: 0.25, trace: "这里是DeepSeek Coder解答G4的详细过程..." },
          { id: "G5", accuracy: 0.75, trace: "这里是DeepSeek Coder解答G5的详细过程..." },
          { id: "G6", accuracy: 0.5, trace: "这里是DeepSeek Coder解答G6的详细过程..." }
        ]
      }
    ],
    tokens: []
  }
};

// 当前选择的竞赛ID
let currentCompetition = 'overall';

// 初始化竞赛选择器和表格
function initializeCompetitionSelector() {
  // 添加竞赛选择器的点击事件
  $('.competition-tab').click(function() {
    // 移除所有选项卡的active类
    $('.competition-tab').removeClass('active');
    
    // 为当前点击的选项卡添加active类
    $(this).addClass('active');
    
    // 获取选择的竞赛ID
    const competitionId = $(this).data('competition');
    
    // 更新当前竞赛
    currentCompetition = competitionId;
    
    // 如果是整体视图，需要先加载数据
    if (competitionId === 'overall') {
      loadOverallData();
    } else {
      // 重新加载表格数据
      reloadTableData(competitionId);
    }
    
    // 清除模型输出区域
    $('#traces').hide();
  });
  
  // 初始加载总体数据
  loadOverallData();
}

// 从后端API加载整体数据
function loadOverallData() {
  // 显示加载指示器
  showLoading(true);
  
  // 从后端API获取数据
  fetch('http://localhost:8090/api/data/overall')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // 更新数据存储
      competitionData.overall.models = data.models;
      competitionData.overall.competitions = data.competitions;
      
      // 加载表格
      reloadTableData('overall');
      
      // 隐藏加载指示器
      showLoading(false);
    })
    .catch(error => {
      console.error('Error fetching overall data:', error);
      // 显示错误消息
      showError('Failed to load data from the server. Please try again later.');
      // 隐藏加载指示器
      showLoading(false);
    });
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

// 更新二级表格(token使用情况)
function updateSecondaryTable(competitionId) {
  // 如果在FAQ中展开了token信息，则更新二级表格
  if ($('#secondaryTable').is(':visible')) {
    const data = competitionData[competitionId];
    // 二级表格更新逻辑...
  }
}
