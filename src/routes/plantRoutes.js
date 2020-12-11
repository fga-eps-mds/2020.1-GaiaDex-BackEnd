const express = require('express');
const PlantController = require('../controller/PlantController');

const router = new express.Router();

router.post('/register', PlantController.registerPlant);
router.get('/', PlantController.fetchAll);
router.get('/:plantId', PlantController.searchPlant);
router.delete('/:plantId', PlantController.deletePlant);
router.put('/:plantId', PlantController.updatePlant);

module.exports = router;
