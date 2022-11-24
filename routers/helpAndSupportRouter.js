const express = require('express');
const bcryptjs = require('bcryptjs');
const router = new express.Router();
const auth = require('../auth/auth');
const map = require('../models/mapsModel');

const contact = require('../models/contactUsModel');


// *********contact us*********
// contact us post
router.post('/contact',auth.staff_guard, (req,res)=>{
    const company_name = req.body.company_name;
    const company_address = req.body.company_address;
    const company_phone = req.body.company_phone;
    const company_founded = req.body.company_founded;
    

    const data = new contact({
        company_name: company_name,
        company_address: company_address,
        company_phone: company_phone,
        company_founded: company_founded
    })

    data.save()
    .then(()=>{
        res.json({success:true, msg:"Inserted"})}  
    )
    .catch((e)=>{
        res.json({msg:"Failed"})
    })

})



module.exports = router;