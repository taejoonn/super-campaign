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
const Campaign_1 = require("../backend/entity/Campaign");
const middlewareObj = {};
middlewareObj.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        res.redirect('/');
    }
};
middlewareObj.isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user[0]._permission === 3) {
        return next();
    }
    else {
        res.redirect('/');
    }
};
middlewareObj.isManager = (req, res, next) => {
    if (req.isAuthenticated() && req.user[0]._permission === 1) {
        return next();
    }
    else {
        res.redirect('/');
    }
};
middlewareObj.manages = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    let thing = yield isManagerOf(req.user[0]._employeeID, req.params.id);
    if (req.isAuthenticated() && thing) {
        return next();
    }
    else {
        res.redirect('/');
    }
});
/**
 * Given a campaignID return true if this manager
 * manages this campaign.
 * @param campaignId
 */
function isManagerOf(managerID, campaignId) {
    return __awaiter(this, void 0, void 0, function* () {
        var campaign = yield typeorm_1.getManager().findOne(Campaign_1.Campaign, { where: { "_ID": campaignId } });
        for (let i in campaign.managers) {
            if (campaign.managers[i].ID.employeeID === managerID) {
                return true;
            }
        }
        return false;
    });
}
module.exports = middlewareObj;
//# sourceMappingURL=index.js.map