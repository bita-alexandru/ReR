function toggleDependentCheckbox(caller, target) {
    let cCheckbox = document.getElementById(caller);
    let tCheckbox = document.getElementById(target);
    if (tCheckbox !== null) {
        tCheckbox.disabled = !cCheckbox.checked;
        tCheckbox.checked = false;
    }
}

function createCard(src, title, link) {
    src = src === undefined ? "https://i.pinimg.com/236x/54/a4/00/54a4008daad4565a9b5db1b94e59c74c.jpg" : src;
    title = title === undefined ? "Of" : title;
    link = link === undefined ? "https://www.youtube.com/watch?v=QLlUEMtfbSk" : link;

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
    newTitle.href = link;
    newTitle.target = "_blank";



    let newDescription = document.createElement("div");
    newDescription.classList.add('ml-1');
    newDescription.classList.add("col-3");
    newDescription.innerText = "pfpfPF";

    cardContentDiv.append(newTitle);
    cardContentDiv.append(newDescription);

    newRow.append(newImageDiv);
    newRow.append(cardContentDiv);

    newCard.append(newRow);
    content.append(newCard);
}