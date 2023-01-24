import { Database } from "@/@database/database";
import { COLORS } from "@shared/constants";
import { givePlayerMoney, sendError, SendMsg } from "./functions"

const db = new Database();

mp.events.addCommand("buylevel", (player: PlayerMp) => {
    
    if (player.respect < (player.level*3)) return sendError(player, `Nu ai ${(player.level*3)} respect points.`);
    if (player.money < (player.level*3)*100000) return sendError(player, `Nu ai suma necesara de bani.`);

    player.respect -= (player.level*3); givePlayerMoney(player, 'take', (player.level*3)*100000); player.level ++;
    SendMsg(player, COLORS.COLOR_SERVER, `Server: !{f9f9f9}Felicitari! Ai avansat la nivel ${player.level}.`);
    db.query("update users set level = ?, respect = ? where username = ?", [player.level, player.respect, player.username]);
});