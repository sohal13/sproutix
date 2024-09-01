// controllers/productController.js
import Product from '../Schema/productSchema.js';
import SellerApplication from '../Schema/sellerApplicationSchema.js';
import Seller from '../Schema/sellerSchema.js';
import axios from 'axios'
import UserActivity from '../Schema/userActivitySchema.js';
import { createError } from '../utils/error.js';

export const listProduct = async (req, res, next) => {
  console.log(req.user);
  try {
    // Extract product details from the request body
    const {
      name, scientificName, description, price, quantity, category, images, video,
      brand, careInstructions, lightRequirement, waterRequirement, soilType, climate,
    } = req.body;
    const userId = req.user.id;
    // Create a new product instance
    const newProduct = new Product({
      name, scientificName, description, price, quantity, category, image: images, videoUrl: video,
      brand, careInstructions, lightRequirement, waterRequirement, soilType, climate, userId: userId
    });
    // Save the product to the database
    const savedProduct = await newProduct.save();
    // Respond with the saved product
    res.status(201).json(savedProduct);
  } catch (error) {
    console.log(error);
    next(createError(500, 'Failed to create product'));
  }
};

export const getMyListing = async (req, res, next) => {
  try {
    const userId = req.user.id;
    // Find all products where userId matches
    const products = await Product.find({ userId });
    // Check if products are found
    if (products.length === 0) {
      return next(createError(404, 'No products found for this user'))
    }
    res.status(200).json(products);
  } catch (error) {
    next(error); // Pass errors to the error-handling middleware
  }
}

export const getSingleListing = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById({ _id: productId });
    if (!product) return next(createError(404, 'No products Exist'));
    res.status(200).json(product);
  } catch (error) {
    next(error)
  }
}

const OPENCAGE_API_KEY = 'f3a631ca2e764211b7900b8981e22ae5';

async function geocodeAddress(address) {
  const formattedAddress = `${address.addressLine1}, ${address.addressLine2 || ''}, ${address.city}, ${address.state}, ${address.postalCode}`;
  const response = await axios.get('https://api.opencagedata.com/geocode/v1/json', {
    params: {
      q: formattedAddress,
      key: OPENCAGE_API_KEY,
    },
  });
  const { lat, lng } = response.data.results[0].geometry;
  return { latitude: lat, longitude: lng };
}
export const getExpectedDelivery=async(req,res,next)=>{
  try {
    const productId = req.params.id;
    const product = await Product.findById({ _id: productId });
    if (!product) return next(createError(404, 'No products Exist'));
    const sellerApplicationId = await SellerApplication.findOne({userId:product.userId});
    if(!sellerApplicationId) return next(createError(404, 'No Seller Application found'));
    const seller = await Seller.findOne({sellerDetail:sellerApplicationId._id}).populate('sellerDetail');
    if (!seller || !seller.sellerDetail) {
      return res.status(404).json({ success: false, message: 'Seller or seller details not found' });
    }
    const sellerApplication = seller.sellerDetail;
    const businessAddress = sellerApplication.businessAddress;

    // Geocode the business address
    const coordinates = await geocodeAddress(businessAddress);

    res.status(200).json({
      success: true,
      coordinates: coordinates,
      shippingMethods: seller.shippingMethods,
      shippingPolicies: seller.shippingPolicies,
    });
  } catch (error) {
    next(error)
  }
}


export const searchProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      order = 'desc',
      name,
      minPrice,
      maxPrice,
      minRating,
      maxRating,
      category,
      brand,
      climate,
      lightRequirement,
      waterRequirement,
      soilType,
      featured
    } = req.query;

    // Validate and sanitize sortBy field
    const validSortFields = ['name', 'price', 'createdAt', 'ratings.average'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const sortOrder = order === 'asc' ? 1 : -1;

    // Building filter conditions
    const filterConditions = {};

    if (name) filterConditions.name = new RegExp(name, 'i'); // Case-insensitive search
    if (category) filterConditions.category = category;
    if (brand) filterConditions.brand = brand;
    if (climate) filterConditions.climate = climate;
    if (lightRequirement) filterConditions.lightRequirement = lightRequirement;
    if (waterRequirement) filterConditions.waterRequirement = waterRequirement;
    if (soilType) filterConditions.soilType = soilType;
    if (featured) filterConditions.featured = featured === 'true';

    // Price filter
    if (minPrice || maxPrice) {
      filterConditions.price = {};
      if (minPrice) filterConditions.price.$gte = Number(minPrice);
      if (maxPrice) filterConditions.price.$lte = Number(maxPrice);
    }

    // Ratings filter
    if (minRating || maxRating) {
      filterConditions['ratings.average'] = {};
      if (minRating) filterConditions['ratings.average'].$gte = Number(minRating);
      if (maxRating) filterConditions['ratings.average'].$lte = Number(maxRating);
    }

    // Pagination and Sorting
    const skip = (page - 1) * limit;
    const [products, totalProducts] = await Promise.all([
      Product.find(filterConditions)
        .skip(skip)
        .limit(Number(limit))
        .sort({ [sortField]: sortOrder })
        .lean(), // Use lean() for better performance
      Product.countDocuments(filterConditions)
    ]);

    res.json({
      total: totalProducts,
      page: Number(page),
      pages: Math.ceil(totalProducts / limit),
      products
    });
  } catch (error) {
    next(error);
  }
};

