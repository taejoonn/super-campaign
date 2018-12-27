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
let Locations = class Locations {
    get route() {
        return this._route;
    }
    set route(value) {
        this._route = value;
    }
    get ID() {
        return this._ID;
    }
    get number() {
        return this._streetNumber;
    }
    get street() {
        return this._street;
    }
    get unit() {
        return this._unit;
    }
    get city() {
        return this._city;
    }
    get state() {
        return this._state;
    }
    get zipcode() {
        return this._zipcode;
    }
    get lat() {
        return this._lat;
    }
    get long() {
        return this._long;
    }
    set long(value) {
        this._long = value;
    }
    set lat(value) {
        this._lat = value;
    }
    set ID(value) {
        this._ID = value;
    }
    set streetNumber(value) {
        this._streetNumber = value;
    }
    set street(value) {
        this._street = value;
    }
    set unit(value) {
        this._unit = value;
    }
    set city(value) {
        this._city = value;
    }
    set state(value) {
        this._state = value;
    }
    set zipcode(value) {
        this._zipcode = value;
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ name: "ID" }),
    __metadata("design:type", Number)
], Locations.prototype, "_ID", void 0);
__decorate([
    typeorm_1.Column({ name: "num" }),
    __metadata("design:type", Number)
], Locations.prototype, "_streetNumber", void 0);
__decorate([
    typeorm_1.Column({ name: "street" }),
    __metadata("design:type", String)
], Locations.prototype, "_street", void 0);
__decorate([
    typeorm_1.Column({ name: "unit", nullable: true }),
    __metadata("design:type", String)
], Locations.prototype, "_unit", void 0);
__decorate([
    typeorm_1.Column({ name: "city" }),
    __metadata("design:type", String)
], Locations.prototype, "_city", void 0);
__decorate([
    typeorm_1.Column({ name: "state" }),
    __metadata("design:type", String)
], Locations.prototype, "_state", void 0);
__decorate([
    typeorm_1.Column({ name: "zipcode" }),
    __metadata("design:type", Number)
], Locations.prototype, "_zipcode", void 0);
__decorate([
    typeorm_1.Column("decimal", { precision: 10, scale: 6, name: "lat", nullable: true, default: null }),
    __metadata("design:type", Number)
], Locations.prototype, "_lat", void 0);
__decorate([
    typeorm_1.Column("decimal", { precision: 10, scale: 6, name: "long", nullable: true, default: null }),
    __metadata("design:type", Number)
], Locations.prototype, "_long", void 0);
__decorate([
    typeorm_1.Column({ name: "route", nullable: true }),
    __metadata("design:type", Number)
], Locations.prototype, "_route", void 0);
Locations = __decorate([
    typeorm_1.Entity()
], Locations);
exports.Locations = Locations;
//# sourceMappingURL=Locations.js.map