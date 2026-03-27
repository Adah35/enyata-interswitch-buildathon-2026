"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const validate = (schema, target = 'body') => (req, res, next) => {
    const result = schema.safeParse(req[target]);
    if (!result.success) {
        const details = {};
        result.error.errors.forEach((e) => {
            details[e.path.join('.')] = e.message;
        });
        return res.status(422).json({
            success: false,
            error: {
                code: 'VALIDATION_ERROR',
                message: 'Validation failed',
                details,
            },
        });
    }
    req[target] = result.data;
    next();
};
exports.validate = validate;
//# sourceMappingURL=validate.js.map