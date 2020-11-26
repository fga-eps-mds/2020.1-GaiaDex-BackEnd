const Topic = require('../models/Topic');
const Comment = require('../models/Comment');

class CommentController {
  static async createComment(req, res) {
    try {
      if (!req.body.text)
        return res.status(400).send({ error: 'Comment should not be empty' });

      const comment = await Comment.create({
        ...req.body,
        user: req.params.userId,
        topic: req.params.topicId,
      });
      const topic = await Topic.findById(req.params.topicId);

      await comment.save();

      topic.comments.push(comment);
      await topic.save();

      return res
        .status(200)
        .send({ message: 'Comment successfully registered.' });
    } catch (err) {
      return res.status(400).send({ error: `Error while commenting.${err}` });
    }
  }

  // router.put('/update/:commentId', async (req, res) => {
  static async updateComment(req, res) {
    try {
      await Comment.findById(req.params.commentId);
      const newData = req.body;

      if (!newData.text)
        return res.status(400).send({ error: 'Comment should not be empty' });

      await Comment.findOneAndUpdate({ _id: req.params.commentId }, req.body, {
        useFindAndModify: false,
      });
      return res.statue(200).send({ message: 'Comment updated successfully.' });
    } catch (err) {
      return res
        .status(400)
        .send({ error: `Error while updating comment.${err}` });
    }
  }

  // router.delete('/delete/:commentId', async (req, res) => {
  static async deleteComment(req, res) {
    console.log('*************\n');
    console.log(req.body);
    console.log('*************\n');
    try {
      const topic = await Topic.findById(req.body.topicId);
      console.log(topic);
      const index = topic.comments.indexOf(req.params.commentId);
      if (index > -1) {
        topic.comments.splice(index, 1);
      }

      topic.save();

      await Comment.findByIdAndRemove(req.params.commentId).populate('user');

      return res.status(200).send({
        message: 'Comment successfully removed.',
      });
    } catch (err) {
      return res
        .status(400)
        .send({ error: `Error while deleting comment.${err}` });
    }
  }

  // router.post('/like/:commentId', async (req, res) => {
  static async likeComment(req, res) {
    try {
      await Comment.findOneAndUpdate(
        { _id: req.params.commentId },
        { $inc: { likes: 1 } },
        { useFindAndModify: false }
      );
      return res.status(200).send({ message: 'Liked!' });
    } catch (err) {
      return res
        .status(400)
        .send({ error: `Error while liking comment.${err}` });
    }
  }

  // router.post('/dislike/:commentId', async (req, res) => {
  static async dislikeComment(req, res) {
    try {
      await Comment.findOneAndUpdate(
        { _id: req.params.commentId },
        { $inc: { dislikes: 1 } },
        { useFindAndModify: false }
      );
      return res.status(200).send({ message: 'Disliked!' });
    } catch (err) {
      return res
        .status(400)
        .send({ error: `Error while linking comment.${err}` });
    }
  }
}

module.exports = CommentController;
