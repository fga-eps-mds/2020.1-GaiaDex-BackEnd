const express = require('express');

const router = express.Router();

const jsonwebtoken = require('jsonwebtoken');

const User = require('../models/user');

const userSchema = require('../schemas/userSchema');

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

    const user = await User.findOne({ email, password });
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

    const aToken = "Bearer "+token;

    res.header('authtoken', aToken);
    res.json({
        message: 'Auth token generated'
    }).redirect('/main');
    
});

router.get('/logout', async(req, res) => { 
    const sessiontoken = req.headers.authtoken;

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

router.post('/signup', async(req, res, next) => {

    try {

        const newUserData = req.body;
        const result = userSchema.validate(req.body);

        if( await User.findOne({ username: newUserData.username}) ) {
            const error = new Error('Username already being used.');
            return next(error);
        }

        if( result.error ) {
            return next(result.error);
        }

        const user = new User(newUserData);

        user.save()
            .then( result => {
                return res.send(result);
            })
            .catch( err => next(err));

    } catch(err) {
        return next(err);
    }

});

router.put('/update-user/:id', async(req, res, next) => {

    try {

        const user = await User.findById(req.params.id);
        const newData = req.body;

        if ( !newData.username ) {
            newData.username = user.username;
        }
        if ( !newData.password ) {
            newData.password = user.password;
        }
        if ( !newData.email ) {
            newData.email = user.email;
        }

        const result = userSchema.validate(newData);

        if(result.error) {
            return next(result.error);
        }
        
        await User.findOneAndUpdate({_id: req.params.id}, req.body, { useFindAndModify: false})
                    .then( () => {
                        res.send({ message: 'User updated successfully.'});
                    });

    } catch(err) {
        return next(err);
    }

});

router.delete('/delete-user/:id', async(req, res, next) => {
    
    try {
        
        await User.findByIdAndDelete(req.params.id);
        return res.send({ message: 'User successfully deleted.' });

    } catch(err) {
        return next(err);
    }

});

module.exports = router;