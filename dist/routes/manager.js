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
const Assignment_1 = require("../backend/entity/Assignment");
const Results_1 = require("../backend/entity/Results");
const Questionaire_1 = require("../backend/entity/Questionaire");
const managerTools = require("../util/managerTools");
const managerRepo = require("../repositories/managerRepo");
const resultStatisticsUtil = require("../util/resultStatisticsUtil");
const server_1 = require("../server");
const router = express_1.Router();
exports.managerRouter = router;
const logger = require('../util/logger');
const managerLogger = logger.getLogger('managerLogger');
const middleware = require('../middleware');
const fs = require('fs');
router.get('/', middleware.isAuthenticated, (req, res) => __awaiter(this, void 0, void 0, function* () {
    res.render('campaignScreen');
}));
router.post('/new-assignment/:id', middleware.isAuthenticated, (req, res) => __awaiter(this, void 0, void 0, function* () {
    /**
     * Check if id corressponds to a campaign
     */
    let campaign = yield managerRepo.getCampaignBasic(req.params.id);
    if (campaign === undefined) {
        return res.status(404).send('Campaign not found');
    }
    // check if the campaign has already started
    var currentDate = new Date();
    if (+campaign.startDate <= +currentDate) {
        return res.send("This Campaign has already started. You cannot create a new assignemnt!");
    }
    /**
     * Check if a assignment already exists for this campaign
     */
    var replaced = false;
    let assignment = yield managerTools.getOldAssignment(campaign.ID)
        .then(res => {
        return res;
    });
    if (assignment != undefined) {
        // delete all tasks and their relations
        assignment = yield managerTools.clearAssignment(assignment);
        replaced = true;
    }
    else {
        assignment = new Assignment_1.Assignment();
    }
    /**
     * Grab global parameters from globals.json
     */
    let AVG_TRAVEL_SPEED = managerTools.getAvgSpeed();
    let WORKDAY_LIMIT = managerTools.getWorkdayLimit();
    let ESTIMATED_VISIT_TIME = campaign.avgDuration;
    /**
     * Grab necessary data to create an assignment.
     * Canvassers to put to work
     * Locations to canvass
     * Estimated number of tasks
     */
    let canvassers = yield managerRepo.getAvailableCanvassers(req.params.id);
    let locations = managerTools.getCampaignLocations(campaign);
    let estimatedTasks = managerTools.estimateTask(locations, ESTIMATED_VISIT_TIME, AVG_TRAVEL_SPEED, WORKDAY_LIMIT);
    // Set up json object
    var data = {
        locations: locations,
        num_canvassers: estimatedTasks,
        estimated_visit_time: ESTIMATED_VISIT_TIME,
        workday_limit: WORKDAY_LIMIT,
        avg_travel_speed: AVG_TRAVEL_SPEED
    };
    let OResults = yield managerTools.launchORT(data);
    /**
     * Create tasks and assign campaignID & assignment
     */
    let tasks = managerTools.createTasks(JSON.parse(OResults).routes, campaign, assignment);
    /**
     * Remove canvassers with no openings in schedule
     */
    canvassers = managerTools.removeBusy(canvassers);
    var ret = managerTools.assignTasks(canvassers, tasks);
    if (ret.status == 3) {
        // no available dates so no tasks were assigned
        canvassers = null;
    }
    else {
        // all or some tasks are assigned
        canvassers = ret.canvasser;
    }
    var status = ret.status;
    assignment.tasks = tasks;
    campaign.assignment = assignment;
    /**
     * Save new assignment and update campaign
     */
    if (replaced) {
        for (let l in assignment.tasks) {
            assignment.tasks[l].assignment = assignment;
        }
        yield typeorm_1.getManager().save(assignment.tasks);
    }
    else {
        yield typeorm_1.getManager().save(assignment).then(res => console.log("Assingment Saved"));
        yield typeorm_1.getManager().save(campaign).then(res => console.log("campaign saved"));
    }
    /**
     * Save canvassers with their assigned task
     */
    if (status != 3) {
        canvassers = yield managerTools.loadCanvasserCampaigns(canvassers);
        yield typeorm_1.getManager().save(canvassers).then(res => console.log("Canvassers saved"));
    }
    else {
        return res.send("Warning!!! No canvassers are available to assign task(s) to!");
    }
    if (status == 2) {
        return res.send("Warning!!! Not enough canvassers are available to be assigned for all tasks!");
    }
    /**
     * Redirect to correct home page
     */
    if (req.user[0]._permission === 1) {
        res.status(200).render('CampaignManagerHome', { campaigns: campaign });
    }
    else if (req.user[0]._permission === 2) {
        res.status(200).render('CanvasserHome');
    }
    else {
        res.status(200).render('AdminHome');
    }
}));
router.get('/view-assignment/:id', middleware.isAuthenticated, (req, res) => __awaiter(this, void 0, void 0, function* () {
    let campaign;
    let tasks = [];
    let remainingLocations = [];
    let locations = [];
    let taskLocations = [];
    let campaignID = req.params.id;
    let numLocations = 0;
    let canvassers = [];
    // Check if id corressponds to a campaign    
    campaign = yield managerRepo.getCampaignBasic(campaignID);
    if (campaign === undefined) {
        return res.status(404).send('Assignment not found');
    }
    // Grab all canvassers that work for this campaign
    canvassers = yield managerRepo.getCanvassers(campaignID);
    // Grab all task with this campaign id
    tasks = yield managerRepo.getCampaignTask(campaignID);
    let test = [];
    // Grab all remaining locations for the tasks
    for (let i in tasks) {
        let location = yield managerRepo.getRemainingLocations(tasks[i].ID);
        tasks[i].remainingLocations = locations;
        location.forEach(l => {
            l.locations.forEach(place => {
                tasks[i].remainingLocations.push(place);
            });
        });
        remainingLocations.push(location);
        test.push(location);
    }
    // Remove canvassers with no task
    for (let i = 0; i < canvassers.length; i++) {
        if (canvassers[i]._task === undefined) {
            canvassers.splice(i, 1);
        }
    }
    // Get all the locations in remainingLocations
    for (let i in remainingLocations) {
        for (let j in remainingLocations[i]) {
            remainingLocations[i][j].locations.forEach(location => {
                locations.push(location);
                numLocations++;
            });
        }
        // Each iteration is one task.
        // Limit 1 element to 1 task.
        taskLocations.push(locations);
        locations = [];
    }
    let id = 2;
    res.render('view-assignments', { tasks, campaignID, id, numLocations });
}));
router.post('/view-assignment-detail', middleware.isAuthenticated, (req, res) => __awaiter(this, void 0, void 0, function* () {
    const canv = yield managerRepo.getCanvasserRL(req.body.campaignID);
    if (res.status(200)) {
        if (canv === undefined) {
            res.send('Error retreiving task ' + req.body.taskID);
        }
        else {
            var cindex, index;
            var geocodes = [];
            for (let j in canv) {
                for (let i in canv[j].task) {
                    if (canv[j].task[i].ID == req.body.taskID) {
                        cindex = j;
                        index = i;
                        for (let h in canv[j].task[i].remainingLocation.locations) {
                            geocodes.push({
                                lat: canv[j].task[i].remainingLocation.locations[h].lat,
                                lng: canv[j].task[i].remainingLocation.locations[h].long
                            });
                        }
                    }
                }
            }
            server_1.io.on("connection", function (socket) {
                socket.emit("task-geocodes", geocodes);
            });
            res.render("view-task-detail", {
                task: canv[cindex].task[index],
                canvasserID: req.body.canvasserID,
                geocodes: geocodes
            });
        }
    }
    else {
        res.status(404).send("Details of Task " + req.body.taskID + " was not found");
    }
}));
router.get('/results/:id', middleware.manages, (req, res) => __awaiter(this, void 0, void 0, function* () {
    var campaign = yield managerRepo.getCampaignBasic(req.params.id);
    var resul = yield typeorm_1.getManager().find(Results_1.Results, {
        where: { "_campaign": campaign },
        relations: ["_completedLocation", "_completedLocation._locations"]
    });
    if (resul.length === 0) {
        return res.render('view-results', {
            empty: true,
            role: req.user[0]._permission,
            resultsTableView: "",
            id: req.params.id,
            resultsSummary: "",
            ratingStatistics: ""
        });
    }
    var question = yield typeorm_1.getManager().find(Questionaire_1.Questionaire, { where: { "_campaign": campaign } });
    campaign.results = resul;
    function ResultDetails(location_Id, rating, coord) {
        this.location_Id = location_Id;
        this.rating = rating;
        this.coord = coord;
    }
    campaign.locations.forEach(location => {
        new ResultDetails(location.ID, 'results', managerTools.getCoords2(location));
    });
    var ratingResults = yield resultStatisticsUtil.getRatingStatistics(req);
    var questionaireResults = yield resultStatisticsUtil.getQuestionStatistics(req);
    //send all the locations results through the socket
    server_1.io.on('connection', function (socket) {
        socket.emit('result-details', campaign.getLocationsResults());
    });
    var question = yield typeorm_1.getManager().find(Questionaire_1.Questionaire, { where: { "_campaign": campaign } });
    var resultsTable = [];
    //loop through resul to convert the IDs to their actual values into resultsTable
    for (var i = 0; i < resul.length; i++) {
        var resultRow = { answer: true, question: "", rating: 0, location: "" };
        resultRow.location = resul[i].completedLocation.locations[0].number + ", " +
            resul[i].completedLocation.locations[0].street + ", " +
            resul[i].completedLocation.locations[0].unit + ", " +
            resul[i].completedLocation.locations[0].city + ", " +
            resul[i].completedLocation.locations[0].state + ", " +
            resul[i].completedLocation.locations[0].zipcode;
        resultRow.question = question[resul[i].answerNumber].question;
        resultRow.answer = resul[i].answer;
        resultRow.rating = resul[i].rating;
        resultsTable.push(resultRow);
    }
    if (resul === undefined) {
        res.status(404).send("No results were found for this campaign.");
    }
    else {
        res.render('view-results', {
            empty: false,
            role: req.user[0]._permission,
            resultsTableView: resultsTable,
            id: req.params.id,
            resultsSummary: questionaireResults,
            ratingStatistics: ratingResults
        });
    }
}));
//# sourceMappingURL=manager.js.map