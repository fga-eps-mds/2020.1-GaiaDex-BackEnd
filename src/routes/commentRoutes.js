const express = require('express');
const { auth } = require('../lib/auth');
const CommentController = require('../controller/CommentController');
const LikeController = require('../controller/LikeController');

const router = express.Router();

router.post('/create/:topicId', auth, CommentController.createComment);
router.put('/update/:commentId', auth, CommentController.updateComment);
router.delete('/delete/:commentId', auth, CommentController.deleteComment);
router.post('/like/:commentId', auth, LikeController.handleLikeOrDislike);
router.post('/dislike/:commentId', auth, LikeController.handleLikeOrDislike);

module.exports = router;
