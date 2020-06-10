function createCard(cardData, index) {
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
    newTitle.href = cardData.url;
    newTitle.target = "_blank";


    if(cardData.description != null && cardData.description.length > 150){
        var a = document.createElement('a');
        a.innerText = 'Show More';
        a.href = 'javascript:;';
        a.onclick = function() { showMore(event, 'id' + index) };
    }

    let newDescription = document.createElement("div");
    newDescription.classList.add('ml-1');
    newDescription.classList.add("col-3");
    newDescription.classList.add("truncate-text");
    newDescription.id = 'id' + index;
    newDescription.innerText = cardData.description;

    cardContentDiv.append(newTitle);
    cardContentDiv.append(newDescription);

    newRow.append(newImageDiv);
    newRow.append(cardContentDiv);
    if(cardData.description != null && cardData.description.length > 150)
    newRow.append(a);

    newCard.append(newRow);
    content.append(newCard);
}

function getFeed(logged) {
    if (logged) {
        let xmlhttp = new XMLHttpRequest();
        xmlhttp.method = 'GET';
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState === 4) {
                if (xmlhttp.status === 200) {
                    let jsonData = JSON.parse(xmlhttp.response);
                    let content = document.getElementById('content');
                    for (let i = 0; i < jsonData.length; i++) {
                        createCard(jsonData[i], i);
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
}