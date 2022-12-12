const { listen } = window.__TAURI__.event;
// choose-mode
const unlisten = async () => {
    return await listen('choose-mode', (event) => {
        // console.log(event);
        const { message, game_mode } = event.payload;
        console.log(message);
        console.log(game_mode);
        // document.getElementById('title').innerHTML = message;
    });
};
unlisten();