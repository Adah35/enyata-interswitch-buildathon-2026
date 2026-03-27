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
exports.Task = void 0;
const typeorm_1 = require("typeorm");
const enums_1 = require("./enums");
const User_entity_1 = require("./User.entity");
const Category_entity_1 = require("./Category.entity");
let Task = class Task {
};
exports.Task = Task;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Task.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Task.prototype, "posterId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_entity_1.User, (user) => user.postedTasks),
    (0, typeorm_1.JoinColumn)({ name: 'posterId' }),
    __metadata("design:type", User_entity_1.User)
], Task.prototype, "poster", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'uuid' }),
    __metadata("design:type", String)
], Task.prototype, "taskerId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_entity_1.User, (user) => user.assignedTasks, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'taskerId' }),
    __metadata("design:type", User_entity_1.User)
], Task.prototype, "tasker", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'uuid' }),
    __metadata("design:type", String)
], Task.prototype, "categoryId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('Category', 'tasks', { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'categoryId' }),
    __metadata("design:type", Category_entity_1.Category)
], Task.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Task.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Task.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: enums_1.TaskStatus, default: enums_1.TaskStatus.DRAFT }),
    __metadata("design:type", String)
], Task.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float' }),
    __metadata("design:type", Number)
], Task.prototype, "latitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float' }),
    __metadata("design:type", Number)
], Task.prototype, "longitude", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Task.prototype, "locationDisplay", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Task.prototype, "locationExact", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint' }),
    __metadata("design:type", String)
], Task.prototype, "budgetKobo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', nullable: true }),
    __metadata("design:type", String)
], Task.prototype, "finalPriceKobo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', array: true, default: [] }),
    __metadata("design:type", Array)
], Task.prototype, "mediaUrls", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Task.prototype, "scheduledFor", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'varchar' }),
    __metadata("design:type", String)
], Task.prototype, "durationEstimate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', array: true, default: [] }),
    __metadata("design:type", Array)
], Task.prototype, "completionProofUrls", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Task.prototype, "completedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Task.prototype, "confirmedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Task.prototype, "autoReleaseAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Task.prototype, "cancelledAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], Task.prototype, "cancelReason", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Task.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Task.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('Bid', 'task'),
    __metadata("design:type", Object)
], Task.prototype, "bids", void 0);
__decorate([
    (0, typeorm_1.OneToOne)('EscrowAccount', 'task'),
    __metadata("design:type", Object)
], Task.prototype, "escrow", void 0);
__decorate([
    (0, typeorm_1.OneToOne)('Dispute', 'task'),
    __metadata("design:type", Object)
], Task.prototype, "dispute", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('Rating', 'task'),
    __metadata("design:type", Object)
], Task.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('Message', 'task'),
    __metadata("design:type", Object)
], Task.prototype, "messages", void 0);
exports.Task = Task = __decorate([
    (0, typeorm_1.Entity)('tasks')
], Task);
//# sourceMappingURL=Task.entity.js.map