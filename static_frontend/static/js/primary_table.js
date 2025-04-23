// Primary table initialization and data
function initializePrimaryTable() {
  // 初始化表格时默认使用overall数据
  const competitionId = 'overall';
  const data = competitionData[competitionId];
  
  // 创建表格列
  const columns = [
    { 
      title: "Model", 
      data: "model",
      className: "dt-center model-names"
    },
    { 
      title: "Accuracy", 
      data: "accuracy",
      className: "dt-center",
      render: function(data) {
        return (data * 100).toFixed(1) + "%";
      }
    },
    { 
      title: "Cost", 
      data: "cost",
      className: "dt-center avg-cost"
    }
  ];

  // Add problem columns
  if (data.models.length > 0 && data.models[0].problems) {
    data.models[0].problems.forEach((problem, index) => {
      columns.push({
        title: problem.id,
        data: null,
        className: "dt-center",
        render: function(data) {
          const accuracy = data.problems[index].accuracy;
          const formattedAccuracy = (accuracy * 100).toFixed(0) + "%";
          return formattedAccuracy;
        },
        createdCell: function(cell, cellData, rowData) {
          const accuracy = rowData.problems[index].accuracy;
          $(cell).addClass(formatCellColor(accuracy));
          
          // Add click handler to show model trace
          $(cell).on('click', function() {
            const trace = rowData.problems[index].trace;
            const model = rowData.model;
            const problemId = rowData.problems[index].id;
            
            $('#traces').html('<h3>' + model + ' on ' + problemId + '</h3><pre>' + trace + '</pre>');
            $('#traces').show();
            
            // Scroll to traces section
            $('html, body').animate({
              scrollTop: $('#traces').offset().top - 100
            }, 500);
          });
        }
      });
    });
  }

  // 初始化DataTable
  $('#myTopTable').DataTable({
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
  });
  
  // 初始化竞赛选择器
  initializeCompetitionSelector();
}

// 格式化单元格颜色
function formatCellColor(accuracy) {
  if (accuracy > 0.75) {
    return 'cell-green';
  } else if (accuracy >= 0.25) {
    return 'cell-yellow';
  } else if (accuracy > 0) {
    return 'cell-orange';
  } else {
    return 'cell-red';
  }
}
