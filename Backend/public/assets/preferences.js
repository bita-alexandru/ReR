function updateSelect(options, id, defaultOption, selectedDomains = null) {
    let selectEl = document.getElementById(id);
    selectEl.innerHTML = "<option value=''>" + defaultOption + "</option>";
    for (let i = 0; i < options.length; i++) {
        if (selectedDomains !== null) {
            if (selectedDomains.indexOf(options[i]) > -1) continue;
        }
        let newOption = document.createElement('option');
        newOption.value = i;
        newOption.setAttribute('pref-data', options[i]);
        newOption.innerHTML = options[i];
        selectEl.append(newOption);
    }
}

function addNewPreference(prefix, data = null) {
    let domainSelect = document.getElementById(prefix + 'select');
    let list = document.getElementById(prefix + 'added');

    if (data === null) {
        var selectedOption = domainSelect.options[domainSelect.selectedIndex];
        if (selectedOption.value === null || selectedOption.value === '' || selectedOption.value === undefined) return;
        domainSelect.removeChild(selectedOption);
    }

    let value = data !== null ? data.value : selectedOption.value;
    let text = data !== null ? data.text : selectedOption.innerText;

    for (let i = 0; i < list.children.length; i++) {
        if (list.children[i].getAttribute('pref-data') == text) {
            alert('Value already exists');
            return;
        }
    }
    if (value === null || value === '') return;

    let newDomain = document.createElement('li');
    newDomain.setAttribute('value', value);
    newDomain.setAttribute('pref-data', text);
    let liDiv = document.createElement('div');
    liDiv.classList.add('row');
    liDiv.style = 'margin-bottom: 0.1rem';
    let valueDiv = document.createElement('div');
    valueDiv.classList.add('col-6');
    valueDiv.innerText = text;
    let removeDiv = document.createElement('div');
    removeDiv.classList.add('col-4');
    let removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.innerText = 'Remove';
    removeButton.onclick = () => { removePreference(prefix, value) };
    removeDiv.append(removeButton);
    liDiv.append(valueDiv);
    liDiv.append(removeDiv);

    newDomain.append(liDiv);
    list.append(newDomain);

    document.getElementById('required').classList.add('valid');
    
    updateHiddenDomains(prefix);
}

function addNewWebsite() {
    let textEl = document.getElementById('excluded-website');
    let text = textEl.value;
    if (!validateElement(textEl.id)) return;
    textEl.value = '';
    textEl.focus();
    let website = {
        value: text,
        text: text
    }
    addNewPreference('websites-', website);
}

function updateHiddenDomains(prefix) {
    let list = document.getElementById(prefix + 'added');
    let hiddenValue = '';
    let hiddenElement = document.getElementById(prefix + 'hidden');
    hiddenElement.value = '';
    for (let i = 0; i < list.children.length; i++) {
        hiddenValue += list.children[i].getAttribute('pref-data') + '_';
    }
    hiddenElement.value = hiddenValue;
}

function removePreference(prefix, value) {
    let domainList = document.getElementById(prefix + 'added');
    let domainSelect = document.getElementById(prefix + 'select');
    let domains = domainList.children;

    for (let i = 0; i < domains.length; i++) {
        if (domains[i].getAttribute('value') == value) {
            if(prefix === 'domains-'){
                let option = document.createElement('option');
                let domainName = domains[i].getAttribute('pref-data');
                option.setAttribute('value', i);
                option.setAttribute('domain', domainName);
                option.innerText = domainName;
                domainSelect.append(option);
            }
            domainList.removeChild(domains[i]);
        }
    }
    updateHiddenDomains(prefix);
}

function getPreferences(logged) {
    if(!logged){
        document.getElementById('fail-setPreferences').classList.remove('valid');
    }

    
        let xmlhttp = new XMLHttpRequest();
        xmlhttp.method = 'GET';

        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState === 4) {
                var response = JSON.parse(xmlhttp.responseText);
                if (xmlhttp.status === 200) {
                    let jsonData = JSON.parse(xmlhttp.response);
                    updateSelect(jsonData.allDomains, 'domains-select', 'Select Domain', jsonData.domains);

                    if(logged){
                        for (let i = 0; i < jsonData.domains.length; i++) {
                            addNewPreference('domains-', { text: jsonData.domains[i], value: jsonData.domains[i] });
                        }
    
                        for (let i = 0; i < jsonData.websites.length; i++) {
                            addNewPreference('websites-', { text: jsonData.websites[i], value: jsonData.websites[i] });
                        }
                    }

                    

                } else if (xmlhttp.status === 400) {
                    alert('Bad Request');
                } else if (xmlhttp.status === 500) {
                    window.location = '/internal_error';
                }
            }
        }
        xmlhttp.open('GET', '/get_preferences');
        xmlhttp.send();
}

function postSetPreferences() {
    let form = document.forms["set-preferences"];
    if (!validateForm('set-preferences')) return false;

    let formData = new FormData(form);
    if (!formData.get('domains')) {
        document.getElementById('required').classList.remove('valid');
        return false;
    }
    else {
        let postQuery = "?domains=" + formData.get('domains') +
            "&websites=" + formData.get('websites');
        let request = new Request('/set_preferences', {
            method: 'POST',
            body: postQuery,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        fetch(request).then(response => {
            if (response.status === 200) {
                window.location = "/";
                return true;
            }
            else if(response.status === 401){
                document.getElementById('fail-setPreferences').classList.remove('valid');
            }
            else if(response.status === 500){
                window.location.href = "/internal_error";
            }
        });
        return false;
    }
}