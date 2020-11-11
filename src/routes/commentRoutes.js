const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');
const Like = require('../models/Likes');
const Topic = require('../models/Topic');
const Comment = require('../models/Comment');
const { auth } = require('./auth');

router.post('/create/:topicId', auth, async (req, res) => {
  try {
    if (!req.body.text)
      return res.status(400).send({ error: 'Comment should not be empty' });

    const comment = await Comment.create({
      text: req.body.text,
      user: req.userId,
      topic: req.params.topicId,
    });
    const topic = await Topic.findById(req.params.topicId).populate([
      { path: 'comments', populate: { path: 'user' } },
      { path: 'user' },
      { path: 'plant' },
    ]);

    await comment.save();
    topic.comments.push(comment);
    await topic.save();

    const topicCorrect = await Topic.findById(req.params.topicId);
    return res.send(topicCorrect);
  } catch (err) {
    return res.status(400).send({ error: `Error while commenting.${err}` });
  }
});

router.put('/update/:commentId', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    const newData = req.body;

    if (!newData.text)
      return res.status(400).send({ error: 'Comment should not be empty' });

    await Comment.findOneAndUpdate({ _id: req.params.commentId }, req.body, {
      useFindAndModify: false,
    });
    const newTopic = await Topic.findById(comment.topic).populate([
      { path: 'comments', populate: 'user' },
      { path: 'user' },
      { path: 'plant' },
    ]);
    return res.send(newTopic);
  } catch (err) {
    return res
      .status(400)
      .send({ error: `Error while updating comment.${err}` });
  }
});

router.delete('/delete/:commentId', auth, async (req, res) => {
  try {
    const topic = Topic.findById(req.body.topicId);
    const index = topic.comments.indexOf(req.params.commentId);

    if (index > -1) {
      topic.comments.splice(index, 1);
    }

    topic.save();

    await Comment.findByIdAndRemove(req.params.commentId);
    const newTopic = await Topic.findById(comment.topic).populate([
      { path: 'comments', populate: 'user' },
      { path: 'user' },
      { path: 'plant' },
    ]);
    return res.send(newTopic);
  } catch (err) {
    return res.status(400).send({ error: `Error while deleting topic.${err}` });
  }
});

router.post('/like/:commentId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const comment = await Comment.findById(req.params.commentId);
    const topic = await Topic.findById(comment.topic).populate([
      { path: 'comments', populate: 'user' },
      { path: 'user' },
      { path: 'plant' },
    ]);
    const isLiked = await Like.findOne({
      user: req.userId,
      comment: req.params.commentId,
    });
    if (isLiked == null) {
      const like = await Like.create({
        user,
        comment,
      });
      await like.save();
      comment.likes.push(like);
      await comment.save();
      const topicTrue = await Topic.findById(comment.topic).populate([
        { path: 'comments', populate: 'user' },
        { path: 'user' },
        { path: 'plant' },
      ]);
      return res.send(topicTrue);
    }
    return res.send(topic);
  } catch (err) {
    return res.status(400).send({ error: `Error while commenting.${err}` });
  }
});

router.post('/dislike/:commentId', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    const topic = await Topic.findById(comment.topic).populate([
      { path: 'comments', populate: 'user' },
      { path: 'user' },
      { path: 'plant' },
    ]);
    const like = await Like.findOne({
      user: req.userId,
      comment: req.params.commentId,
    });
    if (like != null) {
      const index = comment.likes.indexOf(like._id);
      if (index > -1) {
        comment.likes.splice(index, 1);
      }

      comment.save();
      await Like.findByIdAndRemove(like._id);
      const topicTrue = await Topic.findById(comment.topic).populate([
        { path: 'comments', populate: 'user' },
        { path: 'user' },
        { path: 'plant' },
      ]);
      return res.send(topicTrue);
    }
    return res.send(topic);
  } catch (err) {
    return res.status(400).send({ error: `Error while commenting.${err}` });
  }
});

module.exports = router;
