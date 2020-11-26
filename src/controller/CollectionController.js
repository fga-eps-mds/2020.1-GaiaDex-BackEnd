const User = require('../models/User');
const MyPlant = require('../models/MyPlant');
const Plant = require('../models/Plant');

class CollectionController {
  static async getCollection(req, res) {
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
}

module.exports = CollectionController;
