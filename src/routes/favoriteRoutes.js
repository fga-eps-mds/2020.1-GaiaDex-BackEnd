const express = require('express');

const router = express.Router();

const User = require('../models/User');
const Plant = require('../models/Plant');

router.post('/add/:userId/:plantId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const plant = await Plant.findById(req.params.plantId);

    if (user.favorites.indexOf(plant) === -1) {
      user.favorites.push(plant);
      await user.save();
    }

    return res
      .status(200)
      .send({ message: 'Plant successfuly added to user favorites.' });
  } catch (err) {
    return res
      .status(400)
      .send({ error: `Error while adding new favorite plant. ${err}` });
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

router.delete('/delete/:userId/:plantId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const index = user.favorites.indexOf(req.params.plantId);

    if (index > -1) {
      user.favorites.splice(index, 1);
      await user.save();
    }

    return res.status(200).send({ message: 'Favorite deleted successfuly' });
  } catch (err) {
    return res.status(400).send({ error: `Error deleting favorite. ${err}` });
  }
});

module.exports = router;
