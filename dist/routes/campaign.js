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
const express_1 = require("express");
const typeorm_1 = require("typeorm");
const Campaign_1 = require("../backend/entity/Campaign");
const editTools = require("../util/campaignEditTools");
const campaignCreator = require("../util/campaignCreator");
const Questionaire_1 = require("../backend/entity/Questionaire");
const TalkPoint_1 = require("../backend/entity/TalkPoint");
const Canvasser_1 = require("../backend/entity/Canvasser");
const server_1 = require("../server");
const middleware = require('../middleware');
const router = express_1.Router();
exports.campaignRouter = router;
const logger = require('../util/logger');
const campaignLogger = logger.getLogger('campaignLogger');
/**
 * GET and POST for create Campaign
 */
router.get('/new', middleware.isManager, (req, res) => __awaiter(this, void 0, void 0, function* () {
    //retrieve canvassers that can be chosen for the new campaign
    const canvasserRepository = typeorm_1.getRepository(Canvasser_1.Canvasser);
    const canvasser = yield canvasserRepository.find().catch(e => console.log(e));
    res.render('create-campaign', { canvassers: canvasser });
}));
//Removed authentication for now
router.get('/home', middleware.isManager, (req, res) => __awaiter(this, void 0, void 0, function* () {
    let campaigns = yield typeorm_1.getManager()
        .createQueryBuilder(Campaign_1.Campaign, "campaigns")
        .leftJoinAndSelect("campaigns._managers", "managers")
        .leftJoinAndSelect("managers._ID", "ids")
        .getMany();
    let c = [];
    for (let i = 0; i < campaigns.length; i++) {
        for (let j = 0; j < campaigns[i].managers.length; j++) {
            if (req.user[0]._employeeID === campaigns[i].managers[j].ID.employeeID) {
                c.push(campaigns[i]);
            }
        }
    }
    res.render('CampaignManagerHome', { campaigns: c });
}));
router.post('/', middleware.isManager, (req, res) => __awaiter(this, void 0, void 0, function* () {
    let startDate;
    let endDate;
    let avgDuration;
    let campaign;
    // Grab dates needed to create campaign object 
    startDate = campaignCreator.getDate(req.body.campaign.startDate);
    endDate = campaignCreator.getDate(req.body.campaign.endDate);
    avgDuration = Number(req.body.campaign.averageExpectedDuration);
    // Create Campaign then save it.   
    campaign = campaignCreator.initCampaign(req.body.campaign.campaignName, startDate, endDate, avgDuration);
    yield campaignCreator.saveCampaign(campaign);
    campaignLogger.info(`Saved campaign: ${campaign._name}` + ` with ID: ${campaign.ID}`);
    // Parse the talking points then save them.    
    yield campaignCreator.saveTalkingPoints(campaign, req.body.campaign.talkingPoints);
    campaignLogger.info(`Saved talking points for: ${campaign._name}`);
    // Parse the questionaire then save it.     
    yield campaignCreator.saveQuestionnaire(campaign, req.body.campaign.questionaire);
    campaignLogger.info(`Saved questionaire for: ${campaign._name}`);
    // Save campaign managers    
    yield campaignCreator.saveManagers(campaign, req.body.campaign.managers);
    campaignLogger.info(`Saved managers for: ${campaign._name}`);
    // Save this campaigns locations    
    yield campaignCreator.saveLocations(campaign, req.body.campaign.locations);
    campaignLogger.info(`Saved locations for: ${campaign._name}`);
    //Save canavassers    
    yield campaignCreator.saveCanavaser(campaign, req.body.campaign.canvassers);
    res.redirect('/home');
}));
/**
 * GET and POST for edit Campaign
 */
