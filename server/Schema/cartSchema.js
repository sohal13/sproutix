import mongoose from 'mongoose';

const CartItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image:[{type:String}],
    quantity: { type: Number, required: true, min: 1 },
    subtotal: { type: Number, required: true },
});

const CartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [CartItemSchema],
    totalAmount: { type: Number, required: true, default: 0 },
    discount: { type: Number, default: 0 },
    finalAmount: { type: Number, required: true, default: 0 },
}, { timestamps: true });

CartSchema.methods.calculateTotal = function() {
    this.totalAmount = this.items.reduce((acc, item) => acc + item.subtotal, 0);
    this.finalAmount = this.totalAmount - this.discount;
};

const Cart =  mongoose.model('Cart', CartSchema);

export default Cart;
