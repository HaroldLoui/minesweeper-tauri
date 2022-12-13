const { listen } = window.__TAURI__.event;

let minesArea = [];
let info = {
  level: 1,
  row: 10,
  col: 10,
  mines: 10,
  cheat: 0
};

// choose-mode
const unlisten = async () => {
  return await listen("choose-mode", (event) => {
    // console.log(event.payload);
    info = event.payload;
    console.log(info);
    init();
  });
};
unlisten();

const BLOCK_WIDTH = 40;
const BLOCK_HEIGHT = 40;

const canvas = document.getElementById("mines-canvas");
const ctx = canvas.getContext("2d");

function init() {
  // console.log("3333333", info);
  canvas.width = info.col * BLOCK_WIDTH;
  // canvas.width = 1300;
  canvas.height = info.row * BLOCK_HEIGHT;
  console.log("4444444", canvas.width)
  ctx.fillStyle = "aliceblue";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  minesArea = generateMines();
}

init();

function drawMineNumber(number) {
  var bai = parseInt(number / 100);
  var shi = parseInt((number % 100) / 10);
  var ge = number % 10;

  var bDom = document.getElementById("n-bai");
  var sDom = document.getElementById("n-shi");
  var gDom = document.getElementById("n-ge");

  bDom.src = "assets/digit" + bai + ".png";
  sDom.src = "assets/digit" + shi + ".png";
  gDom.src = "assets/digit" + ge + ".png";
}

function drawTime(time) {
  var qian = parseInt(time / 1000);
  var bai = parseInt((time % 1000) / 100);
  var shi = parseInt((time % 100) / 10);
  var ge = time % 10;

  var qDom = document.getElementById("t-qian");
  var bDom = document.getElementById("t-bai");
  var sDom = document.getElementById("t-shi");
  var gDom = document.getElementById("t-ge");

  qDom.src = "assets/digit" + qian + ".png";
  bDom.src = "assets/digit" + bai + ".png";
  sDom.src = "assets/digit" + shi + ".png";
  gDom.src = "assets/digit" + ge + ".png";
}

var timeId = null;

// 当第一次点击时间才正式开始
function resetTime() {
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

// 绘制雷区
function drawMines() {
  // const minesArea = minesArea;
  console.log(info)
  for (var i = 0; i < info.row; i++) {
    for (var j = 0; j < info.col; j++) {
      ctx.font = "14px serif";
      ctx.strokeStyle = "#ccc";
      ctx.strokeRect(BLOCK_WIDTH * i, BLOCK_HEIGHT * j, BLOCK_WIDTH, BLOCK_HEIGHT);
      drawBlock(minesArea[i][j], i, j);
    }
  }
}

// 生成雷区
function generateMines() {
  // 初始化二维数组
  console.log("111111", info)
  var rows = [];
  for (var i = 0; i < info.row; i++) {
    var cols = [];
    for (var j = 0; j < info.col; j++) {
      cols[j] = 0;
    }
    rows[i] = cols;
  }
  // 初始化一维数组并通过shuffle算法生成雷区
  var array = new Array(info.row * info.col);
  array.fill(0);
  for (var n = 0; n < info.mines; n++) {
    array[n] = "m";
  }
  array = shuffle(array);
  // console.log(array);
  // 将一维雷区映射到二维上
  for (var i = 0; i < array.length; i++) {
    var newX = parseInt(i / info.col);
    var newY = i % info.col;
    rows[newX][newY] = array[i];
  }
  // console.log(rows);
  // 遍历雷区生成数字
  for (var i = 0; i < info.row; i++) {
    for (var j = 0; j < info.col; j++) {
      if (rows[i][j] === "m") {
        // 如果是雷，则将周围八个非雷的格子数字+1
        for (var x = i - 1; x <= i + 1; x++) {
          for (var y = j - 1; y <= j + 1; y++) {
            if (inArea(x, y) && rows[x][y] !== "m") {
              rows[x][y] += 1;
            }
          }
        }
      }
    }
  }
  return rows;
}

function inArea(x, y) {
  return x >= 0 && x < info.row && y >= 0 && y < info.col;
}

// 洗牌算法，打乱数组顺序
function shuffle(array){
  let res = [], random;
  while(array.length>0){
    random = Math.floor(Math.random()*array.length);
    res.push(array[random]);
    array.splice(random, 1);
  }
  return res;
}

// 绘制数字
function drawBlock(n, x, y) {
  const colors = [
    "",
    "#0000FF", // 1
    "#007B00", // 2
    "#FF0000", // 3
    "#00007B", // 4
    "#7B0000", // 5
    "#007B7B", // 6
    "#000000", // 7
    "#7B7B7B", // 8
  ];
  if (n >= 0 && n <= 8) {
    ctx.strokeStyle = colors[n];
    if (n > 0) {
      ctx.strokeText(n, 40*x+18, 40*y+23);
    }
  } else {
    ctx.strokeStyle = "#000";
    ctx.strokeText(n, 40*x+18, 40*y+23);
  }
}

function startGame() {
  init();
  drawMines();
}

// startGame();
