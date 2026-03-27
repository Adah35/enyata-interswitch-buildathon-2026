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
exports.EscrowAccount = void 0;
const typeorm_1 = require("typeorm");
const enums_1 = require("./enums");
const User_entity_1 = require("./User.entity");
const Task_entity_1 = require("./Task.entity");
let EscrowAccount = class EscrowAccount {
};
exports.EscrowAccount = EscrowAccount;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], EscrowAccount.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], EscrowAccount.prototype, "taskId", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Task_entity_1.Task, (task) => task.escrow),
    (0, typeorm_1.JoinColumn)({ name: 'taskId' }),
    __metadata("design:type", Task_entity_1.Task)
], EscrowAccount.prototype, "task", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], EscrowAccount.prototype, "posterUserId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_entity_1.User, (user) => user.escrowsAsPoster),
    (0, typeorm_1.JoinColumn)({ name: 'posterUserId' }),
    __metadata("design:type", User_entity_1.User)
], EscrowAccount.prototype, "poster", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'uuid' }),
    __metadata("design:type", String)
], EscrowAccount.prototype, "taskerUserId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_entity_1.User, (user) => user.escrowsAsTasker, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'taskerUserId' }),
    __metadata("design:type", User_entity_1.User)
], EscrowAccount.prototype, "tasker", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint' }),
    __metadata("design:type", String)
], EscrowAccount.prototype, "grossAmountKobo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint' }),
    __metadata("design:type", String)
], EscrowAccount.prototype, "platformFeeKobo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint' }),
    __metadata("design:type", String)
], EscrowAccount.prototype, "taskerCommissionKobo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint' }),
    __metadata("design:type", String)
], EscrowAccount.prototype, "netPayoutKobo", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, unique: true, type: 'varchar' }),
    __metadata("design:type", String)
], EscrowAccount.prototype, "iswTransactionRef", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'varchar' }),
    __metadata("design:type", String)
], EscrowAccount.prototype, "iswPaymentRef", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'varchar' }),
    __metadata("design:type", String)
], EscrowAccount.prototype, "iswTransferRef", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'varchar' }),
    __metadata("design:type", String)
], EscrowAccount.prototype, "iswRefundRef", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: enums_1.EscrowStatus, default: enums_1.EscrowStatus.HOLDING }),
    __metadata("design:type", String)
], EscrowAccount.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], EscrowAccount.prototype, "heldAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], EscrowAccount.prototype, "autoReleaseAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], EscrowAccount.prototype, "releasedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], EscrowAccount.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], EscrowAccount.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('Transaction', 'escrow'),
    __metadata("design:type", Object)
], EscrowAccount.prototype, "transactions", void 0);
exports.EscrowAccount = EscrowAccount = __decorate([
    (0, typeorm_1.Entity)('escrow_accounts')
], EscrowAccount);
//# sourceMappingURL=EscrowAccount.entity.js.map