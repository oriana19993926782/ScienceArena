// Primary table initialization and data
// Manages the main leaderboard table

// Configuration object for competition data
const competitionConfig = {
  current: "Science Competition 2025",
  competitions: [
    {
      id: "science_comp_2025",
      name: "Science Competition 2025",
      description: "International Science Competition held in April 2025",
      problemCount: 5,
      date: "2025-04-15"
    },
    {
      id: "iypt_2025",
      name: "IYPT 2025",
      description: "International Young Physicists' Tournament 2025",
      problemCount: 8,
      date: "2025-03-10"
    }
  ]
};

// Initialize the primary table with model performance data
function initializePrimaryTable() {
  // Sample data structure - would be replaced with real data from API
  const tableData = [
    {
      model: "GPT-4o",
      accuracy: 0.85,
      cost: "$2.45",
      problems: [
        { id: "P1", accuracy: 1.0, trace: "这里是GPT-4o解答P1的详细过程，包含详细的推导和计算。\n\n步骤1: 理解问题...\n\n步骤2: 建立模型...\n\n步骤3: 求解方程...\n\n最终答案: 42" },
        { id: "P2", accuracy: 0.75, trace: "这里是GPT-4o解答P2的详细过程..." },
        { id: "P3", accuracy: 0.5, trace: "这里是GPT-4o解答P3的详细过程..." },
        { id: "P4", accuracy: 1.0, trace: "这里是GPT-4o解答P4的详细过程..." },
        { id: "P5", accuracy: 1.0, trace: "这里是GPT-4o解答P5的详细过程..." }
      ],
      contamination: false,
      modelInfo: {
        provider: "OpenAI",
        releaseDate: "2024-05-13",
        apiEndpoint: "gpt-4o"
      }
    },
    {
      model: "Claude 3 Opus",
      accuracy: 0.80,
      cost: "$3.20",
      problems: [
        { id: "P1", accuracy: 1.0, trace: "这里是Claude 3 Opus解答P1的详细过程..." },
        { id: "P2", accuracy: 1.0, trace: "这里是Claude 3 Opus解答P2的详细过程..." },
        { id: "P3", accuracy: 0.25, trace: "这里是Claude 3 Opus解答P3的详细过程..." },
        { id: "P4", accuracy: 0.75, trace: "这里是Claude 3 Opus解答P4的详细过程..." },
        { id: "P5", accuracy: 1.0, trace: "这里是Claude 3 Opus解答P5的详细过程..." }
      ],
      contamination: false,
      modelInfo: {
        provider: "Anthropic",
        releaseDate: "2024-03-04",
        apiEndpoint: "claude-3-opus-20240229"
      }
    },
    {
      model: "Gemini 1.5 Pro",
      accuracy: 0.75,
      cost: "$1.80",
      problems: [
        { id: "P1", accuracy: 1.0, trace: "这里是Gemini 1.5 Pro解答P1的详细过程..." },
        { id: "P2", accuracy: 0.75, trace: "这里是Gemini 1.5 Pro解答P2的详细过程..." },
        { id: "P3", accuracy: 0.25, trace: "这里是Gemini 1.5 Pro解答P3的详细过程..." },
        { id: "P4", accuracy: 1.0, trace: "这里是Gemini 1.5 Pro解答P4的详细过程..." },
        { id: "P5", accuracy: 0.75, trace: "这里是Gemini 1.5 Pro解答P5的详细过程..." }
      ],
      contamination: false,
      modelInfo: {
        provider: "Google",
        releaseDate: "2024-02-15",
        apiEndpoint: "gemini-1.5-pro"
      }
    },
    {
      model: "Llama 3 70B",
      accuracy: 0.65,
      cost: "$0.60",
      problems: [
        { id: "P1", accuracy: 1.0, trace: "这里是Llama 3 70B解答P1的详细过程..." },
        { id: "P2", accuracy: 0.5, trace: "这里是Llama 3 70B解答P2的详细过程..." },
        { id: "P3", accuracy: 0.25, trace: "这里是Llama 3 70B解答P3的详细过程..." },
        { id: "P4", accuracy: 0.75, trace: "这里是Llama 3 70B解答P4的详细过程..." },
        { id: "P5", accuracy: 0.75, trace: "这里是Llama 3 70B解答P5的详细过程..." }
      ],
      contamination: false,
      modelInfo: {
        provider: "Meta",
        releaseDate: "2024-04-18",
        apiEndpoint: "llama-3-70b-instruct"
      }
    },
    {
      model: "DeepSeek Coder",
      accuracy: 0.55,
      cost: "$0.45",
      problems: [
        { id: "P1", accuracy: 0.75, trace: "这里是DeepSeek Coder解答P1的详细过程..." },
        { id: "P2", accuracy: 0.5, trace: "这里是DeepSeek Coder解答P2的详细过程..." },
        { id: "P3", accuracy: 0, trace: "这里是DeepSeek Coder解答P3的详细过程..." },
        { id: "P4", accuracy: 1.0, trace: "这里是DeepSeek Coder解答P4的详细过程..." },
        { id: "P5", accuracy: 0.5, trace: "这里是DeepSeek Coder解答P5的详细过程..." }
      ],
      contamination: false,
      modelInfo: {
        provider: "DeepSeek",
        releaseDate: "2023-11-21",
        apiEndpoint: "deepseek-coder-33b-instruct"
      }
    }
  ];

  // Get problem metadata for the current competition
  const problemMetadata = getProblemMetadata();

  // Create table columns dynamically
  const columns = [
    { 
      title: "Model", 
      data: "model",
      className: "dt-center model-column",
      render: function(data, type, row) {
        if (type === 'display') {
          // Add tooltip with model info if available
          if (row.modelInfo) {
            const info = row.modelInfo;
            const tooltip = `Provider: ${info.provider}<br>Release: ${info.releaseDate}`;
            return `<span title="${tooltip}" data-toggle="tooltip" data-html="true">${data}</span>`;
          }
        }
        return data;
      }
    },
    { 
      title: "Accuracy", 
      data: "accuracy",
      className: "dt-center accuracy-column",
      render: function(data) {
        return (data * 100).toFixed(1) + "%";
      }
    },
    { 
      title: "Cost", 
      data: "cost",
      className: "dt-center cost-column"
    }
  ];

  // Add problem columns
  if (tableData.length > 0 && tableData[0].problems) {
    tableData[0].problems.forEach((problem, index) => {
      const problemInfo = problemMetadata[index] || { id: problem.id, title: problem.id };
      
      columns.push({
        title: problemInfo.title,
        data: null,
        className: "dt-center problem-column",
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
            
            displayModelOutput(model, problemId, trace);
          });
          
          // Add tooltip with problem information if available
          if (problemInfo.description) {
            $(cell).attr('title', problemInfo.description);
            $(cell).attr('data-toggle', 'tooltip');
          }
        }
      });
    });
  }

  // Initialize DataTable with advanced configuration
  $('#myTopTable').DataTable({
    data: tableData,
    columns: columns,
    paging: false,
    searching: false,
    info: false,
    ordering: true,
    order: [[1, 'desc']], // Sort by accuracy by default
    responsive: true,
    autoWidth: false,
    scrollX: true,
    drawCallback: function() {
      // Initialize tooltips after table draw
      if (typeof $().tooltip === 'function') {
        $('[data-toggle="tooltip"]').tooltip();
      }
      
      // Update contamination warning if any model is potentially contaminated
      updateContaminationWarning(tableData);
    }
  });
  
  // Add competition selector if multiple competitions are available
  if (competitionConfig.competitions.length > 1) {
    addCompetitionSelector();
  }
}

