// Secondary table initialization and data
function initializeSecondaryTable() {
  const tokenData = [
    {
      model: "GPT-4o",
      avgInputTokens: 1250,
      avgOutputTokens: 3750,
      inputPrice: "$0.01",
      outputPrice: "$0.03"
    },
    {
      model: "Claude 3 Opus",
      avgInputTokens: 1350,
      avgOutputTokens: 4200,
      inputPrice: "$0.015",
      outputPrice: "$0.075"
    },
    {
      model: "Gemini 1.5 Pro",
      avgInputTokens: 1200,
      avgOutputTokens: 3500,
      inputPrice: "$0.0035",
      outputPrice: "$0.0035"
    },
    {
      model: "Llama 3 70B",
      avgInputTokens: 1300,
      avgOutputTokens: 3800,
      inputPrice: "$0.0009",
      outputPrice: "$0.0009"
    },
    {
      model: "DeepSeek Coder",
      avgInputTokens: 1150,
      avgOutputTokens: 3200,
      inputPrice: "$0.0005",
      outputPrice: "$0.0015"
    }
  ];

  // Initialize secondary table
  $('#secondaryTable').DataTable({
    data: tokenData,
    columns: [
      { title: "Model", data: "model" },
      { 
        title: "Avg. Input Tokens", 
        data: "avgInputTokens",
        render: function(data) {
          return data.toLocaleString();
        }
      },
      { 
        title: "Avg. Output Tokens", 
        data: "avgOutputTokens",
        render: function(data) {
          return data.toLocaleString();
        }
      },
      { title: "Input Price (per 1M tokens)", data: "inputPrice" },
      { title: "Output Price (per 1M tokens)", data: "outputPrice" }
    ],
    paging: false,
    searching: false,
    info: false,
    ordering: true,
    responsive: true,
    autoWidth: false
  });
}
