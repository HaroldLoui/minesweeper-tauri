#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri::{CustomMenuItem, Menu, MenuItem, PhysicalSize, Size, Submenu, Window};

// the payload type must implement `Serialize` and `Clone`.
#[derive(Clone, serde::Serialize)]
struct Payload {
    message: String,
    game_mode: String,
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
                        width: 200 , height: 200,
                    });
                    let payload = Payload {
                        message: "初级".into(),
			            game_mode: "simple".into(),
                    };
                    choose_mode(window, size, payload);
                }
                "medium" => {
                    println!("选择了中级模式");
                    let size = Size::Physical(PhysicalSize {
                        width: 300 , height: 300,
                    });
                    let payload = Payload {
                        message: "中级".into(),
			            game_mode: "medium".into(),
                    };
                    choose_mode(window, size, payload);
                }
                "hard" => {
                    println!("选择了高级模式");
                    let size = Size::Physical(PhysicalSize {
                        width: 400 , height: 400,
                    });
                    let payload = Payload {
                        message: "高级".into(),
			            game_mode: "hard".into(),
                    };
                    choose_mode(window, size, payload);
                }
                "full_screen" => {
                    println!("选择了满屏模式");
                    let size = Size::Physical(PhysicalSize {
                        width: 500 , height: 500,
                    });
                    let payload = Payload {
                        message: "满屏".into(),
			            game_mode: "full_screen".into(),
                    };
                    choose_mode(window, size, payload);
                }
                _ => {}
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn choose_mode(window: &Window, size: Size, payload: Payload) {
    window.set_size(size).unwrap();
    window.emit("choose-mode", payload).unwrap();
}

