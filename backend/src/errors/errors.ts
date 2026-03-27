import HttpException, { ErrorCode } from "./root";
export class UnauthorizedError extends HttpException {
  constructor(message = "Unauthorized", errorCode: number = 401) {
    super(message, errorCode, 401, null);
    this.name = "UnauthorizedError";

    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

export class BadRequestException extends HttpException {
  constructor(message: string, errorCode: number = ErrorCode.BAD_REQUEST) {
    super(message, errorCode, 400, null);
    this.name = "BadRequestException";
    Object.setPrototypeOf(this, BadRequestException.prototype);
  }
}
export class NotFoundException extends HttpException {
  constructor(message: string, errorCode: number = ErrorCode.NOT_FOUND) {
    super(message, errorCode, 404, null);
    this.name = "NotFoundException";
    Object.setPrototypeOf(this, NotFoundException.prototype);
  }
}
export class ForbiddenException extends HttpException {
  constructor(message: string, errorCode: number = ErrorCode.FORBIDDEN) {
    super(message, errorCode, 403, null);
    this.name = "ForbiddenException";
    Object.setPrototypeOf(this, ForbiddenException.prototype);
  }
}
