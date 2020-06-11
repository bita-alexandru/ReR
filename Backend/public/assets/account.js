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

function postLogin(){
    let form = document.forms["login-account"];
    if(!validateForm('login-account')) return;

    let formData = new FormData(form);
    let postQuery = "?username=" + formData.get('username') + 
    "&password=" + formData.get('password');
    let request = new Request('/login', {
        method: 'POST',
        body: postQuery,
        headers: {
            'Content-Type': 'application/json'
        }
    });
    fetch(request).then(response => {
        if(response.status === 200){
            window.location = "/";
        }
        else{
            document.getElementById('fail-login').classList.remove('valid');
        }
    });
    return false;
}
