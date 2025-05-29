const carouselcontroller=require('../Controller/carouselController');
const express=require('express');
const router=express.Router();
const upload=require('../utils/fileupload');

router.post('/addcarousel',upload.fields([
    {name:'carousel_image',maxCount:1}]),carouselcontroller.addCrousel);

 router.get('/getallcarousel',carouselcontroller.getallCarousels);
router.post('/updateCarousel',upload.fields([
    {name:'carousel_image',maxCount:1}]),carouselcontroller.updatecarousel);

router.post('/deletecarousel',carouselcontroller.deleteCarousel) ;

 
router.post('/getCorouselByuser',carouselcontroller.getcarouselByuser);
   
    
module.exports=router 
