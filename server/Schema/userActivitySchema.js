import mongoose from 'mongoose';

const userActivitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  action: { type: String, enum: ['view', 'click', 'purchase'], required: true },
  clicks: { type: Number, default: 0 }, 
  views: { type: Number, default: 0 }, 
  purchases: { type: Number, default: 0 }, 
  timestamp: { type: Date, default: Date.now }
});

const UserActivity = mongoose.model('UserActivity', userActivitySchema);

export default UserActivity;
