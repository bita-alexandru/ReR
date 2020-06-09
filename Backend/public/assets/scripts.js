function getCookie(name) {
    let cookieName = name + "=";
    let allCookies = document.cookie.split(';');
    for (let i = 0; i < allCookies.length; i++) {
        let cookie = allCookies[i];
        cookie = ' ' + cookie;
        while (cookie.charAt(0) == ' ') {
            cookie = cookie.substring(1);
            if (cookie.indexOf(cookieName) != -1) {
                return cookie.substring(cookieName.length, cookie.length);
            }
        }
    }
    return null;
}

function checkLoggedInFor(callbackFunc) {
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.method = 'GET';
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4) {
            callbackFunc(xmlhttp.response.indexOf('true') > -1);
        }
    }
    xmlhttp.open('GET', '/is_authenticated', true);
    xmlhttp.send();
}