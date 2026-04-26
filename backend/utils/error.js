/* Define custom error classes */

/*
    ValidationError
    Used when user input is invalid.
    Example: missing required field, invalid email format, invalid visa title.
*/
export class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = "ValidationError";
        this.statusCode = 422;
    }
}

/*
    AuthError
    Used when authentication fails.
    Example: no token, invalid token, wrong username or password.
*/
export class AuthError extends Error {
    constructor(message) {
        super(message);
        this.name = "AuthError";
        this.statusCode = 401;
    }
}

/*
    ForbiddenError
    Used when the user is logged in but does not have permission.
    Example: employee tries to access an HR-only route.
*/
export class ForbiddenError extends Error {
    constructor(message) {
        super(message);
        this.name = "ForbiddenError";
        this.statusCode = 403;
    }
}

/*
    NotFoundError
    Used when requested data does not exist.
    Example: application, user, document, or visa status record not found.
*/
export class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = "NotFoundError";
        this.statusCode = 404;
    }
}