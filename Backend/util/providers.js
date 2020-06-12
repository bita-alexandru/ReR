const fetch = require('node-fetch');
const mongoose = require('mongoose');
const Pusher = require('pusher');
const resourceModel = require('../models/resource');
const preferences = require('./available_preferences');

const allDomains = preferences.all_domains;

// currents
const apiCurrents = 'https://api.currentsapi.services/v1/search';
let prevCurrents = '';
// openwhyd
const apiOpenwhyd = 'https://openwhyd.org/hot?format=json&limit=10';
// lastfm
const apiLastfm = 'https://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&format=json&limit=100&api_key=';
// vimeo
const apiVimeo = 'https://api.vimeo.com/videos?filter=trending';
// youtube
const apiYoutube = 'https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&key=';
let prevYoutube;
// unsplash 
const apiUnsplash = 'https://api.unsplash.com/photos?order_by=latest&per_page=100';
// pexels 
const apiPexels = 'https://api.pexels.com/v1/curated?per_page=80';
// core 
const apiCore = 'https://core.ac.uk:443/api-v2/articles/search/*?page=_PAGE&pageSize=100&metadata=true&fulltext=false&citations=false&similar=false&duplicate=false&urls=true&faithfulMetadata=false&apiKey=';
// ieee 
const apiSpringer = 'http://api.springernature.com/meta/v2/json?q=type:Journal&p=100&api_key=';

function save(resources) {
    resourceModel.insertMany(resources, err => {
        if (err) {
            console.log('ERROR_INSERTMANY:' + err);
        }
    });
}

function getCurrents() { // news
    fetch(apiCurrents, {
        method: 'get', headers: {
            'Authorization': process.env.AUTH_CURRENTS
        },
    })
        .catch(err => console.log('ERROR_API_CURRENTS:' + err))
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                console.log('RESPONSE_API_CURRENTS:');
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
                console.log('ERROR_JSONPARSE_CURRENTS');
            }
        });
}

function getOpenwhyd() { // music
    fetch(apiOpenwhyd, {
        method: 'get'
    })
        .catch(err => console.log('ERROR_API_OPENWHYD:' + err))
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                console.log('RESPONSE_API_OPENWHYD:');
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
                console.log('ERROR_JSONPARSE_OPENWHYD');
            }
        });
}

function getLastfm() { // music
    fetch(apiLastfm + process.env.AUTH_LASTFM, {
        method: 'get'
    })
        .catch(err => console.log('ERROR_API_LASTFM:' + err))
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                console.log('RESPONSE_API_LASTFM:');
            }
        })
        .then(json => {
            let resources = [];

            try {
                json = JSON.stringify(json);

                const tracks = JSON.parse(json).tracks.track;

                let r = Math.floor(Math.random() * tracks.length);

                const Resource = new resourceModel({
                    _id: mongoose.Types.ObjectId(),
                    title: tracks[r].artist.name + ' - ' + tracks[r].name,
                    description: '',
                    domains: 'music',
                    url: tracks[r].url,
                    website: 'www.last.fm',
                    published: new Date(),
                    image: tracks[r].image[2]['#text']
                });

                resources.push(Resource);
                save(resources);
            } catch {
                console.log('ERROR_JSONPARSE_LASTFM');
            }
        });
}

function getUnsplash() { // images
    fetch(apiUnsplash, {
        method: 'get',
        headers: { 'Authorization': 'Client-ID ' + process.env.AUTH_UNSPLASH }
    })
        .catch(err => console.log('ERROR_API_UNSPLASH:' + err))
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                console.log('RESPONSE_API_UNSPLASH:');
            }
        })
        .then(json => {
            let resources = [];

            try {
                json = JSON.stringify(json);

                const images = JSON.parse(json);

                let r = Math.floor(Math.random() * images.length);

                const Resource = new resourceModel({
                    _id: mongoose.Types.ObjectId(),
                    title: images[r].alt_description.replace(/(\b[a-z](?!\s))/g, function (x) { return x.toUpperCase(); }),
                    description: images[r].description,
                    domains: 'photography',
                    url: images[r].links.html,
                    website: 'www.unsplash.com',
                    published: new Date(),
                    image: images[r].urls.thumb
                });

                resources.push(Resource);
                save(resources);

            } catch {
                console.log('ERROR_JSONPARSE_UNSPLASH');
            }
        });
}

