const express = require('express');
const bcryptjs = require('bcryptjs');
const router = new express.Router();
const user = require('../models/userModel');
const jwt = require('jsonwebtoken');
const auth = require('../auth/auth');
const upload = require('../fileupload/fileupload');
const nodemailer = require('nodemailer');

// register
router.post("/user/insert", (req, res) => {
    const email = req.body.email;
    // make email unique
    user.findOne({ email: email })
        .then((user_data) => {
            if (user_data != null) {
                res.json({ msg: "Email already exists" });
                return;
            }
            const phone = req.body.phone;
            const password = req.body.password;

            //encrypt password in database
            bcryptjs.hash(password, 10, (e, hashed_pw) => {
                const data = new user({
                    phone: phone,
                    email: email,
                    password: hashed_pw,
                })
                data.save()
                    .then(() => {
                        res.json({ msg: "user registered" })
                    })
                    .catch((e) => {
                        res.json({ msg: "user registration failed" })
                    });
            });
        })
        .catch();
})





module.exports = router;