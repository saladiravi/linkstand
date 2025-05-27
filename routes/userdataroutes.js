const express = require('express');
const router = express.Router();
const userController = require('../Controller/userdataController');
const upload=require('../utils/fileupload');

 

router.post('/adduser',upload.fields([
    {name:'logo',maxCount:1},
    {name:'brochure',maxCount:1},
    ]), userController.addUser);
router.get('/getalluser',userController.getAllUser);
router.post('/getUserByid',userController.getUserbyId);
router.post('/getuserprofile',userController.getUserProfile);
router.post('/deleteUser',userController.deleteUser);
router.post('/updateUser',upload.fields([
    {name:'logo',maxCount:1},
    {name:'brochure',maxCount:1},
    ]),userController.updateUser);
  

module.exports = router;
