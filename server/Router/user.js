import express from "express"
import {verifyAdmin, verifySeller, verifyUser} from '../utils/verifyUser.js'
import { applyForSeller, approveSeller, getApplicationStatus, getSellerAdditionalInfo, getUserProfile, storeUserActivity, updateSellerAdditionalInfo, updateUserProfile } from "../RoutControler/userControler.js";
const router = express.Router();

//User
router.get('/profile', verifyUser, getUserProfile);
//update
router.put('/profile/update/:id', verifyUser, updateUserProfile);
//track user activity
router.post('/track-activity', verifyUser, storeUserActivity);

//Become Seller
router.post('/becomeseller/:id', verifyUser, applyForSeller);
router.get('/application-status',verifyUser,getApplicationStatus);
router.get('/seller-info/:id', verifySeller,getSellerAdditionalInfo);
// Update additional information
router.post('/additional-info/:id',verifyUser,verifySeller,updateSellerAdditionalInfo);


//admin
router.put('/approve-seller/:id', verifyAdmin, approveSeller);

export default router