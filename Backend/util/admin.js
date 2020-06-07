const mongoose = require('mongoose');
const userModel = require('../models/user');
const resourceModel = require('../models/resource');
const responde = require('./responder');

function getUser(data, response) {

}

function getUsers(data, response) {

}

function getResource(data, response) {

}

function getResources(data, response) {

}

function exportUsers(data, response) {

}

function exportResources(data, response) {

}

function setUser(data, response) {

}

function setResource(data, response) {
    if (data.method === 'POST') {
        try {
            const values = JSON.parse(data.payload);

            resourceModel.create( // create and store a new resource
                {
                    _id: mongoose.Types.ObjectId(),
                    title: values.title,
                    description: values.description,
                    domains: values.domains,
                    source: values.source,
                    date: values.date,
                    image: values.image
                }, 
                (err) => {
                    if(err) { // something went wrong, perhaps an internal error
                        responder.status(response,500);
                    } else { // resource created & stored successfully
                        responder.status(response, 200);
                    }
                }
            );
        } catch {
            responder.status(response, 400);
        }
    } else {
        responder.status(response, 400);
    }
}

function toggleFeed(option) {

}

function togglePreferences(option) {

}

function toggleAccount(option) {

}

function toggleLogin(option) {

}

function toggleRegister(option) {

}

function toggleDeleteAccount(option) {

}

function toggleGetFeed(option) {

}

function toggleGetPreferences(option) {

}

function toggleSetPreferences(option) {

}

function toggleDeleteAccount(option) {

}

module.exports = { setResource };