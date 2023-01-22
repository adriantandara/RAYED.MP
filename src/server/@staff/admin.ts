import { getNameByID, sendAdmins, sendError, sendUsage } from "@/@player/functions";
import { COLORS, SHARE } from "@shared/constants";
import { Database } from '../@database/database';
let db = new Database();

mp.events.addCommand("setadmin", (player: PlayerMp, _, id, adminLevel: any, reason: string = "no reason") => {
    
    if (player.admin < 6) return sendError(player, SHARE.accesError);
    if (!id || !adminLevel) return sendUsage(player, "/setadmin <playerid/name> <admin level> <reason (optional)>");

    const user: any = getNameByID(id);
    if (user == undefined) return sendError(player, SHARE.connectedError);
    if (adminLevel < 0 || adminLevel > 8) return sendError(player, "Invalid admin level 0 - 8.");
    if (adminLevel == 0) {}
    user.admin = adminLevel; 
    sendAdmins(COLORS.COLOR_SERVER, `Staff: !{f9f9f9}Admin ${player.name} l-a promovat pe ${user.name} la admin level ${adminLevel}, motiv: ${reason}`);
    db.query("update users set admin = ? where username = ?", [user.admin, user.name]);
});