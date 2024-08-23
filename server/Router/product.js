import express from "express"
import { getMyListing, getRelatedProducts, getSingleListing, listProduct, searchProducts, showFeaturedProduct } from "../RoutControler/productControler.js";
import { verifySeller, verifyUser } from "../utils/verifyUser.js";

const router = express.Router();

router.post('/list',verifyUser,verifySeller,listProduct)

router.get('/mylisting',verifyUser,verifySeller,getMyListing)

router.get('/this/:id',getSingleListing);

router.get('/search', searchProducts);

router.get("/related/:id", getRelatedProducts);

router.get('/featured', showFeaturedProduct);


router.get('/test',verifyUser,(req,res,next)=>{
    try {
        console.log(req.user.id);
    } catch (error) {
        console.log(error);
    }
})

export default router