router.get('/edit/:id', middleware.manages, (req, res) => __awaiter(this, void 0, void 0, function* () {
    const campaignRepository = typeorm_1.getRepository(Campaign_1.Campaign);
    const campaignID = req.params.id;
    const campaign = yield campaignRepository
        .find({ where: { "_ID": campaignID } })
        .catch(e => console.log(e));
    if (campaign === undefined) {
        return res.status(404).render('edit-campaign', {
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
        });
    }
    else {
        //parse Date
        let campaignStart = campaign[0]._startDate;
        var today = new Date();
        // check if the campaign has already started
        if (+campaignStart <= +today) {
            res.send("This campaign has already begun and cannot be edited!");
        }
        console.log("Month: ", campaignStart.getMonth);
        let campaignStartString = campaignStart.getFullYear() + "-" + (campaignStart.getMonth() + 1) + "-" + campaignStart.getDate();
        let campaignEnd = campaign[0]._endDate;
        let campaignEndString = campaignEnd.getFullYear() + "-" + (campaignEnd.getMonth() + 1) + "-" + campaignEnd.getDate();
        //parse questions back to input form
        const qRepo = typeorm_1.getRepository(Questionaire_1.Questionaire);
        const questionaire = yield qRepo.find({ where: { "_campaign": campaign[0].ID } });
        campaign[0].question = questionaire;
        let questionsInput = "";
        for (let i in campaign[0].question) {
            questionsInput += campaign[0].question[i].question + "\n";
        }
        //parse talking points back to input form
        const tRepo = typeorm_1.getRepository(TalkPoint_1.TalkPoint);
        const talkPoint = yield tRepo.find({ where: { "_campaign": req.params.id } });
        campaign[0].talkingPoint = talkPoint;
        let talkPointInput = "";
        for (let i in campaign[0].talkingPoint) {
            talkPointInput += campaign[0].talkingPoint[i].talk + "\n";
        }
        //parse locations back to input form
        let locationsInput = "";
        for (let i in campaign[0].locations) {
            locationsInput += campaign[0].locations[i]._streetNumber + ", " +
                campaign[0].locations[i]._street + ", " +
                campaign[0].locations[i].unit + ", " +
                campaign[0].locations[i].city + ", " +
                campaign[0].locations[i].state + ", " +
                campaign[0].locations[i].zipcode + "\n";
        }
        //parse managers back to input form
        let campaignManagers = campaign[0].managers;
        let campaignManagersString = "";
        for (let i in campaignManagers) {
            campaignManagersString += campaignManagers[i].ID.username + "\n";
        }
        //parse canvassers back to input form
        let campaignCanvasser = yield typeorm_1.getManager()
            .createQueryBuilder(Canvasser_1.Canvasser, "canvasser")
            .leftJoinAndSelect("canvasser._campaigns", "campaign")
            .leftJoinAndSelect("canvasser._ID", "user")
            .where("campaign._ID = :ID", { ID: req.params.id })
            .getMany();
        let campaignCanvassersString = "";
        for (let i in campaignCanvasser) {
            campaignCanvassersString += campaignCanvasser[i].ID.username + "\n";
        }
        res.status(200).render('edit-campaign', {
            campaignName: campaign[0].name,
            campaignManagers: campaignManagersString,
            campaignLocations: locationsInput,
            campaignStartDate: campaignStartString,
            campaignEndDate: campaignEndString,
            campaignAvgDuration: campaign[0]._avgDuration,
            campaignQuestions: questionsInput,
            campaignTalkPoints: talkPointInput,
            campaignCanvassers: campaignCanvassersString,
            campaignID: req.params.id
        });
    }
}));
router.post('/edit/:id', middleware.manages, (req, res) => __awaiter(this, void 0, void 0, function* () {
    let updatedCampaign = req.body.campaign;
    let originalCampaign = yield typeorm_1.getManager().findOne(Campaign_1.Campaign, {
        where: { "_ID": req.params.id }
    });
    // Update campaign attributes
    originalCampaign.name = updatedCampaign.campaignName;
    originalCampaign.startDate = editTools.updatedDate(updatedCampaign.startDate);
    originalCampaign.endDate = editTools.updatedDate(updatedCampaign.endDate);
    originalCampaign.avgDuration = updatedCampaign.averageExpectedDuration;
    yield typeorm_1.getManager().save(originalCampaign).catch(e => console.log(e));
    // Update Talking Points
    yield editTools.updateTalkingPoints(originalCampaign, req.body.campaign.talkingPoints);
    // Update Questions
    yield editTools.updateQuestionnaire(originalCampaign, req.body.campaign.questionaire);
    // Update Managers
    yield editTools.updateManagers(originalCampaign, req.body.campaign.managers);
    // Update Canvassers
    yield editTools.updateCanvassers(originalCampaign, req.body.campaign.canvassers);
    // Update Locations
    //@ts-ignore
    yield editTools.updateLocations(originalCampaign, req.body.campaign.locations);
    res.redirect('/home');
}));
/**
 * GET for view campaign
 */
router.get('/view/:id', middleware.manages, (req, res) => __awaiter(this, void 0, void 0, function* () {
    var campaign = yield typeorm_1.getManager().find(Campaign_1.Campaign, { where: { "_ID": req.params.id } })
        .catch(e => console.log(e));
    if (campaign[0] === undefined) {
        res.status(404).send('Campaign with ID: ' + req.params.id + ' was not found!');
    }
    else {
        // MANUAL LOAD FROM DB - Questoinaire AND TALKING POINTS
        const qRepo = typeorm_1.getRepository(Questionaire_1.Questionaire);
        const questionaire = yield qRepo.find({ where: { "_campaign": campaign[0].ID } });
        campaign[0].question = questionaire;
        const tRepo = typeorm_1.getRepository(TalkPoint_1.TalkPoint);
        const tpoints = yield tRepo.find({ where: { "_campaign": req.params.id } });
        campaign[0].talkingPoint = tpoints;
        // LOAD CANVASSERS FROM DB
        const canva = yield typeorm_1.getManager()
            .createQueryBuilder(Canvasser_1.Canvasser, "canvasser")
            .leftJoinAndSelect("canvasser._campaigns", "campaign")
            .leftJoinAndSelect("canvasser._ID", "user")
            .where("campaign._ID = :ID", { ID: req.params.id })
            .getMany();
        // send geocodes through socket
        var geocodes = [];
        for (let i in campaign[0].locations) {
            geocodes.push({
                lat: campaign[0].locations[i].lat,
                lng: campaign[0].locations[i].long
            });
        }
        // lets make a new connection socket for the view url and change the path from client
        server_1.io.on('connection', function (socket) {
            socket.emit('geocodes', geocodes);
        });
        res.render('view-campaign', {
            id: campaign[0].ID,
            name: campaign[0].name,
            manager: campaign[0].managers,
            assignment: "",
            sDate: campaign[0].startDate,
            endDate: campaign[0].endDate,
            duration: campaign[0].avgDuration,
            locationz: campaign[0].locations,
            question: campaign[0].question,
            points: campaign[0].talkingPoint,
            canv: canva,
        });
    }
}));
//# sourceMappingURL=campaign.js.map