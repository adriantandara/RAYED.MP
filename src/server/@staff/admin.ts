import { createVehicle, formatNumber, getNameByID, givePlayerBank, givePlayerMoney, is_valid_vehicle, sendAdmins, sendError, SendMsg, sendToAll, sendUsage, spawn_player } from "@/@player/functions";
import { COLORS, SHARE } from "@shared/constants";
import { appendFile } from "fs";
import { Database } from '../@database/database';
let db = new Database();
const saveFile = "savedpos.txt";

mp.events.addCommand("setadmin", (player: PlayerMp, _, id, adminLevel: any, reason: string = "no reason") => {
    
    if (player.admin < 6) return sendError(player, SHARE.accesError);
    if (!id || !adminLevel) return sendUsage(player, "/setadmin <playerid/name> <admin level> <reason (optional)>");

    const user: any = getNameByID(id);
    if (user == undefined) return sendError(player, SHARE.connectedError);
    if (adminLevel < 0 || adminLevel > 8) return sendError(player, "Invalid admin level 0 - 8.");
    if (adminLevel == 0) {}
    user.admin = adminLevel; 
    sendAdmins(COLORS.COLOR_SERVER, `Staff: !{f9f9f9}Admin ${player.name} l-a promovat pe ${user.name} la admin level ${adminLevel}, motiv: ${reason}`);
    SendMsg(user, COLORS.COLOR_SERVER, `Server: !{f9f9f9}Admin ${player.name} te-a promovat la functia de admin level ${adminLevel}`);
    db.query("update users set admin = ? where username = ?", [user.admin, user.name]);
});

mp.events.addCommand("a", (player: PlayerMp, text: string) => {

    if (!player.admin) return sendError(player, SHARE.accesError);
    if (!text) return sendUsage(player, "/a(admin chat) <text>");

    sendAdmins(COLORS.COLOR_ADMIN, `Admin Level (${player.admin}) | ${player.name}: ${text}`);
});

mp.events.addCommand("save", (player: PlayerMp, name: string = "No name") => {
    if (player.admin < 6) return sendError(player, SHARE.accesError);
    let pos = (player.vehicle) ? player.vehicle.position : player.position;
    let rot = (player.vehicle) ? player.vehicle.rotation : player.heading;

    if (pos instanceof mp.Vector3) 
    {
        if(rot instanceof mp.Vector3)
        {
            appendFile(saveFile, `Position: ${pos.x}, ${pos.y}, ${pos.z} | Rotation: ${rot.x}, ${rot.y}, ${rot.z} | ${(player.vehicle) ? "InCar" : "OnFoot"} - ${name}\r\n`, (err: any) => {
                if (err) player.notify(`~r~SavePos Error: ~w~${err.message}`);
                else player.notify(`~g~Position saved. ~w~(${name})`);
            });
        }
        else
        {
            appendFile(saveFile, `Position: ${pos.x}, ${pos.y}, ${pos.z} | Heading: ${rot} | ${(player.vehicle) ? "InCar" : "OnFoot"} - ${name}\r\n`, (err: any) => 
            {
                if (err) player.notify(`~r~SavePos Error: ~w~${err.message}`);
                else player.notify(`~g~Position saved. ~w~(${name})`);
            });
        }
    } 
    else player.notify(`~r~SavePos Error: ~w~Invalid position.`);
});

mp.events.addCommand("setskin", (player: PlayerMp, _, id, skin: string) => {

    if (player.admin < 1) return sendError(player, SHARE.accesError);
    if (!id || !skin) return sendUsage(player, "/setskin <playerid/name> <skin name>");

    const user = getNameByID(id);
    if (user == undefined) return sendError(player, SHARE.connectedError);

    user.skin = skin; user.model = mp.joaat(user.skin);
    sendAdmins(COLORS.COLOR_SERVER, `Staff: !{f9f9f9}Admin ${player.name} i-a setat skinul ${skin} jucatorului ${user.name}.`);
    SendMsg(user, COLORS.COLOR_SERVER, `Server: !{f9f9f9}Admin ${player.name} ti-a setat skinul ${skin}`);
    db.query("update users set skin = ? where username = ?", [skin, user.name]);
});

