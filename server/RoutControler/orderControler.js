import Order from "../Schema/orderSchema.js";
import { createError } from "../utils/error.js";

export const getMyOrders=async(req,res,next)=>{
    const userId = req.params.id;

    if(userId !== req.user.id) return next(createError(404,"You Are Not Authorized"));
try {
    const orders = await Order.find({user:req.user.id}).sort({createdAt:-1}).populate({
        path: 'items.product', // Specify the path to populate
        select: 'name' // Fields to include from the Product model
      });;
  // Log the full structure of orders
    if(!orders) return next(createError(404,"No Order Found"));
    res.status(200).send(orders);
} catch (error) {
    next(error)
}
}

export const getMyOrdersDetails=async(req,res,next)=>{
    const orderID = req.params.id;
    try {
    const order = await Order.findById(orderID)
      .populate('user', 'name email phone')           // Populate user details
      .populate('sellerId', 'name email phone')       // Populate seller details
      .populate('items.product', 'name')        // Populate product details
      .exec();
  // Log the full structure of orders
    if(!order) return next(createError(404,"No OrderDetail Found With This Id"));
    res.status(200).send(order);
} catch (error) {
    next(error)
}
}

export const cancelOrder = async (req, res, next) => {
    try {
      const { id } = req.params;
      // Cancel the order (assuming status is 'canceled')
      const canceledOrder = await Order.findByIdAndUpdate(id, { status: 'canceled' }, { new: true });
      if (!canceledOrder) return next(createError(404, "Order not found"));
      res.status(200).json(canceledOrder);
    } catch (error) {
      next(error);
    }
  };


  //for sellers
  export const getSellerOrders = async (req, res, next) => {
    const sellerId = req.user.id;
    // Assuming req.user contains seller's info
    try {
      const orders = await Order.find({sellerId}).sort({createdAt:-1}).populate({
        path: 'items.product', // Specify the path to populate
        select: 'name' // Fields to include from the Product model
      });;
      if (!orders || orders.length === 0) {
        return res.status(404).json({ message: 'No orders found for this seller' });
      }
      console.log(orders);
      res.status(200).json(orders);
    } catch (error) {
      next(createError(500, 'Failed to fetch orders'));
    }
  };

  