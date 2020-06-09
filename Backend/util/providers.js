const fetch = require('node-fetch');
const mongoose = require('mongoose');
const resourceModel = require('../models/resource');
const preferences = require('./available_preferences');

const allDomains = preferences.all_domains;
// currents
const apiCurrents = "https://api.currentsapi.services/v1/search";
let prevCurrents = "";
// openwhyd
let prevOpenwhyd = "";
// vimeo
const apiVimeo = "";
let prevVimeo = "";
// youtube
const apiYoutube = "";
let prevYoutube;
// gettyimages 
let prevGettyimages = "";
const apiGettyimages = "";
// flickr 
let prevFlickr = "";
const apiFlickr = "";
// core 
let prevCore = "";
const apiCore = "";
// ieee 
let prevIeee = "";
const apiIeee = "";

function save(resources) {
    resourceModel.insertMany(resources, err => {
        if (err) {
            console.log('EROARE_INSERTMANY:' + err);
        }
    });
}


function getCurrents() { // news
    fetch(apiCurrents, {
        method: 'get', headers: {
            'Authorization': process.env.AUTH_CURRENTS
        },
    })
        .catch(err => console.log('EROARE_API_CURRENTS:' + err))
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                console.log('RASPUNS_API_CURRENTS:' + response.ok);
            }
        })
        .then(json => {
            let resources = [];

            try {
                json = JSON.stringify(json);

                const news = JSON.parse(json).news;

                for (let i = 0; i < news.length; i++) {
                    if (prevCurrents === news[i].id) {
                        break;

                    }

                    if (news[i].image === "None") {
                        continue;
                    }

                    const commonDomains = allDomains.filter(domain => news[i].category.includes(domain))

                    if (commonDomains.length < 1) {
                        continue;
                    }

                    const Resource = new resourceModel({
                        _id: mongoose.Types.ObjectId(),
                        title: news[i].title,
                        description: news[i].description,
                        domains: commonDomains,
                        url: news[i].url,
                        website: news[i].url.split('/')[2],
                        published: news[i].published,
                        image: news[i].image
                    });

                    resources.push(Resource);
                }

                prevCurrents = news[0].id;

                save(resources);
            } catch {
                console.log('EROARE_JSONPARSE');
            }
        });
}

function getOpenwhyd() { // music
    fetch(apiOpenWhyd, {
        method: 'get'
    })
        .catch(err => console.log('EROARE_API_CURRENTS:' + err))
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                console.log('RASPUNS_API_CURRENTS:' + response.ok);
            }
        })
        .then(json => {
            let resources = [];

            try {
                json = JSON.stringify(json);

                const tracks = JSON.parse(json).tracks;

                for (let i = 0; i < tracks.length; i++) {
                    if (prevOpenwhyd === tracks[i].id) {
                        break;

                    }

                    const split = tracks[i].eId.split('/');

                    let url = "";
                    switch (split[1]) {
                        case "sc":
                            url = "https://www.soundcloud.com/" + split[2] + '/' + split[3];
                            break;
                        case "dz":
                            url = "https://www.deezer.com/en/track" + split[2];
                            break;
                        case "yt":
                            url = "https://youtube.com/watch?v=" + split[2];
                            break;
                        case "bc":
                            url = "https://" + split[2] + ".bandcamp.com/track/" + split[3];
                            break;
                        case "vi":
                            url = "https://vimeo.com/" + split[2];
                            break;
                        case "dm":
                            url = "https://www.dailymotion.com/video/" + split[2];
                            break;
                        case "fi":
                            for (let i = 2; i < split.length(); i++)
                                url += split[i];
                            break;

                    }

                    const Resource = new resourceModel({
                        _id: mongoose.Types.ObjectId(),
                        title: tracks[i].name,
                        description: tracks[i].text,
                        domains: "music",
                        url: tracks[i].url,
                        website: url,
                        published: new Date(),
                        image: tracks[i].img
                    });

                    resources.push(Resource);
                }

                let r = Math.floor(Math.random() * 100)  ; 
                while( r === prevOpenwhyd){
                    r = Math.floor(Math.random() * 100);
                }
                prevOpenwhyd = r;
                let toSave = [resources[r]];

               save(toSave);
            } catch {
                console.log('EROARE_JSONPARSE');
            }
        });
}

function getGettyimages() { // images

}

function getFlickr() { // images

}

function getVimeo() { // videos

}

function getYoutube() { // videos

}

function getCore() { // videos

}

function getIeee() { // videos

}

function gatherResources(rate) {
    setInterval(function () {
        
    }, rate * 1000);
}

module.exports = { gatherResources };