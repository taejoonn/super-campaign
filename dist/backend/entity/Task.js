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
const RemainingLocation_1 = require("./RemainingLocation");
const CompletedLocation_1 = require("./CompletedLocation");
const Assignment_1 = require("./Assignment");
let Task = class Task {
    get ID() {
        return this._ID;
    }
    get campaignID() {
        return this._campaignID;
    }
    get remainingLocation() {
        return this._remainingLocation;
    }
    get completedLocation() {
        return this._completedLocation;
    }
    get scheduledOn() {
        return this._scheduledOn;
    }
    get assignment() {
        return this._assignment;
    }
    get duration() {
        return this._duration;
    }
    get canvasser() {
        return this._canvasser;
    }
    get numLocations() {
        return this._numLocations;
    }
    set numLocations(value) {
        this._numLocations = value;
    }
    set canvasser(value) {
        this._canvasser = value;
    }
    set duration(value) {
        this._duration = value;
    }
    set ID(ID) {
        this._ID = ID;
    }
    set campaignID(campaignId) {
        this._campaignID = campaignId;
    }
    set remainingLocation(value) {
        this._remainingLocation = value;
    }
    set completedLocation(value) {
        this._completedLocation = value;
    }
    set scheduledOn(date) {
        this._scheduledOn = date;
    }
    set assignment(value) {
        this._assignment = value;
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ name: "ID" }),
    __metadata("design:type", Number)
], Task.prototype, "_ID", void 0);
__decorate([
    typeorm_1.Column({ name: "campaignID" }),
    __metadata("design:type", Number)
], Task.prototype, "_campaignID", void 0);
__decorate([
    typeorm_1.OneToOne(type => RemainingLocation_1.RemainingLocation, { nullable: true, cascade: true }),
    typeorm_1.JoinColumn({ name: "remainingLocation" }),
    __metadata("design:type", RemainingLocation_1.RemainingLocation)
], Task.prototype, "_remainingLocation", void 0);
__decorate([
    typeorm_1.OneToOne(type => CompletedLocation_1.CompletedLocation, { nullable: true, cascade: true }),
    typeorm_1.JoinColumn({ name: "completedLocation" }),
    __metadata("design:type", CompletedLocation_1.CompletedLocation)
], Task.prototype, "_completedLocation", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Assignment_1.Assignment, as => as.tasks),
    __metadata("design:type", Assignment_1.Assignment)
], Task.prototype, "_assignment", void 0);
__decorate([
    typeorm_1.Column({ name: "ofDate" }),
    __metadata("design:type", Date)
], Task.prototype, "_scheduledOn", void 0);
__decorate([
    typeorm_1.Column({ name: "duration" }),
    __metadata("design:type", Number)
], Task.prototype, "_duration", void 0);
__decorate([
    typeorm_1.Column({ name: "canvasserName", nullable: true }),
    __metadata("design:type", String)
], Task.prototype, "_canvasser", void 0);
__decorate([
    typeorm_1.Column({ name: "numLocations" }),
    __metadata("design:type", Number)
], Task.prototype, "_numLocations", void 0);
Task = __decorate([
    typeorm_1.Entity()
], Task);
exports.Task = Task;
//# sourceMappingURL=Task.js.map