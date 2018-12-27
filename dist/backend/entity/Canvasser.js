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
const User_1 = require("./User");
const Availability_1 = require("./Availability");
const AssignedDate_1 = require("./AssignedDate");
const Task_1 = require("./Task");
const Results_1 = require("./Results");
const Campaign_1 = require("./Campaign");
let Canvasser = class Canvasser {
    get ID() {
        return this._ID;
    }
    get campaigns() {
        return this._campaigns;
    }
    get task() {
        return this._task;
    }
    get availableDates() {
        return this._availableDates;
    }
    get assignedDates() {
        return this._assignedDates;
    }
    get results() {
        return this._results;
    }
    set ID(value) {
        this._ID = value;
    }
    set campaigns(value) {
        this._campaigns = value;
    }
    set task(value) {
        this._task = value;
    }
    set availableDates(value) {
        this._availableDates = value;
    }
    set assignedDates(value) {
        this._assignedDates = value;
    }
    set results(value) {
        this._results = value;
    }
};
__decorate([
    typeorm_1.OneToOne(type => User_1.User, { primary: true, eager: true, cascade: true, onDelete: "CASCADE" }),
    typeorm_1.JoinColumn(),
    __metadata("design:type", User_1.User)
], Canvasser.prototype, "_ID", void 0);
__decorate([
    typeorm_1.ManyToMany(type => Campaign_1.Campaign, { cascade: true, eager: true, nullable: true }),
    typeorm_1.JoinTable({ name: "campaign_canvasser_mapping" }),
    __metadata("design:type", Array)
], Canvasser.prototype, "_campaigns", void 0);
__decorate([
    typeorm_1.ManyToMany(type => Task_1.Task, { cascade: true }),
    typeorm_1.JoinTable({ name: "canvasser_task_mapping" }),
    __metadata("design:type", Array)
], Canvasser.prototype, "_task", void 0);
__decorate([
    typeorm_1.ManyToMany(type => Availability_1.Availability, { cascade: true, nullable: true }),
    typeorm_1.JoinTable({ name: "canvasser_availability_mapping" }),
    __metadata("design:type", Array)
], Canvasser.prototype, "_availableDates", void 0);
__decorate([
    typeorm_1.ManyToMany(type => AssignedDate_1.AssignedDate, { cascade: true, nullable: true }),
    typeorm_1.JoinTable({ name: "canvasser_assignedDate_mapping" }),
    __metadata("design:type", Array)
], Canvasser.prototype, "_assignedDates", void 0);
__decorate([
    typeorm_1.ManyToMany(type => Results_1.Results),
    typeorm_1.JoinTable({ name: "canvasser_results_mapping" }),
    __metadata("design:type", Array)
], Canvasser.prototype, "_results", void 0);
Canvasser = __decorate([
    typeorm_1.Entity()
], Canvasser);
exports.Canvasser = Canvasser;
//# sourceMappingURL=Canvasser.js.map