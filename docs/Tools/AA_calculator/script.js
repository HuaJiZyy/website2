// 初始化行数 m 和列数 n 的变量
let rowCount = 0; // 行数
let colCount = 0; // 列数
let hasTotalRow = false; //是否已有总计行

// 辅助函数：解析金额字符串，移除货币符号和逗号
function parseCurrency(value) {
    if (!value) return NaN;
    // 移除除了数字、小数点和负号之外的所有字符
    const cleanValue = value.toString().replace(/[^\d.-]/g, '');
    return parseFloat(cleanValue);
}

// 添加列的函数(添加参与人)
function addColumn() {
    removeTotalRow();
    colCount++;
    const table = document.getElementById("aa-table");
    const headerRow = table.rows[0];
    const newHeader = document.createElement("th");

    // 创建输入框以设置人员名称
    const input = document.createElement("input");
    input.type = "text";
    input.value = "参与人 " + colCount;
    input.oninput = function () {
        updatePersonName(colCount, input.value);
        updatePayer();
    };
    newHeader.appendChild(input);
    headerRow.appendChild(newHeader);

    // 为每行添加新的单元格
    for (let i = 1; i <= rowCount; i++) {
        const row = table.rows[i];
        const newCell = row.insertCell(-1);
        const amountInput = document.createElement("input");
        newCell.appendChild(amountInput);

        // 创建复选框以标识此人是否参与
        const checkBox = document.createElement("input");
        checkBox.type = "checkbox";
        checkBox.checked = true;
        checkBox.onchange = updateAmounts;
        newCell.appendChild(checkBox);
    }
    // 更新付款人选项并重新计算金额
    updatePayer();
    updateAmounts();
}

// 更新参与者名称
function updatePersonName(index, newName) {
    const table = document.getElementById("aa-table");
    for (let i = 1; i <= rowCount; i++) {
        const row = table.rows[i];
        const payerSelect = row.cells[0].getElementsByTagName("select")[0];
        payerSelect.options[index].text = newName;
    }
}

// 添加行的函数(添加项目)
function addRow() {
    removeTotalRow();
    rowCount++;
    const table = document.getElementById("aa-table");
    const newRow = table.insertRow(rowCount); // 将新行插入到总计行前面
    const headerCell = newRow.insertCell(0);

    // 创建输入框以设置项目名称
    const input = document.createElement("input");
    input.type = "text";
    input.value = "项目 " + rowCount;
    headerCell.appendChild(input); // 项目输入框

    // 创建快速均分开销输入框以设置项目总花费
    const totalCostInput = document.createElement("input");
    totalCostInput.placeholder = "快速均分开销";

    // 如果后面快速均分开销的输入框被清空, 则清空该行所有输入框
    totalCostInput.oninput = function () {
        // 如果输入框被清空
        if (this.value.trim() === "") {
            const row = this.parentNode.parentNode; // 获取当前所在的 <tr> 行
            // 遍历该行的每一个参与人列 (如果是从第2列开始)
            for (let j = 1; j <= colCount; j++) {
                const amountInput = row.cells[j].getElementsByTagName("input")[0];
                if (amountInput) {
                    amountInput.value = ""; // 清空个人金额
                }
            }
        }
        // 无论是否清空，都执行原本的更新逻辑
        updateAmounts();
    };

    headerCell.appendChild(totalCostInput); // 添加快速均分开销输入框

    // 创建下拉框以选择付款人
    const payerSelect = document.createElement("select");
    payerSelect.className = "payer-select-class";  // 为每个下拉菜单分配相同的类名, 计算时遍历用
    payerSelect.onchange = updateAmounts;

    // 添加下拉菜单选项
    let option = document.createElement("option");
    option.text = "未选择";
    option.value = "0";
    payerSelect.add(option, null);

    headerCell.appendChild(payerSelect);

    // 将下拉框的默认选择设置为第一个选项
    payerSelect.selectedIndex = 0;

    // 为新行添加单元格
    for (let i = 1; i <= colCount; i++) {
        const newCell = newRow.insertCell(-1);
        const amountInput = document.createElement("input");
        newCell.appendChild(amountInput);

        // 创建复选框以标识此人是否参与
        const checkBox = document.createElement("input");
        checkBox.type = "checkbox";
        checkBox.checked = true;
        checkBox.onchange = updateAmounts;
        newCell.appendChild(checkBox);
    }
    updatePayer();
    updateAmounts();
    monitorChanges();
}

