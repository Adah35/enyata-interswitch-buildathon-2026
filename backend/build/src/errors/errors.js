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
exports.ForbiddenException = exports.NotFoundException = exports.BadRequestException = exports.UnauthorizedError = void 0;
const root_1 = __importStar(require("./root"));
class UnauthorizedError extends root_1.default {
    constructor(message = "Unauthorized", errorCode = 401) {
        super(message, errorCode, 401, null);
        this.name = "UnauthorizedError";
        Object.setPrototypeOf(this, UnauthorizedError.prototype);
    }
}
exports.UnauthorizedError = UnauthorizedError;
class BadRequestException extends root_1.default {
    constructor(message, errorCode = root_1.ErrorCode.BAD_REQUEST) {
        super(message, errorCode, 400, null);
        this.name = "BadRequestException";
        Object.setPrototypeOf(this, BadRequestException.prototype);
    }
}
exports.BadRequestException = BadRequestException;
class NotFoundException extends root_1.default {
    constructor(message, errorCode = root_1.ErrorCode.NOT_FOUND) {
        super(message, errorCode, 404, null);
        this.name = "NotFoundException";
        Object.setPrototypeOf(this, NotFoundException.prototype);
    }
}
exports.NotFoundException = NotFoundException;
class ForbiddenException extends root_1.default {
    constructor(message, errorCode = root_1.ErrorCode.FORBIDDEN) {
        super(message, errorCode, 403, null);
        this.name = "ForbiddenException";
        Object.setPrototypeOf(this, ForbiddenException.prototype);
    }
}
exports.ForbiddenException = ForbiddenException;
//# sourceMappingURL=errors.js.map