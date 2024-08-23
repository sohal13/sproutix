// routes/checkout.js
import dotenv from "dotenv"
import express from 'express';
import Order from '../Schema/orderSchema.js';
import stripe from 'stripe';
import { verifyUser } from "../utils/verifyUser.js";
import { createError } from "../utils/error.js";
import mongoose from "mongoose";
dotenv.config();


const router = express.Router();
const stripeKey = stripe(process.env.STRIPE_SECRET_KEY);
let endpointSecret;
endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
router.post('/create-checkout-session', verifyUser, async (req, res,next) => {
    const { items, user } = req.body;
    if (!items || items.length === 0) {
        return next(createError(400,'No items provided'));
    }
    if(user._id !== req.user.id) return next(createError(400,'You Are Not Authorized'));
    const product = items.map(item => item);

    const line_items = items?.map(item => ({                  //line_item ineteligation
        price_data: {
            currency: 'inr',
            product_data: {
                name: item.name,
                images: [item.image],
                metadata: {
                    id: JSON.stringify(product),
                },
            },
            unit_amount: Math.round(item.price*100),
        },
        quantity: Math.floor(item.quantity) || 1, // Default to 1 for direct purchases
    }));

    let customer;
    try {
        const existingCustomers = await stripeKey.customers.list({
            email: user.email, // Assuming you have the user's email
            limit: 1,
        });
    
        if (existingCustomers.data.length > 0) {
            // Use the existing customer
            customer = existingCustomers.data[0];
            
            // Optionally update the customer's metadata with the new product info
            customer = await stripeKey.customers.update(customer.id, {
                metadata: {
                    userId: req.user.id,
                    lastProduct: JSON.stringify(product), // Store the most recent product details
                },
            });
        } else {
            // Create a new customer if none exists
            customer = await stripeKey.customers.create({
                email: user.email, // Assuming you have the user's email
                metadata: {
                    userId: req.user.id,
                    product: JSON.stringify(product), // Store the product details
                },
            });
        }
    } catch (error) {
        return next(error);
    }
    
try {
    const session = await stripeKey.checkout.sessions.create({
        payment_method_types: ['card'],
        phone_number_collection: {
            enabled: true
        },
        shipping_address_collection: {
            allowed_countries: ['IN'],
        },
        shipping_options: [
            {
                shipping_rate_data: {
                    type: 'fixed_amount',
                    fixed_amount: {
                        amount: 0,
                        currency: 'inr',
                    },
                    display_name: 'Free shipping',
                    delivery_estimate: {
                        minimum: {
                            unit: 'business_day',
                            value: 7,
                        },
                        maximum: {
                            unit: 'business_day',
                            value: 14,
                        },
                    },
                },
            },
            {
                shipping_rate_data: {
                    type: 'fixed_amount',
                    fixed_amount: {
                        amount: 15000,
                        currency: 'inr',
                    },
                    display_name: 'Next day air',
                    delivery_estimate: {
                        minimum: {
                            unit: 'business_day',
                            value: 5,
                        },
                        maximum: {
                            unit: 'business_day',
                            value: 7
                        },
                    },
                },
            },
        ],
        customer: customer.id,
        line_items: line_items,
        mode: "payment",
        success_url: `${process.env.CLIENT_URL}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CLIENT_URL}/cart`,
    })

    res.status(200).send({ url: session.url });
} catch (error) {
    console.log(error);
    next(error);
}
});


router.get('/checkout-session/:sessionId', async (req, res,next) => {
    const { sessionId } = req.params;
    try {
      const session = await stripeKey.checkout.sessions.retrieve(sessionId);
      if(!session) return next(createError(404,"No Session Id Found!!"))
      res.json(session);
    } catch (error) {
      console.error('Error retrieving session:', error);
      res.status(500).send('Internal Server Error');
    }
  });

export default router;
