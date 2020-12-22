const AppError = require("../utils/AppError")


// global error handler middleware

//handling invalid database errors like the cast error

const handleCastErrorDb=(err)=>{
    const message= `Invalid ${err.path}, ${err.value}`
    return new AppError(message, 400)
}

const handleDuplicateFieldsDB= (err)=>{
    const value= err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message= `Duplicate field value: ${value}, please use another value`
    return new AppError(message, 400)
}

const handleValidationErrorDB= (err)=>{
    const errors=  Object.values(err.errors).map((error)=> error.message)
    const message= `Invalid Input Data: ${errors.join(', ')}`
    return new AppError(message, 400)
}

const handleJWTErrorDB= ()=>{
    return new AppError(`Invalid Token... Please Log In Again`, 400)
}

const handleJWTExpiredErrorDB= ()=>{
    return new AppError(`Your Token has Expired... Plaese Log In Again`, 401)
}




// errors for development
const sendErrDev=(err, res)=>{
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    })
}

// errors for production
const sendErrProd=(err, res)=>{
    if(err.isOperational){
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })
    }else{
        console.error(`ERROR!!!, ${err}`)
        res.status(err.statusCode).json({
            status: err.status,
            message: `Something went very wrong`
        })
    }
    
}

module.exports= (err, req, res, next)=>{
    err.statusCode= err.statusCode || 500;
    err.status= err.status || 'error'

    if(process.env.NODE_ENV==='development'){
        sendErrDev(err, res)
    }else if(process.env.NODE_ENV==='production'){
        let error={...err}
        if(error.name==='CastError') error= handleCastErrorDb(error)
        if(error.code===11000) error= handleDuplicateFieldsDB(error)
        if(error.name==='ValidationError') error= handleValidationErrorDB(error);
        if(error.name==='JsonWebTokenError') error= handleJWTErrorDB();
        if(error.name==='TokenExpiredError') error= handleJWTExpiredErrorDB();
        sendErrProd(error, res)
    }
}