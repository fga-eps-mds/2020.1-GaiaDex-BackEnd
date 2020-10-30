const express = require('express');
const { auth } = require('../lib/auth');
const AuthController = require('../controller/AuthController');

const routes = new express.Router();

routes.post('/login', AuthController.login);
routes.post('/signup', AuthController.signUp);
routes.put('/update/:id', auth, AuthController.updateId);
routes.delete('/delete/:id', auth, AuthController.deleteId);

module.exports = routes;
