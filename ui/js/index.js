// 全局dom元素获取
// 容器dom
const containerDom = document.querySelector(".container");
// headerDom
const headerDom = document.querySelector(".header");
// contentDom
const contentDom = document.querySelector(".content");
// 笑脸按钮元素
const statusBtn = document.querySelector("#statusBtn");
const statusDom = document.querySelector(".status");
// 时间状态元素
const timeNumDom = document.querySelector(".timeNum");
// 剩余雷数元素
const mineNumDom = document.querySelector(".mineNum");
// 雷区元素
const mineAreaDom = document.querySelector(".content");

// 游戏是否失败
var isDead = false;
// 游戏是否胜利
var isWin = false;
// 当前被打开的格子数量，如果等于总格数-雷数量则游戏胜利
var openNum = 0;
// 雷的数量
var mineNum = level.mines;

// 初始化函数
function init() {
    openNum = 0;
    isDead = false;
    isWin = false;
    mineNum = level.mines;
    clearTimeInterval();
    // startTime();
    resetWidth();
    drawMineDigit(mineNum);
    drawTable();
}

/**
 * 根据游戏绘制不同的宽度
 */
function resetWidth() {
    const width = level.col * 30 + 4;
    headerDom.style.width = width + "px";
    contentDom.style.width = width + "px";
    containerDom.style.width = width + 20 + "px";
}

