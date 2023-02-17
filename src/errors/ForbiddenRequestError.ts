import { BaseError } from "./BaseError";

export class ForbiddenRequestError extends BaseError {
    constructor(
        message: string = "Unauthenticated user"
    ) {
        super(403, message)
    }
}