const express = require('express');

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

    res.send({ user });
});