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
const Availability_1 = require("../backend/entity/Availability");
const server_1 = require("../server");
const CompletedLocation_1 = require("../backend/entity/CompletedLocation");
const canvasserTools = require("../util/canvasserTools");
const canvasserRepo = require("../repositories/canvasserRepo");
const router = express_1.Router();
exports.canvasserRouter = router;
const middleware = require('../middleware');
const logger = require('../util/logger');
const canvasserLogger = logger.getLogger('canvasserLogger');
router.get('/calendar', middleware.isAuthenticated, (req, res) => __awaiter(this, void 0, void 0, function* () {
    res.render('edit-availability');
}));
router.get('/home', middleware.isAuthenticated, (req, res) => __awaiter(this, void 0, void 0, function* () {
    // Get all the task for this canvasser
    // Organize by assignment id    
    // Each element in assignments is 1 assignment with
    // all the task for this canvasser
    // Then in front end render each assignment in its
    // own accordian.
    let tasks;
    let assignments = [];
    tasks = yield canvasserRepo.getCanvassersTask(req.user[0]._name);
    assignments = canvasserTools.organizeByAssignment(tasks);
    if (assignments === undefined) {
        return res.render('CanvasserHome', {});
    }
    res.render('CanvasserHome', { assignments });
}));
/**
 * GET and POST for Edit Availability
 */
router.get('/availability', middleware.isAuthenticated, (req, res) => __awaiter(this, void 0, void 0, function* () {
    let canvasserID = req.params.id;
    const canvas = yield canvasserRepo.getCanvasserDates(req.user[0]._employeeID);
    if (canvas == undefined) {
        return res.send("Wrong Link (Canvasser ID)");
    }
    //combine available and assigned dates to be shown on calendar
    var availableOrAssigned = "";
    var assigned = "";
    for (let avail in canvas.availableDates) {
        let curDate = new Date(canvas.availableDates[avail].availableDate);
        let curDateStr = curDate.getMonth() + "/" + curDate.getDate() + "/" + curDate.getFullYear() + ",";
        availableOrAssigned += curDateStr;
    }
    for (let avail in canvas.assignedDates) {
        let curDate = new Date(canvas.assignedDates[avail].assignedDate);
        let curDateStr = curDate.getMonth() + "/" + curDate.getDate() + "/" + curDate.getFullYear() + ",";
        availableOrAssigned += curDateStr;
        assigned += curDateStr;
    }
    if (availableOrAssigned !== "") {
        availableOrAssigned = availableOrAssigned.slice(0, -1);
    }
    if (assigned !== "") {
        assigned = assigned.slice(0, -1);
    }
    res.render('edit-availability', { availableOrAssigned, canvasserID, assigned });
}));
router.post('/availability', middleware.isAuthenticated, (req, res) => __awaiter(this, void 0, void 0, function* () {
    if (req.body.editAvailability.dates === '') {
        return;
    }
    var newDates = req.body.editAvailability.dates.split(",");
    const canv = yield canvasserRepo.getCanvasserDates(req.user[0]._employeeID);
    // copy canvasser's old available dates
    var availCopy = [];
    while (canv.availableDates.length > 0) {
        availCopy.push(canv.availableDates.splice(0, 1)[0]);
    }
    // copy canvasser's new available dates
    canv.availableDates = [];
    for (let i in newDates) {
        var avail = new Availability_1.Availability();
        let newDateParts = newDates[i].split("/");
        if (newDateParts != null) {
            avail.availableDate = new Date(newDateParts[2], newDateParts[0], newDateParts[1]);
            canv.availableDates.push(avail);
        }
    }
    // delete old available dates that are unused
    for (let i in availCopy) {
        for (let j in canv.availableDates) {
            if (+availCopy[i].availableDate === +canv.availableDates[j].availableDate) {
                canv.availableDates[j].ID = availCopy[i].ID;
                break;
            }
            if (Number(j) === canv.availableDates.length - 1) {
                yield canvasserRepo.deleteAvailDate(availCopy[i].ID);
            }
        }
    }
    yield typeorm_1.getManager().save(canv);
    canvasserLogger.info(`Editted availability for canvasser with id: ${req.user[0]._employeeID}`);
    res.redirect("/home");
}));
router.get('/view-tasks/:id', middleware.isAuthenticated, (req, res) => __awaiter(this, void 0, void 0, function* () {
    const canv = yield canvasserRepo.getCanvasserTaskCampaign(req.user[0]._employeeID);
    // check when a canvaseer is in many campaigns. check the list of campaigns
    if (canv === undefined) {
        res.send('You have no tasks assigned.');
    }
    else {
        res.render("view-tasks", {
            role: req.user[0]._permission,
            tasks: canv.task,
            id: canv.ID.employeeID,
            campaignID: req.params.id
        });
    }
    canvasserLogger.info(`/${req.params.id}/view-tasks - View Tasks`);
}));
router.post('/view-task-detail', middleware.isAuthenticated, (req, res) => __awaiter(this, void 0, void 0, function* () {
    const canv = yield canvasserRepo.getCanvasserTaskRL(req.body.campaignID);
    if (res.status(200)) {
        if (canv === undefined) {
            res.send('Error retreiving task ' + req.body.taskID);
        }
        else {
            var index;
            var geocodes = [];
            for (let i in canv.task) {
                if (canv.task[i].ID == req.body.taskID) {
                    index = Number(i);
                }
            }
            for (let i in canv.task[index].remainingLocation.locations) {
                geocodes.push({
                    lat: canv.task[index].remainingLocation.locations[i].lat,
                    lng: canv.task[index].remainingLocation.locations[i].long
                });
            }
            server_1.io.on('connection', function (socket) {
                socket.emit('task-geocodes', geocodes);
            });
            res.render("view-task-detail", {
                task: canv.task[index],
                canvasserID: req.body.canvasserID
            });
        }
    }
    else {
        res.status(404).send("Details of Task " + req.body.taskID + " was not found");
    }
}));
/**
 * Start of canvassing where user selects a campaign -> task -> real time canvassing
 */
