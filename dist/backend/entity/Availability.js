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
let Availability = class Availability {
    get availableDate() {
        return this._availableDate;
    }
    get ID() {
        return this._ID;
    }
    set ID(value) {
        this._ID = value;
    }
    set availableDate(availableDate) {
        this._availableDate = availableDate;
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ name: "ID" }),
    __metadata("design:type", Number)
], Availability.prototype, "_ID", void 0);
__decorate([
    typeorm_1.Column({ name: "availableDate" }),
    __metadata("design:type", Date)
], Availability.prototype, "_availableDate", void 0);
Availability = __decorate([
    typeorm_1.Entity()
], Availability);
exports.Availability = Availability;
//# sourceMappingURL=Availability.js.map