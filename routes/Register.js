const express = require('express');
const User = require('../controllers/User');
const Validator = require('../utils/Validator');
const router = express.Router();

router.post('/backend/register', Validator.register, User.registerUser);

module.exports = router;
