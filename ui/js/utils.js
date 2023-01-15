
// 八方向的步长
const D = [
    [-1, -1], [ 0, -1], [ 1, -1], [-1,  0],
    [ 1,  0], [-1,  1], [ 0,  1], [ 1,  1]
];

/**
 * 一维坐标转为二维坐标
 * @param {Number} index 一维坐标
 * @returns 二维坐标
 */
function _1to2(index) {
    var x = Math.floor(index / GameInfo.col);
    var y = index % GameInfo.col;
    return { x, y };
}

/**
 * 交换数组中两个指定位置的元素
 * @param {Array} array 
 * @param {Number} i 
 * @param {Number} j 
 */
function _swap(array, i, j) {
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
}

/**
 * 使用shuffle算法打乱数组
 * @param {Array} array 
 */
function _shuffle(array) {
    for (var i = array.length - 2; i >= 0; i--) {
        var j = Math.floor(Math.random() * i);
        _swap(array, i, j);
    }
}

/**
 * 整理数组，将最后一个位置放回原来的位置，其余根据当前下标走。
 * 并根据当前的一维雷区数组生成二维雷区数组
 * @param {Array} array 
 * @param {Number} pos 
 */
function _generateNumbers(array, pos) {
    for (var i = 0; i < array.length; i++) {
        if (i >= pos) {
            _swap(array, i, array.length - 1);
        }
        const {x, y} = _1to2(i);
        // 如果当前格子为雷，则将周围非雷的格子数字+1
        if (array[i][1] === 9) {
            mineArea[x][y].value = 9;
            for (var k = 0; k < 8; k++) {
                var x1 = x + D[k][0];
                var y1 = y + D[k][1];
                if (_inArea(x1, y1) && mineArea[x1][y1].value !== 9) {
                    mineArea[x1][y1].value += 1;
                }
            }
        }
        // 为0的情况：
        // 1、可能mineArea[x][y].value已经被加过了，则mineArea[x][y].value不能赋值为0
        // 2、没有被加过，此时mineArea[x][y].value = array[i][1] = 0，这时不需要赋值
    }
}

/**
 * 判断是否越界
 * @param {Number} x 
 * @param {Number} y 
 * @returns 
 */
function _inArea(x, y) {
    return x >= 0 && x < GameInfo.row &&
           y >= 0 && y < GameInfo.col;
}

// 数字图片路径
const SMILE_IMAGE_URLS = [
    "url('images/smile.png')",
    "url('images/ohh.png')",
    "url('images/win.png')",
    "url('images/dead.png')",
];
/**
 * 切换笑脸的图片
 * @param {Number} type 0-smile 1-ohh 2-win 3-dead
 */
function _changeSmile(type) {
    var dom = statusBtn.children[0];
    var url = SMILE_IMAGE_URLS[type];
    dom.style.backgroundImage = url;
}

/**
 * 移除边框
 * @param {Element} cell 
 */
function _removeBorder(cell) {
    // cell.style.border = "none";
    cell.style.border = "3px solid transparent";
    cell.style.backgroundColor = "#ccc";
}

/**
 * 设置新数字
 * @param {Element} dom 
 */
function _replaceDigit(dom, newDigit) {
    var oldDigit = dom.classList[1];
    dom.classList.remove(oldDigit);
    dom.classList.add(newDigit);
}

/**
 * 绘制剩余雷的数量
 * @param {Number} num 
 */
function _drawLaveMines(num) {
    var bDom = document.querySelector("#lb");
    var sDom = document.querySelector("#ls");
    var gDom = document.querySelector("#lg");
    if (num >= 0) {
        // 百分位
        var b = Math.floor(num / 100);
        _replaceDigit(bDom, "digit" + b);
        // 十分位
        var s = Math.floor((num % 100) / 10);
        _replaceDigit(sDom, "digit" + s);
        // 个分位
        var g = num % 10;
        _replaceDigit(gDom, "digit" + g);
    } else {
        num = -num;
        // 十分位
        var s = Math.floor((num % 100) / 10);
        if (s === 0) {
            _replaceDigit(sDom, "digit-");
        } else {
            _replaceDigit(bDom, "digit-");
            _replaceDigit(sDom, "digit" + s);
        }
        // 个分位
        var g = num % 10;
        _replaceDigit(gDom, "digit" + g);
    }
}

/**
 * 绘制当前时间
 * @param {Number} num 
 */
function _drawCurTime(num) {
    num = num > 999 ? 999 : num;
    var bDom = document.querySelector("#tb");
    var sDom = document.querySelector("#ts");
    var gDom = document.querySelector("#tg");
    // 百分位
    var b = Math.floor(num / 100);
    _replaceDigit(bDom, "digit" + b);
    // 十分位
    var s = Math.floor((num % 100) / 10);
    _replaceDigit(sDom, "digit" + s);
    // 个分位
    var g = num % 10;
    _replaceDigit(gDom, "digit" + g);
}

// 暂停
function _sleep(time) {
    return new Promise(res => setTimeout(res, time));
}