mp.events.addCommand("spawncar", (player: PlayerMp, vehicleName: string) => {

    if (!player.admin) return sendError(player, SHARE.accesError);

    if (!vehicleName) return sendUsage(player, "/spawncar <vehicle name>");
    if (!is_valid_vehicle(vehicleName)) return sendError(player, "Invalid vehicle name.");

    let adminVehicle;

    if(vehicleName == "infernus") adminVehicle = createVehicle(player, "ADMIN", "infernussa", player.position, 1, 1, player.heading, 1);
    else adminVehicle = createVehicle(player, "ADMIN", vehicleName, player.position, 1, 1, player.heading, 1);

    adminVehicle.setVariable("isAdminCar", adminVehicle);

    sendAdmins(COLORS.COLOR_SERVER, `Staff: !{f9f9f9}Admin ${player.name} a spawnat un vehicul de tip ${vehicleName} pe server.`);
});

mp.events.addCommand("respawn", (player: PlayerMp, id) => {
    if (!player.admin) return sendError(player, SHARE.accesError);

    if (!id) return sendUsage(player, "/respawn <playerid/name>");
    const user = getNameByID(id);
    if (user == undefined) return sendError(player, SHARE.connectedError);

    spawn_player(user);
    sendAdmins(COLORS.COLOR_SERVER, `Staff: !{f9f9f9}Admin ${player.name} i-a dat respawn lui ${user.name}.`);
    SendMsg(user, COLORS.COLOR_SERVER, `Server: !{f9f9f9}Admin ${player.name} ti-a dat respawn.`);
});

mp.events.addCommand('vre', (player: PlayerMp, veh: any) => {
  
    if (!player.admin) return sendError(player, SHARE.accesError);
    
    if((!veh || isNaN(veh)) && !player.vehicle) return sendUsage(player, `/vre [vehicle_id]`);

    const vehID = mp.vehicles.at(veh); 

    if(!player.vehicle && vehID == undefined) return sendError(player, "This vehicle doesn't exist."); 
 
    sendAdmins(COLORS.COLOR_SERVER, `Staff: !{f9f9f9}Admin ${player.name} a despawnat vehiculul [id: ${((player.vehicle) ? player.vehicle.id : vehID.id)}].`);
 
    ((player.vehicle) ? player.vehicle : vehID).destroy(); 
});

mp.events.addCommand('despawncars', (player: PlayerMp) => {
    if (player.admin < 2) return sendError(player, SHARE.accesError);
    
    const adminCars = mp.vehicles.toArray().filter(f => f.getVariable("isAdminCar"));
    
    adminCars.forEach(vehicle => vehicle.destroy());
    
    sendAdmins(COLORS.COLOR_SERVER, `Staff: !{f9f9f9}Admin ${player.name} a despawnat vehiculele de admin. (${adminCars.length} vehicule)`);
});

mp.events.addCommand('givegun', (player: PlayerMp, _, id, gunName: string, buletts) => {  

    if (!player.admin) return sendError(player, SHARE.accesError);

    if(!id || !gunName || !parseInt(buletts)) return sendUsage(player, `/givegun <playerid/name> <weapon name> <ammo>`);
  
    const user = getNameByID(id);  
    if (user == undefined) return sendError(player, SHARE.connectedError);
 
    user.giveWeapon(mp.joaat(gunName), parseInt(buletts)); 

    sendAdmins(COLORS.COLOR_SERVER, `Staff: !{f9f9f9}Admin ${player.name} i-a dat arma ${gunName} cu ${parseInt(buletts)} gloante lui ${user.name}.`);
    SendMsg(user, COLORS.COLOR_SERVER, `Server: !{f9f9f9}Admin ${player.name} ti-a dat arma ${gunName} cu ${parseInt(buletts)} gloante.`);
});

