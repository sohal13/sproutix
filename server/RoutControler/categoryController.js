// src/controllers/categoryController.js

import Product from "../Schema/productSchema.js";


export const getCategoriesWithImages = async (req, res, next) => {
  try {
    // Fetch unique categories
    const categories = await Product.distinct('category');

    const categoriesWithImages = await Promise.all(
      categories.map(async (category) => {
        const products = await Product.find({ category });
        const randomImage = products.length > 0 ? products[Math.floor(Math.random() * products.length)].image[0] : null;

        return {
          category,
          image: randomImage
        };
      })
    );

    res.status(200).json(categoriesWithImages);
  } catch (error) {
    next(error);
  }
};

export const getProductsByCategory = async (req, res, next) => {
  const { categoryname } = req.params;
  console.log(categoryname);
  try {
      // Fetch products for the specified category
      const products = await Product.find({ category: categoryname });
      if (!products.length) {
          return res.status(404).json({ message: 'No products found for this category' });
      }
      res.status(200).json(products);
  } catch (error) {
      next(error); // Handle errors and pass them to the error handling middleware
  }
};
