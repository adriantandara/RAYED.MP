function load_players_online(players) {
    let players_online = document.querySelector("#onlinePlayers");
    players_online.innerHTML = `${players}/5000`;
}

function load_player_cash(money) {

    let player_cash = document.querySelector("#moneyCash");
    player_cash.innerHTML = `$${formatNumber(money, 0)}`;
}

function load_player_bank(money) {
    let player_bank = document.querySelector("#moneyBank");
    player_bank.innerHTML = `$${formatNumber(money, 0)}`;
}

function load_player_name(name) {

    let player_name = document.querySelector("#playerName");
    player_name.innerHTML = `$${name}`;
}

formatNumber = function (n, c, d, t) {
    var c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
        j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
}