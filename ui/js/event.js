const { listen } = window.__TAURI__.event;

// 当前游戏级别
var GameInfo = {
    level: 1,  // 当前等级
    row: 10,   // 行数
    col: 10,   // 列数
    mines: 10, // 雷数
    cheat: 0   // 可作弊次数
};

// 监听菜单选择事件
const chooseMode = async () => {
    return await listen("choose-mode", (event) => {
        // console.log(event.payload);
        GameInfo = event.payload;
        initData();
    });
};
chooseMode();

// 监听自定义事件
const customMode = async () => {
    return await listen("custom-mode", (event) => {
        console.log(event.payload);
        GameInfo = event.payload;
        initData();
    });
};
customMode();