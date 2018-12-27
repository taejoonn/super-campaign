"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Campaign_1 = require("../backend/entity/Campaign");
const Questionaire_1 = require("../backend/entity/Questionaire");
const Locations_1 = require("../backend/entity/Locations");
const TalkPoint_1 = require("../backend/entity/TalkPoint");
/**
 * Location Specific functions
 */
function getStreetNumber(location) {
    return parseInt(location.split(',')[0]);
}
exports.getStreetNumber = getStreetNumber;
;
function getStreet(location) {
    return (location.split(',')[1]).trim();
}
exports.getStreet = getStreet;
;
function getUnit(location) {
    let unit = location.split(',')[2];
    if (unit === undefined) {
        return '';
    }
    return unit.trim();
}
exports.getUnit = getUnit;
;
function getCity(location) {
    return (location.split(',')[3]).trim();
}
exports.getCity = getCity;
;
function getState(location) {
    return (location.split(',')[4]).trim();
}
exports.getState = getState;
;
function getZip(location) {
    let zip = (location.split(',')[5]).trim().replace('\r', '');
    parseInt(zip, 10); // Necessary to ensure leading 0 is not removed    
    return zip;
}
exports.getZip = getZip;
;
function constructAddress(location) {
    var address = location.streetNumber + " " +
        location.street + ", " +
        location.city + ", " +
        location.state + " " +
        location.zipcode;
    return address;
}
exports.constructAddress = constructAddress;
;
/**
 * Returns the talking points from a campaign object
 */
exports.getTalkingPoints = (campaign, talkingPoints) => {
    /**
     * Split up points by line breaks and remove carriage returns
     */
    talkingPoints = talkingPoints.trim().split('\n');
    for (let i in talkingPoints) {
        talkingPoints[i] = talkingPoints[i].trim().replace('r', '');
    }
    /**
     * Create talking points and insert into array
     */
    let points = [];
    for (let i in talkingPoints) {
        points.push(new TalkPoint_1.TalkPoint());
        points[i].campaign = campaign;
        points[i].talk = talkingPoints[i];
    }
    return points;
};
/**
 * Returns the questions from a campaign object
 */
exports.getQuestionnaire = (campaign, questionaire) => {
    questionaire = questionaire.trim().split("\n");
    for (let i in questionaire) {
        questionaire[i] = questionaire[i].replace('\r', '');
    }
    /**
     * Create questions and insert into array
     */
    let questions = [];
    for (let i in questionaire) {
        questions.push(new Questionaire_1.Questionaire());
        questions[i].campaign = campaign;
        questions[i].question = questionaire[i];
    }
    return questions;
};
/**
 * Campaign Specific function
 */
exports.initCampaign = (name, sDate, eDate, avgDuration) => {
    const newCampaign = new Campaign_1.Campaign();
    newCampaign.name = name;
    newCampaign.startDate = sDate;
    newCampaign.endDate = eDate;
    newCampaign.avgDuration = avgDuration;
    return newCampaign;
};
/**
 * Passed a list of users will remove all non user data
 * @param user
 */
function sanitizeUsers(user) {
    /**
     * Splits by \n then removes \r's
     */
    user = user.split("\n");
    for (let i in user) {
        if (user[i] === '\r' || user[i] === ' ' || user[i] === '') {
            user.splice(i, 1);
        }
    }
    for (let i in user) {
        user[i] = user[i].replace('\r', '');
    }
    return user;
}
exports.sanitizeUsers = sanitizeUsers;
function getManagers(managers) {
    return sanitizeUsers(managers);
}
exports.getManagers = getManagers;
;
function getCanvassers(canvassers) {
    return sanitizeUsers(canvassers);
}
exports.getCanvassers = getCanvassers;
/**
 * Given a string parse for date and return it.
 * @param date
 */
exports.getDate = date => {
    date = date.split("-");
    return new Date(date[0], date[1] - 1, date[2]);
};
// function to build campaign data
exports.createCampaignInfo = campaignData => {
    let campaignName = campaignData.campaignName;
    let startDate = campaignData.startDate;
    let endDate = campaignData.endDate;
    let averageExpectedDuration = campaignData.averageExpectedDuration;
    startDate = startDate.split("-");
    startDate = new Date(startDate[0], startDate[1], startDate[2]);
    console.log(exports.getDate(campaignData.startDate));
    console.log(startDate);
    endDate = endDate.split("-");
    endDate = new Date(endDate[0], endDate[1], endDate[2]);
    const newCampaign = exports.initCampaign(campaignName, startDate, endDate, averageExpectedDuration);
    return newCampaign;
};
//function to build campaign with locations
exports.createCampaignLocations = campaignData => {
    let locations = campaignData.locations;
    locations = locations.trim().split('\n');
    let allLocations = [];
    for (let i in locations) {
        let newLocation = new Locations_1.Locations();
        newLocation.streetNumber = getStreetNumber(locations[i]);
        newLocation.street = getStreet(locations[i]);
        newLocation.unit = getUnit(locations[i]);
        newLocation.city = getCity(locations[i]);
        newLocation.state = getState(locations[i]);
        newLocation.zipcode = getZip(locations[i]);
        allLocations[i] = newLocation;
    }
    let campaign = exports.createCampaignInfo(campaignData);
    campaign.locations = allLocations;
    return campaign;
};
exports.getLocations = (locations) => {
    locations = locations.trim().split('\n');
    let places = [];
    for (let i in locations) {
        places.push(createLocation(locations[i]));
    }
    return places;
};
function createLocation(location) {
    let places = new Locations_1.Locations();
    places.streetNumber = getStreetNumber(location);
    places.street = getStreet(location);
    places.unit = getUnit(location);
    places.city = getCity(location);
    places.state = getState(location);
    places.zipcode = getZip(location);
    return places;
}
//# sourceMappingURL=campaignParser.js.map