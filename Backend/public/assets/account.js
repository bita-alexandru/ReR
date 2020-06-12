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

function logout(logged){
    if (logged) {
        let xmlhttp = new XMLHttpRequest();
        xmlhttp.method = 'GET';

        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState === 4) {
                if (xmlhttp.status === 200) {
                    location.reload();
                } else if (xmlhttp.status === 400) {
                    alert('Bad Request');
                } else if (xmlhttp.status === 500) {
                    window.location = '/internal_error';
                }
            }
        }
        xmlhttp.open('GET', '/logout');
        xmlhttp.send();
    }
}
    

function postLogin(){
    let form = document.forms["login-account"];
    if(!validateForm('login-account')) return false;

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
            window.location.href = "/";
            return true;
        }
        else{
            document.getElementById('fail-login').classList.remove('valid');
        }
    });
    return false;
}

function postDelete(){
    let form = document.forms["delete-account"];
    if(!validateForm('delete-account')) return false;

    let formData = new FormData(form);
    let postQuery = "?password=" + formData.get('password');
    let request = new Request('/delete_account', {
        method: 'POST',
        body: postQuery,
        headers: {
            'Content-Type': 'application/json'
        }
    });
    fetch(request).then(response => {
        if(response.status === 200){
            window.location.href = "/";
            return true;
        }
        else if(response.status === 401){
            document.getElementById('fail-delete').classList.remove('valid');
        }
        else if(response.status === 500){
            window.location.href = "/internal_error";
        }
    });
    return false;
}

function postRegister(){
    let form = document.forms["register-account"];
    document.getElementById('fail-register').classList.add('valid');
    if(!validateForm('register-account')) return false;

    let formData = new FormData(form);
    let postQuery = "?username=" + formData.get('username') + "&password=" + formData.get('password') + "&confirmPassword=" + formData.get('confirmPassword');
    let request = new Request('/register', {
        method: 'POST',
        body: postQuery,
        headers: {
            'Content-Type': 'application/json'
        }
    });
    fetch(request).then(response => {
        if(response.status === 200){
            document.getElementById('success-register').classList.remove('valid');
            return true;
        }
        else if(response.status === 409){
            document.getElementById('fail-register').classList.remove('valid');
        }
        else if(response.status === 500){
            window.location.href = "/internal_error";
        }
    });
    return false;
}
