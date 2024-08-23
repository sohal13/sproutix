import Cart from '../Schema/cartSchema.js';
import Product from '../Schema/productSchema.js';
import { createError } from '../utils/error.js';

export const addToCart = async (req, res) => {
    const { productId, quantity } = req.body;

    try {
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        const userCart = await Cart.findOne({ userId: req.user.id });
        if (!userCart) {
            const newCart = new Cart({
                userId: req.user.id,
                items: [{
                    productId: product._id,
                    name: product.name,
                    price: product.price,
                    quantity,
                    image:product.image[0],
                    subtotal: product.price * quantity,
                }],
                totalAmount: product.price * quantity,
                finalAmount: product.price * quantity,
            });
            await newCart.save();
            return res.status(201).json(newCart);
        }

        const existingItemIndex = userCart.items.findIndex(item => item.productId.toString() === productId);
        if (existingItemIndex > -1) {
            const existingItem = userCart.items[existingItemIndex];
            existingItem.quantity += quantity;
            existingItem.subtotal = existingItem.price * existingItem.quantity;
        } else {
            userCart.items.push({
                productId: product._id,
                name: product.name,
                price: product.price,
                quantity,
                image:product.image[0],
                subtotal: product.price * quantity,
            });
        }

        userCart.calculateTotal();
        await userCart.save();

        res.status(200).json(userCart);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getMyCartData = async (req, res,next) => {

    try {
        const cartdata = await Cart.findOne({userId:req.user.id})
        if (!cartdata) return next(createError(404,'Product not found' ));
        res.status(200).json(cartdata);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}


export const updateCart = async (req, res) => {
    const { productId, quantity } = req.body;

    try {
        const userCart = await Cart.findOne({ userId: req.user.id });

        if (!userCart) return res.status(404).json({ message: 'Cart not found' });

        const itemIndex = userCart.items.findIndex(item => item.productId.toString() === productId);

        if (itemIndex > -1) {
            const item = userCart.items[itemIndex];
            if (quantity > 0) {
                item.quantity = quantity;
                item.subtotal = item.price * quantity;
            } else {
                // Remove item if quantity is set to zero
                userCart.items.splice(itemIndex, 1);
            }
        } else {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        userCart.calculateTotal();
        await userCart.save();

        res.status(200).json(userCart);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const removeFromCart = async (req, res,next) => {
    const  {productId}  = req.body;
    try {
        const userCart = await Cart.findOne({ userId: req.user.id });

        if (!userCart) return res.status(404).json({ message: 'Cart not found' });

        const itemIndex = userCart.items.findIndex(item => item.productId.toString() === productId);

        if (itemIndex > -1) {
            userCart.items.splice(itemIndex, 1);
            userCart.calculateTotal();
            await userCart.save();
            res.status(200).json(userCart);
        } else {
            return res.status(404).json({ message: 'Item not found in cart' });
        }
    } catch (error) {
       next(error)
    }
};

export const clearCart = async (req, res) => {
    try {
        const userCart = await Cart.findOne({ userId: req.user.id });

        if (!userCart) return res.status(404).json({ message: 'Cart not found' });

        userCart.items = [];
        userCart.calculateTotal();
        await userCart.save();

        res.status(200).json({ message: 'Cart cleared', cart: userCart });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const applyCoupon = async (req, res) => {
    const { couponCode } = req.body;

    try {
        const userCart = await Cart.findOne({ userId: req.user.id });

        if (!userCart) return res.status(404).json({ message: 'Cart not found' });

        // Example coupon logic, assuming you have a predefined set of coupons
        const validCoupons = {
            'DISCOUNT10': 10,
            'DISCOUNT20': 20,
        };

        const discount = validCoupons[couponCode];

        if (discount) {
            userCart.discount = (userCart.totalAmount * discount) / 100;
            userCart.calculateTotal();
            await userCart.save();
            res.status(200).json({ message: 'Coupon applied', cart: userCart });
        } else {
            return res.status(400).json({ message: 'Invalid coupon code' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const removeCoupon = async (req, res) => {
    try {
        const userCart = await Cart.findOne({ userId: req.user.id });

        if (!userCart) return res.status(404).json({ message: 'Cart not found' });

        userCart.discount = 0;
        userCart.calculateTotal();
        await userCart.save();

        res.status(200).json({ message: 'Coupon removed', cart: userCart });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

