const express = require('express');

const Plant = require('../models/Plant');
const Topic = require('../models/Topic');

const router = express.Router();

// registro de uma nova planta
router.post('/register', async (req, res) => {
  try {
    const {
      scientificName,
      familyName,
      genderName,
      specieName,
      commonName,
      usage,
      firstUser,
      collectionCount,
      extinction,
      profile_picture,
      gbifID,
      stateProvince,
    } = req.body;

    const plant = await Plant.create({
      scientificName,
      familyName,
      genderName,
      specieName,
      commonName,
      usage,
      firstUser,
      collectionCount,
      extinction,
      profile_picture,
      gbifID,
      stateProvince,
    });

    // await Promise.all(topics.map(async topico =>{
    //     const plantTopic = new Topico({...topico,plant : plant._id});

    //     await plantTopic.save();

    //     plant.topics.push(plantTopic);
    // }));

    await plant.save();

    return res.send({ plant });
  } catch (err) {
    return res.send(err);
  }
});

// Listagem de Todas as plantas
router.get('/', async (req, res) => {
  try {
    const plants = await Plant.find().populate('topics');

    return res.send({ plants });
  } catch (err) {
    return res.status(400).send({ error: 'Loading plants failed' });
  }
});

// Procurando planta por id
router.get('/:plantId', async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.plantId).populate('topics');

    return res.send({ plant });
  } catch (err) {
    return res
      .status(400)
      .send({ error: 'error when searching for this plant ' });
  }
});

// Deletando planta por id
router.delete('/:plantId', async (req, res) => {
  try {
    const deleted = await Plant.findByIdAndRemove(req.params.plantId);

    return res.send(deleted);
  } catch (err) {
    return res.status(400).send({ error: 'Error when Delete this plant' });
  }
});

// Dando upgrade planta por id
router.put('/:plantId', async (req, res) => {
  try {
    const {
      scientificName,
      familyName,
      genderName,
      specieName,
      commonName,
      usage,
      firstUser,
      collectionCount,
      extinction,
      profilePicture,
      gbifID,
      stateProvince,
      topics,
    } = req.body;

    const plant = await Plant.findByIdAndUpdate(
      req.params.plantId,
      {
        scientificName,
        familyName,
        genderName,
        specieName,
        commonName,
        usage,
        firstUser,
        collectionCount,
        extinction,
        profilePicture,
        gbifID,
        stateProvince,
      },
      { new: true }
    );

    plant.topics = [];
    await Topic.remove({ plant: plant._id });

    await Promise.all(
      topics.map(async (topic) => {
        const plantTopic = new Topic({ ...topic, plant: plant._id });

        await plantTopic.save();

        plant.topics.push(plantTopic);
      })
    );

    await plant.save();

    return res.send({ plant });
  } catch (err) {
    return res.status(400).send({ error: 'Registration failed' });
  }
});

module.exports = router;
