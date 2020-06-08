function updateSelect(options, id, defaultOption){
    let selectEl = document.getElementById(id);
    selectEl.innerHTML = "<option value=''>" + defaultOption + "</option>";
    for(let i = 0; i < options.length; i++){
        let newOption = document.createElement('option');
        newOption.value = i;
        newOption.innerHTML = options[i];
        selectEl.append(newOption);
    }
}

`
<div class="row">
    <div class="col-8">
        text
    </div>
    <div class="col-4">
        <button type="button">Remove</button>
    </div>
</div>
`
function addNewPreference(prefix, data = null){
    let domainSelect = document.getElementById(prefix + 'select');
    let list = document.getElementById(prefix + 'added');

    let selectedOption = domainSelect.options[domainSelect.selectedIndex];
    let value = data !== null ? data.value : selectedOption.value;
    let text = data !== null ? data.text : selectedOption.innerText;

    for(let i = 0; i < list.children.length; i++){
        if(list.children[i].getAttribute('value') == value){
            alert('Value already exists');
            return;
        }
    }
    if(value === null || value === '') return;

    let newDomain = document.createElement('li');
    newDomain.value = value;
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
    updateHiddenDomains(prefix);
}

function updateHiddenDomains(prefix){
    let list = document.getElementById(prefix + 'added');
    let hiddenValue = '';
    let hiddenElement = document.getElementById(prefix + 'hidden');
    hiddenElement.value = '';
    for(let i = 0; i < list.children.length; i++){
        hiddenValue += list.children[i].getAttribute('value') + ';';
    }
    hiddenElement.value = hiddenValue;
}

function removePreference(prefix, value){
    let domainList = document.getElementById(prefix + 'added');
    let domains = domainList.children;

    for(let i = 0; i < domains.length; i++){
        if(domains[i].getAttribute('value') == value){
            domainList.removeChild(domains[i]);
        }
    }
    updateHiddenDomains(prefix);
}

function getPreferences(){
    if(loggedIn){
        let xmlhttp = new XMLHttpRequest();
        xmlhttp.method = 'GET';
    
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState === 4) {
              var response = JSON.parse(xmlhttp.responseText);
                if (xmlhttp.status === 200) {
                    let jsonData = JSON.parse(xmlhttp.response);
                    updateSelect(jsonData.default_domains, 'domains-select', 'Select Domain');
                    updateSelect(jsonData.default_websites, 'websites-select', 'Select Website');
                    

                } else if(xmlhttp.status === 400){
                    alert('Bad Request');
                 } else if(xmlhttp.status === 500){
                     window.location = '/internal_error';
                 }
            }
          }
    
          xmlhttp.open('GET', '/get_preferences');
          xmlhttp.send();
    }
}