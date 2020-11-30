const express = require('express');
const ScannerController = require('../controller/ScannerController');

const router = express.Router();

router.post('/', ScannerController.scanner);

module.exports = router;