import jwt from 'jsonwebtoken'
import { createError } from './error.js';

export const verifyToken = (req,res,next)=>{
    const token = req.cookies.plantebuy_token;
    console.log(token);
    if(!token){
        return next(createError(404,"User Is not Authneticated"))
    }
    jwt.verify(token,process.env.JWT_SECRET_KEY,(err,user)=>{
        if(err) next(createError(404,"Token is Not Valid"));
        req.user = user;
        next();
    })
}

export const verifyUser = (req,res,next)=>{
    verifyToken(req,res,()=>{
    if(req.user.id){
        next();
    }else{
    return next(createError(404,"You not Authneticated"))
    }
})
};

export const verifySeller = (req,res,next)=>{
    verifyToken(req,res,()=>{
    if(req.user.seller){
        next();
    }else{
        console.log(req.user);
    return next(createError(404,"You not Authneticated (only Admin are Allowes)"))
    }
})
}

export const verifyAdmin = (req,res,next)=>{
        verifyToken(req,res,()=>{
        if(req.user.admin){
            next();
        }else{
            console.log(req.user);
        return next(createError(404,"You not Authneticated (only Admin are Allowes)"))
        }
    })
}