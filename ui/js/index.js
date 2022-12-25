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

const NUMBER_STR = [ "zero", "one", "two", "three", "four", "five", "six", "seven", "eight" ];

// ============== global variables ========
// 游戏是否初始化
var isInit = false;
// 游戏是否胜利
var isWin = false;
//游戏是否失败
var isDead = false;
// 存储雷区数字 9 代表是雷
var mineArea = [];
// 打开格子的数量
var openBlockNum = 0;
// 插旗数
var flagNum = 0;
// 当前时间
var curTime = 0;
var timeId = null;
//作弊次数
var cheats = 0;
// ============== global variables ========

function initData() {
    initVariables();
    // 初始化游戏页面宽度
    initWidth();
    // 创建雷区格子
    createMineBlocks();
    // 更新雷区格子数量
    updateLaveMineNum(flagNum);
    // 重置时间
    resetTime();
    // 清除时间id
    clearTime();
}

/**
 * 初始化全局变量
 */
function initVariables() {
    isInit = false;
    isWin = false;
    isDead = false;
    mineArea = [];
    openBlockNum = 0;
    flagNum = 0;
    curTime = 0;
    cheats = LEVEL.cheat;
}

/**
 * 初始化游戏页面宽度
 */
function initWidth() {
    // 根据游戏绘制不同的宽度
    const width = LEVEL.col * 35;
    headerDom.style.width = width + "px";
    contentDom.style.width = width + "px";
    containerDom.style.width = width + 20 + "px";
}

/**
 * 创建页面格子并初始化雷区数字数组
 */
function createMineBlocks() {
    // 创建雷区表格
    var table = document.createElement("table");
    for (var i = 0; i < LEVEL.row; i++) {
        // 创建雷区的每一行
        var tr = document.createElement("tr");
        // 初始化雷区数组的每行
        mineArea[i] = [];
        for (var j = 0; j < LEVEL.col; j++) {
            var id = i * LEVEL.col + j;
            // 创建雷区每行的每一列
            var td = document.createElement("td");
            td.dataset.id = id;
            td.id = "td" + id;
            tr.appendChild(td);
            // 初始化雷区数组每行的每列
            // mineArea[i][j] = 0;
            mineArea[i][j] = {
                value: 0, // 值
                isVisit: false, // 是否被访问过
                isFlag: 0, // 0-空 1-旗子 2-问号
            };
        }
        table.appendChild(tr);
    }
    contentDom.innerHTML = '';
    contentDom.appendChild(table);
}

/**
 * 根据第一次选择的位置来生成雷区，以确保第一次不会踩中雷
 * @param {Number} pos 第一次的选择位置
 */
function createMineArea(pos) {
    // 一维雷区数组
    var mineArray = new Array(LEVEL.row * LEVEL.col);
    for (var i = 0; i < mineArray.length; i++) {
        mineArray[i] = [];
        mineArray[i][0] = i;
        mineArray[i][1] = 0;
    }
    // 将选择的位置放到最后
    _swap(mineArray, pos, mineArray.length - 1);
    // 通过shuffle算法确保雷被放到每个位置的概率是均匀的
    for (var i = 0; i < LEVEL.mines; i++) {
        mineArray[i][1] = 9;
    }
    _shuffle(mineArray);
    // 一维雷区数组生成二维雷区数组
    _generateNumbers(mineArray, pos);
    // console.log(mineArea);
}

// 绑定事件
function bindEvent() {
    // 取消浏览器自带鼠标右键菜单
    cancelContextMenu();
    // 绑定笑脸点击事件
    bindStatusEvent();
    // 绑定雷区点击事件
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
    statusBtn.onmousedown = () => {
        _changeSmile(0);
        // 鼠标点击的时候更改边框样式
        statusDom.style.borderColor = "#808080 #fff #fff #808080";
        initData();
    };
    statusBtn.onmouseup = () => {
        // 点击的时候更改边框样式
        statusDom.style.borderColor = "#fff #808080 #808080 #fff";
    };
}

/**
 * 游戏游玩点击的逻辑事件
 */
function bindPlayEvent() {
    // 鼠标按下
    contentDom.onmousedown = (e) => {
        // 游戏成功或者失败都不能继续进行点击
        if (isWin || isDead) {
            return;
        }
        // 每次点击的时候切换下笑脸的图片为ohh
        _changeSmile(1);
        // 确保第一次点击不会踩到雷
        if (!isInit) {
            isInit = true;
            // 设置雷区
            createMineArea(e.target.dataset.id);
            // 启动时间
            startTime();
        }
        switch (e.button) {
            case 0: // 左键
                leftClick(e.target);
                break;
            case 1: // 中键
                middleClick(e.target);
                break;
            case 2: // 右键
                rightClick(e.target);
                break;
            default: break;
        }
    };
    // 鼠标松开
    contentDom.onmouseup = () => {
        // 游戏胜利则显示胜利的图片
        if (isWin) {
            _changeSmile(2);
            return;
        }
        // 游戏失败则显示失败的图片
        if (isDead) {
            _changeSmile(3);
            return;
        }
        // 从ohh切回笑脸
        _changeSmile(0);
    };
}

/**
 * 左键点击事件
 * @param {Element} cell 
 */
