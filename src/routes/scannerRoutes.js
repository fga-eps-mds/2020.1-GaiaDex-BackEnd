const express = require('express');
const ScannerController = require('../controller/ScannerController');

const router = new express.Router();

router.post('/', ScannerController.scanner);

module.exports = router;
