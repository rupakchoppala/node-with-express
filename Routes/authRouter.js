import express from 'express';
import {signup} from "./../Controllers/authController.js";
const router=express.Router();
router.route('/signup').post(signup);
export default router;