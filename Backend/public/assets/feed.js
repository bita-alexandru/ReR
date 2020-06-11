function createCard(cardData, index) {
    src = cardData.image;
    title = cardData.title;
    domains = cardData.domains;
    date = cardData.published;

    date = cardData.published.substr(0, 10) + ' at ' + cardData.published.substr(11, 5);

    let content = document.getElementById("content");

    let newCard = document.createElement("div");
    newCard.classList.add("card");

    let newRow = document.createElement("div");
    newRow.classList.add("row");

    let newImageDiv = document.createElement("div");
    newImageDiv.classList.add("col-2");
    let newImage = document.createElement("img");
    newImage.classList.add('w-100');
    newImage.src = src;
    newImageDiv.append(newImage);

    let cardContentDiv = document.createElement("div");
    cardContentDiv.classList.add("col-10");

    let titleRow = document.createElement('div');
    titleRow.classList.add('row');

    let newTitle = document.createElement("a");
    newTitle.classList.add('ml-1');
    newTitle.innerText = title;
    newTitle.style = "text-decoration: none";
    newTitle.style = "font-size: 1.5rem";
    newTitle.href = cardData.url;
    newTitle.target = "_blank";

    titleRow.append(newTitle);


    if (cardData.description != null && (cardData.description.length > 300 || (cardData.description.match(/<br>/g) || []).length >= 3)) {
        var a = document.createElement('a');
        a.innerText = 'Show More';
        a.href = 'javascript:;';
        a.style = 'margin-left: 25%';
        a.onclick = function () { showMore(event, 'id' + index) };
    }

    let descriptionRow = document.createElement('div');
    descriptionRow.classList.add('row');

    let newDescription = document.createElement("div");
    newDescription.classList.add('ml-1');
    newDescription.classList.add("col-3");
    newDescription.classList.add("truncate-text");
    newDescription.id = 'id' + index;
    newDescription.innerText = cardData.description;
    descriptionRow.append(newDescription);



    let domainRow = document.createElement('div');
    domainRow.classList.add('row');

    let showMoreDiv = document.createElement('div');
    showMoreDiv.classList.add('col-2');
    if (cardData.description != null && (cardData.description.length > 300 || (cardData.description.match(/<br>/g) || []).length >= 3)) {
        showMoreDiv.append(a);
    }
    let newDomain = document.createElement("div"); 
    newDomain.style= 'font-weight: bolder; margin-left: 2%';
    newDomain.classList.add('center');
    newDomain.innerText = '[' + domains + ']';

    let newDate = document.createElement('div');
    newDate.style = 'margin-left: 1%';
    newDate.innerText = ' posted on ' + date;

    let newWebsite = document.createElement('div');
    newWebsite.classList.add('col-3');
    newWebsite.style = 'font-style: oblique; margin-left: 1%';
    newWebsite.innerText = 'via ' + cardData.website; 

    domainRow.append(showMoreDiv);
    domainRow.append(newDomain);
    domainRow.append(newDate);
    domainRow.append(newWebsite);
    cardContentDiv.append(titleRow);
    cardContentDiv.append(descriptionRow);

    
    newRow.append(newImageDiv);
    newRow.append(cardContentDiv);


    newCard.append(newRow);
    newCard.append(domainRow);
    content.append(newCard);
}

let lastUpdateCount = 0;
let newUpdateCount = 0;

function getFeed() {
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.method = 'GET';
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4) {
            if (xmlhttp.status === 200) {
                let jsonData = JSON.parse(xmlhttp.response);
                let content = document.getElementById('content');
                getFeedTimer = setTimeout(function () { getContinousFeed() }, 15000);
                if (lastUpdateCount === 0) {
                    lastUpdateCount = jsonData.length;
                }
                else {
                    newUpdateCount = Math.max(0, jsonData.length - lastUpdateCount);
                }
                for (let i = 0; i < jsonData.length; i++) {
                    createCard(jsonData[i], i);
                    clearTimeout(getFeedTimer);
                }
            } else if (xmlhttp.status === 400) {
                alert('Bad Request');
            } else if (xmlhttp.status === 500) {
                window.location = '/internal_error';
            }
        }
    }
    xmlhttp.open('GET', '/get_feed');
    xmlhttp.send();
}

var getFeedTimer = null;

function getContinousFeed() {
    if (true) {
        getFeed(true);
        if (newUpdateCount > 0) {
            alert('You have new ' + newUpdateCount + ' news');
        }
    }
}