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
exports.Dispute = void 0;
const typeorm_1 = require("typeorm");
const enums_1 = require("./enums");
const User_entity_1 = require("./User.entity");
const Task_entity_1 = require("./Task.entity");
let Dispute = class Dispute {
};
exports.Dispute = Dispute;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Dispute.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Dispute.prototype, "taskId", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Task_entity_1.Task, (task) => task.dispute),
    (0, typeorm_1.JoinColumn)({ name: 'taskId' }),
    __metadata("design:type", Task_entity_1.Task)
], Dispute.prototype, "task", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'uuid' }),
    __metadata("design:type", String)
], Dispute.prototype, "escrowId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Dispute.prototype, "filedById", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_entity_1.User, (user) => user.disputesFiledBy),
    (0, typeorm_1.JoinColumn)({ name: 'filedById' }),
    __metadata("design:type", User_entity_1.User)
], Dispute.prototype, "filedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: enums_1.DisputeReason }),
    __metadata("design:type", String)
], Dispute.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Dispute.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', array: true, default: [] }),
    __metadata("design:type", Array)
], Dispute.prototype, "evidenceUrls", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: enums_1.DisputeStatus, default: enums_1.DisputeStatus.OPEN }),
    __metadata("design:type", String)
], Dispute.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: enums_1.DisputeResolution, nullable: true }),
    __metadata("design:type", String)
], Dispute.prototype, "resolution", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'uuid' }),
    __metadata("design:type", String)
], Dispute.prototype, "resolvedById", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], Dispute.prototype, "resolutionNotes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Dispute.prototype, "resolvedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Dispute.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Dispute.prototype, "updatedAt", void 0);
exports.Dispute = Dispute = __decorate([
    (0, typeorm_1.Entity)('disputes')
], Dispute);
//# sourceMappingURL=Dispute.entity.js.map