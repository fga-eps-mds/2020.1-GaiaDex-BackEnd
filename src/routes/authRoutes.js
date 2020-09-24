const express = require('express');

const router = express.Router();

const jsonwebtoken = require('jsonwebtoken');

const User = require('../models/user');

router.get('/', (req, res) => {
    res.json({
        message: 'Authentication!'
    });
});

const authConfig = {
    "secret": "d41d8cd98f00b204e9800998ecf8427e" 
};

router.post('/login', async(req, res) => {    
    const {email, password} = req.body;

    //const user = await User.findOne({ email }).select('+password');
    const user = {
        "email": "asda@asd.com",
        "password": "asdz"
    };

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

    const aToken = "Bearer "+token;

    res.header("authToken", aToken);
    res.redirect('/main');
});

router.get('/logout', async(req, res) => { 
    const sessiontoken = req.headers.sessiontoken;

    if(!sessiontoken){
        return res.status(401).send({Error: 'Token not provided'});
    }

    const parts = sessiontoken.split(' ');

    if (!parts.length === 2){
        return res.status(401).send({Error: 'Token error'});
    }
    
    const [scheme, token] = parts;

    if(!/^Bearer$/i.test(scheme)){
        return res.status(401).send({Error: 'Token malformated'});
    }

    jsonwebtoken.verify(token, authConfig.secret, (err, decoded) => {
        if(err){
            return res.status(401).send({Error: 'Token invalid'});
        }

        const token = jsonwebtoken.sign({id: decoded.id}, authConfig.secret,{
            expiresIn: 1,
        });

    });

    res.redirect('/login');
});

module.exports = router;
