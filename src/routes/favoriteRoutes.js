const express = require('express');

const router = express.Router();

const User = require('../models/User');
const Plant = require('../models/Plant');
const { auth } = require('./auth');

router.post('/add/:plantId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate([
      { path: 'topics', populate: 'plants' },
      { path: 'myPlants', populate: 'plant' },
      { path: 'favorites', populate: 'plant' },
    ]);
    const plant = await Plant.findById(req.params.plantId);
    if (
      user.favorites.some(
        (favorite) => JSON.stringify(favorite?._id) === JSON.stringify(plant._id)
      )
    )
      return res.status(200).send(user);

    if (user.favorites.indexOf(plant) === -1) {
      user.favorites.push(plant);
      await user.save();
    }

    return res.status(200).send(user);
  } catch (err) {
    return res.status(400).send(err);
  }
});

router.get('/list/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const { favorites } = user;

    return res.status(200).send({ favorites });
  } catch (err) {
    return res.status(400).send({ error: `Error loading favorites. ${err}` });
  }
});

router.delete('/delete/:plantId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const index = user.favorites.indexOf(req.params.plantId);

    if (index > -1) {
      user.favorites.splice(index, 1);
      await user.save();
    }
    const newUser = await User.findById(req.userId).populate([
      { path: 'topics', populate: 'plants' },
      { path: 'myPlants', populate: 'plant' },
      { path: 'favorites', populate: 'plant' },
    ]);
    return res.status(200).send(newUser);
  } catch (err) {
    return res.status(400).send({ error: `Error deleting favorite. ${err} ` });
  }
});

module.exports = router;
