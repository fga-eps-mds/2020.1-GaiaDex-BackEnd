const express = require('express');
const router = express.Router();

const Topic = require('../models/topic');
const User = require('../models/user');

router.post('/create/:userId', async (req, res, next) => {
    
    try {

        const topic = await Topic.create({...req.body, user: req.params.userId});
        const user = await User.findById(req.params.userId);

        await topic.save();

        user.topics.push(topic);
        await user.save();
    
        return res.send({ topic });

    } catch (err) {
        return res.status(400).send({ error: 'Error while creating topic.' + err});
    }

});

router.put('/update/:topicId', async (req, res, next) => {

    try {

        const topic = await Topic.findById(req.params.topicId);

        const newData = req.body;

        if (!newData.title) newData.title = topic.title;
        if (!newData.description) newData.description = topic.description;
        if (!newData.completed) newData.completed = topic.completed;

    
        await Topic.findOneAndUpdate({_id: req.params.topicId}, req.body, { useFindAndModify: false})
        .then( () => {
            res.send({ message: 'Topic updated successfully.'});
        });

    } catch (err) {
        return res.status(400).send({ error: 'Error while updating topic.'});
    }

});

router.delete('/delete/:topicId', async (req, res, next) => {
    try {

        await Topic.findByIdAndRemove(req.params.topicId).populate('user')

        return res.send({
            message: 'Topic successfully removed.'
        });

    } catch (err) {
        return res.status(400).send({ error: 'Error while deleting topic.'});
    }
});

router.get('/list_topics', async (req, res, next) => {
    try {

        const topic = await Topic.find().populate(['user']);

        return res.send({ topic });

    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: 'Error while listing topics.'});
    }
});

router.delete('/delete/:topicId', async (req, res) => {
    try {
        await Topic.findByIdAndRemove(req.params.topicId).populate('user');

        return res.send({
            message: 'Topic successfully removed.'
        });
    } catch (err) {
        console.log(err);
        return res.next({ error: 'Error deleting topic.' });
    }
});

router.get('/list_topics', async (req, res, next) => {
    try {
        const topic = await Topic.find().populate(['user']);

        return res.send({ topic });
    } catch (err) {
        console.log(err);
        return res.next({ error: 'Error loading topics.' });
    }
});

router.post('/comment/:topicId/:userId', async (req, res, next) => {
    try {

        const comment = await Comment.create({...req.body, user: req.params.userId, topic: req.params.topicId});
        const user = await User.findById(req.params.userId);
        const topic = await Topic.findById(req.params.topicId);

        if (!user) return next(new Error('User not found.'));
        if (!topic) return next(new Error('Topic not found.'));

        await comment.save();

        topic.comments.push(comment);
        await topic.save();
    
        return res.send({ message: 'Comment successfully registered.' });

    } catch (err) {
        console.log(err);
        return res.next({ error: 'Error, it was not possible to comment.'});
    }
});

router.put('/update_comment/:commentId', async (req, res, next) => {

    try {

        const comment = await Comment.findById(req.params.commentId);

        if (!comment) return next(new Error('Comment not found.'));

        const newData = req.body;

        if (!newData.text) return next(new Error('Comment should not be empty.'));;
    
        await Comment.findOneAndUpdate({_id: req.params.commentId}, req.body, { useFindAndModify: false})
        .then( () => {
            res.send({ message: 'Comment updated successfully.'});
        });

    } catch (err) {
        console.log(err);
        return res.next({ error: 'Error updating comment.' });
    }

});

module.exports = router;
