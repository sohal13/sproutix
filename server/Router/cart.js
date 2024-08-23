import express from 'express';
import { verifyUser } from '../utils/verifyUser.js';
import { addToCart, applyCoupon, clearCart, getMyCartData, removeCoupon, removeFromCart, updateCart } from '../RoutControler/cartController.js';

const router = express.Router();

router.post('/add', verifyUser, addToCart);
router.get('/get',verifyUser,getMyCartData)
router.put('/update', verifyUser, updateCart);
router.delete('/remove', verifyUser, removeFromCart);
router.delete('/clear', verifyUser, clearCart);
router.post('/apply-coupon', verifyUser, applyCoupon);
router.post('/remove-coupon', verifyUser, removeCoupon);

export default router;
