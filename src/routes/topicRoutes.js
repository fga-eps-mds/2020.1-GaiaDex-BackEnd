const express = require('express');
const router = express.Router();

const Topic = require('../models/topic');
const User = require('../models/user');

router.post('/create/:userId', async (req, res, next) => {
    
    try {

        const topic = await Topic.create({...req.body, user: req.params.userId});
        const user = await User.findById(req.params.userId);

        if (!user) {
            const error = new Error('User not found.');
            return next(error);
        }

        await topic.save();

        user.topics.push(topic);
        await user.save();
    
        return res.send({ topic });

    } catch (err) {
        console.log(err);
        return next({ error: 'Error creating topic.' });
    }

});

router.put('/update/:topicId', async (req, res) => {

    try {

        const topic = await Topic.findById(req.params.topicId);

        if (!topic) {
            const error = new Error('Topic not found.');
            return next(error);
        }

        const newData = req.body;

        if (!newData.title) newData.title = topic.title;
        if (!newData.description) newData.description = topic.description;
        if (!newData.completed) newData.completed = topic.completed;

    
        await Topic.findOneAndUpdate({_id: req.params.topicId}, req.body, { useFindAndModify: false})
        .then( () => {
            res.send({ message: 'Topic updated successfully.'});
        });

    } catch (err) {
        console.log(err);
        return res.next({ error: 'Error updating topic.' });
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

router.get('/list_topics', async (req, res) => {
    try {
        const topic = await Topic.find().populate(['user']);

        return res.send({ topic });
    } catch (err) {
        console.log(err);
        return res.next({ error: 'Error loading topics.' });
    }
});

module.exports = router;
