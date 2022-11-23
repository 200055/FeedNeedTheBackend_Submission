const express = require('express');
const bcryptjs = require('bcryptjs');
const router = new express.Router();
const staff = require('../models/staffModel');
const jwt = require('jsonwebtoken');
const auth = require('../auth/auth');
const upload = require('../fileUpload/fileUpload');
const partner = require('../models/partnerModel');
const blog = require('../models/blogModel');
const map = require('../models/mapsModel');
const contact = require('../models/contactUsModel');


// Staff register
router.post('/staff/register',auth.admin_guard,(req,res)=>{
    const email = req.body.email;
    staff.findOne({email:email})
    .then((s_email)=>{
        if(s_email != null){
            return res.json({msg:"Email already exists"});
        } 

        const firstname = req.body.firstname;
        const lastname = req.body.lastname;
        const username = req.body.username;
        const age = req.body.age;
        const address = req.body.address;
        const gender = req.body.gender;
        const phone = req.body.phone;
        const password = req.body.password;
        const picture = req.body.picture;

        bcryptjs.hash(password, 10, (e, hashed_pw)=>{
            const data = new staff({
                firstname : firstname,
                lastname : lastname,
                username : username,
                age : age,
                address : address,
                gender : gender,
                phone : phone,
                email : email,
                password : hashed_pw,
                picture : picture,
            })
            data.save()
            .then(()=>{
                res.json({msg:"Registered successfully", success:true})
            })
            .catch((e)=>{
                res.json({msg:"Something went wrong"})
            })
        }) 

    })
    .catch() 
})



module.exports = router;


