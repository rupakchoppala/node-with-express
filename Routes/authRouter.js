import express from 'express';
import {signup,login, forgetPassWord,passwordReset,protect} from "./../Controllers/authController.js";
import { UpdtaePassword } from '../Controllers/userController.js';
const router=express.Router();
router.route('/signup').post(signup);
router.route('/login').post(login);
router.route('/forgetpassword').post(forgetPassWord);
router.route('/resetPassword/:token').patch(passwordReset);
router.route('/updatePassword').patch(protect,UpdtaePassword)
export default router;