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
const fs = require("fs");
const Task_1 = require("../backend/entity/Task");
const RemainingLocation_1 = require("../backend/entity/RemainingLocation");
const AssignedDate_1 = require("../backend/entity/AssignedDate");
const Locations_1 = require("../backend/entity/Locations");
const managerRepo = require("../repositories/managerRepo");
var _ = require('lodash');
var moment = require('moment');
moment().format();
// Empty "campaign" object we return when user 
// tries to access a page with an invalid campaign id.
exports.emptyCampaign = {
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
/**
 * Retrieves the global parameters set by admin
 */
function getGlobalParams() {
    let rawdata = fs.readFileSync('src/globals.json');
    // @ts-ignore - [ts] Argument of type 'Buffer' is not assignable to parameter of type 'string'.
    return JSON.parse(rawdata);
}
/**
 * Returns campaign average speed to manager
 */
exports.getAvgSpeed = () => {
    let globals = getGlobalParams();
    return Number(globals.averageSpeed);
};
/**
 * Returns length of workday to manager
 */
exports.getWorkdayLimit = () => {
    let globals = getGlobalParams();
    return Number(globals.taskTimeLimit);
};
/**
 * Returns the geocode of each location within a campaign
 * @param campaign
 */
exports.getCampaignLocations = campaign => {
    // create a new depot location
    var depot = campaign.locations[0];
    depot.lat = Number(depot.lat);
    depot.long = Number(depot.long);
    let locations = [depot];
    campaign.locations.forEach(location => {
        location.lat = Number(location.lat);
        location.long = Number(location.long);
        locations.push(location);
    });
    return locations;
};
/**
 * Code Sniplet has been obtained from https://www.movable-type.co.uk/scripts/latlong.html
 * Calculates the Manhattan Distance between two locations.
 * @param coord1
 * @param coord2
 * @param coord3
 * @param coord4
 */
exports.manhattanDist = (coord1, coord2, coord3, coord4) => {
    let R = 6371e3; // meters
    let t1 = coord1 * Math.PI / 180;
    let t2 = coord3 * Math.PI / 180;
    let t3 = Math.abs(coord3 - coord1) * Math.PI / 180;
    let t4 = Math.abs(coord4 - coord2) * Math.PI / 180;
    let a = Math.sin(t3 / 2) * Math.sin(t3 / 2) +
        Math.cos(t1) * Math.cos(t2) *
            Math.sin(t4 / 2) * Math.sin(t4 / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;
    return d;
};
/**
 * Returns an estimation on the number of task necessary to completely canvass
 * all locations
 * @param locations
 * @param avgDuration
 * @param travelSpeed
 * @param workdayDuration
 */
exports.estimateTask = (locations, avgDuration, travelSpeed, workdayDuration) => {
    let avgDistance = 0;
    locations.forEach(location => {
        let avgSingleDistance = 0;
        // find the average distance between all other locations
        locations.forEach(otherLocation => {
            // find avg distance from locations object
            avgSingleDistance +=
                exports.manhattanDist(location.lat, location.long, otherLocation.lat, otherLocation.long) / travelSpeed;
        });
        avgSingleDistance /= locations.length;
        avgDistance += avgSingleDistance;
    });
    avgDistance /= locations.length;
    let numTask = (avgDistance + avgDuration) / (workdayDuration);
    return Math.ceil(numTask);
};
/**
 * Returns the coordinates of a location
 * @param location
 */
function getCoords2(location) {
    return { lat: Number(location.lat), lng: Number(location.long) };
}
exports.getCoords2 = getCoords2;
;
/**
 * Return a list of created Tasks
 * @param task
 * @param campaign
 */
exports.createTasks = (routes, campaign, assignment) => {
    let tasks = [];
    for (let l in routes) {
        let task = new Task_1.Task();
        task.remainingLocation = new RemainingLocation_1.RemainingLocation();
        task.remainingLocation.locations = [];
        // hard code from json array 'locations' because every indice has a {}
        for (let j in routes[l].locations) {
            let location = new Locations_1.Locations();
            location.ID = routes[l].locations[j]._ID;
            location.streetNumber = routes[l].locations[j]._streetNumber;
            location.street = routes[l].locations[j]._street;
            location.unit = routes[l].locations[j]._unit;
            location.city = routes[l].locations[j]._city;
            location.state = routes[l].locations[j]._state;
            location.zipcode = routes[l].locations[j]._zipcode;
            location.lat = routes[l].locations[j]._lat;
            location.long = routes[l].locations[j]._long;
            location.route = Number(j);
            task.remainingLocation.locations.push(location);
        }
        task.numLocations = task.remainingLocation.locations.length;
        task.campaignID = campaign.ID;
        task.duration = campaign.avgDuration;
        task.assignment = assignment;
        task.scheduledOn = new Date();
        tasks.push(task);
    }
    ;
    return tasks;
};
/**
 * Decorates a Task object with its campaignID,
 * currentLocation, and completedLocatoin.
 * @param task
 * @param campaign
 */
exports.decorateTask = (task, campaign) => {
    task.campaignID = Number(campaign.ID);
    //task.currentLocation = task.remainingLocation.locations[0];
    return task;
};
exports.removeBusy = (canvassers) => {
    let availableCanvassers = [];
    canvassers.forEach(canvasser => {
        if (canvasser.availableDates.length !== 0) {
            availableCanvassers.push(canvasser);
        }
    });
    return availableCanvassers;
};
exports.assignTasks = (canvassers, tasks) => {
    // 2D array of current available dates
    // 1st dimension represents the canvassers
    // 2nd represents the dates
    let currentAvailDates = [];
    // Sort by dates to allow for easier front loading.
    canvassers.forEach(canvasser => {
        canvasser.availableDates = sortDates(canvasser.availableDates);
        // all available dates for this canvasser will be the actual available dates
        if (canvasser.assignedDates.length === 0) {
            canvasser.assignedDates = [];
            canvasser.task = [];
            currentAvailDates.push(canvasser.availableDates);
        }
        else {
            /**
             * create a list of available dates by comparing
             * the assigned dates with all inital availablle dates
             */
            var date = [];
            canvasser.availableDates.forEach(vdate => {
                for (let l in canvasser.assignedDates) {
                    if (vdate.availableDate == canvasser.assignedDates[l].assignedDate) {
                        break;
                    }
                    if (Number(l) == canvasser.assignedDates.length - 1) {
                        date.push(vdate);
                    }
                }
            });
            currentAvailDates.push(date);
        }
    });
    // check if there are no available dates
    if (currentAvailDates.length == 0) {
        return {
            canvasser: null,
            status: 3
        };
    }
    // From all canvassers find the earliest date and insert task
    let earliestDate;
    let canvasserIndex;
    let status;
    for (let l in tasks) {
        // Since dates are already sorted,
        // earliest date will be at a canvassers first available date.
        for (let i in canvassers) {
            // check if the canvasser has any more current available dates
            // because as we loop through currentAvailDates is added to assignedDates and we update
            if (currentAvailDates[i] === undefined) {
                continue;
            }
            else if (currentAvailDates[i].length === 0) {
                continue;
            }
            let date = canvassersEarliestDates(currentAvailDates[i]);
            if (date != null) {
                if (earliestDate === undefined || date < earliestDate) {
                    canvasserIndex = Number(i);
                    earliestDate = date;
                    if (status != 2) {
                        status = 4;
                    }
                }
            }
            // if there are not enough canvassers with available dates. there are unassigned tasks
            if (Number(i) == canvassers.length - 1 && status != 4) {
                status = 2;
            }
        }
        if (status == 2) {
            return {
                canvasser: canvassers,
                status: 2
            };
        }
        // Insert into datesAssigned
        canvassers[canvasserIndex] = assignTask(canvassers[canvasserIndex], tasks[l]);
        tasks[l].canvasser = canvassers[canvasserIndex].ID.name;
        tasks[l].scheduledOn = earliestDate;
        // reflect newly assigned date on the list of current available dates
        for (let m in currentAvailDates[l]) {
            if (+currentAvailDates[l][m].availableDate == +earliestDate) {
                currentAvailDates[l].splice(m, 1);
            }
        }
        earliestDate = undefined;
    }
    ;
    return {
        canvasser: canvassers,
        status: 1
    };
};
function assignTask(canvasser, task) {
    // Create AssignedDate object and insert into canvasser
    let assignedDate = new AssignedDate_1.AssignedDate();
    assignedDate.canvasserID = canvasser;
    assignedDate.assignedDate = canvasser.availableDates[0].availableDate;
    canvasser.assignedDates.push(assignedDate);
    canvasser.task.push(task);
    task.canvasser = canvasser.ID.name;
    // do not delete the date of the newly assigned from available dates
    // the available dates are a record of all dates canvasser was initally available for
    return canvasser;
}
function canvassersEarliestDates(availableDates) {
    if (availableDates == undefined || availableDates == null) {
        return null;
    }
    return availableDates[0].availableDate;
}
function sortDates(availableDates) {
    return _.orderBy(availableDates, (availableDate) => {
        return new moment(availableDate.availableDate);
    });
}
;
/**
 * Update tasks that already exists in the database
 * @param tasks
 * @param campaignID
 * @param canvassers
 */
exports.updateTasks = (tasks, campaignID, canvassers) => __awaiter(this, void 0, void 0, function* () {
    let dbTasks = yield managerRepo.getCampaignTask(campaignID);
    // we can assume the campaign will have the tasks at this point
    dbTasks.forEach(dbTasks => {
        var found = false;
        for (let i in tasks) {
            // if the locationID matches, it is the same task. Update taskID
            for (let j in tasks[i].remainingLocation.locations) {
                if (tasks[i].remainingLocation.locations[j].ID ==
                    dbTasks.remainingLocation.locations[0].ID) {
                    tasks[i].ID = dbTasks.ID;
                    found = true;
                    break;
                }
            }
            if (found) {
                break;
            }
        }
    });
    return tasks;
});
/**
 * Launches and handles the response of OR-Tools from our python file
 * @param data
 */
exports.launchORT = (data) => __awaiter(this, void 0, void 0, function* () {
    console.log("inside launchORT");
    fs.writeFile("src/data/ordata.json", JSON.stringify(data, null, "\t"), function (err) {
        if (err)
            throw err;
    });
    // start up OR-Tools from child process
    // the child process is created within the promse callback
    let myPromise = new Promise((resolve, reject) => {
        var exec = require('child_process').exec;
        let dir = exec("cd src/util && python ortool.py", function (err, stdout, stderr) {
            if (err) {
                reject(err);
            }
        });
        dir.on('exit', function (code) {
            // exit code is code
            let newTasks = fs.readFileSync('src/data/result_tasks.json', 'utf8');
            resolve(newTasks);
        });
    });
    let task;
    yield myPromise
        .then(res => task = res)
        .catch(e => console.log(e));
    console.log("leaving launchORT: ", task);
    return task;
});
/**
 * Load the rest of the campaigns the canvasser may be in.
 * This is needed for saving the entity, as to not lose previous data
 * @param canvassers
 */
exports.loadCanvasserCampaigns = (canvassers) => __awaiter(this, void 0, void 0, function* () {
    for (let l in canvassers) {
        var canvass = yield managerRepo.getCanvasserCampaigns(canvassers[l].ID.employeeID);
        if (canvass != undefined) {
            for (let m in canvass.campaigns) {
                if (canvass.campaigns[m].ID == canvassers[l].campaigns[0].ID)
                    continue;
                canvassers[l].campaigns.push(canvass.campaigns[m]);
            }
        }
    }
    return canvassers;
});
exports.getOldAssignment = (campaignID) => __awaiter(this, void 0, void 0, function* () {
    var task = yield managerRepo.getTaskAssignment(campaignID);
    var assignment;
    // if there exists a task, then a previous assignment exists
    if (task != undefined && task != null) {
        assignment = task.assignment;
        assignment.tasks = yield managerRepo.getAssignmentTasks(assignment.ID);
    }
    return assignment;
});
exports.clearAssignment = (assignment) => __awaiter(this, void 0, void 0, function* () {
    // remove locations for each remaining locations
    for (let l in assignment.tasks) {
        yield removeRLocations(assignment.tasks[l]);
        yield managerRepo.removeRLofTask(assignment.tasks[l].ID);
        yield managerRepo.deleteTask(assignment.tasks[l].ID);
    }
    assignment.task = [];
    return assignment;
});
function removeRLocations(task) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let l in task.remainingLocation.locations) {
            yield managerRepo.removeRL(task.remainingLocation.ID, task.remainingLocation.locations[l].ID);
        }
    });
}
;
//# sourceMappingURL=managerTools.js.map