const User = require('../models/User');
const Plant = require('../models/Plant');
const MyPlant = require('../models/MyPlant');

const myPlantSchema = require('../schemas/myPlantSchema');

class MyPlantsController {
  static async fetchPlants(req, res) {
    try {
      const user = await User.findById(req.params.userId);
      const { length } = user.myPlants;
      if (length > 0) {
        const plantArray = [];
        const promises = user.myPlants.map(async (elem, idx) => {
          const myPlant = await MyPlant.findById(user.myPlants[idx]);
          const typePlant = await Plant.findById(myPlant.plant);
          let objPlant = `{
            "_id" : "${myPlant._id}",
            "nickname" : "${myPlant.nickname}", 
            "commonName" : "${typePlant.commonName}", 
            "profilePicture" : "${typePlant.profilePicture}"
          }`;
          objPlant = JSON.parse(objPlant);
          plantArray.push(objPlant);
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
  }

  static async createPlant(req, res) {
    try {
      const user = await User.findById(req.userId);
      const plant = await Plant.findById(req.params.plantId);
  
      const result = myPlantSchema.validate({ nickname: req.body.nickname });
      if (result.error) {
        return res.status(400).send(result.error);
      }

      const myPlant = await MyPlant.create({
        user,
        nickname: req.body.nickname,
        plant,
      });
      await user.myPlants.push(myPlant._id);
      await user.save();
  
      return res.status(200).send({ myPlant });
    } catch (err) {
      return res
        .status(400)
        .send({ error: `Error while adding plant to backyard.\n${err}` });
    }
  }

  static async searchPlant(req, res) {
    try {
      const user = await User.findById(req.params.userId);
      const index = user.myPlants.indexOf(req.params.myPlantId);
  
      if (index > -1) {
        const myPlant = await MyPlant.findById(req.params.myPlantId);
        return res.send({
          nickname: myPlant.nickname,
          plant: myPlant.plant,
          creation: myPlant.createdAt,
        });
      }
      return res.send({
        message: 'Backyard plant not found.',
      });
    } catch (err) {
      return res
        .status(400)
        .send({ error: `Error while searching for plant.\n${err}` });
    }
  }

  static async updatePlant(req, res) {
    try {
      const newNick = req.body;
  
      const result = myPlantSchema.validate(newNick);
      if (result.error) {
        return res
          .status(400)
          .send({ error: `Error while editing plant. ${result.error}` });
      }
  
      const myPlant = await MyPlant.findOneAndUpdate(
        { _id: req.params.myPlantId },
        newNick,
        {
          useFindAndModify: false,
          new: true,
        }
      );
  
      const newUser = await User.findById(myPlant.user).populate([
        { path: 'topics', populate: 'plants' },
        { path: 'myPlants', populate: 'plant' },
        { path: 'favorites', populate: 'plant' },
      ]);
      return res.send(newUser);
    } catch (err) {
      return res
        .status(400)
        .send({ error: `Error while updating backyard plant.\n${err}` });
    }
  }

  static async deletePlant(req, res) {
    try {
      const myPlant = await MyPlant.findById(req.params.myPlantId);
      const user = await User.findById(myPlant.user);
      const index = user.myPlants.indexOf(req.params.myPlantId);
      if (index > -1) {
        user.myPlants.splice(index, 1);
      }
      await user.save();
      await MyPlant.findByIdAndRemove(req.params.myPlantId, {
        useFindAndModify: false,
      });
      const newUser = await User.findById(user._id).populate([
        { path: 'topics', populate: 'plants' },
        { path: 'myPlants', populate: 'plant' },
        { path: 'favorites', populate: 'plant' },
      ]);
  
      return res.send(newUser);
    } catch (err) {
      return res
        .status(400)
        .send({ error: `Error while deleting plant from backyard.\n${err}` });
    }
  }
}

module.exports = MyPlantsController;
