const express = require('express');
const router = new express.Router();
const user = require('../models/userModel');
const transaction = require('../models/transactionModel');
const auth = require('../auth/auth');
const refund = require('../models/refundDonationModel');

//transaction send
router.post("/user/send_transaction",auth.userGuard, (req,res)=>{
    const user_id = req.userInfo._id;
    const donation_amount = req.body.donation_amount;
    const donation_category = req.body.donation_category;
    const donor_name = req.body.donor_name;
    const donor_note = req.body.donor_note;
    const donor_address = req.body.donor_address;
    const donation_status = req.body.donation_status;
    const idx = req.body.idx;
    const token = req.body.token;

    const data = new transaction({
        user_id: user_id,
        donation_amount: donation_amount, 
        donation_category: donation_category,
        donor_name: donor_name,
        donor_address: donor_address,
        donor_note: donor_note,
        donation_status: donation_status,
        idx: idx,
        token: token,
    })
    data.save()
    .then(()=>{
        res.json({success:true, msg:"Transaction Successful"})}  
    )
    .catch((e)=>{
        res.json({msg:"Transaction Failed"})
    })
})

router.put("/user/donation_point",auth.userGuard,(req,res)=>{
  const donation_point = req.body.donation_point
  const user_id = req.userInfo._id;
  user.updateOne({
      _id: user_id
  },
  {
      donation_point : donation_point
  })
  .then(()=>{
      res.json({success:true, msg:"Updated"})}  
  )
  .catch((e)=>{
      res.json({msg:"Failed to update donation point"})
  })
})



module.exports = router;