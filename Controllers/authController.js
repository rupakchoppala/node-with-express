import User from "../Models/userModel.js";
import asyncErrorHandler from '../utils/ayncErrohandleer.js';
export const signup=asyncErrorHandler(async(req,res)=>{
   const newUser=await User.create(req.body);
   res.status(201).json({
    status:"Success",
    data:{
        user:newUser
    }
   })
})