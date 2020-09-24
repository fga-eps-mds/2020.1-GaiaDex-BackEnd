const express = require('express');
const Plant = require('../models/Plant');
const Topico = require('../models/Topico');

const router = express.Router();
//Criar um novo topico pelo id da planta
router.put('/:plantId', async (req , res) => {
    
    try{
        const {topicos} = req.body;

        const plant = await Plant.findByIdAndUpdate(req.params.plantId,
            {},{ new: true}).populate('topicos');
        

        await Promise.all(topicos.map(async topico =>{
            const plantTopic = new Topico({...topico,plant : plant._id});

            await plantTopic.save();

            plant.topicos.push(plantTopic);
        }));

        await plant.save();


        return res.send({ plant });
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
        
        await Topico.findByIdAndUpdate(req.params.topicId,{description: 'marcos felipe'},{new : true});

        return res.send();
    }catch (err){
        console.log(err);
        return res.status(400).send({ error: 'Error when Delete this plant'});
    }
});

module.exports = router;