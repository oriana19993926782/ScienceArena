// Model answer handling for ScienceArena
// This file handles the display of model outputs when a table cell is clicked

function formatProblemContent(content) {
    // 替换单位符号
    content = content.replace(/\\mathrm/g, '\\text');
    
    // 处理分数
    content = content.replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, '<span class="fraction">$1/$2</span>');
    
    // 处理物理量
    content = content.replace(/([0-9.]+)\\mathrm\\{\\;([a-zA-Z]+)\\}/g, '<span class="physical-quantity">$1 $2</span>');
    
    // 处理指数
    content = content.replace(/\\left\(([^)]+)\\right\)\^\{([^}]*)\}/g, '<span class="exponent">($1)<sup>$2</sup></span>');
    
    // 处理矢量
    content = content.replace(/\\vec\{([^}]*)\}/g, '<span class="vector">$1</span>');
    
    return content;
}

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
            <div class="problem-section">
                <h4>Problem:</h4>
                <div class="formatted-content">${formatProblemContent(trace)}</div>
            </div>
            <div class="answer-section">
                <h4>Correct Answer:</h4>
                <div class="formatted-content">${formatProblemContent(getCorrectAnswer())}</div>
            </div>
            <div class="runs-section">
                <h4>Run Details:</h4>
                <div class="formatted-content">${formatProblemContent(getRunDetails())}</div>
            </div>
        </div>
    `;
    
    // 设置内容并显示div
    tracesDiv.innerHTML = content;
    tracesDiv.style.display = 'block';
    
    // 渲染数学公式
    renderMathInElement(tracesDiv, {
        delimiters: [
            {left: '$$', right: '$$', display: true},
            {left: '$', right: '$', display: false},
            {left: '\\(', right: '\\)', display: false},
            {left: '\\[', right: '\\]', display: true}
        ]
    });
    
    // 滚动到traces部分
    scrollToTraces();
}

function getCorrectAnswer() {
    // 实现获取正确答案的逻辑
    return '';
}

function getRunDetails() {
    // 实现获取运行详情的逻辑
    return '';
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
