import { COLORS } from "@shared/constants";


const random_spawns: Vector3[] = [
    new mp.Vector3(-329.95654296875, 6154.52197265625, 32.31327819824219),
    new mp.Vector3(-330.1108093261719, 6149.98095703125, 32.31329345703125)
];
const random_headings: number[] = [
    74.72555541992188,
    102.65151977539062
];

export const spawn_player = (player: PlayerMp) => {
    player.spawn(random_spawns[Math.floor(Math.random() * random_spawns.length)]);
    player.heading = random_headings[Math.floor(Math.random() * random_headings.length)];
};
export const sendLocal = (player: PlayerMp, color: string, range: number, message: string) => {
    if (player.getVariable('logged') === true) {
        mp.players.forEachInRange(player.position, range, (x) => {
            x.outputChatBox(`!{${color}} ${message}`);
        });
    }
};
export const SendMsg = (player: PlayerMp, color: string, message: string) => {
    if (player.getVariable('logged') === true) {
        player.outputChatBox(`!{${color}} ${message}`);
    }
};
export const sendError = (player: PlayerMp, message: string) => {
    if (player.getVariable('logged') === true) {
        player.outputChatBox(`!{${COLORS.COLOR_SERVER}}Eroare: !{f9f9f9}${message}`)
    }
};
export const sendUsage = (player: PlayerMp, message: string) => {
    if (player.getVariable('logged') === true) {
        player.outputChatBox(`!{${COLORS.COLOR_SERVER}}Syntax: !{f9f9f9}${message}`)
    }
};
export const getNameByID = (playerNameOrPlayerId: any)  => {
    if (!isNaN(playerNameOrPlayerId)) return mp.players.at(parseInt(playerNameOrPlayerId));
    else {
        let foundPlayer = null;
        mp.players.forEach((rageMpPlayer) => {
            if (rageMpPlayer.name.toLowerCase().startsWith(playerNameOrPlayerId.toLowerCase())) {
                foundPlayer = rageMpPlayer;
                return;
            }
        });
        return foundPlayer;
    }
};
export const sendAdmins = (color: string, message: string) => {
    mp.players.forEach(x => {
        if (x.admin > 0 && x.getVariable("logged") == true) {
            x.outputChatBox(`!{${color}} ${message}`);
        }
    });
};