// Get problem metadata for the current competition
function getProblemMetadata() {
  // This would be replaced with real data from an API
  return [
    { 
      id: "P1", 
      title: "P1", 
      description: "Problem 1: Quantum Mechanics Challenge",
      difficulty: "Medium"
    },
    { 
      id: "P2", 
      title: "P2", 
      description: "Problem 2: Particle Physics Analysis",
      difficulty: "Hard"
    },
    { 
      id: "P3", 
      title: "P3", 
      description: "Problem 3: Biochemistry Synthesis",
      difficulty: "Very Hard"
    },
    { 
      id: "P4", 
      title: "P4", 
      description: "Problem 4: Ecological System Modeling",
      difficulty: "Medium"
    },
    { 
      id: "P5", 
      title: "P5", 
      description: "Problem 5: Astronomy Calculation",
      difficulty: "Hard"
    }
  ];
}

// Display model output when a cell is clicked
function displayModelOutput(model, problemId, trace) {
  const tracesDiv = document.getElementById('traces');
  
  // Create content with model and problem information
  const content = `
    <div class="model-output-header">
      <h3>${model} on ${problemId}</h3>
      <button class="close-button" onclick="closeModelOutput()">×</button>
    </div>
    <div class="model-output-content">
      <pre>${trace}</pre>
    </div>
  `;
  
  // Set the content and display the div
  tracesDiv.innerHTML = content;
  tracesDiv.style.display = 'block';
  
  // Scroll to the traces section
  scrollToElement('traces');
  
  // Render math in the trace if applicable
  if (typeof renderMathInElement === 'function') {
    renderMathInElement(tracesDiv);
  }
}

// Close the model output display
function closeModelOutput() {
  const tracesDiv = document.getElementById('traces');
  tracesDiv.style.display = 'none';
}

// Update contamination warning if any model is potentially contaminated
function updateContaminationWarning(tableData) {
  const warningElement = document.getElementById('warning-contamination-table');
  
  // Check if any model has contamination flag
  const hasContamination = tableData.some(model => model.contamination === true);
  
  if (hasContamination) {
    warningElement.innerHTML = "Warning: Some models may have seen these problems during training. Click on cells for details.";
    warningElement.style.display = 'block';
  } else {
    warningElement.style.display = 'none';
  }
}

// Add competition selector if multiple competitions are available
function addCompetitionSelector() {
  // Create a select element before the table
  const selectorHtml = `
    <div class="competition-selector">
      <label for="competition-select">Select Competition:</label>
      <select id="competition-select">
        ${competitionConfig.competitions.map(comp => 
          `<option value="${comp.id}" ${comp.name === competitionConfig.current ? 'selected' : ''}>${comp.name}</option>`
        ).join('')}
      </select>
    </div>
  `;
  
  // Add the selector before the table
  $('#myTopTable').before(selectorHtml);
  
  // Add event listener to handle competition changes
  $('#competition-select').on('change', function() {
    const selectedCompId = $(this).val();
    loadCompetition(selectedCompId);
  });
}
