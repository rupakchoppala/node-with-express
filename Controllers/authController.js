import User from "../Models/userModel.js";
import asyncErrorHandler from '../utils/ayncErrohandleer.js';
import jwt from 'jsonwebtoken';
import CustomError from "../utils/custom error.js";
import util from 'util';
import { sendMail } from "../utils/email.js";
import ms from 'ms';
import crypto from "crypto";
const signToken=(id)=>{
     return jwt.sign({id},process.env.SECRET_STR,{expiresIn:process.env.LOGIN_EXPIRES})
}
export const CreateUserResponse=(user,statuscode,res)=>{
    const token=signToken(user._id)
    const options={
        maxAge:ms(process.env.LOGIN_EXPIRES),
        //secure:true,
        httpOnly:true

    }
    if(process.env.NODE_ENV === 'production'){
        options.secure=true;
    }
    res.cookie('jwt',token,options)
    user.password=undefined;
    
    res.status(statuscode).json({
     status:"Success",
     data:{
         user
     }
    })

}
export const signup=asyncErrorHandler(async(req,res,next)=>{
   const newUser=await User.create(req.body);
   CreateUserResponse(newUser,201,res);
   
})
export const login=asyncErrorHandler(async(req,res,next)=>{
    const{email,password}=req.body;
    //const email=req.body.email;
    if(!email || !password){
        const err=new CustomError('plaesw provide the email id and the password',404);
        return next(err);

    }
    const user=await User.findOne({email}).select('+password');
   // const isMatch= await user.comparePasswordInDb(password,user.password);
    if(!user||!(await user.comparePasswordInDb(password,user.password))){
        const err=new CustomError("Invalid email or password",400);
        return next(err);
    }
    CreateUserResponse(user,201,res)
});
export const protect =asyncErrorHandler(async(req,res,next)=>{
    //1.read token and check if it exists
//     let token = null;

// // Extract from Authorization header
// if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
//     token = req.headers.authorization.split(" ")[1];
// }

// // Extract from cookies if available
// if (!token && req.cookies.jwt) {
//     token = req.cookies.jwt;
// }

// console.log("Extracted Token:", token);
const token=req.cookies.jwt;

if (!token) {
    return next(new CustomError("You are not logged in!", 401));
}

    //console.log("Authorization Header:", req.headers.authorization);
//2.validate the token
const decodedToken=jwt.verify(token,process.env.SECRET_STR);

//3.if the user exists
 const user=await User.findById(decodedToken.id);
 if(!user){
    const err=new CustomError("The user with the token is not existed ",401);
    next(err);
 }

//4.if the user changed the pasword after the token was issued
 if(await user.isPasswordChanged(decodedToken.iat)){
    const err=new CustomError("pswd changed recently login again",401);
    return next(err);

 }
//5.allow user to access route
req.user=user;
next();
})
export const restrict=(role)=>{
    return (req,res,next)=>{
        if(req.user.role !== role){
            const err= new CustomError("you dont have permission to perfirm to this action",403);
            next(err);
        }
        next();
    }
}
//for multiple roles
// export const restrict=(...role)=>{
//     return (req,res,next)=>{
//         if(!role.includes(req.user.role)){
//             const err= new CustomError("you dont have permission to perfirm to this action",403);
//             next(err);
//         }
//         next();
//     }
// }
export const forgetPassWord= async(req,res,next)=>{
    //1.get user based on posted emial
    const user=await User.findOne({email:req.body.email});
    if(!user){
        const err=new CustomError('we could not find the user with the given mail',404);
        next(err)
    }
    //2.Generate a random reset token
    const resetToken=user.createResetPasswordToken();
    await user.save({validateBeforeSave:false});
    //3.send the token back to user email
    const resetUrl=`${req.protocol}://${req.get('host')}/v1/users/resetPassword/${resetToken}`;
    const message=`we received an reset password request.please use below link to reset the password\n\n${resetUrl}
    \n\nThis reset password link only valid for 10 minutes `;
    console.log(resetUrl,message);
   try{
    await sendMail({
        email:user.email,
        subject:'password change request received',
        message:message

    })
    res.status(200).json({
        status:"Success",
        message:"password link send to user email"
    })
}
catch(err){
    user.passwordResetToken=undefined;
    user.passwordResetTokenExpires=undefined;
    await user.save({validateBeforeSave:false});
    return next(new CustomError("There was an error occurs at sending pswd reset mail try agin later",500))
}
}
export const passwordReset=asyncErrorHandler(async(req,res,next)=>{
    const token=crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user=await User.findOne({passwordResetToken:token,passwordResetTokenExpires:{$gt:Date.now()}});
     if(!user){
        const err=new CustomError("token is invalid or expired",400);
        next(err);
     }
      user.password=req.body.password;
      user.Confirmpassword=req.body.Confirmpassword;
      user.passwordResetToken=undefined;
      user.passwordResetTokenExpires=undefined;
      user.passwordChangedAt=Date.now();
      user.save();
      //login the user
      CreateUserResponse(user,201,res)
});