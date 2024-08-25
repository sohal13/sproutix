import mongoose from 'mongoose';

const sellerApplicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
},
  // Basic Information
  businessName: {
    type: String,
    required: true
  },
  businessType: {
    type: String,
    enum: ['sole_proprietorship', 'partnership', 'corporation'],
    required: true
  },
  contact: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    }
  },

  // Business Details
  businessAddress: {
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
  },
  website: {
    type: String
  },

  // Legal and Compliance
  businessLicense: {
    type: String // You can replace this with a file reference or URL if uploading files
  },
  taxId: {
    type: String,
  },

  // Status and Verification
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  verificationDocuments: [{
    type: String // For URLs or file references for verification documents
  }],
}, {
    timestamps: true
  });
  
const SellerApplication =  mongoose.model('Sellerapplication', sellerApplicationSchema);
  
export default SellerApplication;
  