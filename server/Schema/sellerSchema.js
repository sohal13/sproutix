import mongoose from 'mongoose';

const sellerSchema = new mongoose.Schema({
  sellerDetail:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sellerapplication',
    required: true
  }  ,
   // Additional information
  bankAccount: {
    accountHolder: {
      type: String,
      required: true
    },
    accountNumber: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return /\d{9,18}/.test(v); // Example validation for bank account number
        },
        message: props => `${props.value} is not a valid bank account number!`
      }
    },
    bankName: {
      type: String,
      required: true
    },
    ifscCode: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(v); // Example validation for IFSC code
        },
        message: props => `${props.value} is not a valid IFSC code!`
      }
    },
  },
  
  // Shipping details
  shippingMethods: [{
    methodName: {
      type: String,
      required: true
    },
    cost: {
      type: Number,
      required: true
    },
    deliveryTime: {
      type: String,
      required: true
    }
  }],
  
  shippingPolicies: {
    handlingTime: {
      type: String,
      required: true
    },
    shippingCosts: {
      type: String,
      required: true
    },
    deliveryAreas: {
      type: [String],
      required: true
    },
    returnPolicy: {
      type: String,
      required: true
    }
  },
  
  packaging: {
    type: String,
    required: true
  },
  
  notifications: {
    type: String
  }
}, {
  timestamps: true
});

const Seller =  mongoose.model('Seller', sellerSchema);

export default Seller;
