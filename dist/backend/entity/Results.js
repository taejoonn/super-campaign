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
const CompletedLocation_1 = require("./CompletedLocation");
const Campaign_1 = require("./Campaign");
let Results = class Results {
    get ID() {
        return this._ID;
    }
    get answer() {
        return this._answer;
    }
    get answerNumber() {
        return this._answerNumber;
    }
    get rating() {
        return this._rating;
    }
    get completedLocation() {
        return this._completedLocation;
    }
    get campaign() {
        return this._campaign;
    }
    set campaign(value) {
        this._campaign = value;
    }
    set ID(value) {
        this._ID = value;
    }
    set answer(answer) {
        this._answer = answer;
    }
    set answerNumber(answerNumber) {
        this._answerNumber = answerNumber;
    }
    set rating(value) {
        this._rating = value;
    }
    set completedLocation(value) {
        this._completedLocation = value;
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ name: "ID" }),
    __metadata("design:type", Number)
], Results.prototype, "_ID", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Campaign_1.Campaign, camp => camp.results),
    __metadata("design:type", Campaign_1.Campaign)
], Results.prototype, "_campaign", void 0);
__decorate([
    typeorm_1.Column({ name: "result" }),
    __metadata("design:type", Boolean)
], Results.prototype, "_answer", void 0);
__decorate([
    typeorm_1.Column({ name: "resultNum" }),
    __metadata("design:type", Number)
], Results.prototype, "_answerNumber", void 0);
__decorate([
    typeorm_1.Column({ name: "rating" }),
    __metadata("design:type", Number)
], Results.prototype, "_rating", void 0);
__decorate([
    typeorm_1.ManyToOne(type => CompletedLocation_1.CompletedLocation, cl => cl.results, { nullable: true }),
    __metadata("design:type", CompletedLocation_1.CompletedLocation)
], Results.prototype, "_completedLocation", void 0);
Results = __decorate([
    typeorm_1.Entity()
], Results);
exports.Results = Results;
//# sourceMappingURL=Results.js.map