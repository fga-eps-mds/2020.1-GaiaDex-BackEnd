const { Topic, defaultTopicPopulate } = require('../models/Topic');
const Comment = require('../models/Comment');
const Like = require('../models/Like');
const User = require('../models/User');
const TopicController = require('./TopicController');

class LikeController {
  constructor(topic, like, isLike, isTopic) {
    this.topic = topic;
    this.like = like;
    this.isLike = isLike;
    this.isTopic = isTopic;
  }

  getEntity() {
    if (this.isTopic) {
      return this.topic;
    }
    return this.comment;
  }

  static getEntityName(isTopic) {
    return isTopic ? 'topic' : 'comment';
  }

  static async getController(req, isLike, isTopic) {
    const entityParameter = isTopic ? req.params.topicId : req.params.commentId;
    const entityName = LikeController.getEntityName(this.isTopic);

    const topic = isTopic
      ? await Topic.findById(entityParameter).populate(defaultTopicPopulate)
      : await Topic.findOne({})
          .populate({
            path: 'comments',
            match: { _id: entityParameter },
          })
          .exec();

    const like = await Like.findOne({
      user: req.userId,
      [entityName]: entityParameter,
    });

    return new LikeController(topic, like, isLike, isTopic);
  }

  static async handleLikeOrDislike(req, res) {
    const isTopic = req.baseUrl.split('/')[1] === 'topic';
    const isLike = req.path.split('/')[1] === 'like';
    try {
      const controller = await LikeController.getController(
        req,
        isLike,
        isTopic
      );
      if (isLike === !controller.like) {
        return await controller.callCommentOrTopic(req, res);
      }

      return res.send(controller.topic);
    } catch (err) {
      return res
        .status(400)
        .send({ error: `Error while liking/disliking topic/comment.\n${err}` });
    }
  }

  async callCommentOrTopic(req, res) {
    let topicId;
    if (!this.isTopic) {
      this.comment = await Comment.findById(req.params.commentId);
      topicId = this.comment.topic;
    } else {
      topicId = this.topic.id;
    }
    await this.applyLikeDislike(req.userId);
    return TopicController.refreshTopicContents(res, topicId);
  }

  async applyLikeDislike(userId) {
    if (this.isLike) {
      await this.applyLike(userId);
    } else {
      await this.applyDislike();
    }
  }

  async applyLike(userId) {
    const user = await User.findById(userId);
    const entityName = LikeController.getEntityName(this.isTopic);
    const like = await Like.create({
      user,
      [entityName]: this.getEntity(),
    });
    await like.save();
    this.getEntity().likes.push(like);
    await this.getEntity().save();
  }

  async applyDislike() {
    const index = this.getEntity().likes.indexOf(this.like._id);
    if (index > -1) {
      this.getEntity().likes.splice(index, 1);
    }
    await this.getEntity().save();
    const deletedLike = await Like.findByIdAndRemove(this.like._id);
    if (this.isTopic) {
      deletedLike.populate(defaultTopicPopulate);
    }
  }
}

module.exports = LikeController;