function leftClick(cell) {
    var id = cell.dataset.id;
    const {x, y} = _1to2(id);
    // 已经被打开或者被标记了旗子和问号的格子不能被点击
    if (mineArea[x][y].isVisit || mineArea[x][y].isFlag > 0) {
        return;
    }
    // 踩到雷了
    if (mineArea[x][y].value === 9) {
        gameOver(cell);
        return;
    } 
    // 0-8则打开格子
    openBlock(x, y);
}

/**
 * 打开当前格子
 * @param {Number} x 
 * @param {Number} y 
 */
function openBlock(x, y) {
    const value = mineArea[x][y].value;
    if (value === 9 || mineArea[x][y].isVisit) {
        return;
    }
    mineArea[x][y].isVisit = true;
    var id = x * LEVEL.col + y;
    var dom = document.querySelector("#td" + id);
    _removeBorder(dom);
    dom.classList.add(NUMBER_STR[value]);
    // 检查是否胜利
    openBlockNum += 1;
    if (openBlockNum === LEVEL.row * LEVEL.col - LEVEL.mines) {
        gameWin();
        return;
    }
    // 如果是空白格子则进行递归打开操作
    if (value === 0) {
        for (var i = 0; i < 8; i++) {
            var x1 = x + D[i][0];
            var y1 = y + D[i][1];
            if (_inArea(x1, y1) && mineArea[x1][y1].value !== 9 &&
                !mineArea[x1][y1].isVisit && mineArea[x1][y1].isFlag === 0) {
                openBlock(x1, y1);
            }
        }
    }
}

/**
 * 游戏胜利逻辑
 */
function gameWin() {
    // 设置全局属性
    isWin = true;
    // 改笑脸
    _changeSmile(2);
    // 清除时间
    clearTime();
    // TODO: 排行榜
    console.log("You win");
}

/**
 * 游戏结束逻辑
 * @param {Element} cell
 */
function gameOver(cell) {
    // 设置全局属性
    isDead = true;
    // 改笑脸
    _changeSmile(3);
    // 清除时间
    clearTime();
    // 找到所有为雷并且没有被右键进行标记过的格子标记出来
    for (var i = 0; i < LEVEL.row; i++) {
        for (var j = 0; j < LEVEL.col; j++) {
            if (mineArea[i][j].value === 9 && 
                mineArea[i][j].isFlag === 0) {
                var id = i * LEVEL.col + j;
                var dom = document.querySelector("#td" + id);
                dom.classList.add("mine");
                _removeBorder(dom);
            }
        }
    }
    // 选中的格子颜色为红色
    cell.classList.remove("mine");
    cell.classList.add("mine-death");
    // 找到所有插错旗子的格子
    var flagBlocks = document.querySelectorAll(".flag");
    flagBlocks.forEach((dom) => {
        const {x, y} = _1to2(dom.dataset.id);
        // 插错旗了
        if (mineArea[x][y].value !== 9) {
            dom.classList.remove("flag");
            dom.classList.add("misflagged");
        }
    });
}

/**
 * 右键点击事件
 * @param {Element} cell 
 */
function rightClick(cell) {
    var id = cell.dataset.id;
    const {x, y} = _1to2(id);
    // 已经被打开的格子不能被右键点击
    if (mineArea[x][y].isVisit) {
        return;
    }
    // 更新当前格子右键状态;
    mineArea[x][y].isFlag = (mineArea[x][y].isFlag + 1) % 3;
    switch (mineArea[x][y].isFlag) {
        case 0: // 空
            cell.classList.remove("question");
            break;
        case 1: // 旗子
            cell.classList.add("flag");
            flagNum++;
            break;
        case 2: // 问号
            cell.classList.remove("flag");
            cell.classList.add("question");
            flagNum--;
            break;
        default: break;
    }
    // 更新剩余雷的数量
    updateLaveMineNum(flagNum);
}

/**
 * 根据插旗的数量更新剩余雷的数量
 * @param {Number} flagNum 插旗的数量
 */
function updateLaveMineNum(flagNum) {
    var laveNum = LEVEL.mines - flagNum;
    _drawLaveMines(laveNum);
}

/**
 * 中键点击事件
 * @param {Element} cell 
 */
function middleClick(cell) {
    const {x, y} = _1to2(cell.dataset.id);
    const value = mineArea[x][y];
    if (cheats <= 0 || mineArea[x][y].isVisit 
        || mineArea[x][y].isFlag !== 0) {
        return;
    }
    // 是雷则插上旗子，否则直接打开
    if (value === 9) {
        mineArea[x][y].isFlag = 1;
        cell.classList.add("flag");
        flagNum++;
        updateLaveMineNum(flagNum);
    } else {
        openBlock(x, y);
    }
    cheats -= 1;
}

/**
 * 重置时间
 */
function resetTime() {
    curTime = 0;
    _drawCurTime(curTime);
}

/**
 * 清除时间id
 */
function clearTime() {
    if (timeId !== null) {
        clearInterval(timeId);
    }
}

/**
 * 启动时间
 */
function startTime() {
    timeId = setInterval(() => {
        curTime++;
        _drawCurTime(curTime);
    }, 1000);
}

// 主函数
function main() {
    // 初始化数据
    initData();
    // 绑定事件
    bindEvent();
}

main();