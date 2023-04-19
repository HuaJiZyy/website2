// script.js
const optionForm = document.getElementById('option-form');
const optionInput = document.getElementById('option');
const optionsList = document.getElementById('options-list');
const drawButton = document.getElementById('draw-button');
const wheelCanvas = document.getElementById('wheel');
const wheelContext = wheelCanvas.getContext('2d');
const wheelContainer = document.getElementById('wheel-container');
const options = [];

const colors = [
    '#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
    '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
    '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
    '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
    '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
    '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
    '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
    '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
    '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
    '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'
];

function drawWheel() {
    const centerX = wheelCanvas.width / 2;
    const centerY = wheelCanvas.height / 2;
    const radius = Math.min(centerX, centerY) - 5;

    wheelContext.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height);

    if (options.length === 0) {
        wheelContext.beginPath();
        wheelContext.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        wheelContext.fillStyle = '#ccc';
        wheelContext.fill();
    } else {
        const angleStep = 2 * Math.PI / options.length;
        for (let i = 0; i < options.length; i++) {
            wheelContext.beginPath();
            wheelContext.moveTo(centerX, centerY);
            wheelContext.arc(centerX, centerY, radius, i * angleStep, (i + 1) * angleStep, false);
            wheelContext.closePath();
            wheelContext.fillStyle = colors[i % colors.length];
            wheelContext.fill();

            // 在每个部分上绘制选项文本
            wheelContext.save();
            wheelContext.translate(centerX, centerY);
            wheelContext.rotate(i * angleStep + angleStep / 2);
            wheelContext.fillStyle = '#000';
            wheelContext.font = '14px Arial';
            wheelContext.textAlign = 'center';
            wheelContext.fillText(options[i], radius / 2, -radius / 2 + 20);
            wheelContext.restore();
        }
    }
}

function spinWheel() {
    const startAngle = Math.random() * 2 * Math.PI;
    const spinDuration = 5000; // 持续时间（毫秒）
    const spinEndTime = Date.now() + spinDuration;

    function spinStep() {
        const progress = 1 - (spinEndTime - Date.now()) / spinDuration;
        const angle = startAngle + progress * (2 * Math.PI) * (10 + progress * 20);
        wheelContext.save();
        wheelContext.translate(wheelCanvas.width / 2, wheelCanvas.height / 2);
        wheelContext.rotate(angle);
        wheelContext.translate(-wheelCanvas.width / 2, -wheelCanvas.height / 2);
        drawWheel();
        wheelContext.restore();

        if (Date.now() < spinEndTime) {
            requestAnimationFrame(spinStep);
        } else {
            const winningOptionIndex = Math.floor((angle % (2 * Math.PI)) / (2 * Math.PI) * options.length);
            alert(`抽中的选项是：${options[winningOptionIndex]}`);
        }
    }

    spinStep();
}


drawButton.addEventListener('click', () => {
    drawButton.disabled = true;
    spinWheel();
});

// optionForm.addEventListener('submit', (e) => {
//     e.preventDefault();
//     const optionValue = optionInput.value.trim();
//     if (optionValue) {
//         options.push(optionValue);
//         const listItem = document.createElement('li');
//         listItem.textContent = optionValue;
//         optionsList.appendChild(listItem);
//         optionInput.value = '';
//         drawButton.disabled = false;
//         if (options.length > 0) {
//             wheelContainer.classList.remove('hidden');
//         }
//     }
// });
// optionForm.addEventListener('submit', (e) => {
//     e.preventDefault();
//     const optionValue = optionInput.value.trim();

//     // 检查选项数量是否达到上限
//     if (options.length >= 8) {
//         alert('你想吃得太多了, 最多只能添加8个选项。');
//         return;
//     }

//     if (optionValue) {
//         options.push(optionValue);
//         const listItem = document.createElement('li');
//         listItem.textContent = optionValue;
//         optionsList.appendChild(listItem);
//         optionInput.value = '';
//         drawButton.disabled = false;
//     }
// });

optionForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const optionValue = optionInput.value.trim();
    // 检查选项数量是否达到上限
    if (options.length >= 8) {
        alert('你想吃得太多了, 最多只能添加8个选项。');
        return;
    }

    if (optionValue) {
        options.push(optionValue);
        const listItem = document.createElement('li');
        listItem.textContent = optionValue;
        optionsList.appendChild(listItem);
        optionInput.value = '';
        drawButton.disabled = false;
    }
});

drawWheel();
