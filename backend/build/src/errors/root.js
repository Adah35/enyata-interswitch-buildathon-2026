"use strict";
// message
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorCode = void 0;
class HttpException extends Error {
    constructor(message, errorCode, status, errors = null) {
        super(message); // Call the base Error class constructor
        this.errorCode = errorCode;
        this.status = status;
        this.errors = errors;
    }
}
exports.default = HttpException;
var ErrorCode;
(function (ErrorCode) {
    ErrorCode[ErrorCode["OK"] = 200] = "OK";
    ErrorCode[ErrorCode["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    ErrorCode[ErrorCode["NOT_FOUND"] = 404] = "NOT_FOUND";
    ErrorCode[ErrorCode["INTERNAL_SERVER"] = 500] = "INTERNAL_SERVER";
    ErrorCode[ErrorCode["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    ErrorCode[ErrorCode["FORBIDDEN"] = 403] = "FORBIDDEN";
    ErrorCode[ErrorCode["EXISTS"] = 409] = "EXISTS";
})(ErrorCode || (exports.ErrorCode = ErrorCode = {}));
//# sourceMappingURL=root.js.map