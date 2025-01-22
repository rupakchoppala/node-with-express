import CustomError from "../utils/custom error.js";

const devErrors=(res,error)=>{
    res.status(error.statusCode).json({
        status:error.statusCode,
        success:error.status,
        stackTrace:error.stack,
        message:error.message,
        error:error

    })
}
const castErrorHandler=(err)=>{
    const msg=`invalid value for ${err.path}: ${err.value} `;
   return  new CustomError(msg,400);

}
const duplicateErrorHandler=(err)=>{
    const name=err.keyValue.title;
    const msg=`There is already a movie with the name ${name}.Please use another name`;
   return  new CustomError(msg,400);

}
const ValidationErrorHandler=(err)=>{
    const errors=Object.values(err.errors).map(val=>val.message);
    const errorMessages=errors.join('. ');
    const msg=`Invalid input Data :${errorMessages}`;
   return  new CustomError(msg,400);

}
const prodErrors=(res,error)=>{
    if(error.isOperatonal){
    res.status(error.statusCode).json({
        status:error.statusCode, 
        message:error.message,
    

    })}
    else{
        res.status(500).json({
            status:'error', 
            message:"somethimg went wron try again later",
        
    
        })}
    }
const GlobalErrorHandle=(error,req,res,next)=>{
    error.statusCode=error.statusCode||500;
    error.status=error.status||'error';
    if(process.env.NODE_ENV === "development"){
        devErrors(res,error);
    }
    else if(process.env.NODE_ENV === "production"){
        //let err={...error};
       // console.log(err);
        if(error.name === 'CastError'){
        error=castErrorHandler(error);
     //   console.log("hjbfhqhag");
        } 
        if(error.code === 11000){
            error=duplicateErrorHandler(error);
         //   console.log("hjbfhqhag");
            }
       if(error.name === "ValidationError"){
                error=ValidationErrorHandler(error);
             //   console.log("hjbfhqhag");
                }

        prodErrors(res,error)
    }
 //  next();
}
export default GlobalErrorHandle;