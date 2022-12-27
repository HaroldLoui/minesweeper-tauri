const { listen } = window.__TAURI__.event;

// 当前游戏级别
var GameInfo = {
    level: 1,  // 当前等级
    row: 10,   // 行数
    col: 10,   // 列数
    mines: 10, // 雷数
    cheat: 0   // 可作弊次数
};

// choose-mode
const unlisten = async () => {
    return await listen("choose-mode", (event) => {
        // console.log(event.payload);
        GameInfo = event.payload;
        initData();
    });
};
unlisten();