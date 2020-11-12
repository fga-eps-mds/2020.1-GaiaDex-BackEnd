const Topic = require('../models/Topic');
const Comment = require('../models/Comment');

class CommentController{
  async createComment(req, res){
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
  
      return res.status(200).send({ message: 'Comment successfully registered.' });
      } catch (err) {
        return res.status(400).send({ error: `Error while commenting.${err}` });
      }  
    }

    async updateComment(req, res){
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

    async deleteComment(req, res){
      try {
        const comment = await Comment.findById(req.params.commentId);
        const topic = await Topic.findById(comment.topic);
    
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
        return res.status(400).send({ error: `Error while deleting topic.${err}` });
      }
    }

    async likeComment(req, res){
      try {
        await Comment.findOneAndUpdate(
          { _id: req.params.commentId },
          { $inc: { likes: 1 } },
          { useFindAndModify: false }
        );
        return res.status(200).send({ message: 'Liked!' });
      } catch (err) {
        return res.status(400).send({ error: `Error while liking comment.${err}` });
      }
    }

    async dislikeComment(req, res){
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

module.exports = new CommentController();
