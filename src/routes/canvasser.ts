import { Request, Response, Router } from 'express';
import { getManager, getRepository } from "typeorm";
import { Canvasser } from '../backend/entity/Canvasser';
import { Availability } from '../backend/entity/Availability';
import { io } from '../server';
import { Campaign } from '../backend/entity/Campaign';
import { Questionaire } from '../backend/entity/Questionaire';
import { Results } from '../backend/entity/Results';
import { CompletedLocation } from '../backend/entity/CompletedLocation';
import { Locations } from '../backend/entity/Locations';
import * as canvasserTools from '../util/canvasserTools';
import * as canvasserRepo from '../repositories/canvasserRepo';

const router: Router = Router();
const middleware = require('../middleware');
const logger = require('../util/logger');
const canvasserLogger = logger.getLogger('canvasserLogger');

router.get('/calendar', middleware.isAuthenticated, async (req: Request, res: Response) => {
    res.render('edit-availability');

});

router.get('/home', middleware.isAuthenticated, async (req: Request, res: Response) => {

    // Get all the task for this canvasser
    // Organize by assignment id    
    // Each element in assignments is 1 assignment with
    // all the task for this canvasser
    // Then in front end render each assignment in its
    // own accordian.
    let tasks;
    let assignments = [];

    tasks = await canvasserRepo.getCanvassersTask(req.user[0]._name)
    assignments = canvasserTools.organizeByAssignment(tasks);


    if (assignments === undefined) {
        return res.render('CanvasserHome', {});
    }
    res.render('CanvasserHome', { assignments });

});

/**
 * GET and POST for Edit Availability
 */
router.get('/availability', middleware.isAuthenticated, async (req: Request, res: Response) => {
    let canvasserID = req.params.id;
    const canvas = await canvasserRepo.getCanvasserDates(req.user[0]._employeeID);
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
});

router.post('/availability', middleware.isAuthenticated, async (req: Request, res: Response) => {
    if (req.body.editAvailability.dates === '') {
        return;
    }

    var newDates = req.body.editAvailability.dates.split(",");
    const canv = await canvasserRepo.getCanvasserDates(req.user[0]._employeeID);

    // copy canvasser's old available dates
    var availCopy = [];
    while (canv.availableDates.length > 0) {
        availCopy.push(canv.availableDates.splice(0, 1)[0]);
    }
    // copy canvasser's new available dates
    canv.availableDates = [];
    for (let i in newDates) {
        var avail = new Availability();
        let newDateParts = newDates[i].split("/");
        if (newDateParts != null) {
            avail.availableDate = new Date(
                newDateParts[2], newDateParts[0], newDateParts[1]);
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
                await canvasserRepo.deleteAvailDate(availCopy[i].ID);
            }
        }
    }

    await getManager().save(canv);
    canvasserLogger.info(`Editted availability for canvasser with id: ${req.user[0]._employeeID}`);

    res.redirect("/home");
});

router.get('/view-tasks/:id', middleware.isAuthenticated, async (req: Request, res: Response) => {
    const canv = await canvasserRepo.getCanvasserTaskCampaign(req.user[0]._employeeID)

    // check when a canvaseer is in many campaigns. check the list of campaigns
    if (canv === undefined) {
        res.send('You have no tasks assigned.');
    } else {
        res.render("view-tasks", {
            role: req.user[0]._permission,
            tasks: canv.task,
            id: canv.ID.employeeID,
            campaignID: req.params.id
        });
    }

    canvasserLogger.info(`/${req.params.id}/view-tasks - View Tasks`);
});

router.post('/view-task-detail', middleware.isAuthenticated, async (req: Request, res: Response) => {
    const canv = await canvasserRepo.getCanvasserTaskRL(req.body.campaignID);

    if (res.status(200)) {
        if (canv === undefined) {
            res.send('Error retreiving task ' + req.body.taskID);
        } else {
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
            io.on('connection', function (socket) {
                socket.emit('task-geocodes', geocodes);
            });

            res.render("view-task-detail", {
                task: canv.task[index],
                canvasserID: req.body.canvasserID
            });
        }
    } else {
        res.status(404).send("Details of Task " + req.body.taskID + " was not found");
    }
});

