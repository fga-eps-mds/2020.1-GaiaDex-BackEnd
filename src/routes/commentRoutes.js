const express = require('express');
const Plant = require('../models/Plant');
const Topico = require('../models/Topico');
const Comment = require('../models/Comment');

const router = express.Router();

router.post('/register', async (req , res) => {
    try{
        const comment = await Comment.create(req.body);

        return res.send({ comment });
    }catch (err){
        return res.status(400).send({ error: 'Registration failed'});
    }
});


module.exports = router;