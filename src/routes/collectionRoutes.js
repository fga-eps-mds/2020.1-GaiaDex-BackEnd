const express = require('express');
const CollectionController = require('../controller/CollectionController');

const router = new express.Router();

router.get('/:userId', CollectionController.getCollection);

module.exports = router;
