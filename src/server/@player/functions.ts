import { Database } from "@/@database/database";
import { COLORS } from "@shared/constants";
import { pedsData } from "./pedsData";
import { vehiclesData } from "./vehiclesData";

let db = new Database();


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
    player.model = mp.joaat(player.skin); player.health = 100;
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
export const createVehicle = (player: PlayerMp, type: any, model: string, position: Vector3, colorOne: number, colorTwo: number, rotationPos = player.heading, put = 0) => { 
  
    const vehicle = mp.vehicles.new(mp.joaat(model), position,
    {     
        //@ts-ignore
        color: [colorOne, colorTwo],
        locked: false,
        engine: false,
        dimension: player.dimension,
        type: type,
        owner: player.name,
        rotation: new mp.Vector3(0, 0, rotationPos)
    });

    if(put == 1) player.putIntoVehicle(vehicle, 0);  
    return vehicle;
};
export const sendToAll = (color: string, message: string) => {
    const date = new Date();
    mp.players.forEach(x => {
        if (x.getVariable('logged') === true) x.outputChatBox(`${(x.data.timeStamp == 1) ? (`[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}] `) : ('')}!{${color}} ${message}`);
    });
};
export const givePlayerMoney = (player: PlayerMp, type: string, amount: number) => {

    switch (type) {
        case 'set': { player.money = amount; break; }
        case 'give': { player.money += amount; break; }
        case 'take': { player.money -= amount; break; }
    }
    db.query("update users set money = ? where username = ?", [player.money, player.name]);
    player.call("loadPlayerCash", [player.money]);
};
export const givePlayerBank = (player: PlayerMp, type: string, amount: number) => {

    switch (type) {
        case 'set': { player.bank = amount; break; }
        case 'give': { player.bank += amount; break; }
        case 'take': { player.bank -= amount; break; }
    }
    db.query("update users set bank = ? where username = ?", [player.bank, player.name]);
    player.call("loadPlayerBank", [player.bank]);
};
export function formatNumber(value: number): string {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
export const is_valid_vehicle = (value: string) => { return (vehiclesData.includes(value) ? 1 : 0); };
export const is_skin_valid = (value: string) => { return (pedsData.includes(value) ? 1 : 0); };