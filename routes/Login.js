const express = require('express');
const User = require('../controllers/User');
const router = express.Router();

router.post('/backend/login', User.loginUser);

module.exports = router;
