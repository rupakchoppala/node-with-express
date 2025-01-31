import mongoose from "mongoose";
import validator from "validator";
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
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
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },
    password:{
        type:String,
        required:[true,"Please enter your password"],
        minlength:8,
        select:false
    },
    Confirmpassword:{
        type:String,
        required:[true,"Please confirm your password"],
        minlength:8,
        validate:function(val){
           return  val == this.password;
        },message:"password and confrim password not matched"
    },
    active:{
        type:Boolean,
        default:true,
        select:false
    },
    passwordChangedAt:Date,
    passwordResetToken:String,
    passwordResetTokenExpires:Date
})
userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        return next()

    }
    this.password=await bcrypt.hash(this.password,12);
    this.Confirmpassword=undefined;
    next();
})
userSchema.pre(/^find/,function(next){
    this.find({active:{$ne:false}})//this keyword will poitn to current query
     next();
})
userSchema.methods.comparePasswordInDb= async function (pswd,pswdDB) {
    return await bcrypt.compare(pswd, pswdDB);  // 'this.password' refers to the password field on the document
 };
 userSchema.methods.isPasswordChanged=async function(JWTTimestamp){
    if(this.passwordChangedAt){
        const pswdChangedTimestamp=parseInt(this.passwordChangedAt.getTime()/1000,10);
      return  JWTTimestamp<pswdChangedTimestamp;
    }
    return false;
 }
 userSchema.methods.createResetPasswordToken= function(){
    const resetToken=crypto.randomBytes(32).toString('hex');
    this.passwordResetToken=crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetTokenExpires=Date.now()+10*60*1000;
    console.log(resetToken,this.passwordResetToken);
    return resetToken;
 }
const User=mongoose.model('user',userSchema)
export default  User;