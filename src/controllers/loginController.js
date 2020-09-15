const express = require('express');

const jasonwebtoken = require('jasonwebtoker');

const User = require('../models/User');

const router = express.Router();

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

    const token = jasonwebtoken.sign({id: user.id}) 

    res.send({ user });
});

module.exports = app => app.use('/', router);