import './setup';
import './@player/auth';
import './events';
import './@staff/admin';
import { appendFile } from 'fs';


const saveFile = "savedpos.txt";

mp.events.addCommand("spawnveh", (player: PlayerMp) => {

    mp.vehicles.new("oppressor2", player.position,
    {
        heading: player.heading,
        numberPlate: "Pula",
        color: [[255, 0, 0],[255,0,0]]
    });
});

mp.events.addCommand("save", (player: PlayerMp, name: string = "No name") => {
    //if (player.getVariable("admin") < 6) return sendError(player, accesError);
    let pos = (player.vehicle) ? player.vehicle.position : player.position;
    let rot = (player.vehicle) ? player.vehicle.rotation : player.heading;

    if (pos instanceof mp.Vector3) {
        if(rot instanceof mp.Vector3){
            appendFile(saveFile, `Position: ${pos.x}, ${pos.y}, ${pos.z} | Rotation: ${rot.x}, ${rot.y}, ${rot.z} | ${(player.vehicle) ? "InCar" : "OnFoot"} - ${name}\r\n`, (err: any) => {
                if (err) player.notify(`~r~SavePos Error: ~w~${err.message}`);
                else player.notify(`~g~Position saved. ~w~(${name})`);
            });
        }else{
            appendFile(saveFile, `Position: ${pos.x}, ${pos.y}, ${pos.z} | Heading: ${rot} | ${(player.vehicle) ? "InCar" : "OnFoot"} - ${name}\r\n`, (err: any) => {
                if (err) player.notify(`~r~SavePos Error: ~w~${err.message}`);
                else player.notify(`~g~Position saved. ~w~(${name})`);
            });
        }
    } else {
        player.notify(`~r~SavePos Error: ~w~Invalid position.`);
    }
});