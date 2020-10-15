const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Plant = require('../models/Plant');
const Favorite = require('../models/Favorite');

router.get('/', async (req, res) => {
    res.send({ message: 'User Backyard.'});
});

router.post('/add/:userId/:plantId', async (req, res) => {

    try {
        
        const user = await User.findById(req.params.userId);
        const plant = await Plant.findById(req.params.plantId);
        
        const favorite = await Favorite.create({nickname: req.body.nickname, plant: plant});

        user.favorites.push(favorite);
        user.save()
            .then( () => {
                return res.send(user);
            });

    } catch(err) {
        console.log(err);
        return res.status(400).send({ error: 'Error while adding plant to favorites.' + err});
    }

});

module.exports = router;
