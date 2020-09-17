const express = require('express');

const jsonwebtoken = require('jsonwebtoken');

const router = express.Router();

const authConfig = {
    "secret": "d41d8cd98f00b204e9800998ecf8427e" 
};

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

module.exports = app => app.use('/', router);