"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const bcrypt = __importStar(require("bcryptjs"));
const jwt = __importStar(require("jsonwebtoken"));
const date_fns_1 = require("date-fns");
const data_source_1 = require("../connection/data-source");
const config_1 = require("../config");
const service_1 = require("./service");
const errors_1 = require("../errors/errors");
const User_entity_1 = require("../entities/User.entity");
const RefreshToken_entity_1 = require("../entities/RefreshToken.entity");
class UserService extends service_1.BaseService {
    constructor() {
        super(...arguments);
        // Keep legacy alias used by existing authMiddleware
        this.generateJWT = (payload, expiresIn = '15m') => {
            return jwt.sign(payload, config_1.config.JWT_ACCESS_SECRET, { expiresIn });
        };
        this.verifyToken = (token, isRefresh = false) => {
            try {
                const secret = isRefresh ? config_1.config.JWT_REFRESH_SECRET : config_1.config.JWT_ACCESS_SECRET;
                return jwt.verify(token, secret);
            }
            catch {
                throw new errors_1.BadRequestException('Invalid or expired token');
            }
        };
    }
    initRepository() {
        return (0, data_source_1.getRepository)(User_entity_1.User);
    }
    get refreshTokenRepo() {
        return data_source_1.AppDataSource.getRepository(RefreshToken_entity_1.RefreshToken);
    }
    // ─── JWT helpers ─────────────────────────────────────────────────────────
    generateAccessToken(payload) {
        return jwt.sign(payload, config_1.config.JWT_ACCESS_SECRET, {
            expiresIn: config_1.config.JWT_ACCESS_EXPIRES_IN,
        });
    }
    generateRefreshToken(payload) {
        return jwt.sign(payload, config_1.config.JWT_REFRESH_SECRET, {
            expiresIn: config_1.config.JWT_REFRESH_EXPIRES_IN,
        });
    }
    verifyAccessToken(token) {
        try {
            return jwt.verify(token, config_1.config.JWT_ACCESS_SECRET);
        }
        catch {
            throw new errors_1.UnauthorizedError('Invalid or expired access token');
        }
    }
    verifyRefreshToken(token) {
        try {
            return jwt.verify(token, config_1.config.JWT_REFRESH_SECRET);
        }
        catch {
            throw new errors_1.UnauthorizedError('Invalid or expired refresh token');
        }
    }
    // ─── Password helpers ─────────────────────────────────────────────────────
    hashPassword(password) {
        return bcrypt.hashSync(password, 10);
    }
    comparePassword(plain, hash) {
        return bcrypt.compareSync(plain, hash);
    }
    // ─── DTO mapper ──────────────────────────────────────────────────────────
    toDTO(user) {
        return {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
            role: user.role,
            kycLevel: user.kycLevel,
            isPhoneVerified: user.isPhoneVerified,
            isEmailVerified: user.isEmailVerified,
            avatarUrl: user.avatarUrl,
            bio: user.bio,
            lastLoginAt: user.lastLoginAt,
            createdAt: user.createdAt,
        };
    }
    // ─── Auth operations ──────────────────────────────────────────────────────
    async registerUser(data) {
        const repo = this.getRepository();
        const existing = await repo.findOne({
            where: [{ email: data.email }, { phone: data.phone }],
        });
        if (existing) {
            if (existing.email === data.email) {
                throw new errors_1.BadRequestException('An account with this email already exists');
            }
            throw new errors_1.BadRequestException('An account with this phone number already exists');
        }
        const user = repo.create({
            fullName: data.fullName,
            email: data.email.toLowerCase(),
            phone: data.phone,
            password: this.hashPassword(data.password),
            role: data.role,
        });
        await repo.save(user);
        const payload = { id: user.id, email: user.email, role: user.role };
        const accessToken = this.generateAccessToken(payload);
        const refreshTokenValue = this.generateRefreshToken(payload);
        await this.storeRefreshToken(user.id, refreshTokenValue);
        return { user: this.toDTO(user), accessToken, refreshToken: refreshTokenValue };
    }
    async loginUser(email, password) {
        const repo = this.getRepository();
        const user = await repo.findOne({ where: { email: email.toLowerCase() } });
        if (!user || !this.comparePassword(password, user.password)) {
            throw new errors_1.UnauthorizedError('Invalid email or password');
        }
        // Update last login
        await repo.update(user.id, { lastLoginAt: new Date() });
        user.lastLoginAt = new Date();
        const payload = { id: user.id, email: user.email, role: user.role };
        const accessToken = this.generateAccessToken(payload);
        const refreshTokenValue = this.generateRefreshToken(payload);
        await this.storeRefreshToken(user.id, refreshTokenValue);
        return { user: this.toDTO(user), accessToken, refreshToken: refreshTokenValue };
    }
    async refreshAccessToken(tokenValue) {
        const decoded = this.verifyRefreshToken(tokenValue);
        const storedToken = await this.refreshTokenRepo.findOne({
            where: { token: tokenValue },
        });
        if (!storedToken) {
            throw new errors_1.UnauthorizedError('Refresh token not found or already revoked');
        }
        if (storedToken.expiresAt < new Date()) {
            await this.refreshTokenRepo.delete({ token: tokenValue });
            throw new errors_1.UnauthorizedError('Refresh token expired, please login again');
        }
        const user = await this.getRepository().findOne({ where: { id: decoded.id } });
        if (!user) {
            throw new errors_1.UnauthorizedError('User not found');
        }
        // Rotate refresh token
        await this.refreshTokenRepo.delete({ token: tokenValue });
        const payload = { id: user.id, email: user.email, role: user.role };
        const newAccessToken = this.generateAccessToken(payload);
        const newRefreshToken = this.generateRefreshToken(payload);
        await this.storeRefreshToken(user.id, newRefreshToken);
        return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    }
    async logout(tokenValue) {
        if (tokenValue) {
            await this.refreshTokenRepo.delete({ token: tokenValue });
        }
    }
    async markPhoneVerified(userId) {
        await this.getRepository().update(userId, { isPhoneVerified: true });
    }
    async getUser(userId) {
        const user = await this.getRepository().findOne({ where: { id: userId } });
        if (!user)
            throw new errors_1.NotFoundException('User not found');
        return user;
    }
    async updateUser(userId, data) {
        await this.getRepository().update(userId, data);
        const user = await this.getUser(userId);
        return this.toDTO(user);
    }
    // ─── Internal helpers ─────────────────────────────────────────────────────
    async storeRefreshToken(userId, tokenValue) {
        const expiresAt = (0, date_fns_1.addDays)(new Date(), 30);
        const rt = this.refreshTokenRepo.create({ userId, token: tokenValue, expiresAt });
        await this.refreshTokenRepo.save(rt);
    }
}
exports.UserService = UserService;
//# sourceMappingURL=userService.js.map