const express = require('express');
const TopicController = require('../controller/TopicController');

const router = express.Router();

router.post('/create/:plantId/:userId', TopicController.createTopic);
router.put('/update/:topicId', TopicController.updateTopic);
router.delete('/delete/:topicId', TopicController.deleteTopic);
router.get('/list', TopicController.listTopics);
router.post('/like/:topicId', TopicController.likeTopic);
router.post('/dislike/:topicId', TopicController.dislikeTopic);

module.exports = router;
