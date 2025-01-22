class CustomError extends Error{
    constructor(message,statusCode){
        super(message);
        this.statusCode=statusCode;
        this.status=statusCode >= 400 && statusCode < 500 ? 'fail' :"error";
        this.isOperatonal=true;
        this.error=this.error;
        Error.captureStackTrace(this,this.constructor);
}}
export default CustomError;
