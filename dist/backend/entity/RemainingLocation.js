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
const Task_1 = require("./Task");
let RemainingLocation = class RemainingLocation {
    get ID() {
        return this._ID;
    }
    get locations() {
        return this._locations;
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
    set task(task) {
        this._task = task;
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ name: "ID" }),
    __metadata("design:type", Number)
], RemainingLocation.prototype, "_ID", void 0);
__decorate([
    typeorm_1.ManyToMany(type => Locations_1.Locations, { eager: true, cascade: true }),
    typeorm_1.JoinTable({ name: "remaining_locations_mapping" }),
    __metadata("design:type", Array)
], RemainingLocation.prototype, "_locations", void 0);
__decorate([
    typeorm_1.OneToOne(type => Task_1.Task),
    __metadata("design:type", Task_1.Task)
], RemainingLocation.prototype, "_task", void 0);
RemainingLocation = __decorate([
    typeorm_1.Entity()
], RemainingLocation);
exports.RemainingLocation = RemainingLocation;
//# sourceMappingURL=RemainingLocation.js.map