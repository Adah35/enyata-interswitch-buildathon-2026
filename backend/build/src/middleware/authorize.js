"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const errors_1 = require("../errors/errors");
/**
 * Usage: authorize('ADMIN') or authorize('TASKER', 'BOTH')
 * Must be used after authMiddleware.
 */
const authorize = (...roles) => (req, res, next) => {
    const userRole = req.user?.role;
    if (!userRole || !roles.includes(userRole)) {
        return next(new errors_1.ForbiddenException('You do not have permission to access this resource'));
    }
    next();
};
exports.authorize = authorize;
//# sourceMappingURL=authorize.js.map