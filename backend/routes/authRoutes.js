const express = require('express');
const {loginUser} = require('../controller/loginUser');
const {register} = require('../controller/registerUser');
const {logout} = require('../controller/logout');
const {checkUser} = require('../controller/checkUser');
const {UsernameAvailability} = require('../controller/usernameExists');
const router = express.Router();

router.post('/login', loginUser);
router.post('/sign-up', register);
router.post('/logout', logout);
router.get('/profile', checkUser);
router.post('/username-exists', UsernameAvailability);

module.exports = router;