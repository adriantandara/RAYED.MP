export const player_data_select = (player: PlayerMp, rows: any) => {
    player.sqlID = rows.ID;
    player.admin = rows.admin;
}