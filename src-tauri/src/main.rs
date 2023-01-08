#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod menus;
use menus::menu::{ init_menu, menu_event, open_rank_window };
use std::fs::{ File, OpenOptions };
use std::io::{ Write, Read };

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![rank, get_rank_list])
        .menu(init_menu())
        .on_menu_event(menu_event)
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
async fn rank(handle: tauri::AppHandle, time: u32, level: u8) {
    // 写入文件
    let mut file = OpenOptions::new().read(true).write(true).append(true).create(true)
                .open("../rank.txt").unwrap();

    let line = format!("{} {} {}\n", level, whoami::username(), time);
    file.write_all(line.as_bytes()).unwrap();
    file.flush().unwrap();

    // 打开rank窗口
    open_rank_window(handle);
}

#[tauri::command]
fn get_rank_list() -> String {
    let mut buffer = String::new();
    let mut file = File::open("../rank.txt").unwrap();
    file.read_to_string(&mut buffer).unwrap();
    format!("{}", buffer)
}