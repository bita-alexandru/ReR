function initializeAccountPage(){
    if(getCookie('token') === null){
        let registerForm = document.getElementById('register-account');
        registerForm.classList.remove('display-none');
        let loginForm = document.getElementById('login-account');
        loginForm.classList.remove('display-none');
    }
    else{
        let deleteForm = document.getElementById('delete-account');
        deleteForm.classList.remove('display-none');
    }
}

function login(e){
    e.preventDefault();

    let username = document.getElementById('loginUsername').value;
    let password = document.getElementById('loginPassword').value;

    let formData = {
        username: username,
        password: password
    }

    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open('post', 'login', true);
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
}