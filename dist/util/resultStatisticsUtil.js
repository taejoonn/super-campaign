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
const Results_1 = require("../backend/entity/Results");
const Questionaire_1 = require("../backend/entity/Questionaire");
function getRatingStatistics(req) {
    return __awaiter(this, void 0, void 0, function* () {
        const math = require('mathjs');
        var campaign = yield typeorm_1.getManager().findOne(Campaign_1.Campaign, { where: { "_ID": req.params.id } });
        var question = yield typeorm_1.getManager().find(Questionaire_1.Questionaire, { where: { "_campaign": campaign } });
        var resul = yield typeorm_1.getManager().find(Results_1.Results, {
            where: { "_campaign": campaign },
            relations: ["_completedLocation", "_completedLocation._locations"]
        });
        campaign.results = resul;
        var completedResults = campaign.getLocationsResults();
        var allRatings = [];
        for (let i in completedResults) {
            allRatings.push(completedResults[i].rating);
        }
        return { average: math.mean(allRatings), std: math.std(allRatings) };
    });
}
exports.getRatingStatistics = getRatingStatistics;
function getQuestionStatistics(req) {
    return __awaiter(this, void 0, void 0, function* () {
        const math = require('mathjs');
        var campaign = yield typeorm_1.getManager().findOne(Campaign_1.Campaign, { where: { "_ID": req.params.id } });
        var question = yield typeorm_1.getManager().find(Questionaire_1.Questionaire, { where: { "_campaign": campaign } });
        var resul = yield typeorm_1.getManager().find(Results_1.Results, {
            where: { "_campaign": campaign },
            relations: ["_completedLocation", "_completedLocation._locations"]
        });
        campaign.results = resul;
        var completedResults = campaign.getLocationsResults();
        var questionaireResults = [];
        for (let questionNum in question) {
            var questionStats = { question: question[questionNum].question, true: 0, false: 0, percentYes: 0, percentNo: 0 };
            for (let resultNum in completedResults) {
                if (completedResults[resultNum].results[questionNum].result == true) {
                    questionStats.true = questionStats.true + 1;
                }
                else if (completedResults[resultNum].results[questionNum].result == false) {
                    questionStats.false = questionStats.false + 1;
                }
            }
            questionStats.percentYes = questionStats.true / (questionStats.true + questionStats.false) * 100;
            questionStats.percentNo = questionStats.false / (questionStats.true + questionStats.false) * 100;
            questionaireResults.push(questionStats);
        }
        return questionaireResults;
    });
}
exports.getQuestionStatistics = getQuestionStatistics;
//# sourceMappingURL=resultStatisticsUtil.js.map