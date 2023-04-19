const optionForm = document.getElementById('option-form');
const optionInput = document.getElementById('option');
const drawButton = document.getElementById('draw-button');
const rectangleContainer = document.getElementById('rectangle-container');
const clearOptionsButton = document.getElementById('clear-options');

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

// ... 其他代码 ...
clearOptionsButton.addEventListener('click', () => {
    options.length = 0;
    createRectangles();
    drawButton.disabled = true;
});

// ... 其他代码 ...

let isSpinning = false; // 添加此变量

function spinRectangles() {
    if (isSpinning) { // 检查是否正在进行抽奖
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
                alert(`今晚吃：${winningRectangle.textContent}`);
                isSpinning = false; // 设置为抽奖结束
            }, 100);
        }
    };

    spin();
}

// ... 其他代码 ...


// ... 其他代码 ...


optionForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // 检查选项数量是否达到上限
    if (options.length >= 9) {
        alert('最多只能添加9个选项。');
        return;
    }

    const optionValue = optionInput.value.trim();
    if (optionValue) {
        options.push(optionValue);
        optionInput.value = '';
        drawButton.disabled = false;
    }

    createRectangles();
});

drawButton.addEventListener('click', () => {
    drawButton.disabled = true;
    spinRectangles();
});

// 在页面加载时创建矩形框
createRectangles();

