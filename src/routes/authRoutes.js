const express = require('express');
const { auth } = require('../lib/auth');
const AuthController = require('../controller/AuthController');

const router = new express.Router();

router.post('/login', AuthController.login);
router.post('/signup', AuthController.signUp);
router.get('/user/:id', AuthController.userId);
router.put('/update/:id', auth, AuthController.updateId);
router.delete('/delete', auth, AuthController.deleteId);
router.get('/user', auth, AuthController.loggedUser);

module.exports = router;