// 表格每个格子的信息
var tableData = [];
// 绘制表格
function drawTable() {
    tableData = [];
    var table = document.createElement("table");
    var array = createMines();
    for (var i = 0; i < level.row; i++) {
        var tr = document.createElement("tr");
        tableData[i] = [];
        for (var j = 0; j < level.col; j++) {
            var isMine = array[i][j] === 9;
            var td = document.createElement("td");
            var div = document.createElement("div");
            div.dataset.id = i * level.col + j;
            if (isMine) {
                div.classList.add("mine");
            }
            td.appendChild(div);
            var obj = {
                type: isMine ? "mine" : "number", // 当前格子的类型
                value: array[i][j], // 当前格子的值
                isOpen: false,      // 当前格子有没有被打开
                rightStatus: 0,     // 当前格子的右键状态 0-无，1-旗帜，2-问号
                isSearch: false,    // 当前格子有没有被搜索过
                cell: div,          // 格子信息
            };
            tableData[i][j] = obj;
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    // 防止重复添加表格
    mineAreaDom.innerHTML = "";
    mineAreaDom.appendChild(table);
}

// 生成雷区
function createMines() {
    // 使用洗牌算法生成雷区的一维数组
    var array = new Array(level.row * level.col);
    array.fill(0);
    array.fill(9, 0, level.mines);
    array = shuffle(array);
    // 将雷区一维数组转成二维数组
    var mineArray = [];
    for (var i = 0; i < level.row; i++) {
        var cols = [];
        for (var j = 0; j < level.col; j++) {
            var index = i * level.col + j;
            cols[j] = array[index] === 9 ? 9 : 0;
        }
        mineArray[i] = cols;
    }
    // 生成每个雷周围的数字
    for (var i = 0; i < level.row; i++) {
        for (var j = 0; j < level.col; j++) {
            if (mineArray[i][j] === 9) {
                // 如果是雷，则将周围八个非雷的格子数字+1
                for (var x = i - 1; x <= i + 1; x++) {
                    for (var y = j - 1; y <= j + 1; y++) {
                        if (inArea(x, y) && mineArray[x][y] !== 9) {
                            mineArray[x][y] += 1;
                        }
                    }
                }
            }
        }
    }
    return mineArray;
}

// 洗牌算法
function shuffle(arr){
    var result = [],
        random;
    while(arr.length > 0){
        random = Math.floor(Math.random() * arr.length);
        result.push(arr[random])
        arr.splice(random, 1)
    }
    return result;
}

// 判断坐标是否合格
function inArea(x, y) {
    return x >= 0 && x < level.row && 
           y >= 0 && y < level.col;
}

// 时间相关
var timeId = null;
var curTime = 0;

// 清除时间id
function clearTimeInterval() {
    curTime = 0;
    if (timeId !== null) {
        clearInterval(timeId);
    }
}

// 启动时间
function startTime() {
    timeId = setInterval(() => {
        curTime++;
        if (curTime > 999) {
            clearInterval(timeId);
        } else {
            drawTimeDigit(curTime);
        }
    }, 1000);
}

// 数字图片路径
const DIGIT_IMAGE_URLS = [
    "url('images/digit0.png')",
    "url('images/digit1.png')",
    "url('images/digit2.png')",
    "url('images/digit3.png')",
    "url('images/digit4.png')",
    "url('images/digit5.png')",
    "url('images/digit6.png')",
    "url('images/digit7.png')",
    "url('images/digit8.png')",
    "url('images/digit9.png')",
    "url('images/digit-.png')",
];

/**
 * 绘制游戏时间
 * @param {Number} n 绘制的数字
 */
function drawTimeDigit(n) {
    // 百位数
    var b = parseInt(n / 100);
    // 十位数
    var s = parseInt((n / 10) % 10);
    // 个位数
    var g = n % 10;
    var children = timeNumDom.children;
    children[0].style.backgroundImage = DIGIT_IMAGE_URLS[b];
    children[1].style.backgroundImage = DIGIT_IMAGE_URLS[s];
    children[2].style.backgroundImage = DIGIT_IMAGE_URLS[g];
}

/**
 * 绘制游戏时间
 * @param {Number} n 绘制的数字
 */
function drawMineDigit(n) {
    var children = mineNumDom.children;
    // 百位数
    var b;
    // 十位数
    var s;
    // 个位数
    var g;
    if (n < 0) {
        n = Math.abs(n);
        children[0].style.backgroundImage = DIGIT_IMAGE_URLS[10];
    } else {
        b = parseInt(n / 100);
        children[0].style.backgroundImage = DIGIT_IMAGE_URLS[b];
    }
    s = parseInt((n / 10) % 10);
    g = n % 10;
    children[1].style.backgroundImage = DIGIT_IMAGE_URLS[s];
    children[2].style.backgroundImage = DIGIT_IMAGE_URLS[g];
}

// 绑定事件
function bindEvent() {
    // 取消浏览器自带鼠标右键菜单
    cancelContextMenu();
    // 绑定笑脸点击事件
    bindStatusEvent();
    // 绑定游玩逻辑事件
    bindPlayEvent();
}

// 取消右键菜单
function cancelContextMenu() {
    containerDom.oncontextmenu = () => {
        return false;
    };
}

/**
 * 笑脸点击事件
 */
function bindStatusEvent() {
    var statusImg = statusBtn.children[0];
    statusBtn.onmousedown = () => {
        // 鼠标点击的时候更改边框样式
        statusDom.style.borderColor = "#808080 #fff #fff #808080";
        statusImg.style.backgroundImage = "url('images/smile.png')";
        init();
        bindPlayEvent();
    };
    statusBtn.onmouseup = () => {
        // 点击的时候更改边框样式
        statusDom.style.borderColor = "#fff #808080 #808080 #fff";
    };
}

// 获取格子上的数据信息
function getDataByCell(cell) {
    var index = cell.dataset.id;
    if (index === undefined || index === null) {
        return null;
    }
    var x = Math.floor(index / level.col);
    var y = index % level.col;
    return tableData[x][y];
}

const NUMBER_STR = [ "zero", "one", "two", "three", "four", "five", "six", "seven", "eight" ];

// 左键点击事件
function leftClick(cell) {
    // console.log(cell.dataset.id);
    var cellData = getDataByCell(cell);
    if (cellData === null || cellData === undefined) {
        return;
    }
    // 被标了旗子/问号或者已经打开则不能点击当前格子
    if (cellData.rightStatus > 0 || cellData.isOpen) {
        return;
    }
    // 如果是雷，游戏失败
    if (cellData.type === "mine") {
        // 游戏结束
        gameOver(cell);
        return;
    }
    // 如果是数字类型
    if (cellData.type === "number") {
        // 搜索逻辑
        search(cell, cellData);
    }
}

// 八方向偏移量
const d = [
    [-1, -1], [ 0, -1], [ 1, -1], [-1,  0], 
    [ 1,  0], [-1,  1], [ 0,  1], [ 1,  1]
];
// 搜索函数
function search(cell, cellData) {
    // 如果是数字1-7并且没有标记旗子和问号则直接打开并返回
    var n = cellData.value;
    // 标记了旗子和问号不能打开
    if (cellData.rightStatus === 0) {
        cell.classList.add(NUMBER_STR[n]);
        cell.parentNode.style.border = "none";
        // 标记格子被搜索
        cellData.isSearch = true;
        // 标记格子被打开
        cellData.isOpen = true;
        openNum++;
        if (openNum === level.row * level.col - level.mines) {
            gameWin();
        }
    }
    if (n !== 0) {
        return;
    }
    // 是0执行搜索逻辑
    var curX = Math.floor(cell.dataset.id / level.col);
    var curY = cell.dataset.id % level.col;
    for (var i = 0; i < 8; i++) {
        var newX = curX + d[i][0];
        var newY = curY + d[i][1];
        if (inArea(newX, newY) && 
            tableData[newX][newY].type === "number" && 
            tableData[newX][newY].isSearch === false) {
            var newCellData = tableData[newX][newY];
            var newCell = newCellData.cell;
            search(newCell, newCellData);
        }
    }
}

function gameWin() {
    console.log("恭喜您，游戏胜利！！！");
    isWin = true;
    // 笑脸改成胜利
    var statusImg = statusBtn.children[0];
    statusImg.style.backgroundImage = "url('images/win.png')";
}

// 游戏结束
function gameOver(cell) {
    // 全局游戏状态
    isDead = true;
    // 笑脸改成失败
    var statusImg = statusBtn.children[0];
    statusImg.style.backgroundImage = "url('images/dead.png')";
    // 改变当前格子背景色
    cell.parentNode.style.border = "none";
    cell.parentNode.style.backgroundColor = "#FF0000";
    cell.classList.remove("mine");
    cell.classList.add("mine-death");
    // 显示所有雷
    var allMineDiv = document.querySelectorAll(".mine");
    allMineDiv.forEach((dom) => {
        dom.style.opacity = 1;
        dom.parentNode.style.border = "none";
    });
    // 找到所有插错旗子的格子
    var allFlagDiv = document.querySelectorAll(".flag");
    allFlagDiv.forEach((dom) => {
        var id = dom.dataset.id;
        var x = Math.floor(id / level.col);
        var y = id % level.col;
        var obj = tableData[x][y];
        // 旗子插在了数字上
        if (obj.type === "number") {
            dom.classList.remove("flag");
            dom.classList.add("misflagged");
            dom.parentNode.style.border = "none";
        }
    });
}

// 右键点击事件
function rightClick(cell) {
    var cellData = getDataByCell(cell);
    if (cellData === null || cellData === undefined) {
        return;
    }
    cellData.rightStatus = (cellData.rightStatus + 1) % 3;
    switch (cellData.rightStatus) {
        // 0 空
        case 0:
            cell.classList.remove("question");
            break;
        // 1 旗子
        case 1:
            cell.classList.add("flag");
            mineNum -= 1;
            drawMineDigit(mineNum);
            break;
        // 2 问号
        case 2:
            cell.classList.remove("flag");
            cell.classList.add("question");
            mineNum += 1;
            drawMineDigit(mineNum);
            break;
        default:
            break;
    }
}

// 游玩逻辑事件
function bindPlayEvent() {
    isDead = false;
    isWin = false;
    // console.log(contentDom.firstChild);
    var statusImg = statusBtn.children[0];
    contentDom.firstChild.onmousedown = (e) => {
        // 游戏胜利或者结束的话点击事件都不能生效
        if (isDead || isWin) {
            return;
        }
        // 每次鼠标按下时更改笑脸的样式
        statusImg.style.backgroundImage = "url('images/ohh.png')";
        // 鼠标左键
        if (e.button === 0) {
            leftClick(e.target);
        }

        // 鼠标中键
        if (e.button === 1) {
            // midClick();
        }

        // 鼠标右键
        if (e.button === 2) {
            rightClick(e.target);
        }
    };
    contentDom.firstChild.onmouseup = () => {
        // 每次鼠标松开后更改回笑脸的样式
        statusImg.style.backgroundImage = "url('images/smile.png')";
        if (isDead) { 
            // 游戏结束后不能改回smile，就用dead
            statusImg.style.backgroundImage = "url('images/dead.png')";
            return;
        }
        if (isWin) {
            // 游戏胜利后不能改回smile，就用win
            statusImg.style.backgroundImage = "url('images/win.png')";
        }
    };
}

// 主函数
function main() {
    // 初始化
    init();
    // 绑定事件
    bindEvent();
}

main();
