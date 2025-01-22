import mongoose from "mongoose";
import validator from "validator";
import bcrypt from 'bcrypt';
const userSchema=new mongoose.Schema({
    //name email password confirm password photo
    name:{
        type:String,
        required:[true,"plaes enter your name"]
    },
    email:{
        type:String,
        required:[true,"plaes enter your email"],
        unique:true,
        lowercase:true,
        validate:[validator.isEmail,"please enter a valid email"]
    },
    photo:String,
    password:{
        type:String,
        required:[true,"Please enter your password"],
        minlength:8
    },
    Confirmpassword:{
        type:String,
        required:[true,"Please confirm your password"],
        minlength:8,
        validate:function(val){
           return  val == this.password;
        },message:"password and confrim password not matched"
    },
})
userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        return next()

    }
    this.password=await bcrypt.hash(this.password,12);
    this.Confirmpassword=undefined;
    next();
})
const User=mongoose.model('user',userSchema)
export default  User;