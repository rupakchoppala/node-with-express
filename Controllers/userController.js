import User from "../Models/userModel.js";
import asyncErrorHandler from '../utils/ayncErrohandleer.js';
//import jwt from 'jsonwebtoken';
import CustomError from "../utils/custom error.js";
//import util from 'util';
//import { sendMail } from "../utils/email.js";
//import crypto from "crypto";
import { CreateUserResponse } from "./authController.js";
const filterReqObj=(obj,...allowedFields)=>{
    const newObj={};
    Object.keys(obj).forEach(prop=>{
        if(allowedFields.includes(prop)){
            newObj[prop]=obj[prop];
        }
           
    })
}
export const getAllusers=asyncErrorHandler(async(req,res,next)=>{
    const users=await User.find();
    res.status(200).json({
        status:"success",
        result:users.length,
        data:{
            users
        }
    })
})
export const UpdtaePassword=asyncErrorHandler(async(req,res,next)=>{
    //1.Get current user details from database
    const user=await User.findById(req.user._id).select('+password');
    console.log(user.password);
    console.log(req.body.currentPassword);
    //2.check if the supllied current update user password with new value
    if(!(await user.comparePasswordInDb(req.body.currentPassword,user.password))){
        return next(new CustomError("current password you provide is wrong",401));
           
    }
    //3.if supplied password is corect update user pswd with new value
    user.password=req.body.password;
    user.Confirmpassword=req.body.Confirmpassword;
    await user.save();
    //4.login the user and send jwt
    CreateUserResponse(user,201,res);

})
export const updateDetails=asyncErrorHandler(async(req,res,next)=>{
    //1.check if requset [password contains password pr confirm password
    if(req.body.password||req.body.Confirmpassword){
        return(new CustomError("you are not suppode to update pasword using this endpoint",401));
    }
    //2.updtae user details
    const filterObj=filterReqObj(req.body,'name','email');
    const user=await User.findByIdAndUpdate(req.user.id,filterObj,{runValidators:true,new:true});
    res.status(201).json({
        status:"success",
        data:user
       })
  //  await user.save()//it suppose to save the all filels but we dont allow this endpoint as like that so finf by id and update
   // await user.save();
}

)
export const DeleteUser=asyncErrorHandler(async(req,res,next)=>{
   const user=await User.findByIdAndUpdate(req.user._id,{active:false});
   res.status(204).json({
    status:"success",
    data:null
   })
})