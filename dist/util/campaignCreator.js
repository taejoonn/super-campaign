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
const Campaign_1 = require("../backend/entity/Campaign");
const typeorm_1 = require("typeorm");
const Locations_1 = require("../backend/entity/Locations");
const Canvasser_1 = require("../backend/entity/Canvasser");
const campaignParser = require("./campaignParser");
const campaignRepo = require("../repositories/campaignRepo");
const logger = require('../util/logger');
const campaignLogger = logger.getLogger('campaignLogger');
const googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyDeR11lAE5_xyjlYoxq3mAo0dSzVs2xyaM',
    Promise: Promise
});
exports.emptyCampaign = (campaignID) => {
    return {
        missing: campaignID,
        id: "",
        name: "",
        manager: "",
        assignment: "",
        location: "",
        sDate: "",
        eDate: "",
        duration: "",
        question: "",
        points: "",
        canvasser: ""
    };
};
exports.getDate = date => {
    return campaignParser.getDate(date);
};
exports.initCampaign = (name, sDate, eDate, avgDuration) => {
    const newCampaign = new Campaign_1.Campaign();
    newCampaign.name = name;
    newCampaign.startDate = sDate;
    newCampaign.endDate = eDate;
    newCampaign.avgDuration = avgDuration;
    return newCampaign;
};
exports.saveTalkingPoints = (campaign, talkingPoints) => {
    const Manager = typeorm_1.getManager();
    talkingPoints = campaignParser.getTalkingPoints(campaign, talkingPoints);
    /**
     * Save each indivdual talking point to the DB.
     */
    talkingPoints.forEach((point) => __awaiter(this, void 0, void 0, function* () {
        yield Manager.save(point).catch(e => console.log(e));
    }));
};
exports.saveQuestionnaire = (campaign, questionaire) => {
    const Manager = typeorm_1.getManager();
    questionaire = campaignParser.getQuestionnaire(campaign, questionaire);
    /**
     * Save each indivdual question to the DB.
     */
    questionaire.forEach((question) => __awaiter(this, void 0, void 0, function* () {
        yield Manager.save(question).catch(e => console.log(e));
    }));
};
exports.saveManagers = (campaign, managers) => __awaiter(this, void 0, void 0, function* () {
    let usr;
    let cm;
    managers = campaignParser.getManagers(managers);
    campaign.managers = [];
    for (let i in managers) {
        if (managers[i] != "") {
            usr = yield campaignRepo.getManagerByUsername(managers[i]);
            console.log(usr);
            if (usr !== undefined) {
                cm = yield campaignRepo.getManagerByUser(usr);
                console.log(cm);
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
});
function createLocation(location) {
    let places = new Locations_1.Locations();
    campaignLogger.info(`Saving ${location}`);
    places.streetNumber = campaignParser.getStreetNumber(location);
    places.street = campaignParser.getStreet(location);
    places.unit = campaignParser.getUnit(location);
    places.city = campaignParser.getCity(location);
    places.state = campaignParser.getState(location);
    places.zipcode = campaignParser.getZip(location);
    return places;
}
exports.saveLocations = (campaign, locations) => __awaiter(this, void 0, void 0, function* () {
    const Manager = typeorm_1.getManager();
    locations = locations.trim().split('\n');
    let places = [];
    let address;
    let coord;
    campaign.locations = [];
    for (let i in locations) {
        places.push(createLocation(locations[i]));
        address = campaignParser.constructAddress(places[i]);
        yield googleMapsClient.geocode({ address })
            .asPromise()
            .then(res => {
            coord = res.json.results[0].geometry.location;
            places[i].lat = Number(coord.lat);
            places[i].long = Number(coord.lng);
        })
            .catch(e => console.log('Locations error', e));
        campaign.locations.push(places[i]);
    }
    yield Manager.save(campaign.locations);
});
exports.saveCanavaser = (campaign, canvassers) => __awaiter(this, void 0, void 0, function* () {
    let usr;
    let canvass;
    canvassers = campaignParser.getCanvassers(canvassers);
    campaign.canvassers = [];
    for (let i in canvassers) {
        if (canvassers[i] != "") {
            usr = yield campaignRepo.getCanvasserByUsername(canvassers[i]);
            if (usr !== undefined) {
                canvass = yield typeorm_1.getManager().findOne(Canvasser_1.Canvasser, { where: { "_ID": usr } });
                if (canvass !== undefined) {
                    campaign.canvassers.push(canvass);
                    canvass.campaigns.push(campaign);
                }
                else {
                    campaignLogger.warn(`${usr._username} is not a canvasser`);
                }
            }
            else {
                campaignLogger.warn(`${canvassers[i]} does not exist`);
            }
        }
    }
    yield typeorm_1.getManager().save(campaign.canvassers)
        .catch(e => console.log('Error', e));
});
exports.saveCampaign = (campaign) => __awaiter(this, void 0, void 0, function* () {
    const Manager = typeorm_1.getManager();
    yield Manager.save(campaign).catch(e => console.log(e));
});
//# sourceMappingURL=campaignCreator.js.map