mp.events.addCommand("gotom", (player: PlayerMp) => {

    if (player.admin < 1) return sendError(player, SHARE.accesError);
    if (player.vehicle) player.vehicle.position = new mp.Vector3(495.3240966796875, 5591.61767578125, 794.861083984375);
    else player.position = new mp.Vector3(501.4615478515625, 5604.625, 797.9095458984375);
    sendAdmins(COLORS.COLOR_SERVER, `Staff: !{f9f9f9}Admin ${player.name} s-a teleportat pe Muntele Chilliad.`);
});

mp.events.addCommand("gotols", (player: PlayerMp) => {

    if (player.admin < 1) return sendError(player, SHARE.accesError);
    if (player.vehicle) player.vehicle.position = new mp.Vector3(-71.14082336425781, -856.8265991210938, 40.57482147216797);
    else player.position = new mp.Vector3(-71.14082336425781, -856.8265991210938, 40.57482147216797);
    sendAdmins(COLORS.COLOR_SERVER, `Staff: !{f9f9f9}Admin ${player.name} s-a teleportat in orasul Los Santos.`);
});

mp.events.addCommand("gotopaleto", (player: PlayerMp) => {

    if (player.admin < 1) return sendError(player, SHARE.accesError);
    if (player.vehicle) player.vehicle.position = new mp.Vector3(-302.221435546875, 6231.70361328125, 31.454235076904297);
    else player.position = new mp.Vector3(-302.221435546875, 6231.70361328125, 31.454235076904297);
    sendAdmins(COLORS.COLOR_SERVER, `Staff: !{f9f9f9}Admin ${player.name} s-a teleportat in orasul Paleto Bay.`);
});

mp.events.addCommand("gotospawn", (player: PlayerMp) => {

    if (player.admin < 1) return sendError(player, SHARE.accesError);
    if (player.vehicle) player.vehicle.position = new mp.Vector3(-340.36572265625, 6153.02197265625, 31.48905372619629);
    else player.position = new mp.Vector3(-340.36572265625, 6153.02197265625, 31.48905372619629);
    sendAdmins(COLORS.COLOR_SERVER, `Staff: !{f9f9f9}Admin ${player.name} s-a teleportat la Spawn Civil.`);
});

mp.events.addCommand("anno", (player: PlayerMp, text: string) => {

    if (!player.admin) return sendError(player, SHARE.accesError);
    if (!text) return sendUsage(player, "/anno <text>");
    
    sendToAll(COLORS.COLOR_ANNO, `(( ${player.name}: ${text} ))`);
});

mp.events.addCommand("fixveh", (player: PlayerMp) => {
    
    if (!player.admin) return sendError(player, SHARE.accesError);
    if (!player.vehicle) return sendError(player, "Nu esti intr-un vehicul.");

    player.vehicle.repair();
    SendMsg(player, COLORS.COLOR_SERVER, `Staff: !{f9f9f9}Vehiculul [ID: ${player.vehicle.id}] a fost reparat.`);
});

mp.events.addCommand("gotocar", (player: PlayerMp, vehicleID: any) => {
    
    if (!player.admin) return sendError(player, SHARE.accesError);
    if (!vehicleID) return sendUsage(player, "/gotocar <vehicle id>");

    const vehID = mp.vehicles.at(vehicleID); 

    if(vehID == undefined) return sendError(player, "This vehicle doesn't exist.");

    player.position = new mp.Vector3((vehID.position.x+1.5), vehID.position.y, vehID.position.z);

});

mp.events.addCommand("getcar", (player: PlayerMp, vehicleID: any) => {

    if (!player.admin) return sendError(player, SHARE.accesError);
    if (!vehicleID) return sendUsage(player, "/getcar <vehicle id>");

    const vehID = mp.vehicles.at(vehicleID); 

    if(vehID == undefined) return sendError(player, "This vehicle doesn't exist.");

    vehID.position = new mp.Vector3((player.position.x+3), player.position.y, player.position.z);
});

