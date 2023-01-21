
var login_browser_component: any;


/* ---- EVENTS ---- */
mp.events.add("playerReady", () => { mp.events.call("show_login"); });
mp.events.add("login_data", (username: string, password: string) => { mp.events.callRemote("login_account", username, password); });
mp.events.add("register_data", (username: string, email: string, password: string) => { mp.events.callRemote("register_account", username, email, password); });

mp.events.add("login_handler", (handle: any) => {

    switch (handle) {
        case 'success': { mp.events.call("hide_player_login"); break; };
        case 'registred': { mp.events.call("hide_player_login"); break; }
        case 'incorrect-auth': { mp.game.graphics.notify("~r~[ERROR]: ~w~Parola introdusa nu este corecta."); break; }
        case 'taken-auth': { mp.game.graphics.notify("~r~[ERROR]: ~w~Numele introdus este deja inregistrat pe server."); break; }
        case 'short-auth': { mp.game.graphics.notify("~r~[ERROR]: ~w~Caracterele introduse in nume/parola sunt prea scurte."); break; }
        case 'logged': { mp.game.graphics.notify("~r~[ERROR]: ~w~Acest cont este deja logat pe server."); break; }
        case 'invalid-auth': { mp.game.graphics.notify("~r~[ERROR]: ~w~Email-ul introdus nu este valid."); break; }
        default: break;
    }
});

mp.events.add("show_login", () => {
    login_browser_component = mp.browsers.new('package://@ui/account/auth.components.html');

    mp.players.local.freezePosition(true);
    setTimeout(() => { mp.gui.cursor.show(true, true); mp.gui.chat.activate(false); }, 500);
    mp.game.ui.setPauseMenuActive(false);
    mp.game.ui.displayRadar(false);
    
});

mp.events.add("hide_login", () => {
    
    login_browser_component.destroy();

    mp.players.local.freezePosition(false);
    mp.gui.cursor.show(false, false);
    mp.game.ui.displayRadar(true);
})