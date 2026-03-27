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
exports.authMiddleware = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const errors_1 = require("../errors/errors");
const root_1 = require("../errors/root");
const config_1 = require("../config");
const userService_1 = require("../services/userService");
const authService = new userService_1.UserService();
const authMiddleware = async (req, res, next) => {
    try {
        const token = (req.cookies && req.cookies.accessToken) ||
            (req.headers.authorization?.startsWith('Bearer ')
                ? req.headers.authorization.split(' ')[1]
                : undefined);
        if (!token) {
            throw new errors_1.UnauthorizedError('Missing authorization token', root_1.ErrorCode.UNAUTHORIZED);
        }
        let decoded;
        try {
            decoded = jwt.verify(token, config_1.config.JWT_ACCESS_SECRET);
        }
        catch {
            throw new errors_1.UnauthorizedError('Invalid or expired token', root_1.ErrorCode.UNAUTHORIZED);
        }
        if (!decoded?.id) {
            throw new errors_1.UnauthorizedError('Invalid token payload', root_1.ErrorCode.UNAUTHORIZED);
        }
        const user = await authService.findById(decoded.id);
        if (!user) {
            throw new errors_1.UnauthorizedError('User not found', root_1.ErrorCode.NOT_FOUND);
        }
        req.user = {
            id: user.id,
            email: user.email,
            role: user.role,
        };
        next();
    }
    catch (err) {
        next(err);
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=authMiddleware.js.map