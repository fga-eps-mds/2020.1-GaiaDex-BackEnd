const express = require('express');

const router = express.Router();

const Topic = require('../models/Topic');
const Comment = require('../models/Comment');

router.post('/create/:topicId/:userId', async (req, res) => {
  try {
    if (!req.body.text)
      return res.status(400).send({ error: 'Comment should not be empty' });

    const comment = await Comment.create({
      ...req.body,
      user: req.params.userId,
      topic: req.params.topicId,
    });
    const topic = await Topic.findById(req.params.topicId).populate([{path:'comments',populate:{path:'user'}},{path:'user'},{path:'plant'}]);;

    await comment.save();

    topic.comments.push(comment);
    await topic.save();

    return res.send(topic);
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
    const comment = await Comment.findById(req.params.commentId);
    const topic = await Topic.findById(comment.topic);

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

router.post('/like/:commentId', async (req, res) => {
  try {
    await Comment.findOneAndUpdate(
      { _id: req.params.commentId },
      { $inc: { likes: 1 } },
      { useFindAndModify: false }
    );
    return res.send({ message: 'Liked!' });
  } catch (err) {
    return res.status(400).send({ error: `Error while liking comment.${err}` });
  }
});

router.post('/dislike/:commentId', async (req, res) => {
  try {
    await Comment.findOneAndUpdate(
      { _id: req.params.commentId },
      { $inc: { dislikes: 1 } },
      { useFindAndModify: false }
    );
    return res.send({ message: 'Disliked!' });
  } catch (err) {
    return res
      .status(400)
      .send({ error: `Error while linking comment.${err}` });
  }
});

module.exports = router;
