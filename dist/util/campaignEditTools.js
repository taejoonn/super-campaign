"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const Campaign_1 = require("../backend/entity/Campaign");
const Locations_1 = require("../backend/entity/Locations");
const CampaignManager_1 = require("../backend/entity/CampaignManager");
const User_1 = require("../backend/entity/User");
const Canvasser_1 = require("../backend/entity/Canvasser");
const campaignParser = require("./campaignParser");
const campaignRepo = require("../repositories/campaignRepo");
const logger = require('../util/logger');
const campaignLogger = logger.getLogger('campaignLogger');
const googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyAkzTbqwM75PSyw0vwMqiVb9eP6NjnClFk',
    Promise: Promise
});
exports.initCampaign = updatedCampaign => {
    let properties;
    let startDate;
    let endDate;
    let avgDuration;
    let talkingPoints;
    let questions;
    let managers;
    let canvassers;
    let locations;
    startDate = campaignParser.getDate(updatedCampaign.startDate);
    endDate = campaignParser.getDate(updatedCampaign.endDate);
    avgDuration = Number(updatedCampaign.averageExpectedDuration);
    // Create Campaign Object
    const campaign = new Campaign_1.Campaign();
    // Parse the talking points
    talkingPoints = campaignParser.getTalkingPoints(campaign, updatedCampaign.talkingPoints);
    // Parse the questionnaire
    questions = campaignParser.getQuestionnaire(campaign, updatedCampaign.questionaire);
    // Parse the Campaign Managers
    managers = campaignParser.getManagers(updatedCampaign.managers);
    // Parse the Canvassers
    canvassers = campaignParser.getCanvassers(updatedCampaign.canvassers);
    // Parse the locations
    locations = campaignParser.getLocations(updatedCampaign.locations);
    // Decorate Campaign object
    campaign.name = updatedCampaign.campaignName;
    campaign.startDate = startDate;
    campaign.endDate = endDate;
    campaign.avgDuration = avgDuration;
    campaign.talkingPoint = talkingPoints;
    campaign.question = questions;
    campaign.managers = managers;
    return [updatedCampaign.campaignName, startDate, endDate, avgDuration,
        talkingPoints, questions, managers];
};
exports.compareNames = (originalname, updatedName) => {
    console.log(originalname);
    console.log(updatedName);
    return (originalname === updatedName);
};
exports.compareDates = (originalDate, updatedDate) => {
    let date = campaignParser.getDate(updatedDate);
    originalDate = date.getFullYear() + "-"
        + (date.getMonth() + 1) + "-"
        + date.getDate();
    return (originalDate === updatedDate);
};
exports.compareAvgDurations = (originalAvgDuration, updatedAvgDuration) => {
    return (originalAvgDuration == updatedAvgDuration);
};
exports.updatedDate = (updatedDate) => {
    return campaignParser.getDate(updatedDate);
};
exports.updateTalkingPoints = (campaign, talkingPoints) => __awaiter(this, void 0, void 0, function* () {
    talkingPoints = campaignParser.getTalkingPoints(campaign, talkingPoints);
    /**
     * Delete original talking points
     */
    yield campaignRepo.deleteTalkPoint(campaign._ID);
    /**
     * Save each indivdual talking point to the DB.
     */
    talkingPoints.forEach((point) => __awaiter(this, void 0, void 0, function* () {
        yield typeorm_1.getManager().save(point).catch(e => console.log(e));
    }));
    campaignLogger.info(`Updated Talking Points for ${campaign.name}`);
});
exports.updateQuestionnaire = (campaign, questionaire) => __awaiter(this, void 0, void 0, function* () {
    questionaire = campaignParser.getQuestionnaire(campaign, questionaire);
    /**
     * Delete original questions
     */
    yield campaignRepo.deleteQuestionaire(campaign._ID);
    /**
     * Update the questions in the DB.
     */
    questionaire.forEach((question) => __awaiter(this, void 0, void 0, function* () {
        yield typeorm_1.getManager().save(question).catch(e => console.log(e));
    }));
    campaignLogger.info(`Updated Questionairre for ${campaign.name}`);
});
exports.updateManagers = (campaign, managers) => __awaiter(this, void 0, void 0, function* () {
    let usr, cm;
    managers = campaignParser.getManagers(managers);
    campaign.managers = [];
    for (let i in managers) {
        if (managers[i] != "") {
            usr = yield typeorm_1.getManager()
                .findOne(User_1.User, { where: { "_username": managers[i] } });
            // If user exist
            if (usr !== undefined) {
                cm = yield typeorm_1.getManager()
                    .findOne(CampaignManager_1.CampaignManager, { where: { "_ID": usr } });
                // If user is a campaign manager
                if (cm !== undefined) {
                    campaign.managers.push(cm);
                }
                else {
                    campaignLogger.warn(`${usr._username} is not a campaign manager, not added`);
                }
            }
            else {
                campaignLogger.warn(`${managers[i]} does not exist`);
            }
        }
    }
    campaignLogger.info(`Updated managers for: ${campaign.name}`);
    yield typeorm_1.getManager().save(campaign).catch(e => console.log(e));
});
exports.updateCanvassers = (campaign, updatedCanvassers) => __awaiter(this, void 0, void 0, function* () {
    // Remove current canvassers from campaign\
    let canvassers = yield campaignRepo.getCanvasserCamp(campaign._ID);
    canvassers.forEach((canvasser) => __awaiter(this, void 0, void 0, function* () {
        yield campaignRepo.removeCanvasserCampaign(canvasser.ID.employeeID, campaign._ID);
    }));
    let usr, canvass;
    canvassers = campaignParser.getCanvassers(updatedCanvassers);
    campaign.canvassers = [];
    for (let i in canvassers) {
        usr = yield typeorm_1.getManager().findOne(User_1.User, { where: { "_username": canvassers[i] } });
        canvass = yield typeorm_1.getManager().findOne(Canvasser_1.Canvasser, { where: { "_ID": usr } });
        if (usr === undefined) {
            campaignLogger.warn(`User with id ${canvassers[i]} does not exist`);
        }
        else if (canvass === undefined) {
            campaignLogger.warn(`${usr._username} is not a canvasser`);
        }
        else {
            campaign.canvassers.push(canvass);
            canvass.campaigns.push(campaign);
        }
    }
    campaignLogger.info(`Updated Canvassers for ${campaign.name}`);
    yield typeorm_1.getManager().save(campaign.canvassers)
        .catch(e => console.log('Error', e));
});
exports.updateLocations = (campaign, updatedLocations) => __awaiter(this, void 0, void 0, function* () {
    let address;
    let coord;
    let places = [];
    let removals = [];
    let insertions = [];
    let originalLocations = campaign.locations;
    // Parse the updated list of locations
    updatedLocations = updatedLocations.trim().split('\n');
    updatedLocations.forEach(location => {
        places.push(createLocation(location));
    });
    // Check which locations need to be inserted
    // If place is not found in originalLocations it must
    // be new therefore add into array of locations to insert
    for (let i in places) {
        if (!locationFound(places[i], originalLocations)) {
            insertions.push(places[i]);
        }
    }
    // Check which locations need to be deleted
    // If original locations are not found in updated list then
    // they must have been removed therefore add to array of locations
    // to delete
    for (let i in originalLocations) {
        if (!locationFound(originalLocations[i], places)) {
            removals.push(originalLocations[i]);
        }
    }
    removals.forEach((location) => __awaiter(this, void 0, void 0, function* () {
        yield campaignRepo.deleteLocation(location._ID);
    }));
    let addresses = [];
    for (let i in insertions) {
        address =
            insertions[i]._streetNumber + " " +
                insertions[i].street + ", " +
                insertions[i].city + ", " +
                insertions[i].state + " " +
                insertions[i].zipcode;
        addresses.push(address);
        yield googleMapsClient.geocode({ address })
            .asPromise()
            .then(res => {
            coord = res.json.results[0].geometry.location;
            insertions[i].lat = Number(coord.lat);
            insertions[i].long = Number(coord.lng);
        })
            .catch(e => console.log('Locations error', e));
    }
    insertions.forEach(location => {
        campaign.locations.push(location);
    });
    campaignLogger.info(`Updated locations for ${campaign.name}`);
    yield typeorm_1.getManager().save(campaign);
});
function locationFound(targetLocation, listOfLocations) {
    for (let i in listOfLocations) {
        if (locationsMatch(targetLocation, listOfLocations[i])) {
            return true;
        }
    }
    return false;
}
;
function locationsMatch(targetLocation, location) {
    // Compare street numbers
    if (targetLocation._streetNumber !== location._streetNumber) {
        return false;
    }
    // compare streets
    if (targetLocation._street !== location._street) {
        return false;
    }
    // compare unit
    if (targetLocation._unit !== location._unit) {
        return false;
    }
    // compare city
    if (targetLocation._city !== location._city) {
        return false;
    }
    // // compare state
    if (targetLocation._state !== location._state) {
        return false;
    }
    // compare zipcode
    if (targetLocation._zipcode != location._zipcode) {
        return false;
    }
    return true;
}
;
function createLocation(location) {
    let places = new Locations_1.Locations();
    places.streetNumber = campaignParser.getStreetNumber(location);
    places.street = campaignParser.getStreet(location);
    places.unit = campaignParser.getUnit(location);
    places.city = campaignParser.getCity(location);
    places.state = campaignParser.getState(location);
    places.zipcode = campaignParser.getZip(location);
    return places;
}
;
//# sourceMappingURL=campaignEditTools.js.map