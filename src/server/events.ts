import { sendLocal } from "@/@player/functions";
import { COLORS } from "@shared/constants";

mp.events.add("playerChat", (player: PlayerMp, text: string) => {
    sendLocal(player, COLORS.COLOR_CHAT, 20.0, `${player.name}[${player.id}]:!{f9f9f9} ${text}`);
});

