const express = require('express');
const MyPlantsController = require('../controller/MyPlantsController');

const router = new express.Router();

router.get('/:userId', MyPlantsController.fetchPlants);
router.post('/add/:userId/:plantId', MyPlantsController.createPlant);
router.get('/:userId/:myPlantId', MyPlantsController.searchPlant);
router.put('/edit/:myPlantId', MyPlantsController.updatePlant);
router.delete('/delete/:myPlantId', MyPlantsController.deletePlant);

module.exports = router;
