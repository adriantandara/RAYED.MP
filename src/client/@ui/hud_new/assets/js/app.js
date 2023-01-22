function load_player_cash(money) { return document.getElementById("bank").textContent = `${formatNumber(money, 0)}`; };
function load_player_bank(money) { return document.getElementById("cash").textContent = `${formatNumber(money, 0)}`; };
function load_player_online(online) { return document.getElementById("online").textContent = `${online}`; };
function load_player_id(id) { return document.getElementById("idPlayer").textContent = `(${id})`; };


function load_server_clock() {
    
    let date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();

    if (hours < 10) hours = "0" + hours;
    if (minutes < 10) minutes = "0" + minutes;

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    if (day < 10) day = "0" + day;
    if (month < 10) month = "0" + month;


    document.getElementById("clock").textContent = `${hours}:${minutes}`;
    document.getElementById("date").textContent = `${day}.${month}.${year}`;
}

setInterval(() => { load_server_clock(); }, 1000);


formatNumber = function (n, c, d, t) {
    var c = isNaN(c = Math.abs(c)) ? 2 : c, d = d == undefined ? "." : d, t = t == undefined ? "," : t, s = n < 0 ? "-" : "", i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))), j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
}