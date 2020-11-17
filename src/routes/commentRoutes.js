const express = require('express');

const router = express.Router();
const User = require('../models/User');
const Like = require('../models/Likes');
const Topic = require('../models/Topic');
const Comment = require('../models/Comment');
const { auth } = require('./auth');

router.post('/create/:topicId/:userId', async (req, res) => {
  try {
    if (!req.body.text)
      return res.status(400).send({ error: 'Comment should not be empty' });

    const comment = await Comment.create({
      ...req.body,
      user: req.params.userId,
      topic: req.params.topicId,
    });
    const topic = await Topic.findById(req.params.topicId).populate([
      { path: 'comments', populate: { path: 'user' } },
      { path: 'user' }
    ]);

    await comment.save();

    topic.comments.push(comment);
    await topic.save();
    const topicCorrect = await Topic.findById(req.params.topicId).populate([
      { path: 'comments', populate: { path: 'user' } },
      { path: 'user' }
    ]);
    return res.send(topicCorrect);
  } catch (err) {
    return res.status(400).send({ error: `Error while commenting.${err}` });
  }
});

router.put('/update/:commentId', async (req, res) => {
  try {
    await Comment.findById(req.params.commentId);
    const newData = req.body;

    if (!newData.text)
      return res.status(400).send({ error: 'Comment should not be empty' });

    await Comment.findOneAndUpdate({ _id: req.params.commentId }, req.body, {
      useFindAndModify: false,
    });
    return res.send({ message: 'Comment updated successfully.' });
  } catch (err) {
    return res
      .status(400)
      .send({ error: `Error while updating comment.${err}` });
  }
});

router.delete('/delete/:commentId', async (req, res) => {
  try {
    const topic = Topic.findById(req.body.topicId);
    const index = topic.comments.indexOf(req.params.commentId);

    if (index > -1) {
      topic.comments.splice(index, 1);
    }

    topic.save();

    await Comment.findByIdAndRemove(req.params.commentId).populate('user');

    return res.send({
      message: 'Comment successfully removed.',
    });
  } catch (err) {
    return res.status(400).send({ error: `Error while deleting topic.${err}` });
  }
});

router.post('/like/:commentId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const comment = await Comment.findById(req.params.commentId).populate([
      { path: 'likes' },
      { path: 'user' },
      { path: 'toppic' },
    ]);
    const topic = await Topic.findById(comment.topic).populate([
      { path: 'likes' },
      { path: 'user' },
      { path: 'toppic' },
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
        { path: 'likes' },
        { path: 'user' },
        { path: 'comments' },
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
    const topic = await Topic.findById(comment.topic);
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
      await Like.findByIdAndRemove(like._id).populate('user');
      const topicTrue = await Topic.findById(comment.topic).populate([
        { path: 'likes' },
        { path: 'user' },
        { path: 'comments' },
      ]);
      return res.send(topicTrue);
    }
    return res.send(topic);
  } catch (err) {
    return res.status(400).send({ error: `Error while commenting.${err}` });
  }
});

module.exports = router;
