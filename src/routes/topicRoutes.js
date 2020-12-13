const express = require('express');
const { auth } = require('../lib/auth');
const TopicController = require('../controller/TopicController');


const router = new express.Router();
router.post('/create/:plantId', auth, TopicController.createTopic);
router.put('/update/:topicId', TopicController.updateTopic);
router.delete('/delete/:topicId', TopicController.deleteTopic);
router.get('/list', TopicController.listTopics);
router.post('/like/:topicId', auth, TopicController.likeTopic);
router.post('/dislike/:topicId', auth, TopicController.dislikeTopic);
router.get('/find/:topicId', TopicController.findTopic);

module.exports = router;
