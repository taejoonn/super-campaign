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
const Canvasser_1 = require("./Canvasser");
let AssignedDate = class AssignedDate {
    get canvasserID() {
        return this._canvasserID;
    }
    get assignedDate() {
        return this._assignedDate;
    }
    get ID() {
        return this._ID;
    }
    set ID(value) {
        this._ID = value;
    }
    set canvasserID(canvasserID) {
        this._canvasserID = canvasserID;
    }
    set assignedDate(assignedDate) {
        this._assignedDate = assignedDate;
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ name: "ID" }),
    __metadata("design:type", Number)
], AssignedDate.prototype, "_ID", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Canvasser_1.Canvasser, can => can.ID),
    typeorm_1.JoinColumn(),
    __metadata("design:type", Canvasser_1.Canvasser)
], AssignedDate.prototype, "_canvasserID", void 0);
__decorate([
    typeorm_1.Column({ name: "assignedDate" }),
    __metadata("design:type", Date)
], AssignedDate.prototype, "_assignedDate", void 0);
AssignedDate = __decorate([
    typeorm_1.Entity()
], AssignedDate);
exports.AssignedDate = AssignedDate;
//# sourceMappingURL=AssignedDate.js.map