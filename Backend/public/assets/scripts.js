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

function checkPassword(){
    let firstPass = document.getElementById('register-password').value;
    let secondPass = document.getElementById('confirmed-password').value;

    if(firstPass === secondPass){
        return true;
    }
    return false;
}

function checkNull(id){
    let element = document.getElementById(id);
    if(element.value === '' || element.value === null || element.value === undefined) return false;
    return true;
}

var customValidations = [ checkPassword, checkNull ];


function validateElement(id){
    let element = document.getElementById(id);
    let errorSpan = document.getElementById(id + '-error');
    let validRegex = element.getAttribute('validation-regex'); //momentan facem validarea doar dupa regex
    let validText = element.getAttribute('error-text');
    let customValid = element.getAttribute('validation-custom');
    let isValid = true;

    if(validRegex !== null){
        let regExpression = new RegExp(validRegex);
        isValid = regExpression.test(element.value);
    }
    if(customValid !== null){
        isValid = customValidations.filter(c => c.name === customValid)[0](id);
    }

    if(!isValid){
        if(!element.classList.contains('validation-error')){
            element.classList.add('validation-error');
            element.oninput = function() { validateOnInput(id); }
            errorSpan.classList.remove('valid');
            errorSpan.classList.add('invalid');
            errorSpan.innerText = validText;
        }
        return false;
    }
    else{
        element.classList.remove('validation-error');
        errorSpan.classList.add('valid');
        errorSpan.classList.remove('invalid');
        element.oninput = null;
        return true;
    }
}

function validateOnInput(id){
    validateElement(id);
}

function validateForm(id){
    let form = document.forms[id];
    let formInputs = form.getElementsByTagName('input');
    let isValid = true;
    if(formInputs === null || formInputs === undefined) return true;
    for(let i = 0; i < formInputs.length; i++){
        if(formInputs[i].getAttribute('val-required') !== null){ //alegem doar elementele care au proprietati de validare
            if(!validateElement(formInputs[i].id)){
                isValid = false;
            }
        }
    }
    return isValid;
}

function validateSubmitForm(id){
    if(validateForm(id)){
        document.forms[id].submit();
        return true;
    }
    return false;
}


function showMore(e, id){
    let el = document.getElementById(id);
    let a = e.currentTarget;
    if(el.classList.contains('truncate-text')){
        el.classList.remove('truncate-text');
        el.classList.add('show-more');
        a.innerText = 'Show Less';  
    }
    else{
        el.classList.add('truncate-text');
        el.classList.remove('show-more');
        a.innerText = 'Show More';
    }
}