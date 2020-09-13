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
const TalkPoint_1 = require("../backend/entity/TalkPoint");
const Task_1 = require("../backend/entity/Task");
const Results_1 = require("../backend/entity/Results");
const Canvasser_1 = require("../backend/entity/Canvasser");
const Availability_1 = require("../backend/entity/Availability");
const Questionaire_1 = require("../backend/entity/Questionaire");
const Locations_1 = require("../backend/entity/Locations");
const Campaign_1 = require("../backend/entity/Campaign");
exports.getTaskByID = (taskID) => __awaiter(this, void 0, void 0, function* () {
    return yield typeorm_1.getManager()
        .createQueryBuilder(Task_1.Task, "task")
        .leftJoinAndSelect("task._remainingLocation", "RL")
        .leftJoinAndSelect("RL._locations", "RLocations")
        .leftJoinAndSelect("task._completedLocation", "CL")
        .leftJoinAndSelect("CL._locations", "CLocations")
        .where("task._ID = :id", { id: taskID })
        .getOne()
        .then(res => {
        return res;
    })
        .catch(e => console.log(e));
});
exports.getCanvassersTask = (canvasserName) => __awaiter(this, void 0, void 0, function* () {
    return yield typeorm_1.getManager()
        .createQueryBuilder(Task_1.Task, "task")
        .leftJoinAndSelect("task._remainingLocation", "RL")
        .leftJoinAndSelect("RL._locations", "locations")
        .leftJoinAndSelect("task._completedLocation", "CL")
        .leftJoinAndSelect("CL._locations", "CLocations")
        .leftJoinAndSelect("task._assignment", "assignment")
        .where("task._canvasser = :canvasserName", { canvasserName })
        .getMany()
        .then(res => {
        return res;
    })
        .catch(e => console.log(e));
});
exports.getCanvasserTaskCampaign = (employeeID) => __awaiter(this, void 0, void 0, function* () {
    return yield typeorm_1.getManager()
        .createQueryBuilder(Canvasser_1.Canvasser, "canvasser")
        .leftJoinAndSelect("canvasser._task", "task")
        .leftJoinAndSelect("canvasser._campaigns", "campaign")
        .leftJoinAndSelect("canvasser._ID", "user")
        .where("user._employeeID = :ID", { ID: employeeID })
        .getOne();
});
exports.getCanvasserTaskRL = (campaignID) => __awaiter(this, void 0, void 0, function* () {
    console.log("inside getCanvasserTakRL: ", campaignID);
    return yield typeorm_1.getManager()
        .createQueryBuilder(Canvasser_1.Canvasser, "canvasser")
        .leftJoinAndSelect("canvasser._campaigns", "campaign")
        .leftJoinAndSelect("canvasser._task", "task")
        .leftJoinAndSelect("task._remainingLocation", "rmL")
        .leftJoinAndSelect("rmL._locations", "fmLs")
        .where("campaign._ID = :ID", { ID: campaignID })
        .getOne()
        .then(res => {
        console.log("after get");
        return res;
    });
});
exports.getCanvasserCampaignsTasks = (employeeID) => __awaiter(this, void 0, void 0, function* () {
    return yield typeorm_1.getManager()
        .createQueryBuilder(Canvasser_1.Canvasser, "canvasser")
        .leftJoinAndSelect("canvasser._ID", "user")
        .leftJoinAndSelect("canvasser._campaigns", "campaigns")
        .leftJoinAndSelect("canvasser._task", "task")
        .where("user._employeeID = :id", { employeeID })
        .getOne();
});
exports.getTasksByCampaign = (campaignID) => __awaiter(this, void 0, void 0, function* () {
    return yield typeorm_1.getManager()
        .createQueryBuilder(Task_1.Task, "task")
        .leftJoinAndSelect("task._remainingLocation", "RL")
        .leftJoinAndSelect("RL._locations", "locations")
        .leftJoinAndSelect("task._completedLocation", "CL")
        .leftJoinAndSelect("CL._locations", "CLocations")
        .where("task._campaignID = :cid", { cid: campaignID })
        .getMany()
        .then(res => {
        return res;
    })
        .catch(e => console.log(e));
});
exports.getResults = (campaignID) => __awaiter(this, void 0, void 0, function* () {
    return yield typeorm_1.getManager()
        .createQueryBuilder(Results_1.Results, "results")
        .leftJoinAndSelect("results._completedLocation", "CL")
        .leftJoinAndSelect("results._campaign", "campaign")
        .where("campaign._ID = :id", { id: campaignID })
        .getMany();
});
exports.getTalk = (campaignID) => __awaiter(this, void 0, void 0, function* () {
    return yield typeorm_1.getManager().find(TalkPoint_1.TalkPoint, { where: { "_campaign": campaignID } });
});
exports.getCanvasserDates = (canvasserID) => __awaiter(this, void 0, void 0, function* () {
    return yield typeorm_1.getManager()
        .createQueryBuilder(Canvasser_1.Canvasser, "canvasser")
        .leftJoinAndSelect("canvasser._ID", "user")
        .leftJoinAndSelect("canvasser._campaigns", "campaign")
        .leftJoinAndSelect("canvasser._availableDates", "avaDate")
        .leftJoinAndSelect("canvasser._assignedDates", "assDate")
        .where("canvasser._ID = :ID", { ID: canvasserID })
        .getOne();
});
exports.deleteAvailDate = (availID) => __awaiter(this, void 0, void 0, function* () {
    yield typeorm_1.getRepository(Availability_1.Availability)
        .createQueryBuilder()
        .delete()
        .where("_ID = :ID", { ID: availID })
        .execute();
});
exports.getQuestionaire = (campaignID) => __awaiter(this, void 0, void 0, function* () {
    return yield typeorm_1.getManager().find(Questionaire_1.Questionaire, { where: { "_campaign": campaignID } });
});
exports.getLocation = (locationID) => __awaiter(this, void 0, void 0, function* () {
    return yield typeorm_1.getManager().findOne(Locations_1.Locations, { where: { "_ID": locationID } });
});
exports.getCampaignBasic = (campaignID) => __awaiter(this, void 0, void 0, function* () {
    return yield typeorm_1.getManager().findOne(Campaign_1.Campaign, { where: { "_ID": campaignID } });
});
exports.getResultsBasic = (campaignID) => __awaiter(this, void 0, void 0, function* () {
    return yield typeorm_1.getManager().find(Results_1.Results, { where: { "_campaign": campaignID } });
});
exports.saveResults = (employeeID, results) => __awaiter(this, void 0, void 0, function* () {
    yield typeorm_1.getManager()
        .createQueryBuilder()
        .relation(Canvasser_1.Canvasser, "_results")
        .of(employeeID)
        .add(results)
        .then(res => console.log("after results save for canvassers"))
        .catch(e => console.log(e));
});
//# sourceMappingURL=canvasserRepo.js.map