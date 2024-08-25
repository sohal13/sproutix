import User from "../Schema/userSchema.js"
import bcrypt from 'bcryptjs'
import { createError } from "../utils/error.js"
import jwt from 'jsonwebtoken'

export const userRegister=async(req,res,next)=>{
    try {
        const phone = req.body.phone;
        const email = req.body.email;
        const isUserExist = await User.findOne({
            $or:[
                {email:email},
                {phone:phone}
            ]
        })
        if(isUserExist){
          return next(createError(404 , "User Alrady Exist!"))
        }
        const salt = bcrypt.genSaltSync(10)
        const hashPassword = bcrypt.hashSync(req.body.password,salt);
        const newUser = new User({
            name:req.body.name,
            email:req.body.email,
            phone:req.body.phone,
            password:hashPassword,
        })
        await newUser.save();
        res.status(201).send({
            message:"You Are Registered Successfully!!",
            user:newUser,
        })
    } catch (error) {
        next(error)
    }
}

export const userLogin=async(req,res,next)=>{
    try {
        const phone=req.body.phone;
        const password = req.body.password;
        const isUser = await User.findOne({phone})
        if(!isUser){
          return next(createError(404 , "User NOt Registered!"))
        }
        const comparePassword = bcrypt.compareSync(password,isUser.password);
        if(!comparePassword){
            return next(createError(404 , "Wrong password"))
        }
        const token = jwt.sign({id:isUser._id,admin:isUser.isAdmin,seller:isUser.isSeller},process.env.JWT_SECRET_KEY,
            { expiresIn: '730d' } )
        isUser.password = undefined;
        res.cookie("plantebuy_token",token,{
            expires:new Date(Date.now() + 258920000000),
            httpOnly:true,
            secure: false, // Adjust for production
            sameSite: 'None',
            path: '/' ,// Ensure accessibility
            maxAge: 1000 * 60 * 60 * 24 * 730, // 2 years
        }).status(200).json({
            message:"You Are Login Successfully!!",
            user:isUser,
            token
        })
    } catch (error) {
        next(error)
    }
}

export const userLogout = (req, res) => {
    res.clearCookie('plantebuy_token', {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    });
    res.status(200).json({ message: "Logged out successfully" });
};
