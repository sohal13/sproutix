import express from "express"
import { userLogin, userLogout, userRegister } from "../RoutControler/authControler.js";
import { verifyUser } from "../utils/verifyUser.js";

const router = express.Router();

router.post('/register',userRegister)

router.post('/login',userLogin)

router.post('/logout',verifyUser, userLogout);


export default router