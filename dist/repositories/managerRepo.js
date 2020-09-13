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
const Canvasser_1 = require("../backend/entity/Canvasser");
const typeorm_1 = require("typeorm");
const Task_1 = require("../backend/entity/Task");
const RemainingLocation_1 = require("../backend/entity/RemainingLocation");
const Campaign_1 = require("../backend/entity/Campaign");
/**
 * Returns the canvassers that are available to work on
 * a campaign
 * @param campaignID
 */
exports.getAvailableCanvassers = (campaignID) => __awaiter(this, void 0, void 0, function* () {
    return yield typeorm_1.getManager()
        .createQueryBuilder(Canvasser_1.Canvasser, "canvasser")
        .leftJoinAndSelect("canvasser._campaigns", "campaign")
        .leftJoinAndSelect("canvasser._ID", "user")
        .leftJoinAndSelect("canvasser._availableDates", "avaDate")
        .leftJoinAndSelect("canvasser._assignedDates", "assDate")
        .leftJoinAndSelect("canvasser._task", "task")
        .leftJoinAndSelect("task._remainingLocation", "RL")
        .leftJoinAndSelect("RL._locations", "RLocation")
        .leftJoinAndSelect("task._completedLocation", "CL")
        .leftJoinAndSelect("CL._locations", "CLocation")
        .leftJoinAndSelect("task._assignment", "assignment")
        .where("campaign._ID = :ID", { ID: campaignID })
        .getMany();
});
exports.getCanvassers = (campaignID) => __awaiter(this, void 0, void 0, function* () {
    return yield typeorm_1.getManager()
        .createQueryBuilder(Canvasser_1.Canvasser, "canvasser")
        .leftJoinAndSelect("canvasser._ID", "user")
        .leftJoinAndSelect("canvasser._campaigns", "campaign")
        .leftJoinAndSelect("canvasser._task", "tasks")
        .where("campaign._ID = :ID", { ID: campaignID })
        .getMany();
});
exports.getTaskCanvasser = (taskID, canvasserID) => __awaiter(this, void 0, void 0, function* () {
    return yield typeorm_1.getManager()
        .createQueryBuilder(Canvasser_1.Canvasser, "canvasser")
        .leftJoinAndSelect("canvasser._tasks", "tasks")
        .where("canvasser._ID = :ID", { ID: canvasserID })
        .where("tasks._ID = ID", { ID: taskID })
        .getMany();
});
/**
 * Returns the tasks for a campaign
 * @param campaignID
 */
exports.getCampaignTask = (campaignID) => __awaiter(this, void 0, void 0, function* () {
    return yield typeorm_1.getManager()
        .createQueryBuilder(Task_1.Task, "task")
        .leftJoinAndSelect("task._remainingLocation", "rL")
        .leftJoinAndSelect("rL._locations", "locations")
        .where("campaignID = :ID", { ID: campaignID })
        .getMany();
});
exports.getTask = (taskId) => __awaiter(this, void 0, void 0, function* () {
    return yield typeorm_1.getManager()
        .createQueryBuilder(Task_1.Task, "task")
        .where("_ID = ID", { ID: taskId })
        .getMany();
});
exports.getRemainingLocations = (taskID) => __awaiter(this, void 0, void 0, function* () {
    return yield typeorm_1.getManager()
        .createQueryBuilder(RemainingLocation_1.RemainingLocation, "remainingLocation")
        .leftJoinAndSelect("remainingLocation._locations", "locations")
        .where("remainingLocation._ID = :ID", { ID: taskID })
        .getMany();
});
exports.getCanvasserCampaigns = (employeeID) => __awaiter(this, void 0, void 0, function* () {
    return yield typeorm_1.getManager()
        .createQueryBuilder(Canvasser_1.Canvasser, "canvasser")
        .leftJoinAndSelect("canvasser._ID", "user")
        .leftJoinAndSelect("canvasser._campaigns", "campaigns")
        .leftJoinAndSelect("campaigns._assignment", "assignment")
        .where("user._employeeID = :id", { id: employeeID })
        .getOne();
});
exports.getTaskAssignment = (campaignID) => __awaiter(this, void 0, void 0, function* () {
    return yield yield typeorm_1.getManager()
        .createQueryBuilder(Task_1.Task, "task")
        .leftJoinAndSelect("task._assignment", "assignment")
        .where("task._campaignID = :id", { id: campaignID })
        .getOne()
        .then(res => {
        return res;
    });
});
exports.getAssignmentTasks = (assignmentID) => __awaiter(this, void 0, void 0, function* () {
    return yield typeorm_1.getManager()
        .createQueryBuilder(Task_1.Task, "task")
        .leftJoinAndSelect("task._assignment", "assignment")
        .leftJoinAndSelect("task._remainingLocation", "RL")
        .leftJoinAndSelect("RL._locations", "RLocation")
        .where("assignment._ID = :id", { id: assignmentID })
        .getMany()
        .then(res => {
        return res;
    });
});
exports.removeRL = (RLID, locationID) => __awaiter(this, void 0, void 0, function* () {
    yield typeorm_1.getManager()
        .createQueryBuilder()
        .relation(RemainingLocation_1.RemainingLocation, "_locations")
        .of(RLID)
        .remove(locationID);
});
exports.removeRLofTask = (taskID) => __awaiter(this, void 0, void 0, function* () {
    yield typeorm_1.getManager()
        .createQueryBuilder()
        .relation(Task_1.Task, "_remainingLocation")
        .of(taskID)
        .set(null);
});
exports.deleteTask = (taskID) => __awaiter(this, void 0, void 0, function* () {
    yield typeorm_1.getManager()
        .createQueryBuilder()
        .delete()
        .from(Task_1.Task)
        .where("_ID = :id", { id: taskID })
        .execute();
});
exports.getCampaignBasic = (campaignID) => __awaiter(this, void 0, void 0, function* () {
    return yield typeorm_1.getManager().findOne(Campaign_1.Campaign, { where: { "_ID": campaignID } });
});
exports.getCanvasserRL = (campaignID) => __awaiter(this, void 0, void 0, function* () {
    return yield typeorm_1.getManager()
        .createQueryBuilder(Canvasser_1.Canvasser, "canvasser")
        .leftJoinAndSelect("canvasser._campaigns", "campaign")
        .leftJoinAndSelect("canvasser._task", "task")
        .leftJoinAndSelect("task._remainingLocation", "rmL")
        .leftJoinAndSelect("rmL._locations", "fmLs")
        .where("campaign._ID = :ID", { ID: campaignID })
        .getMany();
});
//# sourceMappingURL=managerRepo.js.map