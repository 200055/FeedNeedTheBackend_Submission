const express = require('express');
const router = new express.Router();
const partner = require('../models/partnerModel');
const auth = require('../auth/auth');
const upload = require('../fileUpload/fileUpload');


module.exports = router;
