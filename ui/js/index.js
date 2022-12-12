function drawMineNumber(number) {
    var bai = parseInt(number / 100);
    var shi = parseInt((number % 100) / 10);
    var ge = number % 10;

    var bDom = document.getElementById('n-bai');
    var sDom = document.getElementById('n-shi');
    var gDom = document.getElementById('n-ge');

    bDom.src = 'assets/digit' + bai + '.png';
    sDom.src = 'assets/digit' + shi + '.png';
    gDom.src = 'assets/digit' + ge + '.png';
}

// drawMineNumber(987)

function drawTime(time) {
    var qian = parseInt(time / 1000);
    var bai = parseInt((time % 1000) / 100);
    var shi = parseInt((time % 100) / 10);
    var ge = time % 10;

    var qDom = document.getElementById('t-qian');
    var bDom = document.getElementById('t-bai');
    var sDom = document.getElementById('t-shi');
    var gDom = document.getElementById('t-ge');

    qDom.src = 'assets/digit' + qian + '.png';
    bDom.src = 'assets/digit' + bai + '.png';
    sDom.src = 'assets/digit' + shi + '.png';
    gDom.src = 'assets/digit' + ge + '.png';
}

var timeId;

// 当第一次点击时间才正式开始
function startGame() {
    if (timeId != null) {
        clearInterval(timeId);
    }
    var curTime = 0;
    timeId = setInterval(() => {
        curTime++;
        if (curTime <= 9999) {
            drawTime(curTime);
        } else {
            clearInterval(timeId);
        }
    }, 1000);
}

// startGame();


