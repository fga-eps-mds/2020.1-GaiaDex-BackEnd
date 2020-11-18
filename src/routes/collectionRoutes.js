const express = require('express');

const router = express.Router();

const User = require('../models/User');
const MyPlant = require('../models/MyPlant');
const Plant = require('../models/Plant');

router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const { length } = user.myPlants;
    if (length > 0) {
      const plantArray = [];
      const promises = user.myPlants.map(async (elem, idx) => {
        const myplant = await MyPlant.findById(user.myPlants[idx]);
        const typePlant = await Plant.findById(myplant.plant);
        let objplant = `{
        "_id" : "${myplant._id}",
        "nickname" : "${myplant.nickname}", 
        "commonName" : "${typePlant.commonName}", 
        "profilePicture" : "${typePlant.profilePicture}"}`;
        objplant = JSON.parse(objplant);
        plantArray.push(objplant);
      });

      await Promise.all(promises);
      return res.send(plantArray);
    }
    return res.send({ message: 'No plants in my collection' });
  } catch (err) {
    return res
      .status(400)
      .send({ error: `Error visualizing collection${err}` });
  }
});

module.exports = router;
