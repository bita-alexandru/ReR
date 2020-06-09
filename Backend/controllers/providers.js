const fetch = require('node-fetch');
const mongoose = require('mongoose');
const resourceModel = require('../models/resource');
const preferences = require('../util/available_preferences');

const allDomains = preferences.all_domains;
// currents
const apiCurrents = "https://api.currentsapi.services/v1/search";
let prevCurrents = "";

// openwhyd
let prevOpenwhyd = "";

function save(resources) {
    resourceModel.insertMany(resources, err => {
        if (err) {
            console.log('EROARE_INSERTMANY:' + err);
        }
    });
}

function gatherResources(rate) {
    setInterval(function () {
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
    }, rate * 1000);
}

module.exports = { gatherResources };