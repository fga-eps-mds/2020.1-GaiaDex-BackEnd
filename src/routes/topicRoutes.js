const express = require('express');

const router = express.Router();
const Like = require('../models/Likes');
const Topic = require('../models/Topic');
const User = require('../models/User');
const Plant = require('../models/Plant');
const topicSchema = require('../schemas/topicSchema');
const { auth } = require('./auth');

router.post('/create/:plantId/:userId', async (req, res) => {
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
    return res.status(400).send({ error: `Error while creating topic.${err}` });
  }
});

router.put('/update/:topicId', async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.topicId);

    const newData = req.body;

    if (!newData.title) newData.title = topic.title;
    if (!newData.description) newData.description = topic.description;

    const result = topicSchema.validate(newData);
    if (result.error) {
      return res
        .status(400)
        .send({ error: `Error while creating topic. ${result.error}` });
    }

    const topicNew = await Topic.findOneAndUpdate(
      { _id: req.params.topicId },
      newData,
      {
        useFindAndModify: true,
      }
    ).populate([
      { path: 'comments', populate: 'user' },
      { path: 'user' },
      { path: 'plnt' },
    ]);
    return res.send(topicNew);
  } catch (err) {
    return res.status(400).send({ error: `Error while updating topic.${err}` });
  }
});

router.delete('/delete/:topicId', async (req, res) => {
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
    return res.status(400).send({ error: `Error while deleting topic.${err}` });
  }
});

router.get('/list', async (req, res) => {
  try {
    const topic = await Topic.find().populate([
      { path: 'comments', populate: 'user' },
      { path: 'user' },
      { path: 'plant' },
    ]);
    return res.send({ topic });
  } catch (err) {
    return res.status(400).send({ error: `Error while listing topics.${err}` });
  }
});

router.post('/like/:topicId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const topic = await Topic.findById(req.params.topicId).populate([
      { path: 'comments', populate: 'user' },
      { path: 'user' },
      { path: 'plant' },
    ]);
    const isLiked = await Like.findOne({
      user: req.userId,
      topic: req.params.topicId,
    });
    if (isLiked == null) {
      const like = await Like.create({
        user,
        topic,
      });
      await like.save();
      topic.likes.push(like);
      await topic.save();
      const topictrue = await Topic.findById(req.params.topicId).populate([
        { path: 'comments', populate: 'user' },
        { path: 'user' },
        { path: 'plant' },
      ]);
      return res.send(topictrue);
    }
    console.log(topic.likes.length);
    return res.send(topic);
  } catch (err) {
    return res.status(400).send({ error: `Error while commenting.${err}` });
  }
});

router.post('/dislike/:topicId', auth, async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.topicId).populate([
      { path: 'comments', populate: 'user' },
      { path: 'user' },
      { path: 'plant' },
    ]);
    const like = await Like.findOne({
      user: req.userId,
      topic: req.params.topicId,
    });
    if (like != null) {
      const index = topic.likes.indexOf(like._id);
      if (index > -1) {
        topic.likes.splice(index, 1);
      }
      topic.save();
      await Like.findByIdAndRemove(like._id).populate([
        { path: 'comments', populate: 'user' },
        { path: 'user' },
        { path: 'plant' },
      ]);
    }
    return res.send(topic);
  } catch (err) {
    return res.status(400).send({ error: `Error while commenting.${err}` });
  }
});
router.get('/find/:topicId', async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.topicId).populate([
      { path: 'comments', populate: 'user' },
      { path: 'user' },
      { path: 'plnt' },
    ]);

    return res.send(topic);
  } catch (err) {
    return res.status(400).send({ error: `Error while find topic id.${err}` });
  }
});


module.exports = router;
