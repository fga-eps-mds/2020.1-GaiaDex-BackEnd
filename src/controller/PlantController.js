const Plant = require('../models/Plant');
const { Topic } = require('../models/Topic');
const User = require('../models/User');

class PlantController {
  // registro de uma nova planta
  static async registerPlant(req, res) {
    try {
      const {
        scientificName,
        familyName,
        genderName,
        specieName,
        commonName,
        usage,
        collectionCount,
        extinction,
        profilePicture,
        gbifID,
        stateProvince,
      } = req.body;
      const firstUser = await User.findById(req.userId);
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
        profilePicture,
        gbifID,
        stateProvince,
      });

      await plant.save();
      return res.send(plant);
    } catch (err) {
      if (err.code === 11000) {
        const { scientificName } = req.body;
        const plant = await Plant.findOne({
          scientificName,
        });
        return res.send(plant);
      }
      return res.send(err);
    }
  }

  // Listagem de Todas as plantas
  static async fetchAll(req, res) {
    try {
      const plants = await Plant.find().sort({ "topics": -1 }).populate([
        { path: 'topics' },
      ]);
      return res.send( plants );
    } catch (err) {
      return res.status(400).send({ error: 'Loading plants failed' });
    }
  }

  // Procurando planta por id
  static async searchPlant(req, res) {
    try {
      const plant = await Plant.findById(req.params.plantId).populate([
        { path: 'topics' },
      ]);
      return res.send({ plant });
    } catch (err) {
      return res
        .status(400)
        .send({ error: 'error when searching for this plant ' });
    }
  }

  // Deletando planta por id
  static async deletePlant(req, res) {
    try {
      const deleted = await Plant.findByIdAndRemove(req.params.plantId);

      return res.send(deleted);
    } catch (err) {
      return res.status(400).send({ error: 'Error when Delete this plant' });
    }
  }

  // Dando upgrade planta por id
  static async updatePlant(req, res) {
    try {
      const { topics, ...plantPayload } = req.body;

      const plant = await Plant.findByIdAndUpdate(
        req.params.plantId,
        plantPayload,
        { new: true }
      );

      plant.topics = [];

      await Topic.deleteOne({ plant: plant._id });

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
  }
}

module.exports = PlantController;
