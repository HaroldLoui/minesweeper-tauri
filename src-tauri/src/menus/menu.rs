use tauri::{ CustomMenuItem, Menu, MenuItem, Submenu, WindowMenuEvent };
use tauri::{ Size, PhysicalSize };

const SIMPLE: &str = "simple";
const MEDIUM: &str = "medium";
const HARD: &str = "hard";
const FULL_SCREEN: &str = "full_screen";

const CHOOSE_MODE: &str = "choose-mode";

// 初始化菜单
pub fn init_menu() -> Menu {
    // `"quit".to_string()` 是菜单项的id，第二个参数是菜单的名称
    let simple_menu = CustomMenuItem::new(SIMPLE.to_string(), "初级");
    let medium_menu = CustomMenuItem::new(MEDIUM.to_string(), "中级");
    let hard_menu = CustomMenuItem::new(HARD.to_string(), "高级");
    let full_screen_menu = CustomMenuItem::new(FULL_SCREEN.to_string(), "满屏");
    // let close = CustomMenuItem::new("close".to_string(), "Close");
    let game_sub_menu = Submenu::new(
        "游戏",
        Menu::new()
            .add_item(simple_menu)
            .add_item(medium_menu)
            .add_item(hard_menu)
            .add_item(full_screen_menu),
    );
    Menu::new()
        .add_native_item(MenuItem::Copy)
        .add_submenu(game_sub_menu)
        .add_item(CustomMenuItem::new("help", "帮助"))
}

// 菜单选择事件
pub fn menu_event(event: WindowMenuEvent) {
    let window = event.window();
    window.center().unwrap();
    match event.menu_item_id() {
        // 还是要发事件去触发初始化数据的操作
        SIMPLE => {
            window.unmaximize().unwrap();
            window.set_size(Size::Physical(PhysicalSize { width: 380, height: 450 })).unwrap();
            window.emit(CHOOSE_MODE, GameInfo::simple()).unwrap();
        }
        MEDIUM => {
            window.unmaximize().unwrap();
            window.set_size(Size::Physical(PhysicalSize { width: 600, height: 665 })).unwrap();
            window.emit(CHOOSE_MODE, GameInfo::medium()).unwrap();
        }
        HARD => {
            window.unmaximize().unwrap();
            window.set_size(Size::Physical(PhysicalSize { width: 1080, height: 665 })).unwrap();
            window.emit(CHOOSE_MODE, GameInfo::hard()).unwrap();
        }
        FULL_SCREEN => {
            window.maximize().unwrap();
            window.emit(CHOOSE_MODE, GameInfo::full_screen()).unwrap();
        }
        _ => {}
    }
    window.center().unwrap();
}

#[derive(Clone, serde::Serialize)]
struct GameInfo {
    level: u32, // 当前等级
    row: u32,   // 行
    col: u32,   // 列
    mines: u32, // 雷的数量
    cheat: u32, // 可作弊次数
}

impl GameInfo {
    pub fn simple() -> GameInfo {
        GameInfo { level: 1, row: 10, col: 10, mines: 10, cheat: 0 }
    }
    pub fn medium() -> GameInfo {
        GameInfo { level: 2, row: 16, col: 16, mines: 40, cheat: 3 }
    }
    pub fn hard() -> GameInfo {
        GameInfo { level: 3, row: 16, col: 30, mines: 99, cheat: 5 }
    }
    pub fn full_screen() -> GameInfo {
        GameInfo { level: 4, row: 10, col: 10, mines: 10, cheat: 0 }
    }
}