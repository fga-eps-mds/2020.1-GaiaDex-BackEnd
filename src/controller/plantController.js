const express = require('express');

const Plant = require('../model/Plant');

const router = express.Router();

router.post('/register', async (req , res) => {
    try{
        const plant = await Plant.create(req.body);

        return res.send({ plant });
    }catch (err){
        return res.status(400).send({ error: 'Registration failed'});
    }
});


module.exports = app => app.use('/plant' , router);