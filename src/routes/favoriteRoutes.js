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

    return res.status(200).send({ plant });
  } catch (err) {
    return res
      .status(400)
      .send({ error: `Error while adding new favorite plant. ${err}` });
  }
});

module.exports = router;
