export const errorHandlerMiddleware=(err,req,res,next)=>{
    return res.status(err.status).json({
        message:err.message,
        status:err.status
    })
}