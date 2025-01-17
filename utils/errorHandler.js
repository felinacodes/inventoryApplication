const {CustomError, 
    CustomNotFoundError,
    CustomValidationError,
    CustomUnauthorizedError,
    CustomForbiddenError,
    CustomConflictError,
    CustomBadRequestError,} = require('../middleware/errorHandling');

    function handleDatabaseError(error, next) {
        console.error('Error retrieving data from database:', error);
    
        if (error.code === 'ECONNREFUSED') {
            return next(new CustomError('Database connection was refused.', 500));
        } else if (error.code === '28P01') {
            return next(new CustomError('Invalid password.', 500));
        } else if (error.code === '3D000') {
            return next(new CustomError('Database not found.', 500));
        } else if (error.code === '23505') {
            return next(new CustomError('Unique constraint violation.', 409));
        }
    
        return next(new CustomError('Failed to retrieve data from the database.', 500));
    }

    function checkDataExistence(...data) {
        const next = data.pop();
        for ( const item of data) {
            if (!item) {
                return next(new CustomNotFoundError('Data not found.'));
            }
        }
    }

    module.exports = {
        handleDatabaseError,
        checkDataExistence,
    };