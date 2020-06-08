function toggleDependentCheckbox(caller, target) {
    let cCheckbox = document.getElementById(caller);
    let tCheckbox = document.getElementById(target);
    if (tCheckbox !== null) {
        tCheckbox.disabled = !cCheckbox.checked;
        tCheckbox.checked = false;
    }
}

function createCard(cardData) {
    src = cardData.image;
    title = cardData.title;
    link = '';

    let content = document.getElementById("content");

    let newCard = document.createElement("div");
    newCard.classList.add("card");

    let newRow = document.createElement("div");
    newRow.classList.add("row");

    let newImageDiv = document.createElement("div");
    newImageDiv.classList.add("col-2");
    let newImage = document.createElement("img");
    newImage.classList.add('w-100');
    newImage.classList.add('blur');
    newImage.src = src;
    newImageDiv.append(newImage);

    let cardContentDiv = document.createElement("div");
    cardContentDiv.classList.add("col-10");

    let newTitle = document.createElement("a");
    newTitle.classList.add('ml-1');
    newTitle.classList.add("col-1");
    newTitle.innerText = title;
    newTitle.href = cardData.source;
    newTitle.target = "_blank";

    let newDescription = document.createElement("div");
    newDescription.classList.add('ml-1');
    newDescription.classList.add("col-3");
    newDescription.innerText = cardData.description;   

    cardContentDiv.append(newTitle);
    cardContentDiv.append(newDescription);

    newRow.append(newImageDiv);
    newRow.append(cardContentDiv);

    newCard.append(newRow);
    content.append(newCard);
}

function getCookie(name) {
    let cookieName = name + "=";
    let allCookies = document.cookie.split(';');
    for(let i = 0; i < allCookies.length; i++) {
        let cookie = allCookies[i];
        cookie = ' ' + cookie;
        while (cookie.charAt(0) == ' ') {
            cookie = cookie.substring(1);
            if (cookie.indexOf(cookieName) != -1) {
                return cookie.substring(cookieName.length,cookie.length);
            }
        }
    }
    return null;
} 

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

function loggedIn(){
    if(getCookie('token') === null){
        return true;
    }
    return true;
}

function getFeed(){
    if(loggedIn()){
        let xmlhttp = new XMLHttpRequest();
        xmlhttp.method = 'GET';
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState === 4) {
                if (xmlhttp.status === 200) {
                    let jsonData = JSON.parse(xmlhttp.response);
                    let content = document.getElementById('content');
                    for(let i = 0; i < jsonData.length; i++){
                        createCard(jsonData[i]);
                    }
                } else if(xmlhttp.status === 400){
                   alert('Bad Request');
                } else if(xmlhttp.status === 500){
                    window.location = '/internal_error';
                }
            }
          }
          xmlhttp.open('GET', '/get_feed');
          xmlhttp.send();
    }
}