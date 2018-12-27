"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const Assignment_1 = require("./Assignment");
const CampaignManager_1 = require("./CampaignManager");
const Locations_1 = require("./Locations");
const Questionaire_1 = require("./Questionaire");
const TalkPoint_1 = require("./TalkPoint");
const Results_1 = require("./Results");
let Campaign = class Campaign {
    get results() {
        return this._results;
    }
    set results(value) {
        this._results = value;
    }
    get ID() {
        return this._ID;
    }
    get name() {
        return this._name;
    }
    get managers() {
        return this._managers;
    }
    get assignment() {
        return this._assignment;
    }
    get locations() {
        return this._locations;
    }
    get startDate() {
        return this._startDate;
    }
    get endDate() {
        return this._endDate;
    }
    get avgDuration() {
        return this._avgDuration;
    }
    get question() {
        return this._question;
    }
    get talkingPoint() {
        return this._talkingPoint;
    }
    set ID(ID) {
        this._ID = ID;
    }
    set name(name) {
        this._name = name;
    }
    set managers(value) {
        this._managers = value;
    }
    set assignment(assignemnt) {
        this._assignment = assignemnt;
    }
    set locations(locations) {
        this._locations = locations;
    }
    set startDate(startDate) {
        this._startDate = startDate;
    }
    set endDate(endDate) {
        this._endDate = endDate;
    }
    set avgDuration(avgDuration) {
        this._avgDuration = avgDuration;
    }
    set question(value) {
        this._question = value;
    }
    set talkingPoint(value) {
        this._talkingPoint = value;
    }
    getLocationsResults() {
        var completedLocations = [];
        if (this._results.length > 0) {
            for (let i in this._results) {
                if (completedLocations.length === 0) {
                    completedLocations.push({
                        completedLocation: this._results[i].completedLocation,
                        results: [{
                                resultNum: this._results[i].answerNumber,
                                result: this._results[i].answer
                            }],
                        rating: this._results[i].rating,
                        //K:
                        coord: { lat: parseFloat(this._results[i].completedLocation.locations[0].lat.toString()), lng: parseFloat(this._results[i].completedLocation.locations[0].long.toString()) }
                    });
                }
                else {
                    completedLocations = this.addResult(completedLocations, this._results[i]);
                }
            }
        }
        return completedLocations;
    }
    addResult(completedLocations, result) {
        var results = completedLocations;
        for (let j in results) {
            if (result.completedLocation.ID === results[j].completedLocation.ID) {
                results[j].results.push({
                    resultNum: result.answerNumber,
                    result: result.answer
                });
            }
            else if (Number(j) === results.length - 1) {
                results.push({
                    completedLocation: result.completedLocation,
                    results: [{
                            resultNum: result.answerNumber,
                            result: result.answer
                        }],
                    rating: result.rating
                });
            }
        }
        return results;
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ name: "ID" }),
    __metadata("design:type", Number)
], Campaign.prototype, "_ID", void 0);
__decorate([
    typeorm_1.Column({ name: "campaignName" }),
    __metadata("design:type", String)
], Campaign.prototype, "_name", void 0);
__decorate([
    typeorm_1.ManyToMany(type => CampaignManager_1.CampaignManager, { cascade: true, eager: true }),
    typeorm_1.JoinTable({ name: "campaign_manager_mapping" }),
    __metadata("design:type", Array)
], Campaign.prototype, "_managers", void 0);
__decorate([
    typeorm_1.OneToOne(type => Assignment_1.Assignment, { nullable: true }),
    typeorm_1.JoinColumn(),
    __metadata("design:type", Assignment_1.Assignment)
], Campaign.prototype, "_assignment", void 0);
__decorate([
    typeorm_1.ManyToMany(type => Locations_1.Locations, { eager: true, cascade: true }),
    typeorm_1.JoinTable({ name: "campaign_locations_mapping" }),
    __metadata("design:type", Array)
], Campaign.prototype, "_locations", void 0);
__decorate([
    typeorm_1.Column({ name: "startDate" }),
    __metadata("design:type", Date)
], Campaign.prototype, "_startDate", void 0);
__decorate([
    typeorm_1.Column({ name: "endDate" }),
    __metadata("design:type", Date)
], Campaign.prototype, "_endDate", void 0);
__decorate([
    typeorm_1.Column({ name: "avgDuration" }),
    __metadata("design:type", Number)
], Campaign.prototype, "_avgDuration", void 0);
__decorate([
    typeorm_1.OneToMany(type => Questionaire_1.Questionaire, qt => qt.campaign, { cascade: true }),
    __metadata("design:type", Array)
], Campaign.prototype, "_question", void 0);
__decorate([
    typeorm_1.OneToMany(type => TalkPoint_1.TalkPoint, tp => tp.campaign, { cascade: true }),
    __metadata("design:type", Array)
], Campaign.prototype, "_talkingPoint", void 0);
__decorate([
    typeorm_1.OneToMany(type => Results_1.Results, res => res.campaign, { nullable: true }),
    __metadata("design:type", Array)
], Campaign.prototype, "_results", void 0);
Campaign = __decorate([
    typeorm_1.Entity()
], Campaign);
exports.Campaign = Campaign;
//# sourceMappingURL=Campaign.js.map