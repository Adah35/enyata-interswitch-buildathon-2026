// message

export default class HttpException extends Error {
    errorCode: ErrorCode;
    status: number;
    errors: any;
  
    constructor(
      message: string,
      errorCode: ErrorCode,
      status: number,
      errors: any = null
    ) {
      super(message); // Call the base Error class constructor
      this.errorCode = errorCode;
      this.status = status;
      this.errors = errors;
    }
  }
    
  
  export enum ErrorCode {
      OK = 200,
      BAD_REQUEST = 400,
      NOT_FOUND = 404,
      INTERNAL_SERVER = 500,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    EXISTS = 409,
      
      
  }
  
  
  