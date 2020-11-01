const express = require('express');

const router = express.Router();

const User = require('../models/User');
const MyPlant = require('../models/myPlant');
const Plant = require('../models/Plant');

router.get('/', async (req, res) => {
  res.send({ message: 'collection' });
});

router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const { length } = user.myPlants;
    // console.log(user.myPlants.length);
    if (length > 0) {
      const plantArray = [];
      // ESlint reclamou do await dentro do for
      // for (let index = 0; index < user.myPlants.length; index += 1) {
      //   const myplant = await MyPlant.findById(user.myPlants[index]);
      //   const typePlant = await Plant.findById(myplant.plant);
      //   let objplant = `{
      //   "nickname" : "${myplant.nickname}",
      //   "commonName" : "${typePlant.commonName}",
      //   "profilePicture" : "${typePlant.profilePicture}"
      // }`;
      //   objplant = JSON.parse(objplant);
      //   plantArray.push(objplant);
      // }

      const promises = user.myPlants.map(async (elem, idx) => {
        const myplant = await MyPlant.findById(user.myPlants[idx]);
        const typePlant = await Plant.findById(myplant.plant);
        // Calculo para ver quantos dias para regar e fertilizar
        // OBS: POR CAUSA DO ARREDONDAMENDO VALORES TEM UM ERRO
        // DEPENDENDO DA HORA
        // const water = Math.round(
        //   (Date.parse(myplant.water) - Date.now()) / (1000 * 60 * 60 * 24)
        // );
        // const fertilize = Math.round(
        //  (Date.parse(myplant.fertilize) - Date.now()) / (1000 * 60 * 60 * 24)
        // );
        let objplant = `{
        "nickname" : "${myplant.nickname}", 
        "commonName" : "${typePlant.commonName}", 
        "profilePicture" : "${typePlant.profilePicture}"}`;
        objplant = JSON.parse(objplant);
        plantArray.push(objplant);
      });

      await Promise.all(promises);
      res.send(plantArray);
    } else {
      return res.send({ message: 'No plants in my collection' });
    }
  } catch (err) {
    return res
      .status(400)
      .send({ error: `Error visualizing collection${err}` });
  }
  return undefined;
});

//  Estrutura que setar visualiar necessidade de regar ou não
router.put('/:myPlantID', async (req, res) => {
  try {
    const { water, fertilize } = req.body;
    // const notification = await plantNotification.create({water, fertilize});
    const myplant = await MyPlant.findById(req.params.myPlantID);
    // const myplant = await MyPlant.findById(req.params.myPlantID);
    // await notification.save();
    // myplant.notifications.push(notification);
    myplant.water = water;
    myplant.fertilize = fertilize;
    myplant.save();

    console.log({ myplant });

    return res.send({ message: 'Notification successfully registered.' });
  } catch (err) {
    return res.status(400).send({ error: `Error adding notification${err}` });
  }
});

module.exports = router;
