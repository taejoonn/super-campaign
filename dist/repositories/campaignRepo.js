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
const User_1 = require("../backend/entity/User");
const CampaignManager_1 = require("../backend/entity/CampaignManager");
const Canvasser_1 = require("../backend/entity/Canvasser");
const TalkPoint_1 = require("../backend/entity/TalkPoint");
const Questionaire_1 = require("../backend/entity/Questionaire");
const Locations_1 = require("../backend/entity/Locations");
exports.getManagerByUsername = (username) => __awaiter(this, void 0, void 0, function* () {
    return yield typeorm_1.getManager().findOne(User_1.User, { where: { "_username": username } });
});
exports.getManagerByUser = (user) => __awaiter(this, void 0, void 0, function* () {
    return yield typeorm_1.getManager().findOne(CampaignManager_1.CampaignManager, { where: { "_ID": user } });
});
exports.getCanvasserByUsername = (username) => __awaiter(this, void 0, void 0, function* () {
    return yield typeorm_1.getManager().findOne(User_1.User, { where: { "_username": username } });
});
exports.getCanvasserByUser = (user) => __awaiter(this, void 0, void 0, function* () {
    return yield typeorm_1.getManager().findOne(Canvasser_1.Canvasser, { where: { "_ID": user } });
});
exports.deleteTalkPoint = (campaignID) => __awaiter(this, void 0, void 0, function* () {
    yield typeorm_1.getRepository(TalkPoint_1.TalkPoint)
        .createQueryBuilder()
        .delete()
        .where("_campaign = :ID", { ID: campaignID })
        .execute();
});
exports.deleteQuestionaire = (campaignID) => __awaiter(this, void 0, void 0, function* () {
    yield typeorm_1.getRepository(Questionaire_1.Questionaire)
        .createQueryBuilder()
        .delete()
        .where("_campaign = :ID", { ID: campaignID })
        .execute();
});
exports.getCanvasserCamp = (campaignID) => __awaiter(this, void 0, void 0, function* () {
    return yield typeorm_1.getManager()
        .createQueryBuilder(Canvasser_1.Canvasser, "canvasser")
        .leftJoinAndSelect("canvasser._campaigns", "campaign")
        .leftJoinAndSelect("canvasser._ID", "user")
        .where("campaign._ID = :ID", { ID: campaignID })
        .getMany();
});
exports.removeCanvasserCampaign = (employeeID, campaignID) => __awaiter(this, void 0, void 0, function* () {
    yield typeorm_1.getManager()
        .createQueryBuilder()
        .relation(Canvasser_1.Canvasser, "_campaigns")
        .of(employeeID)
        .remove(campaignID)
        .catch(e => console.log(e));
});
exports.deleteLocation = (locationID) => __awaiter(this, void 0, void 0, function* () {
    yield typeorm_1.getManager()
        .createQueryBuilder()
        .delete()
        .from(Locations_1.Locations)
        .where("_ID = :id", { id: locationID })
        .execute()
        .then(res => console.log(res))
        .catch(e => console.log(e));
});
//# sourceMappingURL=campaignRepo.js.map