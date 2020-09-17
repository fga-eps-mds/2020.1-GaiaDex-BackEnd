const express = require('express');

const Plant = require('../models/Plant');
const Topico = require('../models/Topico');

const router = express.Router();

//registro de uma nova planta
router.post('/register', async (req , res) => {
    try{
        const { scientificName,family_name,gender_name,specie_name,common_name,usage,first_User,collection_count,extinction,profile_picture, gbifID,stateProvince,topicos} = req.body;

        const plant = await Plant.create({scientificName,family_name,gender_name,specie_name,common_name,usage,first_User,collection_count,extinction,profile_picture, gbifID,stateProvince});

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
//Listagem de Todas as plantas
router.get('/', async (req , res) => {
    try{
        const plants = await Plant.find().populate('topicos');

        return res.send({ plants });
    }catch (err){
        return res.status(400).send({ error: 'Loading plants failed'});
    }
});
//Procurando planta por id
router.get('/:plantId', async (req , res) => {
    try{
        const plant = await Plant.findById(req.params.plantId).populate('topicos');

        return res.send({ plant });
    }catch (err){
        return res.status(400).send({ error: 'error when searching for this plant '});
    }
});
//Deletando planta por id
router.delete('/:plantId', async (req , res) => {
    try{
        await Plant.findByIdAndRemove(req.params.plantId);

        return res.send();
    }catch (err){
        return res.status(400).send({ error: 'Error when Delete this plant'});
    }
});
//Dando upgrade planta por id
router.put('/:plantId', async (req , res) => {
    
        try{
            const { scientificName,family_name,gender_name,specie_name,common_name,usage,first_User,collection_count,extinction,profile_picture, gbifID,stateProvince,topicos} = req.body;
    
            const plant = await Plant.findByIdAndUpdate(req.params.plantId,
                {scientificName,family_name,gender_name,specie_name,common_name,usage,first_User,collection_count,extinction,profile_picture, gbifID,stateProvince},{ new: true});
            
            plant.topicos = [];
            await Topico.remove({plant: plant._id});

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


module.exports = app => app.use('/plant' , router);