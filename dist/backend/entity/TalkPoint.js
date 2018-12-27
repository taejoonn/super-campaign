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
const Campaign_1 = require("./Campaign");
let TalkPoint = class TalkPoint {
    get campaign() {
        return this._campaign;
    }
    get talk() {
        return this._talk;
    }
    set campaign(campaign) {
        this._campaign = campaign;
    }
    set talk(talk) {
        this._talk = talk;
    }
};
__decorate([
    typeorm_1.ManyToOne(type => Campaign_1.Campaign, { primary: true, eager: true }),
    __metadata("design:type", Campaign_1.Campaign)
], TalkPoint.prototype, "_campaign", void 0);
__decorate([
    typeorm_1.PrimaryColumn({ name: "talk" }),
    __metadata("design:type", String)
], TalkPoint.prototype, "_talk", void 0);
TalkPoint = __decorate([
    typeorm_1.Entity()
], TalkPoint);
exports.TalkPoint = TalkPoint;
//# sourceMappingURL=TalkPoint.js.map