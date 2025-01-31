import express from 'express';

import { protect } from '../Controllers/authController.js';
import { DeleteUser, UpdtaePassword, getAllusers, updateDetails} from '../Controllers/userController.js';
const router=express.Router();
router.route('/updatePassword').patch(protect,UpdtaePassword);
router.route('/updateMe').patch(protect,updateDetails);
router.route('/deleteMe').delete(protect,DeleteUser);
router.route('/getallusers').get(getAllusers);


export default router;