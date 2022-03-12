import { CustomError } from "./customError"

export class DatabaseConnectionError extends CustomError {
    statusCode = 500
    reason = `Error Connecting to Database`
    constructor(){
        super(`Error Connecting to DB`)
        // Because extending built in class
        Object.setPrototypeOf(this,DatabaseConnectionError.prototype)
    }
    serializeErrors(){
        return [
            {message: this.reason}
        ]
    }
}