mp.events.addCommand("slap", (player: PlayerMp, _, id) => {

    if (!player.admin) return sendError(player, SHARE.accesError);
    if (!id) return sendUsage(player, "/slap <playerid/name>");

    const user = getNameByID(id);
    if (user == undefined) return sendError(player, SHARE.connectedError);
    user.position = new mp.Vector3(user.position.x, user.position.y, (user.position.z+2.5));
    sendAdmins(COLORS.COLOR_SERVER, `Staff: !{f9f9f9}Admin ${player.name} i-a dat slap lui ${user.name}.`);
    SendMsg(user, COLORS.COLOR_SERVER, `Server: !{f9f9f9}Admin ${player.name} ti-a dat slap.`);
});

mp.events.addCommand("slapcar", (player: PlayerMp, vehicleID: any) => {

    if (player.admin < 2) return sendError(player, SHARE.accesError);
    if (!vehicleID) return sendUsage(player, "/slapcar <vehicle id>");

    const vehID = mp.vehicles.at(vehicleID); 

    if(vehID == undefined) return sendError(player, "This vehicle doesn't exist.");

    vehID.position = new mp.Vector3(vehID.position.x, vehID.position.y, (vehID.position.z+3));
});

mp.events.addCommand("set", (player: PlayerMp, _, id, item: string, value: any) => {

    if (player.admin < 6) return sendError(player, SHARE.accesError);

    if (!id || !item || !value) {
        sendUsage(player, "/set <playerid/name> <item> <amount>");
        return SendMsg(player, COLORS.COLOR_SERVER, "Items: !{f9f9f9}money, bank, respect, level");
    }
    const user = getNameByID(id);
    if (user == undefined) return sendError(player, SHARE.connectedError);
    switch(item) {

        case 'money': {
            if (value < 0 || value > 900000000) return sendError(player, "Invalid money $0 - $900.000.000");
            givePlayerMoney(user, 'set', value); sendAdmins(COLORS.COLOR_SERVER, `Staff: !{f9f9f9}Admin ${player.name} i-a setat lui ${user.name} suma de $${formatNumber(value)} cash`);
            SendMsg(user, COLORS.COLOR_SERVER, `Server: !{f9f9f9}Admin ${player.name} ti-a setat suma de $${formatNumber(value)} cash.`);
            break;
        }
        case 'bank': {
            if (value < 0 || value > 900000000) return sendError(player, "Invalid money $0 - $900.000.000");
            givePlayerBank(user, 'set', value); sendAdmins(COLORS.COLOR_SERVER, `Staff: !{f9f9f9}Admin ${player.name} i-a setat lui ${user.name} suma de $${formatNumber(value)} in banca`);
            SendMsg(user, COLORS.COLOR_SERVER, `Server: !{f9f9f9}Admin ${player.name} ti-a setat suma de $${formatNumber(value)} in banca.`);
            break;
        }
        case 'respect': {
            if (value < 0 || value > 1000) return sendError(player, "Invalid respect points: 0 - 1000");
            user.respect = value; sendAdmins(COLORS.COLOR_SERVER, `Staff: !{f9f9f9}Admin ${player.name} i-a setat lui ${user.name} suma de ${value} respect points.`);
            SendMsg(user, COLORS.COLOR_SERVER, `Server: !{f9f9f9}Admin ${player.name} ti-a setat suma de ${value} respect points.`);
            break;
        }
        case 'level': {
            if (value < 1 || value > 1000) return sendError(player, "Invalid level: 1 - 1000");
            user.level = value; sendAdmins(COLORS.COLOR_SERVER, `Staff: !{f9f9f9}Admin ${player.name} i-a setat lui ${user.name} level ${value}.`);
            SendMsg(user, COLORS.COLOR_SERVER, `Server: !{f9f9f9}Admin ${player.name} ti-a setat level ${value}.`);
            break;
        }
        default: {
            sendUsage(player, "/set <playerid/name> <item> <amount>");
            SendMsg(player, COLORS.COLOR_SERVER, "Items: !{f9f9f9}money, bank, respect, level");
            break;
        }
    }
    db.query("update users set respect = ?, level = ? where username = ?", [player.respect, player.level, player.username]);
});

