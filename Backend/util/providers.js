const fetch = require('node-fetch');
const mongoose = require('mongoose');
const resourceModel = require('../models/resource');
const preferences = require('./available_preferences');

const allDomains = preferences.all_domains;
// currents
const apiCurrents = 'https://api.currentsapi.services/v1/search';
let prevCurrents = '';
// openwhyd
const apiOpenwhyd = 'https://openwhyd.org/hot?format=json&limit=100';
// vimeo
const apiVimeo = 'https://api.vimeo.com/videos?filter=trending';
// youtube
const apiYoutube = '';
let prevYoutube;
// gettyimages 
let prevGettyimages = '';
const apiGettyimages = '';
// flickr 
let prevFlickr = '';
const apiFlickr = '';
// core 
let prevCore = '';
const apiCore = '';
// ieee 
let prevIeee = '';
const apiIeee = '';

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

                    if (news[i].image === 'None') {
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
    fetch(apiOpenwhyd, {
        method: 'get'
    })
        .catch(err => console.log('EROARE_API_OPENWHYD:' + err))
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                console.log('RASPUNS_API_OPENWHYD:' + response.ok);
            }
        })
        .then(json => {
            let resources = [];

            try {
                json = JSON.stringify(json);

                const tracks = JSON.parse(json).tracks;

                let r = Math.floor(Math.random() * tracks.length);
                const split = tracks[r].eId.split('/');
                let url = '';

                switch (split[1]) {
                    case 'sc':
                        url = 'https://www.soundcloud.com/' + split[2] + '/' + split[3];
                        url = url.replace('#https:', '')
                        break; s
                    case 'dz':
                        url = 'https://www.deezer.com/en/track' + split[2];
                        break;
                    case 'yt':
                        url = 'https://www.youtube.com/watch?v=' + split[2];
                        break;
                    case 'bc':
                        url = 'https://www.' + split[2] + '.bandcamp.com/track/' + split[3];
                        break;
                    case 'vi':
                        url = 'https://www.vimeo.com/' + split[2];
                        break;
                    case 'dm':
                        url = 'https://www.dailymotion.com/video/' + split[2];
                        break;
                    case 'fi':
                        for (let i = 2; i < split.length(); i++)
                            url += split[i];
                        break;
                }

                const Resource = new resourceModel({
                    _id: mongoose.Types.ObjectId(),
                    title: tracks[r].name,
                    description: tracks[r].text,
                    domains: 'music',
                    url: url,
                    website: url.split('/')[2],
                    published: new Date(),
                    image: tracks[r].img
                });

                resources.push(Resource);
                save(resources);
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
    fetch(apiVimeo, {
        method: 'get',
        headers: { 'Authorization': 'bearer ' + process.env.AUTH_VIMEO }
    })
        .catch(err => console.log('EROARE_API_VIMEO:' + err))
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                console.log('RASPUNS_API_VIMEO:' + response.ok);
            }
        })
        .then(json => {
            let resources = [];

            try {
                json = JSON.stringify(json);

                const videos = JSON.parse(json).data;

                let r = Math.floor(Math.random() * videos.length);

                const Resource = new resourceModel({
                    _id: mongoose.Types.ObjectId(),
                    title: videos[r].name,
                    description: videos[r].description,
                    domains: 'video',
                    url: videos[r].link,
                    website: 'https://www.vimeo.com/',
                    published: new Date(),
                    image: videos[r].pictures.sizes[3].link
                });

                resources.push(Resource);
                save(resources);
            } catch {
                console.log('EROARE_JSONPARSE');
            }
        });
}

function getYoutube() { // videos

}

function getCore() { // videos

}

function getIeee() { // videos

}

function gatherResources(rate) {
    setInterval(function () {
        getCurrents();
        getOpenwhyd();
        getVimeo();
    }, rate * 1000);
}

module.exports = { gatherResources };