/**
 * Start of canvassing where user selects a campaign -> task -> real time canvassing
 */
router.get('/canvassing', middleware.isAuthenticated, async (req: Request, res: Response) => {
    var canvasser = await canvasserRepo.getCanvasserCampaignsTasks(req.user[0]._employeeID);

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
});

/**
 * Real time canvassing where route is shown on map, 
 * along with talking points, questionaire, and option for entering results
 */
router.post('/canvassing/map', middleware.isAuthenticated, async (req: Request, res: Response) => {
    var task = await canvasserRepo.getTaskByID(req.body.taskID);
    // create a list of talking points withou the campaign object
    var talkingPoints = await canvasserRepo.getTalk(req.body.campaignID);
    var points = [];
    talkingPoints.forEach(tp => {
        points.push(tp.talk);
    });

    var task = await canvasserRepo.getTaskByID(req.body.taskID);
    canvasserTools.sendToMap(task, req.body.campaignID);

    res.render("canvassing-map", {
        task: task,
        talkingPoints: points,
    });
});

/**
 * For entering results of a location
 */
router.post('/canvassing/enter-results', middleware.isAuthenticated, async (req: Request, res: Response) => {
    // create a list of questions without the campaign object
    var questionaire = await canvasserRepo.getQuestionaire(req.body.campaignID);
    var questions = [];
    questionaire.forEach(q => {
        questions.push(q.question);
    });

    res.render("canvassing-enter-results", {
        questions: questions,
        campaignID: req.body.campaignID,
        locationID: req.body.locationID,
        taskID: req.body.taskID
    })
});

/**
 * For saving the results
 */
router.post('/canvassing/results', middleware.isAuthenticated, async (req: Request, res: Response) => {
    var results = req.body.results;
    var rating = req.body.rating;
    var completedLocation = new CompletedLocation();

    completedLocation.locations = [await canvasserRepo.getLocation(req.body.locationID)];
    var campaign = await canvasserRepo.getCampaignBasic(req.body.campaignID);
    campaign.results = await canvasserRepo.getResultsBasic(campaign.ID);

    // delete this location from remaining locations
    var tasks = await canvasserRepo.getTasksByCampaign(req.body.campaignID);
    var task = await canvasserTools.findTask(tasks, req.body.locationID);
    var location = canvasserTools.removeLocation(task.remainingLocation.locations, req.body.locationID);

    // save the remainingLocation without this completed location
    await getManager().save(task.remainingLocation)
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
        await getManager().save(task)
            .then(res => console.log("after task save"))
            .catch(e => console.log(e));
        task = await canvasserRepo.getTaskByID(task.ID);

        // fill the new results
        completedLocation.results = canvasserTools.fillResults(results, rating, campaign, null);
    } else {
        task.completedLocation.locations.push(location);
        pushed = true;

        // fill the new and old results
        var oldRes = await canvasserTools.getResults(task, campaign.ID).then(res => {
            return res;
        });

        // update completed location with the new location
        await getManager().save(task.completedLocation)
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
    await getManager().save(completedLocation.results)
        .then(res => console.log("saved results"))
        .catch(e => console.log(e));

    await canvasserRepo.saveResults(req.user[0]._employeeID, completedLocation.results);

    var resu = await canvasserRepo.getTaskByID(req.body.taskID);
    canvasserTools.sendToMap(resu, req.body.campaignID);

    // go to success message and redirect to '/canvassing/map'
    res.render("canvassing-return-map", {
        taskID: req.body.taskID,
        campaignID: req.body.campaignID
    });
});


export { router as canvasserRouter }