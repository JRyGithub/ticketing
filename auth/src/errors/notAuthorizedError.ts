import { CustomError } from "./customError";

export class NotAuthorizedError extends CustomError {
    statusCode = 401
    serializeErrors(): { message: string; field?: string | undefined; }[] {
        return [{message: 'Not authorized'}]
    }
    constructor(){
        super('Not authorized')
        Object.setPrototypeOf(this,NotAuthorizedError.prototype)
    }
}