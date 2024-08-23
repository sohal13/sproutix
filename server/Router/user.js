import express from "express"
import {verifyAdmin, verifyUser} from '../utils/verifyUser.js'
import { getUserProfile, storeUserActivity, updateUserProfile } from "../RoutControler/userControler.js";
const router = express.Router();

router.get('/profile', verifyUser, getUserProfile);
//update
router.put('/profile/update/:id', verifyUser, updateUserProfile);
//track user activity
router.post('/track-activity', verifyUser, storeUserActivity);

//Become Seller
//router.put('/beseller/:id',verifyUser,beComeSeller)

export default router