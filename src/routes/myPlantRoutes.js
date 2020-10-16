const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Plant = require('../models/Plant');
const MyPlant = require('../models/MyPlant');

const myPlantSchema = require('../schemas/myPlantSchema');

router.get('/', async (req, res) => {
    res.send({ message: 'User Backyard.'});
});

router.post('/add/:userId/:plantId', async (req, res) => {

    try {
        
        const user = await User.findById(req.params.userId);
        const plant = await Plant.findById(req.params.plantId);

        const result = myPlantSchema.validate({ nickname: req.body.nickname});
        if ( result.error ) {
            return res.status(400).send({ error: "Error while adding plant to backyard. " + result.error});
        }
        
        const myPlant = {
            user: user, 
            nickname: req.body.nickname, 
            plant: plant
        };
        
        await MyPlant.create(myPlant);

        await user.myPlants.push(myPlant);
        await user.save()
            .then( () => {
                return res.send(user);
            });

    } catch(err) {
        return res.status(400).send({ error: 'Error while adding plant to backyard.' + err});
    }

});

router.get('/:userId/:myPlantId', async (req, res) => {

    try {

        const user = await User.findById(req.params.userId);
        const index = user.myPlants.indexOf(req.params.myPlantId);

        if (index > -1) {
            const myPlant = await MyPlant.findById(req.params.myPlantId);
            return res.send({
                nickname: myPlant.nickname,
                plant: myPlant.plant,
                creation: myPlant.createdAt
            });
        } else {
            return res.send({
                message: "Backyard plant not found."
            });
        }

    } catch(err) {
        console.log(err);
        return res.status(400).send({ error: 'Error while searching for plant.' + err});
    }
});

router.put('/edit/:myPlantId', async (req, res) => {

    try {
        
        const newNick = req.body;

        const result = myPlantSchema.validate(newNick);
        if ( result.error ) return res.status(400).send({ error: 'Error while editing plant. ' + result.error});

        await MyPlant.findOneAndUpdate({_id: req.params.myPlantId}, newNick, { useFindAndModify: false});

        return res.send({ message: 'Backyard plant updated successfully.'});

    } catch (err) {
        return res.status(400).send({ error: 'Error while updating backyard plant.' + err });
    }
});

router.delete('/delete/:myPlantId', async (req, res) => {

    try {

        const myPlant = await MyPlant.findById(req.params.myPlantId);
        const user = await User.findById(myPlant.user);

        const index = user.myPlants.indexOf(req.params.myPlantId);

        if (index > -1) {
            user.myPlants.splice(index, 1);
        }

        await user.save();

        await MyPlant.findByIdAndRemove(req.params.myPlantId, { useFindAndModify: false });

        return res.send({
            message: 'Plant successfully removed from backyard.'
        });

    } catch(err) {
        return res.status(400).send({ error: 'Error while deleting plant from backyard.' + err });
    }
});

module.exports = router;
