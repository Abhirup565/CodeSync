const express = require('express');
const { saveCode } = require('../controller/saveCode');
const { getCode } = require('../controller/getCode');

const router = express.Router();

router.post('/save-code', saveCode);
router.get('/get-code', getCode);
module.exports = router;