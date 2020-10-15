const express = require('express');
const router = express.Router();

const Topic = require('../models/Topic');
const User = require('../models/User');
const Plant = require('../models/Plant');
const topicSchema = require('../schemas/topicSchema');

router.post('/create/:plantId/:userId', async (req, res) => {
    
    try {

        const user = await User.findById(req.params.userId);
        const plant = await Plant.findById(req.params.plantId);

        const result = topicSchema.validate(req.body);

        if ( result.error ) return res.status(400).send({ error: 'Error while creating topic. ' + result.error});

        const topic = await Topic.create({...req.body, user: req.params.userId, plant: req.params.plantId});

        await topic.save();

        user.topics.push(topic);
        await user.save();

        plant.topics.push(topic);
        await plant.save();
    
        return res.send({ topic });

    } catch (err) {
        return res.status(400).send({ error: 'Error while creating topic.' + err });
    }

});

router.put('/update/:topicId', async (req, res) => {

    try {

        const topic = await Topic.findById(req.params.topicId);

        const newData = req.body;

        if (!newData.title) newData.title = topic.title;
        if (!newData.description) newData.description = topic.description;

        const result = topicSchema.validate(newData);
        if ( result.error ) return res.status(400).send({ error: 'Error while creating topic. ' + result.error});
    
        await Topic.findOneAndUpdate({_id: req.params.topicId}, newData, { useFindAndModify: false})
        .then( () => {
            res.send({ message: 'Topic updated successfully.'});
        });

    } catch (err) {
        return res.status(400).send({ error: 'Error while updating topic.' + err });
    }

});

router.delete('/delete/:topicId', async (req, res) => {
    try {

        const topic = await Topic.findById(req.params.topicId);
        const user = await User.findById(topic.user);
        const plant = await Plant.findById(topic.plant);

        const indexAtUser = user.topics.indexOf(req.params.topicId);
        const indexAtPlant = plant.topics.indexOf(req.params.topicId);

        if (indexAtUser > -1) {
            user.topics.splice(indexAtUser, 1);
        }
        if (indexAtPlant > -1) {
            plant.topics.splice(indexAtPlant, 1);
        }

        user.save();
        plant.save();

        await Topic.findByIdAndRemove(req.params.topicId, { useFindAndModify: false });

        return res.send({
            message: 'Topic successfully removed.'
        });

    } catch (err) {
        return res.status(400).send({ error: 'Error while deleting topic.' + err });
    }
});

router.get('/list', async (req, res) => {
    try {

        const topic = await Topic.find().populate(['user']);

        return res.send({ topic });

    } catch (err) {
        return res.status(400).send({ error: 'Error while listing topics.' + err });
    }
});

router.post('/like/:topicId', async (req, res) => {
    try {

        await Topic.findOneAndUpdate({_id: req.params.topicId}, { $inc: { likes: 1 }}, { useFindAndModify: false})
        .then( () => {
            res.send({ message: 'Liked!'});
        });
        
    } catch (err) {
        return res.status(400).send({ error: 'Error while liking topic.' + err });
    }
});

router.post('/dislike/:topicId', async (req, res) => {
    try {

        await Topic.findOneAndUpdate({_id: req.params.topicId}, { $inc: { dislikes: 1 }}, { useFindAndModify: false})
        .then( () => {
            res.send({ message: 'Disliked!'});
        });
        
    } catch (err) {
        return res.status(400).send({ error: 'Error while dislikinng topic.' + err });
    }
});

module.exports = router;