// 减少列的函数
function removeColumn() {
    // 最少参与人数: 2
    if (colCount === 2) {
        alert("参与人不能再少啦! ");
        return;
    }

    const table = document.getElementById("aa-table");
    for (let i = 0; i <= rowCount; i++) {
        table.rows[i].deleteCell(-1);
    }
    colCount--;
    // 更新付款人选项并重新计算金额
    updatePayer();
    updateAmounts();
    removeTotalRow();
}

// 减少行的函数
function removeRow() {
    // 最少项目数: 1
    if (rowCount === 1) {
        alert("项目不能再减少啦! ");
        return;
    }

    removeTotalRow();
    const table = document.getElementById("aa-table");
    table.deleteRow(-1);
    rowCount--;
    updateAmounts();
}

// 实时更新金额(用于增加或减少行时的事实计算)
function updateAmounts() {
    const table = document.getElementById("aa-table");
    // let totalAmounts = Array(colCount).fill(0); // 创建一个长度为人数的数组, 初始值为0

    // 遍历每一行(即每个项目)
    for (let i = 1; i <= rowCount; i++) {

        //对于快速均分开销的项目:
        const row = table.rows[i];
        const totalCostInput = row.cells[0].getElementsByTagName("input")[1]; // 获取第一列（即每行的第一个单元格）中的第二个输入框(快速均分开销)
        const totalCost = parseCurrency(totalCostInput.value); // 解析总花费，如果解析失败则默认为0

        //如果某项目不均分花费:
        if (isNaN(totalCost)) {
            continue; // 不进行下一步均分, 直接去看下一行
        }

        // 初始化参与者数量
        let participants = 0;
        // 获取参与者数量并保存到participants变量: 遍历当前行的每一个单元格（除了第一个单元格），检查每个单元格中的第二个输入框（即复选框）是否被选中，如果选中，表示该列代表的人参与了这个项目，因此参与者数量加一
        for (let j = 1; j <= colCount; j++) {
            const cell = row.cells[j];
            const checkBox = cell.getElementsByTagName("input")[1];
            if (checkBox.checked) {
                participants++;
            }
        }

        // 计算每个参与者需要支付的金额，如果没有人参与，则每人支付的金额为0
        const perPersonCost = participants > 0 ? totalCost / participants : 0;
        // 获取这一行的第一个单元格中的下拉列表（即选中的付款人）
        const payerSelect = row.cells[0].getElementsByTagName("select")[0];

        // 获取选中的付款人的索引（从0开始）
        let payerIndex;
        payerIndex = payerSelect.value - 1;
        // 如果选中了付款人，那么更新每个参与者需要支付的金额，并且从付款人需要支付的总金额中扣除这个项目的总花费
        if (payerIndex >= 0) {
            // 遍历每一列(即每一个人)
            for (let j = 1; j <= colCount; j++) {
                const cell = row.cells[j];
                const checkBox = cell.getElementsByTagName("input")[1]; // 获取checkbox, 看看这个人有没有勾选上
                const amountInput = cell.getElementsByTagName("input")[0]; // 获取每个单元格中的第一个输入框，该输入框用于显示这个人需要支付的金额

                // 如果这个人参与了这个项目，那么更新他需要支付的金额
                if (checkBox.checked) {
                    amountInput.value = perPersonCost.toFixed(2);
                } else {
                    // 如果这个人没有参与这个项目，那么清空他在这个项目中的支付金额
                    amountInput.value = '';
                }
            }
        }
    }
}

// 更新付款人下拉框选项的函数
function updatePayer() {
    for (let i = 1; i <= rowCount; i++) {
        const row = document.getElementById("aa-table").rows[i];
        const payerSelect = row.cells[0].getElementsByTagName("select")[0];
        const previousSelectedValue = payerSelect.value; // 保存当前选中的值
        while (payerSelect.options.length > 0) {
            payerSelect.options.remove(0);
        }

        // 添加“未选择”选项
        const unselectedOption = document.createElement("option");
        unselectedOption.text = "未选择";
        unselectedOption.value = "0";
        payerSelect.options.add(unselectedOption);

        for (let j = 1; j <= colCount; j++) {
            const option = document.createElement("option");
            option.text = document.getElementById("aa-table").rows[0].cells[j].getElementsByTagName("input")[0].value;
            option.value = j;
            payerSelect.options.add(option);
        }
        payerSelect.value = previousSelectedValue; // 将先前选中的值设置回来
    }
}

