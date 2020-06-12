function initializeAccountPage(logged){
    if(!logged){
        let registerForm = document.getElementById('register-account');
        registerForm.classList.remove('display-none');
        let loginForm = document.getElementById('login-account');
        loginForm.classList.remove('display-none');
    }
    else{
        let deleteForm = document.getElementById('delete-account');
        deleteForm.classList.remove('display-none');
        let logoutForm = document.getElementById('logout-account');
        logoutForm.classList.remove('display-none');
    }
}

function logout(){
    document.cookie = 'token=';
    location.reload();
}
