#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod menus;
use menus::menu::{ init_menu, menu_event };

fn main() {
    tauri::Builder::default()
        .menu(init_menu())
        .on_menu_event(menu_event)
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
