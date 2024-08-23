import express from "express";
import { verifySeller, verifyUser } from "../utils/verifyUser.js";
import { cancelOrder, getMyOrders, getMyOrdersDetails, getSellerOrders } from "../RoutControler/orderControler.js";

const router = express.Router();

router.get('/myorders/:id',verifyUser,getMyOrders);

router.get('/orderdetail/:id',verifyUser,getMyOrdersDetails);

router.delete('/cancelorder/:id', verifyUser, cancelOrder); // Cancel an order

//router.get('/searchorders', verifyUser, searchOrders); // Search for orders based on criteria (e.g., date, status)

//router.get('/trackorder/:id', verifyUser, trackOrderStatus); // Track the status of an order

router.get('/seller/orders', verifySeller, getSellerOrders); // Middleware to verify seller identity







export default router;