mp.events.addCommand("goto", (player: PlayerMp, _, id) => {
    
    if (!player.admin) return sendError(player, SHARE.accesError);
    if (!id) return sendUsage(player, "/goto <playerid/name>");

    const user = getNameByID(id);
    if (user == undefined) return sendError(player, SHARE.connectedError);
    if (user == player) return sendError(player, "Nu poti folosi aceasta comanda asupra ta.");

    player.position = new mp.Vector3((user.position.x+2), user.position.y, user.position.z); player.dimension = user.dimension;
    sendAdmins(COLORS.COLOR_SERVER, `Staff: !{f9f9f9}Admin ${player.name} s-a teleportat la ${user.name}.`);
    SendMsg(user, COLORS.COLOR_SERVER, `Server: !{f9f9f9}Admin ${player.name} s-a teleportat la tine.`);
});

mp.events.addCommand("gethere", (player: PlayerMp, _, id) => {
    
    if (!player.admin) return sendError(player, SHARE.accesError);
    if (!id) return sendUsage(player, "/gethere <playerid/name>");

    const user = getNameByID(id);
    if (user == undefined) return sendError(player, SHARE.connectedError);
    if (user == player) return sendError(player, "Nu poti folosi aceasta comanda asupra ta.");
    
    user.position = new mp.Vector3((player.position.x+2), player.position.y, player.position.z); user.dimension = player.dimension;
    sendAdmins(COLORS.COLOR_SERVER, `Staff: !{f9f9f9}Admin ${player.name} l-a teleportat pe ${user.name} la el.`);
    SendMsg(user, COLORS.COLOR_SERVER, `Server: !{f9f9f9}Admin ${player.name} te-a teleportat la el.`);
});

mp.events.addCommand("ah", (player: PlayerMp, adminLevel: any) => {

    if (!player.admin) return sendError(player, SHARE.accesError);
    if (!adminLevel) return sendUsage(player, "/ah <admin level (1 - 7).");

    if (parseInt(adminLevel) < 1 || parseInt(adminLevel) > 7) return sendError(player, "Invalid admin level: 1 - 7");

    switch(parseInt(adminLevel)) {

        case 0: break;
        case 1: {
            SendMsg(player, 'f9f9f9', `------------------------ !{${COLORS.COLOR_SERVER}}Admin Level [1] !{f9f9f9}-----------------------`);
            SendMsg(player, COLORS.COLOR_SERVER, ">> !{f9f9f9}/goto /gethere /givegun /slap /getcar /gotocar /fixveh /a /anno /gotom /gotols /gotopaleto /gotospawn /fly");
            break;
        }
        case 2: {
            SendMsg(player, 'f9f9f9', `------------------------ !{${COLORS.COLOR_SERVER}}Admin Level [2] !{f9f9f9}-----------------------`);
            SendMsg(player, COLORS.COLOR_SERVER, ">> !{f9f9f9}/slapcar /despawncars");
            break;
        }
        case 3: { sendError(player, "Soon."); break; }
        case 4: { sendError(player, "Soon."); break; }
        case 5: { sendError(player, "Soon."); break; }
        case 6: {
            SendMsg(player, 'f9f9f9', `------------------------ !{${COLORS.COLOR_SERVER}}Admin Level [6] !{f9f9f9}-----------------------`);
            SendMsg(player, COLORS.COLOR_SERVER, ">> !{f9f9f9}/setadmin /save /set /setweather /settime");
            break;
        }
        case 7: { sendError(player, "Soon."); break; }
    }
});