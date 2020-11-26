const express = require('express');
const FavoritesController = require('../controller/FavoritesController');

const router = new express.Router();

router.post('/add/:userId/:plantId', FavoritesController.createFavorite);
router.get('/list/:userId', FavoritesController.listFavorites);
router.delete('/delete/:userId/:plantId', FavoritesController.deleteFavorite);

module.exports = router;