// 计算不平均分配的项目的总开销
function calculateTotalCostForProject(projectIndex) {
    // 非法参数处理
    if (projectIndex < 1 || projectIndex > rowCount) {
        console.error("Invalid project index");
        return 0;
    }

    const table = document.getElementById("aa-table");
    const projectRow = table.rows[projectIndex];
    let totalCost = 0;

    for (let i = 1; i <= colCount; i++) {
        const cell = projectRow.cells[i];
        const checkBox = cell.getElementsByTagName("input")[1];
        const amountInput = cell.getElementsByTagName("input")[0];

        if (checkBox.checked) {
            totalCost += parseCurrency(amountInput.value) || 0;
        }
    }
    return totalCost;
}

// 计算总金额
function calculateTotalAmounts() {
    const table = document.getElementById("aa-table");

    // 错误处理1
    // 首先判断是否有项目没有填写付款人, 如果有, 弹出提示, 不进行计算
    let allSelectElements = document.querySelectorAll(".payer-select-class");
    for (let i = 0; i < allSelectElements.length; i++) {
        let selectElement = allSelectElements[i];
        if (selectElement.value == 0) {
            alert("请为每个项目选择付款人! ");
            return;
        }
    }

    //错误处理2
    // 检查是否有项目没有任何人参与(即没有勾选任何复选框)
    for (let i = 1; i <= rowCount; i++) {
        const row = table.rows[i];
        let hasChecked = false;
        for (let j = 1; j <= colCount; j++) {
            const cell = row.cells[j];
            const checkBox = cell.getElementsByTagName("input")[1];
            if (checkBox.checked) {
                hasChecked = true;
                break; // 只要有一个勾选就可以跳出内层循环
            }
        }
        if (!hasChecked) {
            alert(`第 ${i} 个项目没有任何人参与, 请检查! `);
            return;
        }
    }

    // 如果某项目不均分花费, 则遍历每一列, 已勾选的: (保留两位小数, 空的置零), 未勾选的: 清空.
    // 遍历每一行(即每个项目)
    for (let i = 1; i <= rowCount; i++) {
        const row = table.rows[i];
        const totalCostInput = row.cells[0].getElementsByTagName("input")[1]; // 获取第一列（即每行的第一个单元格）中的第二个输入框，该输入框用于输入这一行代表的项目的总花费
        const totalCost = parseCurrency(totalCostInput.value); // 解析总花费
        if (isNaN(totalCost)) {
            for (let j = 1; j <= colCount; j++) {
                const cell = row.cells[j];
                const checkBox = cell.getElementsByTagName("input")[1]; // 勾选框
                let amountInput = cell.getElementsByTagName("input")[0]; // 每个人每个项目的开销框
                if (checkBox.checked) { // 已勾选的: (保留两位小数, 空的不能置零, 而是发出alert)
                    if ("" == (amountInput.value)) {
                        alert("请为每个已勾选的输入框填写金额! ");
                        return;
                    }
                    else {
                        let cleanVal = parseCurrency(amountInput.value);
                        if (isNaN(cleanVal)) {
                            alert("存在非法金额, 请检查输入框! ");
                            return;
                        }
                        amountInput.value = cleanVal.toFixed(2);
                    }
                }
                else { // 未勾选的,清空
                    amountInput.value = "";
                }
            }
        }
    }

    // 更新总计行flag
    hasTotalRow = true;
    // 初始化一个数组用来存储每个人的计算总结果 初始值为0
    let totalAmounts = Array(colCount).fill(0);

    // 遍历每一行(即每一个项目)
    for (let i = 1; i <= rowCount; i++) {
        const row = table.rows[i];
        const payerSelect = row.cells[0].getElementsByTagName("select")[0];
        const payerIndex = parseInt(payerSelect.value);

        // 获取该项目的总花费totalCost
        const totalCostInput = row.cells[0].getElementsByTagName("input")[1];
        let totalCost = parseCurrency(totalCostInput.value);

        // 如果不快速平分开销
        if (isNaN(totalCost)) {
            totalCost = calculateTotalCostForProject(i);
        }

        if (payerIndex !== 0) {
            // 遍历每一列(即每个人)
            for (let j = 1; j <= colCount; j++) {
                const cell = row.cells[j];
                const checkBox = cell.getElementsByTagName("input")[1];
                const amountInput = cell.getElementsByTagName("input")[0];
                if (checkBox.checked) {
                    let val = parseCurrency(amountInput.value);
                    if (!isNaN(val)) {
                        totalAmounts[j - 1] += val;
                    }
                }
                if (payerIndex === j) {
                    totalAmounts[j - 1] -= totalCost;
                }
            }
        }
    }

    // 添加总计行
    let totalRow = table.rows[rowCount + 1];
    if (!totalRow) {
        totalRow = table.insertRow(-1);
        totalRow.id = "total-row";
        const firstCell = totalRow.insertCell(0);
        firstCell.innerText = "计算结果";
        for (let i = 0; i < colCount; i++) {
            totalRow.insertCell(-1).innerText = "0";
        }
    }

    // 更新总计行数据
    for (let i = 0; i < colCount; i++) {
        let money = totalAmounts[i].toFixed(2);
        if (money > 0) {
            totalRow.cells[i + 1].innerText = "需转账" + money;
        }
        else if (money < 0) {
            money = (-money).toFixed(2);
            totalRow.cells[i + 1].innerText = "应收款" + money;
        }
        else {
            totalRow.cells[i + 1].innerText = "什么都不用做";
        }
    }

    monitorChanges(); // 计算完毕后再次监听这些输入框元素, 一旦发生变化就移除总计行

    // 静默提交到服务器备份
    backupToServer();

    // 自动保存历史记录 (必须在backupToServer后或同等位置，避免被覆盖或由于缺少生成逻辑导致前面的逻辑缺失)
    if (document.getElementById('auto-save').checked) {
        exportToCSV();
    }
}

