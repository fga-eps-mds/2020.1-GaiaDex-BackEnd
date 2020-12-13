const { Topic, defaultTopicPopulate } = require('../models/Topic');
const User = require('../models/User');
const Plant = require('../models/Plant');
const topicSchema = require('../schemas/topicSchema');

class TopicController {
  static async createTopic(req, res) {
    try {
      const user = await User.findById(req.params.userId);
      const plant = await Plant.findById(req.params.plantId);

      const result = topicSchema.validate(req.body);

      if (result.error) {
        return res
          .status(400)
          .send({ error: `Error while creating topic. ${result.error}` });
      }

      const topic = await Topic.create({
        ...req.body,
        user: req.params.userId,
        plant: req.params.plantId,
      });
      await topic.save();

      user.topics.push(topic);
      await user.save();

      plant.topics.push(topic);
      await plant.save();

      return res.send({ topic });
    } catch (err) {
      return res
        .status(400)
        .send({ error: `Error while creating topic.\n${err}` });
    }
  }

  static async updateTopic(req, res) {
    try {
      const topic = await Topic.findById(req.params.topicId);

      const newData = req.body;

      if (!('title' in newData)) {
        newData.title = topic.title;
      }

      if (!('description' in newData)) {
        newData.description = topic.description;
      }

      const result = topicSchema.validate(newData);
      if (result.error) {
        return res
          .status(400)
          .send({ error: `Error while creating topic. ${result.error}` });
      }

      const topicNew = await Topic.findOneAndUpdate(
        { _id: req.params.topicId },
        newData,
        { useFindAndModify: false }
      ).populate(defaultTopicPopulate);
      return res.send(topicNew);
    } catch (err) {
      return res
        .status(400)
        .send({ error: `Error while updating topic.\n${err}` });
    }
  }

  static async deleteTopic(req, res) {
    try {
      const topic = await Topic.findById(req.params.topicId);
      const user = await User.findById(topic.user);
      const plant = await Plant.findById(topic.plant);

      const indexAtUser = user.topics.indexOf(req.params.topicId);
      const indexAtPlant = plant.topics.indexOf(req.params.topicId);

      if (indexAtUser > -1) {
        user.topics.splice(indexAtUser, 1);
      }
      if (indexAtPlant > -1) {
        plant.topics.splice(indexAtPlant, 1);
      }

      user.save();
      plant.save();

      await Topic.findByIdAndRemove(req.params.topicId, {
        useFindAndModify: false,
      });

      return res.send(topic);
    } catch (err) {
      return res
        .status(400)
        .send({ error: `Error while deleting topic.\n${err}` });
    }
  }

  static async listTopics(req, res) {
    try {
      const topic = await Topic.find().populate(defaultTopicPopulate);
      return res.send({ topic });
    } catch (err) {
      return res
        .status(400)
        .send({ error: `Error while listing topics.\n${err}` });
    }
  }

  static async findTopic(req, res) {
    try {
      const topic = await Topic.findById(req.params.topicId).populate(
        defaultTopicPopulate
      );

      return res.send(topic);
    } catch (err) {
      return res
        .status(400)
        .send({ error: `Error while find topic id.\n${err}` });
    }
  }

  static async refreshTopicContents(res, topicId) {
    const topicTrue = await Topic.findById(topicId).populate(
      defaultTopicPopulate
    );
    return res.send(topicTrue);
  }
}

module.exports = TopicController;
