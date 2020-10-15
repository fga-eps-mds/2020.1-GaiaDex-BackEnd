const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Plant = require('../models/Plant');
const Favorite = require('../models/Favorite');

const favoriteSchema = require('../schemas/favoriteSchema');

router.get('/', async (req, res) => {
    res.send({ message: 'User Backyard.'});
});

router.post('/add/:userId/:plantId', async (req, res) => {

    try {
        
        const user = await User.findById(req.params.userId);
        const plant = await Plant.findById(req.params.plantId);

        const result = favoriteSchema.validate({ nickname: req.body.nickname});
        if ( result.error ) return res.status(400).send({ error: 'Error while adding favorite. ' + result.error});
        
        const favorite = await Favorite.create({user: user, nickname: req.body.nickname, plant: plant});

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

router.get('/plant/:userId/:favoriteId', async (req, res) => {

    try {

        const user = await User.findById(req.params.userId);
        const index = user.favorites.indexOf(req.params.favoriteId);

        if (index > -1) {
            const favorite = await Favorite.findById(req.params.favoriteId);
            return res.send({
                nickname: favorite.nickname,
                plant: favorite.plant,
                creation: favorite.createdAt
            });
        } else {
            return res.send({
                message: "Favorite plant not found."
            });
        }
        

    } catch(err) {
        console.log(err);
        return res.status(400).send({ error: 'Error while searching for plant.' + err});
    }
});

router.put ('/plant/:favoriteId', async (req, res) => {

    try {
        
        const newNick = req.body;

        const result = favoriteSchema.validate(newNick);
        if ( result.error ) return res.status(400).send({ error: 'Error while adding favorite. ' + result.error});

        await Favorite.findOneAndUpdate({_id: req.params.favoriteId}, newNick, { useFindAndModify: false});

        return res.send({ message: 'Favorite plant updated successfully.'});

    } catch (err) {
        return res.status(400).send({ error: 'Error while updating favorite plant.' + err });
    }
});

router.delete('/delete/:favoriteId', async (req, res) => {

    try {

        const favorite = await Favorite.findById(req.params.favoriteId);
        const user = await User.findById(favorite.user);

        const index = user.favorites.indexOf(req.params.favoriteId);

        if (index > -1) {
            user.favorites.splice(index, 1);
        }

        user.save();

        await Favorite.findByIdAndRemove(req.params.favoriteId, { useFindAndModify: false });

        return res.send({
            message: 'Favorite successfully removed.'
        });

        return res.send({ user });

    } catch(err) {
        return res.status(400).send({ error: 'Error while updating favorite plant.' + err });
    }
});

module.exports = router;
