import jwt from 'jsonwebtoken';
import { createError } from './error.js';

// Function to verify token and attach user to request object
export const verifyToken = (req, res, next) => {
    const token = req.cookies.plantebuy_token || req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
        return next(createError(401, "Authentication token is missing or invalid"));
    }
    
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) {
            return next(createError(403, "Token is not valid"));
        }
        
        req.user = user;
        next();
    });
};

// Middleware to verify if the user is authenticated
export const verifyUser = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user?.id) {
            next();
        } else {
            return next(createError(401, "Unauthorized access"));
        }
    });
};

// Middleware to verify if the user is a seller
export const verifySeller = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user?.seller) {
            next();
        } else {
            return next(createError(403, "Forbidden: Only sellers are allowed"));
        }
    });
};

// Middleware to verify if the user is an admin
export const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user?.admin) {
            next();
        } else {
            return next(createError(403, "Forbidden: Only admins are allowed"));
        }
    });
};
