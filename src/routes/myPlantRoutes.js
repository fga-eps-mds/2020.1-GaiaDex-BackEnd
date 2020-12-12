const express = require('express');
const MyPlantsController = require('../controller/MyPlantsController');
const { auth } = require('../lib/auth');

const router = new express.Router();

router.get('/', MyPlantsController.fetchPlants);
router.post('/add/:plantId', auth, MyPlantsController.createPlant);
router.get('/:userId/:myPlantId', MyPlantsController.searchPlant);
router.put('/edit/:myPlantId', MyPlantsController.updatePlant);
router.delete('/delete/:myPlantId', MyPlantsController.deletePlant);

module.exports = router;
