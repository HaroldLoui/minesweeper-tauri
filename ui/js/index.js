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

// 初始化函数
function init() {
    clearTimeInterval();
    // startTime();
    resetWidth();
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
    var table = document.createElement("table");
    var array = createMines();
    // console.log(array);
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
            drawDigit(curTime, 1);
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
];

/**
 * 绘制游戏状态区域的数字信息
 * @param {Number} n 绘制的数字
 * @param {Number} type 绘制的类型 0-剩余雷的数量 1-花费的时间
 */
function drawDigit(n, type) {
    // 百位数
    var b = parseInt(n / 100);
    // 十位数
    var s = parseInt((n / 10) % 10);
    // 个位数
    var g = n % 10;
    // 根据类型绘制不同的区域
    if (type === 0) {
        var children = mineNumDom.children;
        children[0].style.backgroundImage = DIGIT_IMAGE_URLS[b];
        children[1].style.backgroundImage = DIGIT_IMAGE_URLS[s];
        children[2].style.backgroundImage = DIGIT_IMAGE_URLS[g];
    } else {
        var children = timeNumDom.children;
        children[0].style.backgroundImage = DIGIT_IMAGE_URLS[b];
        children[1].style.backgroundImage = DIGIT_IMAGE_URLS[s];
        children[2].style.backgroundImage = DIGIT_IMAGE_URLS[g];
    }
}

// 绑定事件
function bindEvent() {
    // 取消浏览器自带鼠标右键菜单
    cancelContextMenu();
    // 绑定笑脸点击事件
    bindStatusEvent();
    // 绑定游玩逻辑事件
    play();
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
    isDead = false;
    statusBtn.onmousedown = () => {
        // 鼠标点击的时候更改边框样式
        statusDom.style.borderColor = "#808080 #fff #fff #808080";
        statusImg.style.backgroundImage = "url('images/smile.png')";
        init();
    };
    statusBtn.onmouseup = () => {
        // 点击的时候更改边框样式
        statusDom.style.borderColor = "#fff #808080 #808080 #fff";
    };
}

// 获取格子上的数据信息
function getDataByCell(cell) {
    var index = cell.dataset.id;
    var x = Math.floor(index / level.col);
    var y = index % level.col;
    return tableData[x][y];
}

// 左键点击事件
function leftClick(cell) {
    // console.log(cell.dataset.id);
    var cellData = getDataByCell(cell);
    console.log(cellData);
    // 如果是雷，游戏失败
    if (cellData.type === "mine") {
        gameOver();
    }
    // cell.parentNode.style.border = "none";
    // cell.className = "zero";
}

// 游戏结束
function gameOver() {
    isDead = true;
    // 显示所有雷
    var allDiv = document.querySelectorAll(".mine");
    allDiv.forEach((dom) => {
        dom.style.opacity = 1;
    });
    // 笑脸改成失败笑脸
    // console.log(statusBtn.children[0])
    var statusImg = statusBtn.children[0];
    statusImg.style.backgroundImage = "url('images/dead.png')";
}

// 游玩逻辑
function play() {
    // console.log(contentDom.firstChild);
    var statusImg = statusBtn.children[0];
    contentDom.firstChild.onmousedown = (e) => {
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

        }
    };
    contentDom.firstChild.onmouseup = () => {
        // 每次鼠标松开后更改回笑脸的样式
        if (!isDead) { // 如果游戏失败
            statusImg.style.backgroundImage = "url('images/smile.png')";
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