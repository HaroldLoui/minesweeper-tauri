#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri::{
    Window,
    CustomMenuItem, Menu, MenuItem, Submenu,
    Size, PhysicalSize
};

// the payload type must implement `Serialize` and `Clone`.
#[derive(Clone, serde::Serialize)]
struct GameInfo {
    row: u32,   // 行
    col: u32,   // 列
    mines: u32, // 雷数量
    cheat: u32, // 可作弊次数
}

fn main() {
    // `"quit".to_string()` 是菜单项的id，第二个参数是菜单的名称
    let simple = CustomMenuItem::new("simple".to_string(), "初级");
    let medium = CustomMenuItem::new("medium".to_string(), "中级");
    let hard = CustomMenuItem::new("hard".to_string(), "高级");
    let full_screen = CustomMenuItem::new("full_screen".to_string(), "满屏");
    // let close = CustomMenuItem::new("close".to_string(), "Close");
    let game_sub_menu = Submenu::new(
        "游戏",
        Menu::new()
            .add_item(simple)
            .add_item(medium)
            .add_item(hard)
            .add_item(full_screen),
    );
    let menu = Menu::new()
        .add_native_item(MenuItem::Copy)
        .add_submenu(game_sub_menu)
        .add_item(CustomMenuItem::new("help", "帮助"));

    tauri::Builder::default()
        .menu(menu)
        .on_menu_event(|event| {
            let window = event.window();
            match event.menu_item_id() {
                "simple" => {
                    println!("选择了初级模式");
                    let size = Size::Physical(PhysicalSize {
                        width: 400 , height: 450,
                    });
                    let info = GameInfo {
                        row: 10,
                        col: 10,
                        mines: 10,
                        cheat: 0
                    };
                    choose_mode(window, size, info);
                }
                "medium" => {
                    println!("选择了中级模式");
                    let size = Size::Physical(PhysicalSize {
                        width: 640 , height: 690,
                    });
                    let info = GameInfo {
                        row: 16,
                        col: 16,
                        mines: 40,
                        cheat: 3
                    };
                    choose_mode(window, size, info);
                }
                "hard" => {
                    println!("选择了高级模式");
                    let size = Size::Physical(PhysicalSize {
                        width: 1300 , height: 690,
                    });
                    let info = GameInfo {
                        row: 16,
                        col: 30,
                        mines: 99,
                        cheat: 5
                    };
                    choose_mode(window, size, info);
                }
                "full_screen" => {
                    println!("选择了满屏模式");
                    let size = Size::Physical(PhysicalSize {
                        width: 1200 , height: 690,
                    });
                    let info = GameInfo {
                        row: 10,
                        col: 10,
                        mines: 10,
                        cheat: 0
                    };
                    choose_mode(window, size, info);
                }
                _ => {}
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn choose_mode(window: &Window, size: Size, info: GameInfo) {
    window.set_size(size).unwrap();
    // window.center().unwrap();
    window.emit("choose-mode", info).unwrap();
}

