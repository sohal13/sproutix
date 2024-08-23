import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    scientificName: {
        type: String,
        required: false,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        enum: ['Fruit Plants', 'Vegetable Plants', 'Herbs', 'Flowering Plants', 'Indoor Plants', 'Outdoor Plants', 'Specialty Plants', 'Garden Accessories'],
        required: true,
        trim: true
    },
    image: [{
        type: String,
        required: false
    }],
    videoUrl: { type: String },
    brand: {
        type: String,
        required: false,
        trim: true
    },
    careInstructions: {
        type: String,
        required: false,
        trim: true
    },
    lightRequirement: {
        type: String,
        enum: ['Full Sun', 'Partial Shade', 'Full Shade', 'Bright Indirect Light', 'Low Light'],
        required: false,
        trim: true
    },
    waterRequirement: {
        type: String,
        enum: ['Low', 'Moderate', 'High'],
        required: false,
        trim: true
    },
    soilType: {
        type: String,
        enum: ['Loamy', 'Sandy', 'Clay', 'Peaty', 'Saline', 'Chalky'],
        required: false,
        trim: true
    },
    climate: {
        type: String,
        enum: [
            'Tropical',
            'Subtropical',
            'Temperate',
            'Arid',
            'Cold',
            'Mediterranean',
            'Continental',
            'Subarctic',
            'Polar',
            'Desert',
            'Mountain'
        ],
        required: false,
        trim: true
    },
    ratings: {
        average: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        count: {
            type: Number,
            default: 0,
            min: 0
        }
    },
    featured: {
        type: Boolean,
        default: false
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            rating: {
                type: Number,
                required: true,
                min: 1,
                max: 5
            },
            comment: {
                type: String,
                required: false,
                trim: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    /* relatedProducts: [
         {
             type: mongoose.Schema.Types.ObjectId,
             ref: 'Product'
         }
     ]*/
}, { timestamps: true });

const Product = mongoose.model('Product', ProductSchema);

export default Product;
