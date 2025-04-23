// Model answer handling for ScienceArena
// This file handles the display of model outputs when a table cell is clicked

function displayModelOutput(model, problem, trace) {
  // 获取traces元素
  const tracesDiv = document.getElementById('traces');
  
  // 创建带有模型和问题信息的内容
  const content = `
    <div class="model-output-header">
      <h3 class="model-name">${model} on ${problem}</h3>
      <button class="close-button" onclick="closeModelOutput()">×</button>
    </div>
    <div class="model-output-content">
      <pre>${trace}</pre>
    </div>
  `;
  
  // 设置内容并显示div
  tracesDiv.innerHTML = content;
  tracesDiv.style.display = 'block';
  
  // 滚动到traces部分
  scrollToTraces();
}

function closeModelOutput() {
  // 隐藏traces div
  document.getElementById('traces').style.display = 'none';
}

function scrollToTraces() {
  // 平滑滚动到traces部分
  document.getElementById('traces').scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
}
