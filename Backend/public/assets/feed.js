function createCard(cardData, index) {
    src = cardData.image;
    title = cardData.title;
    domains = cardData.domains;
    date = cardData.published;

    date = cardData.published.substr(0, 10) + ' at ' + cardData.published.substr(11, 5);

    let content = document.getElementById("content");

    let newCard = document.createElement("div");
    newCard.classList.add("card");
    newCard.style = "background: #f2f8fc";

    let newRow = document.createElement("div");
    newRow.classList.add("row");

    let newImageDiv = document.createElement("div");
    newImageDiv.classList.add("col-2");
    let newImage = document.createElement("img");
    newImage.classList.add('w-100');
    newImage.src = src;
    newImage.classList.add('image');
    newImage.alt = title;
    newImageDiv.append(newImage);
    newImageDiv.style = "object-fit: cover; margin-top:0%; margin-bottom: auto;"

    let cardContentDiv = document.createElement("div");
    cardContentDiv.classList.add("col-10");

    let titleRow = document.createElement('div');
    titleRow.classList.add('row');

    let newTitle = document.createElement("a");
    newTitle.classList.add('ml-1');
    newTitle.innerText = title;
    newTitle.style = "text-decoration: none";
    newTitle.style = "font-size: 1.4rem; font-weight: bolder; color: #0B0C10; ";
    newTitle.href = cardData.url;
    newTitle.target = "_blank";
    newTitle.rel = 'noopener';

    titleRow.append(newTitle);

    if (cardData.description != null && (cardData.description.length > 300 || (cardData.description.match(/<br>/g) || []).length >= 3)) {
        var a = document.createElement('a');
        a.innerText = 'Show More';
        a.href = 'javascript:;';
        a.onclick = function () { showMore(event, 'id' + index) };
    }

    let descriptionRow = document.createElement('div');
    descriptionRow.classList.add('row');

    let newDescription = document.createElement("div");
    newDescription.classList.add('ml-1');
    newDescription.classList.add("col-3");
    newDescription.classList.add("truncate-text");
    newDescription.style = "color: #1F2833"
    newDescription.id = 'id' + index;
    newDescription.innerText = cardData.description;
    descriptionRow.append(newDescription);

    let domainRow = document.createElement('div');
    domainRow.classList.add('row');

    let showMoreDiv = document.createElement('div');
    showMoreDiv.classList.add('col-2');
    showMoreDiv.classList.add('center');
    if (cardData.description != null && (cardData.description.length > 300 || (cardData.description.match(/<br>/g) || []).length >= 3)) {
        showMoreDiv.append(a);
    }

    let newDomain = document.createElement("div");
    newDomain.style = 'font-weight: bolder; margin-left: 4%; color: #78244c';
    newDomain.classList.add('center');
    newDomain.innerText = '[' + domains + ']';

    let newDate = document.createElement('div');
    newDate.style = 'margin-left: 1%; font-size: 0.8rem; margin-top: auto; color: #895061';
    newDate.innerText = ' posted on ' + date;

    let newWebsite = document.createElement('div');
    newWebsite.style = 'font-style: oblique; margin-left: 1%; font-size: 0.8rem; margin-top: auto; color: #895061';
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

function getFeed(load = true) {
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.method = 'GET';
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4) {
            if (xmlhttp.status === 200) {
                let jsonData = JSON.parse(xmlhttp.response);
                let content = document.getElementById('content');
                clearTimeout(getFeedTimer);
                getFeedTimer = setTimeout(function () { getContinousFeed(); }, 15000);
                if (lastUpdateCount === 0) {
                    lastUpdateCount = jsonData[0]._id;
                }
                else {
					
					for(let i = 0; i < jsonData.length; i++) {
						
						if(jsonData[i]._id === lastUpdateCount) {
							
							newUpdateCount=i+1;
							break;
						}
					}
                }
                if (load) {
                    for (let i = 0; i < jsonData.length; i++) {
                        createCard(jsonData[i], i);
                    }
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
        getFeed(false);

        if (newUpdateCount > 0) {
            let el = document.getElementById('newPosts');
            el.classList.remove('valid');
            el.innerText = newUpdateCount + ' topiks wait for you!';

            if (document.visibilityState !== 'visible') {
                alert('Hey, you have new TOPIKS to check out!');
            }
        }
    }
}