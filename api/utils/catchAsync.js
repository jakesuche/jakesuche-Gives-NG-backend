

// we are going to catch all our asynchronous codes and errors with this function

module.exports= (fn) =>{
    return(req, res, next)=>{
        fn(req, res, next).catch(next);
    }
}