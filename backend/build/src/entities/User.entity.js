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
exports.User = void 0;
const typeorm_1 = require("typeorm");
const enums_1 = require("./enums");
let User = class User {
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "fullName", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: enums_1.UserRole }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: enums_1.KycLevel, default: enums_1.KycLevel.NONE }),
    __metadata("design:type", String)
], User.prototype, "kycLevel", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, unique: true }),
    __metadata("design:type", String)
], User.prototype, "nin", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, unique: true }),
    __metadata("design:type", String)
], User.prototype, "bvn", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], User.prototype, "passportUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isPhoneVerified", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isEmailVerified", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], User.prototype, "avatarUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], User.prototype, "bio", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'varchar' }),
    __metadata("design:type", String)
], User.prototype, "bankCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'varchar' }),
    __metadata("design:type", String)
], User.prototype, "accountNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'varchar' }),
    __metadata("design:type", String)
], User.prototype, "accountName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "totalTasksPosted", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "totalTasksDone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    __metadata("design:type", Number)
], User.prototype, "avgRatingAsTasker", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    __metadata("design:type", Number)
], User.prototype, "avgRatingAsPoster", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "lastLoginAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('RefreshToken', 'user'),
    __metadata("design:type", Object)
], User.prototype, "refreshTokens", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('Task', 'poster'),
    __metadata("design:type", Object)
], User.prototype, "postedTasks", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('Task', 'tasker'),
    __metadata("design:type", Object)
], User.prototype, "assignedTasks", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('Bid', 'tasker'),
    __metadata("design:type", Object)
], User.prototype, "bids", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('EscrowAccount', 'poster'),
    __metadata("design:type", Object)
], User.prototype, "escrowsAsPoster", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('EscrowAccount', 'tasker'),
    __metadata("design:type", Object)
], User.prototype, "escrowsAsTasker", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('Transaction', 'user'),
    __metadata("design:type", Object)
], User.prototype, "transactions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('Payout', 'tasker'),
    __metadata("design:type", Object)
], User.prototype, "payouts", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('Dispute', 'filedBy'),
    __metadata("design:type", Object)
], User.prototype, "disputesFiledBy", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('Rating', 'rater'),
    __metadata("design:type", Object)
], User.prototype, "ratingsGiven", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('Rating', 'ratee'),
    __metadata("design:type", Object)
], User.prototype, "ratingsReceived", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('Message', 'sender'),
    __metadata("design:type", Object)
], User.prototype, "sentMessages", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('Notification', 'user'),
    __metadata("design:type", Object)
], User.prototype, "notifications", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('users')
], User);
//# sourceMappingURL=User.entity.js.map