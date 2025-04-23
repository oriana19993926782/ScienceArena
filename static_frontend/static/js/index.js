// Main JavaScript file for ScienceArena

$(document).ready(function() {
  // 初始化主表格
  initializePrimaryTable();
  
  // 处理FAQ切换功能
  $('.faq-question').click(function() {
    const $faqItem = $(this).parent();
    const $answer = $(this).next('.faq-answer');
    
    // 切换答案可见性
    $answer.slideToggle(200);
    
    // 切换active类
    $faqItem.toggleClass('active');
    
    // 关闭其他FAQ
    $('.faq-answer').not($answer).slideUp(200);
    $('.faq-item').not($faqItem).removeClass('active');
    
    // 如果打开了token信息问题，初始化次要表格
    if ($answer.find('#secondaryTable').length > 0 && $answer.is(':visible')) {
      updateSecondaryTable(currentCompetition);
    }
  });
  
  // 处理窗口大小调整
  $(window).resize(function() {
    if ($.fn.dataTable.isDataTable('#myTopTable')) {
      $('#myTopTable').DataTable().columns.adjust();
    }
    if ($.fn.dataTable.isDataTable('#secondaryTable')) {
      $('#secondaryTable').DataTable().columns.adjust();
    }
  });
});

// Function to format cell color based on accuracy
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
