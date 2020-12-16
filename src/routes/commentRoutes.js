const express = require('express');
const { auth } = require('../lib/auth');
const CommentController = require('../controller/CommentController');

const router = new express.Router();

router.post('/create/:topicId', auth, CommentController.createComment);
router.put('/update/:commentId', auth, CommentController.updateComment);
router.delete('/delete/:commentId', auth, CommentController.deleteComment);
router.post('/like/:commentId', auth, CommentController.likeComment);
router.post('/dislike/:commentId', auth, CommentController.dislikeComment);

module.exports = router;
