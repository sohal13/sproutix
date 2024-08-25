import express from "express";
import dotenv from "dotenv"
import mongoose from "mongoose";
import authRouter from './Router/auth.js'
import userRouter from './Router/user.js'
import productRoutes from './Router/product.js'
import cartRouter from './Router/cart.js'
import orderRouter from './Router/order.js'
import stripewebhookRouter from './Router/stripewebhook.js'; 
import paymentRouter from './Router/payment.js'
import cookieParser from "cookie-parser";
import cors from 'cors'
import compression from "compression";
const app = express();
dotenv.config();
//data base connection 
const connectToDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Database is Connected Succesfully");
    } catch (error) {
        console.log("DB CONNECTION ERROR :", error);
    }
}

// Configure CORS for production
const allowedOrigins = [
  'https://sproutix-sohal-rahamans-projects.vercel.app',
  'http://localhost:5173', // Optional: Include your local development URL
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],

}));

app.use('/stripe', stripewebhookRouter);
//midlleware
app.use(cookieParser());
app.use(express.json());

// Use compression middleware
app.use(compression({ 
  level: 6, // Compression level (default is 6)
  threshold: 0, // Compress all sizes of files (0 threshold)
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ success: false, message: err.message });
});
app.use('/api/auth',authRouter)
app.use('/api/cart',cartRouter)
app.use('/api/product',productRoutes)
app.use('/api/user',userRouter)
app.use('/api/payment',paymentRouter)
app.use('/api/order',orderRouter)


//error handler middleware
app.use((err,req,res,next)=>{
    const errStatus = err.status || 500;
    const errMessage = err.message || "error in handler!";
    return res.status(errStatus).send({
        success:false,
        message:errMessage,
        stack:err.stack
    })
})

const port = process.env.PORT || 4444; 

app.listen(port, () => {
    connectToDB();
    console.log("Server is Working at 4444");
})