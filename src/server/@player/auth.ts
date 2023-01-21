import { Database } from '@/@database/database';
import bcrypt from 'bcryptjs';


let db = new Database();

/* ---- EVENTS ---- */
mp.events.add("playerJoin", (player: PlayerMp) => {
    player.setVariable("logged", false);
});

mp.events.add("register_account", async (player: PlayerMp, username: string, email: string, password: string) => {
    if (username.length >= 3 && password.length >= 5) {
        if (!is_email_valid({ email })) return failed_auth(player, 'invalid-auth');
        try {
            const row = await attempt_register(player, username, email, password);
            if (row) {
                console.log(`${username} has been registred successfully.`);
                succes_auth_handle(player, "registred", username);
                player.setVariable("registred", true);
            }
            else failed_auth(player, 'taken-auth');
        } catch (error) {
            error_handler_message(error);
        }
    }
    else failed_auth(player, 'short-auth');
});

mp.events.add("login_account", async (player: PlayerMp, username: string, password: string) => {

    let logged_account = mp.players.toArray().find(logged => logged.getVariable("username") === username);
    if (logged_account) return player.call("login_handler", ['logged']);

    try {
        
        const res = await attempt_login(username, password);
        res ? succes_auth_handle(player, 'success', username) : failed_auth(player, 'incorrect-auth');

    } catch (error) {
        
        error_handler_message(error);
    }
});

mp.events.add("load_player_account", async (player: PlayerMp, username: string) => {
    try {
        const [rows] = await db.query('SELECT * FROM `users` WHERE `username` = ?', [username]);
        if (rows && rows.length !== 0) {
            player.sqlID = rows.ID;
            player.name = username;
            player.setVariable("username", username);
            player.setVariable("logged", true);
            if (player.getVariable("registred") == true) {
                //message register
            } else {
                //message login
            }
            db.query('UPDATE users SET lastActive = now() where username = ?', [username]);
        } else {
            console.log("No rows found with this user name.")
        }
    } catch (error) {
        if(error) console.log(error);
    }
});

/* ---- FUNCTIONS ---- */
function is_email_valid({ email }: { email: string; }): boolean {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
function succes_auth_handle(player: PlayerMp, handle: any, username: string) {
    mp.events.call("load_player_account", player, username);
    player.call('login_handler', [handle]);
    console.log(`${username} has been logged successfully.`);
}
async function attempt_register(player: PlayerMp, username: string, email: string, pass: string): Promise<any> {
    try{
        const [rows] = await db.query('SELECT username, email from users where username = ? or email = ?', [username, email]);
        if(!rows || rows.length === 0) {
            const hash = await bcrypt.hash(pass, 10);
            await db.query('INSERT INTO users (username, email, password, socialClub, socialClubId) VALUES (?,?,?,?,?)', [username, email, hash, player.socialClub, player.rgscId]);
            return true;
        }else{
            return false;
        }
    } catch (error) {
        console.log(error);
    }
}
async function attempt_login(username: string, password: string): Promise<any>  {
    try {
        const [rows] = await db.query(`select username, password, id from users where username = ?`, [username]);        
        if (rows.length === 0) return false;
        const newLocal = await bcrypt.compare(password, rows.password);
        if(newLocal) return true;
        else return false;
    } catch (error) {
        if(error) console.log(error);
    }
}
function error_handler_message(e: any) {
    if (e.sql) {console.log(`[MySQL] ERROR: ${e.sqlMessage}\n[MySQL] QUERY: ${e.sql}`)} else { console.log(`Error: ${e}`) }
}
function failed_auth(player: PlayerMp, handle: any) { player.call('login_handler', [handle]); }