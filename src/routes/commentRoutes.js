const express = require('express');
const CommentController = require('../controller/CommentController');

const router = express.Router();

router.post('/create/:topicId/:userId', CommentController.createComment);
router.put('/update/:commentId', CommentController.updateComment);
router.delete('/delete/:commentId', CommentController.deleteComment);
router.post('/like/:commentId', CommentController.likeComment);
router.post('/dislike/:commentId', CommentController.dislikeComment);

module.exports = router;
