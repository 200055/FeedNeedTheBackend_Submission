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

//view leadearboard
router.get("/leaderboard", async (req, res) => {
  await user.find().sort({donation_point: -1})
    .then((users) => {
      res.status(201).json({
        success: true,
        data: users,
      });
    })
    .catch((e) => {
      res.json({
        msg: e,
      });
    });
});

//view all transaction on the system
router.get("/all_transaction",async(req,res)=>{ 
  await transaction.find().sort({created_at:-1})
  .populate({
      path: "user_id"
  })
  .then((transaction) => {
      res.status(201).json({
        success: true,
        data: transaction,
      });
    })
    .catch((e) => {
      res.json({
        msg: e,
      });
    });
})

//pagination transaction
router.get("/all_transaction_pagination", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage);
  const totalCount = await transaction.countDocuments();
  const totalPages = Math.ceil(totalCount / perPage);  // Calculate the total number of pages
  await transaction
    .find()
    .skip(perPage * (page - 1))
    .limit(perPage)
    .sort({ created_at: -1 })
    .populate({
      path: "user_id",
    })
    .then((transactions) => {
      res.status(201).json({
        success: true,
        data: transactions,
        totalPages: totalPages,  // Return the total number of pages
      });
    })
    .catch((e) => { 
      res.json({
        msg: e,
      });
    });
});


// see user transaction by the user
router.get("/user_transaction",auth.userGuard,async(req,res)=>{
  await transaction.find({
      user_id: req.userInfo._id
  }).sort({created_at:-1})
  .then((transaction) => {
      res.status(201).json({
        success: true,
        data: transaction,
      });
    })
    .catch((e) => {
      res.json({
        msg: e,
      });
    });
})

module.exports = router;