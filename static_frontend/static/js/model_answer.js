// Model answer handling for ScienceArena
// This file handles the display of model outputs when a table cell is clicked

/**
 * Displays a model's output for a specific problem
 * @param {string} model - The model name
 * @param {string} problem - The problem identifier
 * @param {string} trace - The raw trace output from the model
 */
function displayModelOutput(model, problem, trace) {
  // Get the traces container
  const tracesDiv = document.getElementById('traces');
  if (!tracesDiv) return;
  
  // Check if we have contamination information for this problem
  const contaminationInfo = getContaminationInfo(model, problem);
  const contamWarning = contaminationInfo ? 
    `<div class="contamination-warning">⚠️ ${contaminationInfo}</div>` : '';
  
  // Format the trace content
  const formattedTrace = formatTrace(trace);
  
  // Create the HTML content
  const content = `
    <div class="model-output-container">
      <div class="model-output-header">
        <h3 class="model-name">${model} on ${problem}</h3>
        <div class="header-actions">
          <button class="copy-button" onclick="copyModelOutput('${model}', '${problem}')">Copy</button>
          <button class="close-button" onclick="closeModelOutput()">×</button>
        </div>
      </div>
      ${contamWarning}
      <div class="model-output-content">
        <pre>${formattedTrace}</pre>
      </div>
      <div class="model-output-footer">
        <span class="timestamp">Generated: ${getCurrentTimestamp()}</span>
      </div>
    </div>
  `;
  
  // Set the content and display the div
  tracesDiv.innerHTML = content;
  tracesDiv.style.display = 'block';
  
  // Scroll to the traces section
  scrollToTrace();
  
  // Render any math in the trace content
  if (typeof renderMathInElement === 'function') {
    renderMathInElement(tracesDiv);
  }
  
  // Add this viewing to history
  addToViewingHistory(model, problem);
}

/**
 * Formats a raw trace for display
 * @param {string} trace - The raw trace output
 * @returns {string} - The formatted trace
 */
function formatTrace(trace) {
  if (!trace) return "No output available";
  
  // Replace newlines with <br> tags to preserve formatting
  let formatted = trace
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  
  // Highlight key sections like "Answer:" or "Solution:"
  formatted = formatted.replace(/(Answer:|Solution:|Final Answer:|Result:)/gi, '<span class="highlight">$1</span>');
  
  return formatted;
}

/**
 * Closes the model output display
 */
function closeModelOutput() {
  const tracesDiv = document.getElementById('traces');
  if (tracesDiv) {
    tracesDiv.style.display = 'none';
  }
}

/**
 * Copies the current model output to clipboard
 * @param {string} model - The model name
 * @param {string} problem - The problem identifier
 */
function copyModelOutput(model, problem) {
  const tracesDiv = document.getElementById('traces');
  if (!tracesDiv) return;
  
  const outputContent = tracesDiv.querySelector('.model-output-content pre');
  if (!outputContent) return;
  
  // Create a temporary textarea to copy the text
  const textarea = document.createElement('textarea');
  textarea.value = `Model: ${model}\nProblem: ${problem}\n\n${outputContent.innerText}`;
  document.body.appendChild(textarea);
  textarea.select();
  
  try {
    const successful = document.execCommand('copy');
    if (successful) {
      // Show a copied notification
      const copyButton = tracesDiv.querySelector('.copy-button');
      const originalText = copyButton.innerText;
      copyButton.innerText = 'Copied!';
      
      // Reset button text after 2 seconds
      setTimeout(() => {
        copyButton.innerText = originalText;
      }, 2000);
    }
  } catch (err) {
    console.error('Failed to copy text: ', err);
  }
  
  document.body.removeChild(textarea);
}

/**
 * Scrolls to the traces section smoothly
 */
function scrollToTrace() {
  const tracesDiv = document.getElementById('traces');
  if (tracesDiv) {
    tracesDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/**
 * Gets any contamination information for this problem/model combination
 * @param {string} model - The model name
 * @param {string} problem - The problem identifier
 * @returns {string|null} - Contamination warning text or null
 */
function getContaminationInfo(model, problem) {
  // This would be populated from real data in production
  const contaminationData = {
    // Example format: "model_name:problem_id": "Warning message"
  };
  
  const key = `${model}:${problem}`;
  return contaminationData[key] || null;
}

/**
 * Adds the current view to history for analytics
 * @param {string} model - The model name
 * @param {string} problem - The problem identifier
 */
function addToViewingHistory(model, problem) {
  // This could track view history for analytics or for a "recently viewed" feature
  const viewHistory = JSON.parse(localStorage.getItem('scienceArenaViewHistory') || '[]');
  
  // Add this view
  viewHistory.push({
    model,
    problem,
    timestamp: Date.now()
  });
  
  // Keep only most recent 10 views
  if (viewHistory.length > 10) {
    viewHistory.shift();
  }
  
  // Save back to localStorage
  localStorage.setItem('scienceArenaViewHistory', JSON.stringify(viewHistory));
}

/**
 * Gets a formatted timestamp for the current time
 * @returns {string} - Formatted timestamp
 */
function getCurrentTimestamp() {
  const now = new Date();
  return now.toLocaleString();
}
