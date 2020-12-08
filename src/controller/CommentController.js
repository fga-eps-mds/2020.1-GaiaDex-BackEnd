const { Topic, defaultTopicPopulate } = require('../models/Topic');
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
      const newTopic = await Topic.findById(comment.topic).populate(
        defaultTopicPopulate
      );
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
      const comment = await Comment.findById(req.params.commentId);
      const topic = await Topic.findById(comment.topic);
      const index = topic.comments.indexOf(req.params.commentId);

      if (index > -1) {
        topic.comments.splice(index, 1);
      }

      topic.save();

      await Comment.findByIdAndRemove(req.params.commentId);
      const newTopic = await Topic.findById(comment.topic).populate(
        defaultTopicPopulate
      );
      return res.send(newTopic);
    } catch (err) {
      return res
        .status(400)
        .send({ error: `Error while deleting topic.${err}` });
    }
  }

  static async handleLikeOrDislike(req, res) {
    const option = req.path.split('/')[1];
    try {
      const comment = await Comment.findById(req.params.commentId);
      const topic = await Topic.findById(comment.topic).populate(
        defaultTopicPopulate
      );
      const isLiked = await Like.findOne({
        user: req.userId,
        comment: req.params.commentId,
      });

      if ((option === 'like') === !isLiked) {
        const hadErrors = await CommentController.createLikeOrDislike(
          option,
          req.userId,
          res,
          comment,
          isLiked
        );
        if (!hadErrors) {
          return await CommentController.updatedTopic(res, comment);
        }
        return hadErrors;
      }
      return res.send(topic);
    } catch (err) {
      return res
        .status(400)
        .send({ error: `Error while ${option.slice(0, -1)}ing.${err}` });
    }
  }

  static async createLikeOrDislike(option, userId, res, comment, isLiked) {
    if (option === 'like') {
      return CommentController.likeComment(userId, res, comment);
    }
    return CommentController.dislikeComment(res, comment, isLiked);
  }

  static async updatedTopic(res, comment) {
    const topicTrue = await Topic.findById(comment.topic).populate(
      defaultTopicPopulate
    );
    return res.send(topicTrue);
  }

  static async likeComment(userId, res, comment) {
    const user = await User.findById(userId);
    try {
      const like = await Like.create({
        user,
        comment,
      });
      await like.save();
      comment.likes.push(like);
      await comment.save();
      return null;
    } catch (err) {
      return res.status(400).send({ error: `Error while liking.${err}` });
    }
  }

  static async dislikeComment(res, comment, like) {
    try {
      const index = comment.likes.indexOf(like._id);
      if (index > -1) {
        comment.likes.splice(index, 1);
      }
      await comment.save();
      await Like.findByIdAndRemove(like._id);
      return null;
    } catch (err) {
      return res.status(400).send({ error: `Error while disliking.${err}` });
    }
  }
}

module.exports = CommentController;
