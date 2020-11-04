const express = require('express');
const TopicController = require('../controller/TopicController');

const router = express.Router();

router.post('/create/:plantId/:userId', TopicController.create);
router.put('/update/:topicId', TopicController.update);
router.delete('/delete/:topicId', TopicController.delete);
router.get('/list', TopicController.list);
router.post('/like/:topicId', TopicController.like);
router.post('/dislike/:topicId', TopicController.dislike);

module.exports = router;
