import express from "express"
import { getExpectedDelivery, getMyListing, getRelatedProducts, getSingleListing, getSuggestions, listProduct, searchProducts, showFeaturedProduct } from "../RoutControler/productControler.js";
import { verifySeller, verifyUser } from "../utils/verifyUser.js";

const router = express.Router();

router.post('/list',verifyUser,verifySeller,listProduct)

router.get('/mylisting',verifyUser,verifySeller,getMyListing)

router.get('/this/:id',getSingleListing);

router.get('/expected-delivery/:id',getExpectedDelivery)

router.get('/search', searchProducts);

router.get('/search-suggestions', getSuggestions);

router.get("/related/:id", getRelatedProducts);

router.get('/featured', showFeaturedProduct);


router.get('/test',verifyUser,(req,res,next)=>{
    try {
        res.send(req.user.id);
    } catch (error) {
        console.log(error);
    }
})

export default router