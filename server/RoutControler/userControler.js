
import User from '../Schema/userSchema.js';
import { createError } from '../utils/error.js';
import UserActivity from '../Schema/userActivitySchema.js';

export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const updateUserProfile = async (req, res, next) => {
    try {
      if (req.params.id !== req.user.id) {
        return res.status(403).json({ message: 'Unauthorized action' });
      }
  
      const user = await User.findById(req.user.id);
  
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone || user.phone;
      user.photo = req.body.photo || user.photo;
  
      if (req.body.password) {
        user.password = req.body.password;
      }
  
      const updatedUser = await user.save();
      res.json({
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        photo: updatedUser.photo,
        isSeller: updatedUser.isSeller,
        isAdmin: updatedUser.isAdmin,
      });
    } catch (error) {
      next(error);
    }
  };


export const beComeSeller=async(req,res,next)=>{
    try {
        const requestFrom = req.params.id;
        const user = await User.findById(requestFrom);
        if(!user) return next(createError(404,"User Not Found"));
    } catch (error) {
        next(error)
    }
}

// Store or update user activity in the database
export const storeUserActivity = async (req, res, next) => {
  const { productId, action } = req.body;

  try {
    // Ensure user is authenticated
    const userId = req.user?.id; // Assuming you have middleware for authentication
    if (!userId) return next(createError(401, "User not authenticated"));

    // Validate the action type
    const validActions = ['view', 'click', 'purchase'];
    if (!validActions.includes(action)) {
      return next(createError(400, "Invalid action type"));
    }

    // Find the existing activity for this user and product
    const existingActivity = await UserActivity.findOne({ userId, productId, action });

    if (existingActivity) {
      // If the activity exists, update the click count or other relevant fields
      existingActivity.clicks = action === 'click' ? (existingActivity.clicks || 0) + 1 : 0;
      existingActivity.views = action === 'view' ? (existingActivity.views || 0) + 1 : 0;
      existingActivity.purchases = action === 'purchase' ? (existingActivity.purchases || 0) + 1 : 0;
      existingActivity.timestamp = Date.now(); // Update the timestamp to the latest activity
      await existingActivity.save();
    } else {
      // If the activity does not exist, create a new one
      const userActivity = new UserActivity({
        userId,
        productId,
        action,
        clicks: action === 'click' ? 1 : 0,
        views: action === 'view' ? 1 : 0,
        purchases: action === 'purchase' ? 1 : 0,

      });
      await userActivity.save();
    }

    res.status(201).json({ message: 'User activity stored or updated successfully' });

  } catch (error) {
    // Handle errors
    next(createError(500, "Failed to store or update user activity"));
  }
};