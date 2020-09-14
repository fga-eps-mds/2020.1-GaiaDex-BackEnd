const express = require('express');
const Plant = require('../model/Plant');
const Topico = require('../model/Topico');

const router = express.Router();

router.post('/register', async (req , res) => {
    try{
        const topic = await Topico.create(req.body);
        return res.send({ topic });
    }catch (err){
        return res.status(400).send({ error: 'Registration failed'});
    }
});
//Listando todos os topics
router.get('/', async (req , res) => {
    try{
        const topics = await Topico.find();

        return res.send({ topics });
    }catch (err){
        return res.status(400).send({ error: 'Loading plants failed'});
    }
});
//Procurando topic por id
router.get('/:topicId', async (req , res) => {
    try{
        const topico = await Topico.findById(req.params.topicId);

        return res.send({ topico });
    }catch (err){
        return res.status(400).send({ error: 'error when searching for this topic '});
    }
});
//Deletando topic por id
router.delete('/:topicId', async (req , res) => {
    try{
        await Topico.findByIdAndRemove(req.params.topicId);

        return res.send();
    }catch (err){
        return res.status(400).send({ error: 'Error when Delete this topic'});
    }
});
//Dando upgrade topic por id
router.put('/:topicId', async (req , res) => {
    try{
        await Topico.findByIdAndRemove(req.params.plantId);

        const topics = await Topico.find();

        return res.send({ topics });
    }catch (err){
        return res.status(400).send({ error: 'Error when Delete this plant'});
    }
});

module.exports = app => app.use('/topic' , router);