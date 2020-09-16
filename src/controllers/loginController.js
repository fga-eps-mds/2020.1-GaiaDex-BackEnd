const express = require('express');

const jsonwebtoken = require('jsonwebtoker');

const User = require('../models/User');

const router = express.Router();

const authConfig = require('../config/auth');

router.post('/login', async(req, res) => {
    const {email, password} = req.body;

    const user = await User.findOne({ email }).select('+password');

    if(!user){
        
        return res.status(400).send({Error: 'User not found'});

    }

    if(!await password == user.password){
        
        return res.status(400).send({ Error: 'Incorrect password'});

    }

    user.password = undefined;

    const token = jsonwebtoken.sign({id: user.id}, authConfig.secret,{
        expiresIn: 86400,
    }); 

    res.send({ user, token });
});

module.exports = app => app.use('/', router);