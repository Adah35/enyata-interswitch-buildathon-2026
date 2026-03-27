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
exports.Rating = void 0;
const typeorm_1 = require("typeorm");
const User_entity_1 = require("./User.entity");
const Task_entity_1 = require("./Task.entity");
let Rating = class Rating {
};
exports.Rating = Rating;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Rating.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Rating.prototype, "taskId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Task_entity_1.Task, (task) => task.rating),
    (0, typeorm_1.JoinColumn)({ name: 'taskId' }),
    __metadata("design:type", Task_entity_1.Task)
], Rating.prototype, "task", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Rating.prototype, "raterId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_entity_1.User, (user) => user.ratingsGiven),
    (0, typeorm_1.JoinColumn)({ name: 'raterId' }),
    __metadata("design:type", User_entity_1.User)
], Rating.prototype, "rater", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Rating.prototype, "rateeId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_entity_1.User, (user) => user.ratingsReceived),
    (0, typeorm_1.JoinColumn)({ name: 'rateeId' }),
    __metadata("design:type", User_entity_1.User)
], Rating.prototype, "ratee", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Rating.prototype, "score", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], Rating.prototype, "reviewText", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Rating.prototype, "isVisible", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Rating.prototype, "createdAt", void 0);
exports.Rating = Rating = __decorate([
    (0, typeorm_1.Entity)('ratings'),
    (0, typeorm_1.Unique)(['taskId', 'raterId'])
], Rating);
//# sourceMappingURL=Rating.entity.js.map