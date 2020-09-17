const express = require('express');

const jsonwebtoken = require('jsonwebtoken');

const User = require('../models/user');

const router = express.Router();

//const authConfig = require('../config/auth');
const authConfig = {
    "secret": "d41d8cd98f00b204e9800998ecf8427e" 
};

router.post('/login', async(req, res) => {    
    const {email, password} = req.body;

    const user = await User.findOne({ email }).select('+password');
    /*const user = {
        "email": "asda@asd.com",
        "password": "asdz"
    };*/

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

    res.send({user, token });
});

module.exports = app => app.use('/', router);