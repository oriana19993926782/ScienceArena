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

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
  // 初始化FAQ点击功能
  initializeFAQs();
  
  // 更新二级表格的事件监听
  addCompetitionChangeListeners();
});

// 添加竞赛变更的事件监听
function addCompetitionChangeListeners() {
  // 当竞赛选择器被点击时，更新二级表格
  document.querySelectorAll('.selector-item').forEach(item => {
    item.addEventListener('click', function() {
      // 获取当前选中的竞赛ID
      const competitionId = this.getAttribute('data-competition');
      
      // 如果当前显示了二级表格，更新它
      if (document.getElementById('secondaryTable').offsetParent !== null) {
        updateSecondaryTable(competitionId);
      }
    });
  });
}

// 初始化FAQ点击功能
function initializeFAQs() {
  // 获取所有FAQ问题元素
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  // 为每个问题添加点击事件
  faqQuestions.forEach(question => {
    question.addEventListener('click', function() {
      // 获取对应的答案元素
      const answer = this.nextElementSibling;
      
      // 切换答案的显示状态
      if (answer.style.display === 'none' || answer.style.display === '') {
        answer.style.display = 'block';
        this.classList.add('active');
      } else {
        answer.style.display = 'none';
        this.classList.remove('active');
      }
    });
  });
}
