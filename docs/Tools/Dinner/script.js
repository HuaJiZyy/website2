const optionForm = document.getElementById('option-form');
const optionInput = document.getElementById('option');
const drawButton = document.getElementById('draw-button');
const rectangleContainer = document.getElementById('rectangle-container');
const clearOptionsButton = document.getElementById('clear-options');
const historyList = document.getElementById('history-list');
const toggleHistoryBtn = document.getElementById('toggle-history');
const historySection = document.getElementById('history-section');
const historyTitle = document.getElementById('history-title');

const options = [];

function createRectangles() {
    rectangleContainer.innerHTML = '';
    for (let i = 0; i < options.length; i++) {
        const rectangle = document.createElement('div');
        rectangle.className = 'rectangle';
        rectangle.textContent = options[i];
        rectangleContainer.appendChild(rectangle);
    }
}


clearOptionsButton.addEventListener('click', () => {
    if (isSpinning) {
        return; // 如果正在抽奖，禁止清空选项
    }
    options.length = 0;
    createRectangles();
    drawButton.disabled = true;
    cannot_start_flag = false;
});

let isSpinning = false; // 添加此变量
let cannot_start_flag = false;

//抽奖
function spinRectangles() {
    if (options.length <= 1) {
        alert(`至少添加两个选项哦!`)
        return;
    }


    if (isSpinning) { // 检查是否正在进行抽奖
        return;
    }
    if (cannot_start_flag) {
        alert(`你已经选完了, 不许换!`);
        return;
    }

    isSpinning = true; // 设置为正在抽奖

    const totalSpins = 30 + Math.floor(Math.random() * 20);
    let currentSpin = 0;
    let currentIndex = 0;

    const spin = () => {
        if (currentSpin > 0) {
            const previousRectangle = rectangleContainer.children[currentIndex];
            previousRectangle.classList.remove('highlight');
            currentIndex = (currentIndex + 1) % options.length;
        }

        if (currentSpin < totalSpins) {
            const currentRectangle = rectangleContainer.children[currentIndex];
            currentRectangle.classList.add('highlight');
            currentSpin++;
            setTimeout(spin, 100);
        } else {
            const winningRectangle = rectangleContainer.children[currentIndex];
            winningRectangle.classList.add('highlight');
            setTimeout(() => {
                const resultText = winningRectangle.textContent;
                addHistoryRecord(resultText, [...options]); // 保存到历史记录, 同时传入当时的选项数组
                alert(`今晚吃: ${resultText}!`);
                isSpinning = false; // 设置为抽奖结束
            }, 300);
        }
    };

    spin();
    cannot_start_flag = true;
}

// 添加选项
optionForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (isSpinning) {
        return; // 如果正在抽奖，禁止添加选项
    }

    // 检查选项数量是否达到上限
    if (options.length >= 9) {
        alert('你想吃的东西太多了!');
        optionInput.value = '';  // 添加这行代码来清空输入框
        return;
    }

    const optionValue = optionInput.value.trim();
    if (optionValue) {
        options.push(optionValue);
        optionInput.value = '';
        drawButton.disabled = false;
    }
    createRectangles();
    cannot_start_flag = false;
});

drawButton.addEventListener('click', () => {
    drawButton.disabled = true;
    spinRectangles();
});

// 在页面加载时创建矩形框
createRectangles();

// ============== 历史记录功能 ==============
let dinnerHistory = JSON.parse(localStorage.getItem('dinnerHistory')) || [];

function renderHistory() {
    historyList.innerHTML = '';
    
    // 如果没有历史记录，将标题改为“暂无历史记录”
    if (dinnerHistory.length === 0) {
        historyTitle.textContent = '暂无历史记录';
    } else {
        historyTitle.textContent = '历史记录';
    }

    dinnerHistory.forEach(item => {
        const li = document.createElement('li');
        
        // 顶部的日期和结果
        const headerDiv = document.createElement('div');
        headerDiv.className = 'history-header';

        const dateSpan = document.createElement('span');
        dateSpan.className = 'history-date';
        dateSpan.textContent = item.date;

        const resultSpan = document.createElement('span');
        resultSpan.className = 'history-result';
        resultSpan.textContent = item.result;

        headerDiv.appendChild(dateSpan);
        headerDiv.appendChild(resultSpan);

        // 底部的所有供选选项
        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'history-options';
        optionsDiv.textContent = `所有选项: ${item.options ? item.options.join(', ') : '无记录'}`;

        li.appendChild(headerDiv);
        li.appendChild(optionsDiv);
        historyList.appendChild(li);
    });
}

function addHistoryRecord(result, currentOptions) {
    const now = new Date();
    // 格式化时间，例如: 2026-03-11 18:30:00
    const dateStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    
    // 存入时增加 options 字段
    dinnerHistory.unshift({ date: dateStr, result: result, options: currentOptions }); // 把最新的记录放在最前面
    
    // 只保留最近的20条记录，防止超出 localStorage 限制或变得太长
    if (dinnerHistory.length > 20) {
        dinnerHistory.pop();
    }

    localStorage.setItem('dinnerHistory', JSON.stringify(dinnerHistory));
    renderHistory();
}

// 隐藏/显示历史记录切换
toggleHistoryBtn.addEventListener('click', () => {
    if (historySection.style.display === 'none' || historySection.style.display === '') {
        historySection.style.display = 'block';
    } else {
        historySection.style.display = 'none';
    }
});

// 初始化历史记录渲染
renderHistory();

