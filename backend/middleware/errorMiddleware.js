const notFount = (req,res,next) => {
    const error = new Error(`Not Fount - ${req.originalUrl}`)
    res.status(404);
    next(error);
}

const errorHAndler = (err,req,res,next) =>{
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    if (err.name === 'CastErro' && err.kind === 'ObjectId'){
        statusCode = 404;
        message = 'REsource not fount'
    }

    res.status(statusCode).json({
        message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    })
}

export {notFount, errorHAndler}