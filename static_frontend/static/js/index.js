// Main JavaScript file for ScienceArena
// This file handles the general site interactions and initializations

// Document ready event handler
$(document).ready(function() {
  // Initialize the tables after document is fully loaded
  if (typeof initializePrimaryTable === 'function') {
    initializePrimaryTable();
  }
  
  if (typeof initializeSecondaryTable === 'function') {
    initializeSecondaryTable();
  }
  
  // Handle FAQ toggle functionality
  $('.faq-question').click(function() {
    const $faqItem = $(this).parent();
    const $answer = $(this).next('.faq-answer');
    
    // Toggle the answer visibility
    $answer.slideToggle(200);
    
    // Toggle active class
    $faqItem.toggleClass('active');
    
    // Close other FAQs when one is opened
    $('.faq-answer').not($answer).slideUp(200);
    $('.faq-item').not($faqItem).removeClass('active');
  });
  
  // Ensure math is rendered in dynamically loaded content
  renderMathInElement(document.body);
  
  // Initialize tooltips if any
  if (typeof $().tooltip === 'function') {
    $('[data-toggle="tooltip"]').tooltip();
  }
  
  // Smooth scrolling for anchor links
  $('a[href^="#"]').on('click', function(event) {
    const target = $(this.getAttribute('href'));
    if (target.length) {
      event.preventDefault();
      $('html, body').stop().animate({
        scrollTop: target.offset().top - 100
      }, 1000);
    }
  });
});

// Handle window resizing to adjust tables
$(window).resize(function() {
  if ($.fn.dataTable.isDataTable('#myTopTable')) {
    $('#myTopTable').DataTable().columns.adjust();
  }
  if ($.fn.dataTable.isDataTable('#secondaryTable')) {
    $('#secondaryTable').DataTable().columns.adjust();
  }
});

// Helper functions
function scrollToElement(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Function to format accuracy colors
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

// Format percentages consistently
function formatPercentage(value) {
  return (value * 100).toFixed(1) + '%';
}

// Load different competitions when needed
function loadCompetition(competitionId) {
  // This would be replaced with actual API calls when data is available
  console.log('Loading competition: ' + competitionId);
  // For now, we can use mock data or reload the page
}

// Export functions for testing or external use
window.ScienceArena = {
  formatCellColor: formatCellColor,
  formatPercentage: formatPercentage,
  scrollToElement: scrollToElement,
  loadCompetition: loadCompetition
};
