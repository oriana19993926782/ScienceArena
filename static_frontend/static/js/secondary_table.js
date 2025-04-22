// Secondary table initialization and data
// This manages the token usage and cost information table

function initializeSecondaryTable() {
  // Token usage data for each model
  // This data would be replaced with real API data in production
  const tokenData = [
    {
      model: "GPT-4o",
      avgInputTokens: 1250,
      avgOutputTokens: 3750,
      inputPrice: "$0.01",
      outputPrice: "$0.03",
      inputPricePerToken: 0.00001,
      outputPricePerToken: 0.00003,
      totalRuns: 20,
      costPerRun: "$0.1225"
    },
    {
      model: "Claude 3 Opus",
      avgInputTokens: 1350,
      avgOutputTokens: 4200,
      inputPrice: "$0.015",
      outputPrice: "$0.075",
      inputPricePerToken: 0.000015,
      outputPricePerToken: 0.000075,
      totalRuns: 20,
      costPerRun: "$0.1605"
    },
    {
      model: "Gemini 1.5 Pro",
      avgInputTokens: 1200,
      avgOutputTokens: 3500,
      inputPrice: "$0.0035",
      outputPrice: "$0.0035",
      inputPricePerToken: 0.0000035,
      outputPricePerToken: 0.0000035,
      totalRuns: 20,
      costPerRun: "$0.09"
    },
    {
      model: "Llama 3 70B",
      avgInputTokens: 1300,
      avgOutputTokens: 3800,
      inputPrice: "$0.0009",
      outputPrice: "$0.0009",
      inputPricePerToken: 0.0000009,
      outputPricePerToken: 0.0000009,
      totalRuns: 20,
      costPerRun: "$0.03"
    },
    {
      model: "DeepSeek Coder",
      avgInputTokens: 1150,
      avgOutputTokens: 3200,
      inputPrice: "$0.0005",
      outputPrice: "$0.0015",
      inputPricePerToken: 0.0000005,
      outputPricePerToken: 0.0000015,
      totalRuns: 20,
      costPerRun: "$0.0225"
    }
  ];

  // Format functions for number display
  function formatNumber(num) {
    return num.toLocaleString('en-US');
  }
  
  function formatPrice(price) {
    return price.startsWith('$') ? price : '$' + price;
  }

  // Calculate derived statistics
  tokenData.forEach(model => {
    model.totalTokens = model.avgInputTokens + model.avgOutputTokens;
    
    // Calculate total cost for a single run (input + output)
    const inputCost = model.avgInputTokens * model.inputPricePerToken;
    const outputCost = model.avgOutputTokens * model.outputPricePerToken;
    model.runCost = inputCost + outputCost;
  });

  // Initialize secondary table with advanced configuration
  $('#secondaryTable').DataTable({
    data: tokenData,
    columns: [
      { 
        title: "Model", 
        data: "model",
        className: "dt-center"
      },
      { 
        title: "Input Tokens", 
        data: "avgInputTokens",
        className: "dt-center",
        render: function(data) {
          return formatNumber(data);
        }
      },
      { 
        title: "Output Tokens", 
        data: "avgOutputTokens",
        className: "dt-center",
        render: function(data) {
          return formatNumber(data);
        }
      },
      { 
        title: "Total Tokens", 
        data: "totalTokens",
        className: "dt-center",
        render: function(data) {
          return formatNumber(data);
        }
      },
      { 
        title: "Input Price (per 1M tokens)", 
        data: "inputPrice",
        className: "dt-center",
        render: function(data) {
          return formatPrice(data);
        }
      },
      { 
        title: "Output Price (per 1M tokens)", 
        data: "outputPrice",
        className: "dt-center",
        render: function(data) {
          return formatPrice(data);
        }
      },
      { 
        title: "Cost per Run", 
        data: "costPerRun",
        className: "dt-center",
        render: function(data) {
          return formatPrice(data);
        }
      }
    ],
    paging: false,
    searching: false,
    info: false,
    ordering: true,
    order: [[0, 'asc']], // Sort by model name by default
    responsive: true,
    autoWidth: false,
    scrollX: true,
    drawCallback: function() {
      if (typeof $().tooltip === 'function') {
        $('[data-toggle="tooltip"]').tooltip();
      }
    }
  });
  
  // Add explanation text after the table
  $('#secondaryTable').after(`
    <div class="token-info-explanation">
      <p>The table above shows the average token usage and costs for each model on this competition.</p>
      <p>Cost per run is calculated based on the average input and output tokens for a single problem attempt.</p>
      <p>The total cost shown in the main table is the sum of all runs (${tokenData[0].totalRuns} in total).</p>
    </div>
  `);
}
