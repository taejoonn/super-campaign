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
const Locations_1 = require("./Locations");
const Results_1 = require("./Results");
const Task_1 = require("./Task");
let CompletedLocation = class CompletedLocation {
    get ID() {
        return this._ID;
    }
    get locations() {
        return this._locations;
    }
    get results() {
        return this._results;
    }
    get task() {
        return this._task;
    }
    set ID(ID) {
        this._ID = ID;
    }
    set locations(locationID) {
        this._locations = locationID;
    }
    set results(resultID) {
        this._results = resultID;
    }
    set task(task) {
        this._task = task;
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ name: "ID" }),
    __metadata("design:type", Number)
], CompletedLocation.prototype, "_ID", void 0);
__decorate([
    typeorm_1.ManyToMany(type => Locations_1.Locations),
    typeorm_1.JoinTable({ name: "completed_locations_mapping" }),
    __metadata("design:type", Array)
], CompletedLocation.prototype, "_locations", void 0);
__decorate([
    typeorm_1.OneToMany(type => Results_1.Results, res => res.completedLocation),
    __metadata("design:type", Array)
], CompletedLocation.prototype, "_results", void 0);
__decorate([
    typeorm_1.OneToOne(type => Task_1.Task, { cascade: true }),
    __metadata("design:type", Task_1.Task)
], CompletedLocation.prototype, "_task", void 0);
CompletedLocation = __decorate([
    typeorm_1.Entity()
], CompletedLocation);
exports.CompletedLocation = CompletedLocation;
//# sourceMappingURL=CompletedLocation.js.map