function getPexels() { // images
    fetch(apiPexels, {
        method: 'get',
        headers: { 'Authorization': process.env.AUTH_PEXELS }
    })
        .catch(err => console.log('ERROR_API_PIXELS' + err))
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                console.log('RESPONSE_API_PEXELS')
            }
        })
        .then(json => {
            let resources = [];

            try {
                json = JSON.stringify(json);

                const images = JSON.parse(json).photos;
                const r = Math.floor(Math.random() * images.length);

                let title = images[r].url.split('/')[4];
                title = title.replace(/[0-9]/g, '');
                title = title.replace(/-/g, ' ');
                title = title.replace(/(\b[a-z](?!\s))/g, function (x) { return x.toUpperCase(); });

                const Resource = new resourceModel({
                    _id: mongoose.Types.ObjectId(),
                    title: 'title',
                    description: 'Photographer: ' + images[r].photographer,
                    domains: 'photography',
                    url: images[r].url,
                    website: 'www.pexels.com',
                    published: new Date(),
                    image: images[r].src.medium
                })

                resources.push(Resource);
                save(resources);
            } catch{
                console.log('ERROR_JSONPARSE_PEXELS');
            }
        });
}

function getVimeo() { // videos
    fetch(apiVimeo, {
        method: 'get',
        headers: { 'Authorization': 'bearer ' + process.env.AUTH_VIMEO }
    })
        .catch(err => console.log('ERROR_API_VIMEO:' + err))
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                console.log('RESPONSE_API_VIMEO:');
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
                    image: videos[r].pictures.sizes[2].link
                });

                resources.push(Resource);
                save(resources);

            } catch {
                console.log('ERROR_JSONPARSE_VIMEO');
            }
        });
}

function getYoutube() { // videos
    fetch(apiYoutube + process.env.AUTH_YOUTUBE, {
        method: 'get',
    })
        .catch(err => console.log('ERROR_API_YOUTUBE:' + err))
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                console.log('RESPONSE_API_YOUTUBE:');
            }
        })
        .then(json => {
            let resources = [];

            try {
                json = JSON.stringify(json);

                const videos = JSON.parse(json).items;

                let r = Math.floor(Math.random() * videos.length);

                const Resource = new resourceModel({
                    _id: mongoose.Types.ObjectId(),
                    title: videos[r].snippet.title,
                    description: videos[r].snippet.description,
                    domains: 'video',
                    url: 'https://www.youtube.com/watch?v=' + videos[r].id,
                    website: 'https://www.youtube.com/',
                    published: new Date(),
                    image: videos[r].snippet.thumbnails.standard.url
                });

                resources.push(Resource);
                save(resources);

            } catch {
                console.log('ERROR_JSONPARSE_YOUTUBE');
            }
        });
}

function getCore() { // documents
    let page = Math.floor(Math.random() * 100) + 1;

    fetch(apiCore.replace('_PAGE', page) + process.env.AUTH_CORE, {
        method: 'get',
    })
        .catch(err => console.log('ERROR_API_CORE:' + err))
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                console.log('RESPONSE_API_CORE:');
            }
        })
        .then(json => {
            let resources = [];

            try {
                json = JSON.stringify(json);

                const docs = JSON.parse(json).data;

                const r = Math.floor(Math.random() * docs.length);

                const Resource = new resourceModel({
                    _id: mongoose.Types.ObjectId(),
                    title: docs[r].title,
                    description: typeof (docs[r].description) ? docs[r].description : '',
                    domains: 'research',
                    url: docs[r].downloadUrl,
                    website: 'www.core.ac.uk',
                    published: new Date(),
                    image: 'https://img.icons8.com/cotton/256/000000/file.png'
                });

                resources.push(Resource);
                save(resources);

            } catch {
                console.log('ERROR_JSONPARSE_CORE');
            }
        });
}

function getSpringer() { // documents
    fetch(apiSpringer + process.env.AUTH_SPRINGER, {
        method: 'get',
    })
        .catch(err => console.log('ERROR_API_SPRINGER:' + err))
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                console.log('RESPONSE_API_SPRINGER:');
            }
        })
        .then(json => {
            let resources = [];

            try {
                json = JSON.stringify(json);

                const docs = JSON.parse(json).records;

                const r = Math.floor(Math.random() * docs.length);

                const Resource = new resourceModel({
                    _id: mongoose.Types.ObjectId(),
                    title: docs[r].title,
                    description: docs[r].abstract,
                    domains: 'research',
                    url: docs[r].url[0].value,
                    website: 'www.springer.com',
                    published: new Date(),
                    image: 'https://img.icons8.com/cotton/256/000000/file.png'
                });

                resources.push(Resource);
                save(resources);

            } catch {
                console.log('ERROR_JSONPARSE_SPRINGER');
            }
        });
}

function gatherResources(rate) { // make calls to the APIs above each 'rate' seconds
    setInterval(function () {
        getCurrents();
        getOpenwhyd();
        getLastfm();
        getVimeo();
        getYoutube();
        getUnsplash();
        getPexels();
        getCore();
        getSpringer();
    }, rate * 1000);
}

module.exports = { gatherResources };