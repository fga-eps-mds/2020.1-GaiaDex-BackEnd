const express = require('express');
const router = express.Router();

const Topic = require('../models/topic');
const User = require('../models/user');
const Comment = require('../models/comment');

router.post('/create/:topicId/:userId', async (req, res) => {
    try {

        const comment = await Comment.create({...req.body, user: req.params.userId, topic: req.params.topicId});
        const topic = await Topic.findById(req.params.topicId);

        await comment.save();

        topic.comments.push(comment);
        await topic.save();
    
        return res.send({ message: 'Comment successfully registered.' });

    } catch (err) {
        return res.status(400).send({ error: 'Error while commenting.' + err});
    }
});

router.put('/update/:commentId', async (req, res) => {

    try {

        await Comment.findById(req.params.commentId);
        const newData = req.body;

        if ( !newData.text ) return res.status(400).send({ error: 'Comment should not be empty'});
    
        await Comment.findOneAndUpdate({_id: req.params.commentId}, req.body, { useFindAndModify: false})
        .then( () => {
            res.send({ message: 'Comment updated successfully.'});
        });

    } catch (err) {
        return res.status(400).send({ error: 'Error while updating comment.' + err});
    }

});

router.delete('/update/:commentId', async (req, res) => {

    try {

        await Comment.findByIdAndRemove(req.params.commentId).populate('user')

        return res.send({
            message: 'Comment successfully removed.'
        });

    } catch (err) {
        return res.status(400).send({ error: 'Error while deleting topic.'});
    }

});

module.exports = router;
