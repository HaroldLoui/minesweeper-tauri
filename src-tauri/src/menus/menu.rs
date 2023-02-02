use tauri::{ CustomMenuItem, Menu, MenuItem, Submenu, WindowMenuEvent, Manager };
use tauri::{ Size, PhysicalSize };

const SIMPLE: &str = "simple";
const MEDIUM: &str = "medium";
const HARD: &str = "hard";
const FULL_SCREEN: &str = "full_screen";
const CUSTOM: &str = "custom";
const RANK: &str = "rank";
const AUTO_FLAG: &str = "auto_flag";

const CHOOSE_MODE_EVENT_NAME: &str = "choose-mode";
const AUTO_FLAG_EVENT_NAME: &str = "auto-flag";

// 是否自动插旗标志
static mut IS_AUTO_FLAG: bool = false;

// 初始化菜单
pub fn init_menu() -> Menu {
    // `"quit".to_string()` 是菜单项的id，第二个参数是菜单的名称
    let simple_menu = CustomMenuItem::new(SIMPLE.to_string(), "初级");
    let medium_menu = CustomMenuItem::new(MEDIUM.to_string(), "中级");
    let hard_menu = CustomMenuItem::new(HARD.to_string(), "高级");
    let full_screen_menu = CustomMenuItem::new(FULL_SCREEN.to_string(), "满屏");
    let custom_menu = CustomMenuItem::new(CUSTOM.to_string(), "自定义");
    let rank_menu = CustomMenuItem::new(RANK.to_string(), "排行榜");
    let auto_flag_menu = CustomMenuItem::new(AUTO_FLAG.to_string(), "[  ] 自动插旗");
    let game_sub_menu = Submenu::new(
        "游戏",
        Menu::new()
            .add_item(simple_menu)
            .add_item(medium_menu)
            .add_item(hard_menu)
            .add_item(full_screen_menu)
            .add_item(custom_menu)
    );
    let help_sub_menu = Submenu::new(
        "帮助",
        Menu::new().add_item(auto_flag_menu).add_item(rank_menu)
    );
    Menu::new()
        .add_native_item(MenuItem::Copy)
        .add_submenu(game_sub_menu)
        .add_submenu(help_sub_menu)
}

// 菜单选择事件
pub fn menu_event(event: WindowMenuEvent) {
    let window = event.window();
    window.center().unwrap();
    match event.menu_item_id() {
        // 还是要发事件去触发初始化数据的操作
        SIMPLE => {
            window.unmaximize().unwrap();
            window.set_size(Size::Physical(PhysicalSize { width: 1200, height: 800 })).unwrap();
            window.emit(CHOOSE_MODE_EVENT_NAME, GameInfo::simple()).unwrap();
        }
        MEDIUM => {
            window.unmaximize().unwrap();
            window.set_size(Size::Physical(PhysicalSize { width: 1200, height: 800 })).unwrap();
            window.emit(CHOOSE_MODE_EVENT_NAME, GameInfo::medium()).unwrap();
        }
        HARD => {
            window.unmaximize().unwrap();
            window.set_size(Size::Physical(PhysicalSize { width: 1200, height: 800 })).unwrap();
            window.emit(CHOOSE_MODE_EVENT_NAME, GameInfo::hard()).unwrap();
        }
        FULL_SCREEN => {
            window.maximize().unwrap();
            window.emit(CHOOSE_MODE_EVENT_NAME, GameInfo::full_screen()).unwrap();
        }
        CUSTOM => {
            let handle = window.app_handle();
            std::thread::spawn(move || {
                let custom_window = tauri::WindowBuilder::new(
                    &handle,
                    "custom",
                    tauri::WindowUrl::App("custom.html".into())
                ).build().unwrap();
                custom_window.set_title("自定义").unwrap();
                custom_window.center().unwrap();
                custom_window.set_size(Size::Physical(PhysicalSize { width: 350, height: 350 })).unwrap();
                custom_window.set_resizable(false).unwrap();
            });
        }
        RANK => {
            let handle = window.app_handle();
            open_rank_window(handle);
        }
        AUTO_FLAG => {
            let menu_handle = window.menu_handle();
            let borrow_window = window.clone();
            std::thread::spawn(move || {
                unsafe {
                    IS_AUTO_FLAG = !IS_AUTO_FLAG;
                    if IS_AUTO_FLAG {
                        menu_handle.get_item(AUTO_FLAG).set_title("[✅] 自动插旗").unwrap();
                    } else {
                        menu_handle.get_item(AUTO_FLAG).set_title("[  ] 自动插旗").unwrap();
                    }
                    borrow_window.emit(AUTO_FLAG_EVENT_NAME, IS_AUTO_FLAG).unwrap();
                }
            });
        }
        _ => {}
    }
    window.center().unwrap();
}

// 打开rank窗口
pub fn open_rank_window(handle: tauri::AppHandle) {
    let rank_window = match tauri::WindowBuilder::new(
        &handle,
        "rank",
        tauri::WindowUrl::App("rank.html".into())
    ).build() {
        Ok(rank_window) => rank_window,
        Err(_err) => {
            return;
        }
    };
    rank_window.set_title("排行榜").unwrap();
    rank_window.center().unwrap();
    rank_window.set_size(Size::Physical(PhysicalSize { width: 600, height: 600 })).unwrap();
    rank_window.set_resizable(false).unwrap();
}

#[derive(Clone, serde::Serialize)]
pub struct GameInfo {
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
