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


// login
router.post("/user/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    user.findOne({ email: email })
        .then((user_data) => {
            if (user_data == null) {
                res.json({ msg: "Invalid Credentials" })
                return;
            }
            bcryptjs.compare(password, user_data.password, (e, result) => {
                if (result == false) {
                    res.json({ msg: "Invalid Credentials" });
                    return;
                }
                //creates token for logged in users
                // this token stores logged in user id
                const token = jwt.sign({ userId: user_data._id }, "##0a9ajdjd92saSda@342!2#$90user"); // secret key as extra auth (database_signature)
                res.json({ msg: "Success", token: token });
            })
        })
        .catch();
})




module.exports = router;