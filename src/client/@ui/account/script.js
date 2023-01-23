let loginForm = document.querySelector('.login-wrap');
let signupForm = document.querySelector('.signup-wrap');
let title = document.querySelector('title');

let signupToggleBtn = document.querySelector('#toggle-signup');
let loginToggleBtn = document.querySelector('#toggle-login');

signupToggleBtn.onclick = () => {
    loginForm.classList.remove('active');
    signupForm.classList.add('active');
    title.textContent = 'Signup form';
}

loginToggleBtn.onclick = () => {
    signupForm.classList.remove('active');
    loginForm.classList.add('active');
    title.textContent = 'Login form';
}

function login_player_account(state) {

    if (!state) {

        let login_name = document.querySelector("#name-login");
        let login_password = document.querySelector("#password-login");

        mp.trigger("login_data", login_name.value, login_password.value);
    }
    else {

        let register_name = document.querySelector("#name-reg");
        let register_email = document.querySelector("#email-reg");
        let register_password = document.querySelector("#password-reg");
        let register_confirm = document.querySelector("#password-confirm");

        if (register_password.value === register_confirm.value) mp.trigger("register_data", register_name.value, register_email.value, register_password.value);
    }
}