router.get('/canvassing', middleware.isAuthenticated, (req, res) => __awaiter(this, void 0, void 0, function* () {
    var canvasser = yield canvasserRepo.getCanvasserCampaignsTasks(req.user[0]._employeeID);
    var tasks = [];
    for (let l in canvasser.campaigns) {
        var task = [];
        for (let m in canvasser.task) {
            if (canvasser.campaigns[l].ID === canvasser.task[m].campaignID) {
                task.push(canvasser.task[m]);
            }
        }
        tasks.push(task);
    }
    res.render("canvassing", {
        campaigns: canvasser.campaigns,
        tasks: tasks
    });
}));
/**
 * Real time canvassing where route is shown on map,
 * along with talking points, questionaire, and option for entering results
 */
router.post('/canvassing/map', middleware.isAuthenticated, (req, res) => __awaiter(this, void 0, void 0, function* () {
    var task = yield canvasserRepo.getTaskByID(req.body.taskID);
    // create a list of talking points withou the campaign object
    var talkingPoints = yield canvasserRepo.getTalk(req.body.campaignID);
    var points = [];
    talkingPoints.forEach(tp => {
        points.push(tp.talk);
    });
    var task = yield canvasserRepo.getTaskByID(req.body.taskID);
    canvasserTools.sendToMap(task, req.body.campaignID);
    res.render("canvassing-map", {
        task: task,
        talkingPoints: points,
    });
}));
/**
 * For entering results of a location
 */
router.post('/canvassing/enter-results', middleware.isAuthenticated, (req, res) => __awaiter(this, void 0, void 0, function* () {
    // create a list of questions without the campaign object
    var questionaire = yield canvasserRepo.getQuestionaire(req.body.campaignID);
    var questions = [];
    questionaire.forEach(q => {
        questions.push(q.question);
    });
    res.render("canvassing-enter-results", {
        questions: questions,
        campaignID: req.body.campaignID,
        locationID: req.body.locationID,
        taskID: req.body.taskID
    });
}));
/**
 * For saving the results
 */
router.post('/canvassing/results', middleware.isAuthenticated, (req, res) => __awaiter(this, void 0, void 0, function* () {
    var results = req.body.results;
    var rating = req.body.rating;
    var completedLocation = new CompletedLocation_1.CompletedLocation();
    completedLocation.locations = [yield canvasserRepo.getLocation(req.body.locationID)];
    var campaign = yield canvasserRepo.getCampaignBasic(req.body.campaignID);
    campaign.results = yield canvasserRepo.getResultsBasic(campaign.ID);
    // delete this location from remaining locations
    var tasks = yield canvasserRepo.getTasksByCampaign(req.body.campaignID);
    var task = yield canvasserTools.findTask(tasks, req.body.locationID);
    var location = canvasserTools.removeLocation(task.remainingLocation.locations, req.body.locationID);
    // save the remainingLocation without this completed location
    yield typeorm_1.getManager().save(task.remainingLocation)
        .then(res => console.log("after remaining locations save"))
        .catch(e => console.log(e));
    /**
     * Check if there is a existing completed location in the task and adjust accordingly
     * add the new results and new location to the completed location
     */
    var pushed = false;
    if (task.completedLocation == undefined || task.completedLocation == null) {
        task.completedLocation = completedLocation;
        // Re-load the task with a new completed location ID
        yield typeorm_1.getManager().save(task)
            .then(res => console.log("after task save"))
            .catch(e => console.log(e));
        task = yield canvasserRepo.getTaskByID(task.ID);
        // fill the new results
        completedLocation.results = canvasserTools.fillResults(results, rating, campaign, null);
    }
    else {
        task.completedLocation.locations.push(location);
        pushed = true;
        // fill the new and old results
        var oldRes = yield canvasserTools.getResults(task, campaign.ID).then(res => {
            return res;
        });
        // update completed location with the new location
        yield typeorm_1.getManager().save(task.completedLocation)
            .then(res => console.log("after completed location with new location save"))
            .catch(e => console.log(e));
        completedLocation.results = canvasserTools.fillResults(results, rating, campaign, oldRes);
    }
    completedLocation.ID = task.completedLocation.ID;
    // assign the completed location for every results
    for (let l in completedLocation.results) {
        completedLocation.results[l].completedLocation = completedLocation;
    }
    // save the results
    yield typeorm_1.getManager().save(completedLocation.results)
        .then(res => console.log("saved results"))
        .catch(e => console.log(e));
    yield canvasserRepo.saveResults(req.user[0]._employeeID, completedLocation.results);
    var resu = yield canvasserRepo.getTaskByID(req.body.taskID);
    canvasserTools.sendToMap(resu, req.body.campaignID);
    // go to success message and redirect to '/canvassing/map'
    res.render("canvassing-return-map", {
        taskID: req.body.taskID,
        campaignID: req.body.campaignID
    });
}));
//# sourceMappingURL=canvasser.js.map