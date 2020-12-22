

// error util class inherited from the inbuilt error class in the node environment

class AppError extends Error{
    constructor(message, statusCode){
        super(message)
        this.statusCode= statusCode;
        this.status= `${statusCode}`.startsWith('4') ? 'fail': 'error';
        this.isOperational= true;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports= AppError;