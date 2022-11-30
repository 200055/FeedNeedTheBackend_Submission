const express = require('express');
const router = new express.Router();
const partner = require('../models/partnerModel');
const auth = require('../auth/auth');
const upload = require('../fileUpload/fileUpload');


// route for inserting partner
router.post('/partner/insert',auth.admin_guard,upload.fields([{name:'partner_image',maxCount: 1},{name:'banner_image',maxCount: 1}]),(req,res)=>{
    console.log(req.files)
    if(req.files == undefined){
        return res.json({msg:"Invalid file format"})
    }
    const partner_name = req.body.partner_name;
    const partner_category = req.body.partner_category;

    const partner_image = req.files['partner_image'][0].filename;
    const banner_image = req.files['banner_image'][0].filename;

    const data = new partner({
        partner_name : partner_name,
        partner_category : partner_category,
        partner_image : partner_image,
        banner_image: banner_image
    })

    data.save()
    .then(()=>{
        res.json({success:true, msg:"Inserted"})}  
    )
    .catch((e)=>{
        res.json({msg:"Failed"})
    })
})

router.get('/partner', async (req,res)=>{
    const partner_details = await partner.find({})
    if (!partner_details) {
        res.status(500).json({success: false});
      } else {
        res.status(201).json( partner_details );
      }
})

module.exports = router;
