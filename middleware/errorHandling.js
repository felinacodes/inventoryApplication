class CustomError extends Error {
    constructor(message, statusCode, name) {
        super(message || "An error occurred");
        this.statusCode = statusCode || 500;
        this.name = name || "CustomError";
    }
}

class CustomNotFoundError extends CustomError {
    constructor(message) {
        super(message, 404, "NotFoundError");
    }
}

class CustomValidationError extends CustomError {
    constructor(message) {
        super(message || "Validation Error", 400, "ValidationError");
    }
}

class CustomUnauthorizedError extends CustomError {
    constructor(message) {
        super(message || "Unauthorized Error", 401, "UnauthorizedError");
    }
}

class CustomForbiddenError extends CustomError {
    constructor(message) {
        super(message || "Forbidden Error", 403, "ForbiddenError");
    }
}

class CustomConflictError extends CustomError {
    constructor(message) {
        super(message || "ConflictError", 409, "ConflictError");
    }
}

class CustomBadRequestError extends CustomError {
    constructor(message) {
        super(message || "Bad Request", 400, "BadRequestError");
    }
}


module.exports = {
    CustomError, 
    CustomNotFoundError,
    CustomValidationError,
    CustomUnauthorizedError,
    CustomForbiddenError,
    CustomConflictError,
    CustomBadRequestError,
};
