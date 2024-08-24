import express from 'express';
import stripe from 'stripe';
import dotenv from 'dotenv';
import Order from "../Schema/orderSchema.js";
import mongoose from 'mongoose';

dotenv.config();

const router = express.Router();
const stripeKey = stripe(process.env.STRIPE_SECRET_KEY);
let endpointSecret;
endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
console.log(endpointSecret);
  // Webhook route
  router.post('/webhooks', express.raw({ type: 'application/json' }), async (req, res) => {
    console.log('Webhook received');
    const sig = req.headers['stripe-signature'];
    let data;
    let eventType;
    if(endpointSecret){
        console.log("in if");
        let event;
        try {
          event = stripeKey.webhooks.constructEvent(req.body, sig, endpointSecret);
          data = event.data.object;
          eventType = event.type;
        } catch (err) {
          res.status(400).send(`Webhook Error: ${err.message}`);
          return;
        }
    }else{
        try {
            data = req.body.data.object;
            eventType = req.body.type;
        } catch (error) {
            res.status(400).send(`Webhook Error: ${err.message}`);
          return;
        }
       
    }

    console.log(`Received event type: ${eventType}`);
  // Handle the event
  if (eventType === 'checkout.session.completed') {
    const session = data;
    try {
        // Retrieve customer information
        const customer = await stripeKey.customers.retrieve(session.customer);
        // Create a new order based on the session and customer information
        let products;
            try {
                products = JSON.parse(customer.metadata.lastProduct);
            } catch (err) {
                console.error('Error parsing product metadata:', err.message);
                res.status(500).send('Internal Server Error');
                return;
            }

            if (!Array.isArray(products)) {
                console.error('Product metadata is not an array:', products);
                res.status(500).send('Internal Server Error');
                return;
            }

            // Convert shipping amount to a number
            const shippingAmount = isNaN(session.total_details.amount_shipping / 100) ? 0 : session.total_details.amount_shipping / 100;

        const order = new Order({
            user: customer.metadata.userId,
            sellerId:products.map(p=>p.sellerId),// Assuming the customer ID is linked to the user in your database
            items: products.map((p) => ({
                product:new mongoose.Types.ObjectId(p._id), // Convert product ID to ObjectId
                quantity: p.quantity,
                price: p.price,
                image:p.image
            })),
            shippingAddress: {
                name: session.shipping_details.name,
                addressLine1: session.shipping_details.address.line1,
                addressLine2: session.shipping_details.address.line2 || '',
                city: session.shipping_details.address.city,
                state: session.shipping_details.address.state,
                postalCode: session.shipping_details.address.postal_code,
                country: session.shipping_details.address.country,
                phone:session.customer_details.phone,
                email:session.customer_details.email,
                shipping_amount:shippingAmount,

            },
            payment: {
                method: 'stripe',
                stripe: {
                    paymentIntentId: session.payment_intent,
                    chargeId: session.id,
                    receiptUrl: session.receipt_url
                },
                amount: session.amount_total / 100 // Convert amount from cents to dollars
            },
            paymentStatus: 'paid',
            status: 'processing'
        });

        await order.save();
        console.log(`Order saved with ID: ${order._id}`);
    } catch (err) {
        console.error(`Error processing order: ${err.message}`);
        res.status(500).send('Internal Server Error');
        return;
    }
} else {
    console.log(`Unhandled event type: ${eventType}`);
}
  // Return a 200 response to acknowledge receipt of the event
  res.send();
  })

export default router;