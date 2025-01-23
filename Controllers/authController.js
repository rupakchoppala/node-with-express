import User from "../Models/userModel.js";
import asyncErrorHandler from '../utils/ayncErrohandleer.js';
import jwt from 'jsonwebtoken';
import CustomError from "../utils/custom error.js";
import util from 'util';
const signToken=(id)=>{
     return jwt.sign({id},process.env.SECRET_STR,{expiresIn:process.env.LOGIN_EXPIRES})
}
export const signup=asyncErrorHandler(async(req,res,next)=>{
   const newUser=await User.create(req.body);
    const token=signToken(newUser._id)
   res.status(201).json({
    status:"Success",
    token:token,
    data:{
        user:newUser
    }
   })
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
    const token=signToken(user._id);
    res.status(200).json({
        status:"success",
        token,
        message:"login successful",
        user
    })
});
export const protect =asyncErrorHandler(async(req,res,next)=>{
    //1.read token and check if it exists
    const token=req.headers.authorization?.split(' ')[1];
    if(!token){
        next(new CustomError("you are not logged in!",401))
    }
    
//2.validate the token
const decodedToken=jwt.verify(token,process.env.SECRET_STR);
console.log(decodedToken);
//3.if the user exists
//4.if the user changed the pasword after the token was issued
//5.allow user to access route
next();
})