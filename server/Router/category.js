// src/routes/categoryRoutes.js
import express from 'express';
import { getCategoriesWithImages, getProductsByCategory } from '../RoutControler/categoryController.js';

const router = express.Router();

// Route to get all categories with a random product image for each
router.get('/all', getCategoriesWithImages);

router.get('/get/:categoryname', getProductsByCategory);

export default router;
