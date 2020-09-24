const express = require('express');
const router = express.Router();

const Topic = require('../models/topic');
const User = require('../models/user');

router.post('/create/:userId', async (req, res, next) => {
    
    try {

        const topic = await Topic.create({...req.body, user: req.params.userId});
        await topic.save();

        const user = await User.findById(req.params.userId);

        if (!user) {
            const error = new Error('User not found.');
            return next(error);
        }

        user.topics.push(topic);

        await user.save();
    
        return res.send({ topic });

    } catch (err) {
        return next(err);
    }

});

module.exports = router;
