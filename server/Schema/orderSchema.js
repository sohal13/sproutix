import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sellerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  } ,// Seller ID
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      image: {
        type: String,
      },
      price: {
        type: Number,
        required: true
      }
    }
  ],
  shippingAddress: {
    name: {
      type: String,
      required: true
    },
    addressLine1: {
      type: String,
      required: true
    },
    addressLine2: {
      type: String
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    postalCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    phone:{
      type:String,
    },
    email:{
      type: String,
    },
    shipping_amount:{
      type:Number,
    }
  },
  payment: {
    method: {
      type: String,
      enum: ['credit_card', 'debit_card', 'paypal', 'stripe'],
      required: true
    },
    stripe: {
      paymentIntentId: {
        type: String
      },
      chargeId: {
        type: String
      },
      receiptUrl: {
        type: String
      }
    },
    amount: {
      type: Number,
      required: true
    }
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'pailed'],
    default: 'pending'
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'canceled'],
    default: 'pending'
  },
},{timestamps:true});

const Order = mongoose.model('Order', orderSchema);

export default Order;
