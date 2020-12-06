const express = require('express');

const router = express.Router();

const User = require('../models/User');
const Plant = require('../models/Plant');
const {auth} = require('./auth');

router.post('/add/:plantId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
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

router.delete('/delete/:plantId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const index = user.favorites.indexOf(req.params.plantId);

    if (index > -1) {
      user.favorites.splice(index, 1);
      await user.save();
    }
    const newUser = await User.findById(req.userId).populate([
      { path: 'favorites' },
    ]);
    return res.status(200).send( newUser.favorites );
  } catch (err) {
    return res.status(400).send({ error: `Error deleting favorite. ${err} ` });
  }
});

module.exports = router;
