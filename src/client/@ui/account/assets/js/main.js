let registerSwitch = document.querySelector("#register-switch");
let loginSwitch = document.querySelector("#login-register");

registerSwitch.addEventListener("click", () => {

    document.getElementById("headerLogin").classList.add("hidden");
    document.getElementById("containerLogin").classList.add("hidden");
    document.getElementById("headerReg").classList.remove("hidden");
    document.getElementById("containerReg").classList.remove("hidden");
    document.getElementById("registerSelected").setAttribute("style", "color: rgb(184, 42, 42);");
})

loginSwitch.addEventListener("click", () => {

    document.getElementById("headerLogin").classList.remove("hidden");
    document.getElementById("containerLogin").classList.remove("hidden");
    document.getElementById("headerReg").classList.add("hidden");
    document.getElementById("containerReg").classList.add("hidden");
    document.getElementById("loginSelected").setAttribute("style", "color: rgb(184, 42, 42);");
    
});

function login_player_account(state) {

    if (!state) {

        let login_name = document.querySelector("#name-login");
        let login_password = document.querySelector("#password-login");

        mp.trigger("login_data", login_name.value, login_password.value);
    }
    else {

        let register_name = document.querySelector("#name-reg");
        let register_email = document.querySelector("#email-reg");
        let register_gender = document.querySelector("#gender-reg");
        let register_password = document.querySelector("#password-reg");
        let register_confirm = document.querySelector("#password-confirm");

        if(register_gender.value.toUpperCase() != "MALE" && register_gender.value.toUpperCase() != "FEMALE") return mp.trigger("login_handler", ['gender-auth']);
        if (register_password.value === register_confirm.value) mp.trigger("register_data", register_name.value, register_email.value, register_gender.value, register_password.value);
    }
}