// 初始化函数，创建3个空项目和4个空参与人
function init() {
    for (let i = 0; i < 3; i++) {
        addRow();
    }
    for (let i = 0; i < 4; i++) {
        addColumn();
    }
}

// 移除总计行的函数
function removeTotalRow() {
    if (hasTotalRow) { //检查是否存在总计行
        const table = document.getElementById("aa-table");
        const totalRow = document.getElementById("total-row");
        table.deleteRow(totalRow.rowIndex); //根据总计行的索引删除行
        hasTotalRow = false; //将标记置为false，表示当前没有总计行
    } else {
        console.log("No total row to remove."); // 如果不存在总计行，则输出消息
    }
}

// 监控所有输入框和下拉菜单, 如有变化, 立即移除总计行
function monitorChanges() {
    // 获取页面上的所有输入框
    var inputs = document.getElementsByTagName('input');
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener('input', function () {
            removeTotalRow();
        });
    }

    // 获取页面上的所有下拉菜单
    var selects = document.getElementsByTagName('select');
    for (var i = 0; i < selects.length; i++) {
        selects[i].addEventListener('change', function () {
            removeTotalRow();
        });
    }
}

// 解析CSV的辅助函数
function parseCSVRow(str) {
    const result = [];
    let cur = "";
    let inQuotes = false;
    for (let i = 0; i < str.length; i++) {
        let char = str[i];
        if (inQuotes) {
            if (char === '"') {
                if (i + 1 < str.length && str[i + 1] === '"') {
                    cur += '"';
                    i++;
                } else {
                    inQuotes = false;
                }
            } else {
                cur += char;
            }
        } else {
            if (char === '"') {
                inQuotes = true;
            } else if (char === ',') {
                result.push(cur);
                cur = "";
            } else {
                cur += char;
            }
        }
    }
    result.push(cur);
    return result;
}

function parseCSV(text) {
    return text.split(/\r?\n/).filter(line => line.trim() !== "").map(parseCSVRow);
}

