import { customErrorClass } from "../errors/customError.js"
import { signInValidate } from "../validation/validate.js"
export const signInValidateMiddleware=(req,_,next)=>{
    const {error,value}=signInValidate.validate(req.body)
    try {
        if(error) throw error
        req.filteredValue=value
        next()
    } catch (error) {
        return next(new customErrorClass(error.message,400))
    }
}
export const signUpValidateMiddleware=(req,_,next)=>{
    console.log(req.file);
    console.log(req.body);
    const {error,value}=signUpValidate.validate({...req.body,avatar:req.file.filename})
    try {
        if(error) throw error
        req.filteredValue=value
        next()
    } catch (error) {
        return next(new customErrorClass(error.message,400))
    }
}
