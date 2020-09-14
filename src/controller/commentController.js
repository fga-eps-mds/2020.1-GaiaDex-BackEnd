const express = require('express');
const Plant = require('../model/Plant');
const Topico = require('../model/Topico');
const Comment = require('../model/Comment');

const router = express.Router();

router.post('/register', async (req , res) => {
    try{
        const comment = await Comment.create(req.body);

        return res.send({ comment });
    }catch (err){
        return res.status(400).send({ error: 'Registration failed'});
    }
});


module.exports = app => app.use('/comment' , router);