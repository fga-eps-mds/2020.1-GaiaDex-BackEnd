const Topic = require('../models/Topic');
const Comment = require('../models/Comment');
const Like = require('../models/Like');
const User = require('../models/User');

class CommentController {
  // router.post('/create/:topicId/:userId', async (req, res) => {
  static async createComment(req, res) {
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
      return res.send(topic);
    } catch (err) {
      return res.status(400).send({ error: `Error while commenting.${err}` });
    }
  }

  // router.put('/update/:commentId', async (req, res) => {
  static async updateComment(req, res) {
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
  }

  // router.delete('/delete/:commentId', async (req, res) => {
  static async deleteComment(req, res) {
    try {
      const comment = Comment.findById(req.params.commentId);
      const topic = Topic.findById(comment.topic);
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
      return res
        .status(400)
        .send({ error: `Error while deleting topic.${err}` });
    }
  }

  // router.post('/like/:commentId', async (req, res) => {
  static async likeComment(req, res) {
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
  }

  // router.post('/dislike/:commentId', async (req, res) => {
  static async dislikeComment(req, res) {
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
  }
}

module.exports = CommentController;
