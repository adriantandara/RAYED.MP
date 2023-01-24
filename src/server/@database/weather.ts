import { sendAdmins, sendError, SendMsg, sendUsage } from "@/@player/functions";
import { COLORS, SHARE } from "@shared/constants";

import axios from 'axios';

let city = "Brasov";
let timeZone = 2;
const timeZones: any = { "Romania": 2, "United Kingdom": 0, "Germany": 1, "France": 1, "Spain": 1, "Italy": 1 };

mp.events.addCommand("setweather", (player: PlayerMp, fullText: string) => {
    if (player.admin < 6) return sendError(player, SHARE.accesError);

    if (!fullText) return sendUsage(player, "/setweather <city name>");

    city = fullText; sendAdmins(COLORS.COLOR_SERVER, `Staff: !{f9f9f9}Admin ${player.name} a sincronizat vremea cu orasul ${city}.`);
});

mp.events.addCommand("settime", (player: PlayerMp, fullText: string) => {
    if (player.admin < 6) return sendError(player, SHARE.accesError);

    if (!fullText) {
        sendUsage(player, "/settime <time zone>");
        return SendMsg(player, COLORS.COLOR_SERVER, "Zones: !{f9f9f9}Romania (2) | United Kingdom (0) | Germany (1) | France (1) | Spain (1) | Italy (1)");
    }
    if (timeZones[fullText]) {
        timeZone = timeZones[fullText];
        sendAdmins(COLORS.COLOR_SERVER, `Staff: !{f9f9f9}Adminul ${player.name} a sincronizat timpul cu tara ${timeZones[fullText]}.`);

    } else return sendError(player, `Tara ${fullText} nu este suportata, te rugam sa introduci o tara valida.`);
});

setInterval(() => {
    try {
        axios.get(`https://api.weatherapi.com/v1/current.json?key=b149c2ec8188411b8f221948232401&q=${city}`)
            .then((response) => {
                if (response.data.current) {
                    const weather = response.data.current.condition.text.toLowerCase();
                    mp.world.weather = weather;
                    console.log(`[WEATHER]: Vremea in orasul ${city} este acum ${weather}.`);
                } else {
                    console.log("Eroare: Nu s-a putut accesa vremea din API");
                }
            })
            .catch((error) => {
                console.log(error);
            });
        const date = new Date();
        let hour = date.getUTCHours() + timeZone;
        if (hour >= 24) hour = hour - 24;
        mp.world.time.set(hour, date.getUTCMinutes(), date.getUTCSeconds());
    } catch (err) {
        console.log(err);
    }
}, 60000);

