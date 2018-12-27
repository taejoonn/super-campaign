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
const CampaignManager_1 = require("../backend/entity/CampaignManager");
const Canvasser_1 = require("../backend/entity/Canvasser");
const SystemAdmin_1 = require("../backend/entity/SystemAdmin");
const User_1 = require("../backend/entity/User");
exports.createBaseUser = userData => {
    const newUser = new User_1.User();
    newUser.name = userData.name;
    newUser.username = userData.username;
    newUser.password = userData.password;
    newUser.permission = parseInt(userData.role);
    return newUser;
};
exports.createRoledUser = (roleNumber, user) => {
    let roledUser;
    if (roleNumber == 1) {
        roledUser = new CampaignManager_1.CampaignManager();
    }
    else if (roleNumber == 2) {
        roledUser = new Canvasser_1.Canvasser();
    }
    else {
        roledUser = new SystemAdmin_1.SystemAdmin();
    }
    roledUser.ID = user;
    return roledUser;
};
exports.getRepo = roleNumber => {
    let repo;
    if (roleNumber === 1) {
        repo = typeorm_1.getRepository(CampaignManager_1.CampaignManager);
    }
    else if (roleNumber === 2) {
        repo = typeorm_1.getRepository(Canvasser_1.Canvasser);
    }
    else {
        repo = typeorm_1.getRepository(SystemAdmin_1.SystemAdmin);
    }
    return repo;
};
exports.deleteUserFromRole = (roleNumber, id) => __awaiter(this, void 0, void 0, function* () {
    if (roleNumber === 1) {
        yield typeorm_1.getRepository(CampaignManager_1.CampaignManager)
            .query(`DELETE FROM Manager WHERE ID_employeeID = ${id}`);
    }
    else if (roleNumber === 2) {
        yield typeorm_1.getRepository(Canvasser_1.Canvasser)
            .query(`DELETE FROM canvasser WHERE ID_employeeID = ${id}`);
    }
    else {
        yield typeorm_1.getRepository(SystemAdmin_1.SystemAdmin)
            .query(`DELETE FROM system_admin WHERE ID_employeeID = ${id}`);
    }
});
//# sourceMappingURL=userManagementSystem.js.map