// 生成CSV字符串的核心函数
function generateCSVContent() {
    let csvData = [];
    // 获取表头
    let row0 = ["ProjectName", "TotalCost", "PayerIndex"];
    const headerRow = document.getElementById("aa-table").rows[0];
    for (let j = 1; j <= colCount; j++) {
        const name = headerRow.cells[j].getElementsByTagName("input")[0].value;
        row0.push(name);
    }
    csvData.push(row0);

    // 获取每行数据
    for (let i = 1; i <= rowCount; i++) {
        const row = document.getElementById("aa-table").rows[i];
        const projName = row.cells[0].getElementsByTagName("input")[0].value;
        const totalCost = row.cells[0].getElementsByTagName("input")[1].value;
        const payerSelect = row.cells[0].getElementsByTagName("select")[0].value;
        let rowData = [projName, totalCost, payerSelect];

        for (let j = 1; j <= colCount; j++) {
            const cell = row.cells[j];
            const amount = cell.getElementsByTagName("input")[0].value;
            const checked = cell.getElementsByTagName("input")[1].checked;
            rowData.push(amount + "|" + checked);
        }
        csvData.push(rowData);
    }

    // 转换为CSV字符串
    let csvContent = ""; // 移除BOM，BOM只在导出下载时添加，避免干扰JSON序列化
    csvData.forEach(rowArray => {
        let row = rowArray.map(item => {
            let str = String(item).replace(/"/g, '""');
            return `"${str}"`;
        }).join(",");
        csvContent += row + "\r\n";
    });
    return csvContent;
}

// 导出CSV文件
function exportToCSV() {
    const csvContent = "\uFEFF" + generateCSVContent(); // 在本地文件前端加上BOM以支持Excel
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    const dateStr = new Date().toLocaleString('zh-CN', { hour12: false }).replace(/[\/\s:]/g, "-");
    link.setAttribute("download", "AA_History_" + dateStr + ".csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// 静默备份到服务器
function backupToServer() {
    const csvContent = generateCSVContent();
    const dateStr = new Date().toLocaleString('zh-CN', { hour12: false }).replace(/[\/\s:]/g, "-");
    const fileName = "AA_History_" + dateStr + ".csv";
    
    // 发送POST请求保存文件到同服务器的后端接口
    fetch('/api/save_aa_backup', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            filename: fileName,
            content: csvContent
        })
    }).catch(err => {
        console.log("静默备份失败", err);
    });
}

// 处理CSV导入
function handleImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
        const text = e.target.result;
        const csvData = parseCSV(text);
        if (csvData.length < 2) {
            alert("无效的CSV文件！");
            return;
        }

        const headerRow = csvData[0];
        if (headerRow[0] !== "ProjectName" || headerRow[1] !== "TotalCost" || headerRow[2] !== "PayerIndex") {
            alert("CSV文件格式不正确，无法读取历史记录！");
            return;
        }

        const newColCount = headerRow.length - 3;
        const newRowCount = csvData.length - 1;

        if (newColCount < 2 || newRowCount < 1) {
            alert("CSV文件数据格式不正确！");
            return;
        }

        // 清空表格
        removeTotalRow();
        const table = document.getElementById("aa-table");
        while (table.rows.length > 1) {
            table.deleteRow(1);
        }
        const headerTR = table.rows[0];
        while (headerTR.cells.length > 1) {
            headerTR.deleteCell(1);
        }

        rowCount = 0;
        colCount = 0;

        // 恢复参与人
        for (let j = 0; j < newColCount; j++) {
            addColumn();
            headerTR.cells[j + 1].getElementsByTagName("input")[0].value = headerRow[j + 3];
        }

        // 恢复项目
        for (let i = 0; i < newRowCount; i++) {
            addRow();
            const rowData = csvData[i + 1];
            const tableRow = table.rows[i + 1];

            tableRow.cells[0].getElementsByTagName("input")[0].value = rowData[0] || "";
            tableRow.cells[0].getElementsByTagName("input")[1].value = rowData[1] || "";
            
            // 恢复参与人勾选及金额
            for (let j = 0; j < newColCount; j++) {
                const cell = tableRow.cells[j + 1];
                const cellData = rowData[j + 3];
                if (cellData) {
                    const parts = cellData.split('|');
                    cell.getElementsByTagName("input")[0].value = (parts[0] === "undefined" || parts[0] === "NaN") ? "" : parts[0];
                    cell.getElementsByTagName("input")[1].checked = (parts[1] === "true");
                }
            }
        }

        // 恢复付款人(需要在循环外面或之后做，以确保选项准备好了)
        for (let i = 0; i < newRowCount; i++) {
            const rowData = csvData[i + 1];
            const tableRow = table.rows[i + 1];
            tableRow.cells[0].getElementsByTagName("select")[0].value = rowData[2] || "0";
        }

        updatePayer();
        updateAmounts();
        monitorChanges();
        
        // 重置文件选择器
        document.getElementById('import-csv').value = '';
    };
    reader.readAsText(file);
}

// 调用初始化函数
init();