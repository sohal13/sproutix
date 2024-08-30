
import User from '../Schema/userSchema.js';
import { createError } from '../utils/error.js';
import UserActivity from '../Schema/userActivitySchema.js';
import Seller from '../Schema/sellerSchema.js';
import nodemailer from 'nodemailer';
import SellerApplication from '../Schema/sellerApplicationSchema.js';

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


export const beComeSeller = async (req, res, next) => {
  try {
    const requestFrom = req.params.id;
    const user = await User.findById(requestFrom);
    if (!user) return next(createError(404, "User Not Found"));
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

export const applyForSeller = async (req, res, next) => {
  const userId = req.user.id || req.params.id; // Assuming you have middleware for authentication
  if (!userId) return next(createError(401, "User not authenticated"));
  try {
    const { businessName, businessType, contact, businessAddress, website, businessLicense, taxId } = req.body
    // Check if an application already exists with the same businessName and contact details
    const existingApplication = await SellerApplication.findOne({
      $or: [
        { businessName: businessName },
        { 'contact.email': contact.email },
        { 'contact.phone': contact.phone }
      ]
    });
    if (existingApplication) {
      return res.status(400).json({ message: 'An application with this business name or contact details already exists' });
    }
    // Create new seller application
    const newSeller = new SellerApplication({
      userId: userId,
      businessName,
      businessType,
      contact,
      businessAddress,
      website,
      businessLicense,
      taxId,
    });

    // Save to database
    await newSeller.save();

    res.status(201).json({ message: 'Seller application submitted successfully', seller: newSeller });
  } catch (error) {
    console.log(error);
    next(createError(500, error.message));
  }
};

export const getApplicationStatus = async (req, res, next) => {
  const userId = req.user.id; // Assuming you have middleware for authentication
  if (!userId) return next(createError(401, "User not authenticated"));
  try {
    // Find the seller application by userId
    const application = await SellerApplication.findOne({ userId });
    if (!application) {
      return res.status(404);
    }
    res.status(200).json(application);
  } catch (error) {
    next(createError(500, 'Failed to retrieve application status'));
  }
};

// Get seller additional information
export const getSellerAdditionalInfo = async (req, res, next) => {
  try {
    const seller = await Seller.findOne({sellerDetail:req.params.id}).populate("sellerDetail");
    if (!seller) return next(createError(404, 'Seller not found'));
    res.status(200).json(seller);
  } catch (error) {
    next(createError(500, error.message));
  }
};

//updating seller more data
export const updateSellerAdditionalInfo = async (req, res, next) => {
    const sellerDetail = req.params.id
  try {
    const { bankAccount, shippingMethods, shippingPolicies, packaging, notifications } = req.body;
    
    // Validate bank account details (example validation)
    if (bankAccount) {
      const { accountNumber, ifscCode } = bankAccount;
      if (!/\d{9,18}/.test(accountNumber)) return next(createError(400, 'Invalid bank account number'));
      if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode)) return next(createError(400, 'Invalid IFSC code'));
    }
    // Validate shipping methods
    if (shippingMethods) {
      for (const method of shippingMethods) {
        if (!method.methodName || !method.cost || !method.deliveryTime) {
          return next(createError(400, 'Invalid shipping method details'));
        }
      }
    }
    
    // Validate shipping policies
    if (shippingPolicies) {
      const { handlingTime, shippingCosts, deliveryAreas, returnPolicy } = shippingPolicies;
      if (!handlingTime || !shippingCosts || !deliveryAreas || !returnPolicy) {
        return next(createError(400, 'Invalid shipping policy details'));
      }
    }
    
    // Validate packaging
    if (!packaging) {
      return next(createError(400, 'Packaging details are required'));
    }
    
    const seller = new Seller({
      sellerDetail,
      bankAccount,
      shippingMethods,
      shippingPolicies,
      packaging,
      notifications
    });

    await seller.save();

    if (!seller) return next(createError(404, 'Seller not found'));
    res.status(200).json(seller);
  } catch (error) {
    next(createError(500, 'Failed to update seller additional information'));
  }
};

//admin
// Function to send email
const sendApprovalEmail = async (seller) => {
  // Create a transporter object
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Example: using Gmail
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Email options
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: seller.contact.email,
    subject: '🎉 Congratulations! Your Seller Application is Approved! 🎉',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
        <div style="text-align: center;">
          <h1 style="color: #4CAF50;">Congratulations, ${seller.contact.name}!</h1>
          <p style="font-size: 18px; color: #333;">Your seller application has been approved! 🎉</p>
          <img src="https://example.com/congrats-image.jpg" alt="Congratulations" style="width: 100%; height: auto; border-radius: 8px; margin: 20px 0;">
        </div>
        <div style="color: #555; font-size: 16px; line-height: 1.6;">
          <p>We are thrilled to have you on board. Your journey to success starts now! 🚀</p>
          <p>Please click the button below to log in to your dashboard and complete your profile. Once completed, you can start listing your products and begin selling.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href=${`https://sproutix.vercel.app/seller/updatedetails/${seller._id}`}
               style="background-color: #4CAF50; color: white; padding: 15px 30px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 18px;">Go to Your Dashboard</a>
          </div>
          <p>Thank you for choosing to partner with us. We look forward to a successful collaboration!</p>
          <p>Best regards,<br>Your Company Name</p>
        </div>
      </div>
    `,
  };
  // Send the email
  await transporter.sendMail(mailOptions);
};

// Admin Approval Controller
export const approveSeller = async (req, res, next) => {
  const sellerId = req.params.id;
  try {
    // Find the seller by ID
    const seller = await SellerApplication.findOne({userId:sellerId});
    if (!seller) return next(createError(404, 'Seller not found'));
    // Check if the seller is already approved
    if (seller.status === 'approved') {
      return res.status(400).json({ message: 'Seller application is already approved' });
    }

    // Update seller status to 'approved'
    seller.status = 'approved';
    await seller.save();

    // Update the associated user's isSeller field to true
    const user = await User.findById(seller.userId);
    if (!user) {
      return res.status(400).json({ message: 'Internal Server Error in Approvel Rout' });
    }
    user.isSeller = true;
    await user.save();
    // Send approval email automatically
    await sendApprovalEmail(seller);

    res.status(200).json({ message: 'Seller application approved and email sent to seller' });
  } catch (error) {
    next(createError(500, 'Failed to approve seller application'));
  }
};