export const getSuggestions = async (req, res, next) => {
  try {
    const { query } = req.query;

    // Using RegExp for case-insensitive search of product names
    const suggestions = await Product.find({
      name: new RegExp(query, 'i') // Matches any part of the product name
    })
      .limit(5) // Limit the number of suggestions
      .select('name _id'); // Select only the fields needed

    res.status(200).json(suggestions);
  } catch (error) {
    next(error);
  }
};


export const getRelatedProducts = async (req, res, next) => {
  const productId = req.params.id;
  try {
    // Find the current product
    const currentProduct = await Product.findById(productId);
    if (!currentProduct) return next(createError(404, "Product not found"));
    // Category-Based Suggestions
    const categoryRelatedProducts = await Product.find({
      category: currentProduct.category,
      _id: { $ne: productId } // Exclude the current product
    }).limit(5); // Limit to 3 related products
    // Attribute Matching (e.g., similar light and water requirements)
    const attributeMatchedProducts = await Product.find({
      _id: { $ne: productId }, // Exclude the current product
      lightRequirement: currentProduct.lightRequirement,
      waterRequirement: currentProduct.waterRequirement,
      category: currentProduct.category
    }).limit(5);
    // Combine all related products and avoid duplicates
    const combinedProducts = [...categoryRelatedProducts, ...attributeMatchedProducts];
    // Remove duplicates
    const uniqueProductsMap = {};
    combinedProducts.forEach(product => {
      uniqueProductsMap[product._id.toString()] = product;
    });

    const uniqueProducts = Object.values(uniqueProductsMap);
    res.status(200).json(uniqueProducts);
  } catch (error) {
    next(createError(500, "Failed to fetch related products"));
  }
};

export const showFeaturedProduct = async (req, res, next) => {
  const userId = req.query.userId; 

  try {
    if (userId && userId !== 'undefined') {
      const recentActivity = await UserActivity.find({ userId })
        .sort({ timestamp: -1 })
        .limit(10);

      const productIds = recentActivity.map(activity => activity.productId);

      // Get featured products based on user activity and randomly sample
      const recentProducts = await Product.find({ _id: { $in: productIds } });

      // Randomly select 10 featured products
      const featuredProducts = await Product.aggregate([
        { $match: { featured: true } },
        { $sample: { size: 10 } }
      ]);

      // Combine recent and featured products
      const combinedProducts = [...recentProducts, ...featuredProducts];
      const uniqueProducts = Array.from(new Set(combinedProducts.map(product => product._id.toString())))
                                  .map(id => combinedProducts.find(product => product._id.toString() === id));

      // Ensure at least 4 featured products
      let finalProducts = uniqueProducts;
      if (finalProducts.filter(product => product.featured).length < 4) {
        const additionalFeatured = await Product.aggregate([
          { $match: { featured: true, _id: { $nin: finalProducts.map(product => product._id) } } },
          { $sample: { size: 4 - finalProducts.filter(product => product.featured).length } }
        ]);
        finalProducts = [...finalProducts, ...additionalFeatured];
      }

      // Randomly sort the final list of products
      finalProducts = finalProducts.sort(() => Math.random() - 0.5);

      res.status(200).json(finalProducts);
    } else {
      // If no user ID, get random featured products
      const featuredProducts = await Product.aggregate([
        { $match: { featured: true } },
        { $sample: { size: 10 } }
      ]);

      if (!featuredProducts || featuredProducts.length === 0) {
        return next(createError(404, "No Featured product found"));
      }

      // Randomly sort the featured products
      const sortedFeaturedProducts = featuredProducts.sort(() => Math.random() - 0.5);

      res.status(200).json(sortedFeaturedProducts);
    }
  } catch (error) {
    next(error);
  }
};


