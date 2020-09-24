const express = require('express');
const router = express.Router();

const Topic = require('../models/topic');
const User = require('../models/user');
const Comment = require('../models/comment');

router.post('/create/:topicId/:userId', async (req, res, next) => {
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

router.put('/update/:commentId', async (req, res, next) => {

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
