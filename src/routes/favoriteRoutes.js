const express = require('express');
const FavoritesController = require('../controller/FavoritesController');
const { auth } = require('../lib/auth');

const router = new express.Router();

router.post('/add/:plantId', auth, FavoritesController.createFavorite);
router.get('/list/:userId', FavoritesController.listFavorites);
router.delete('/delete/:plantId', auth, FavoritesController.deleteFavorite);

module.exports = router;
