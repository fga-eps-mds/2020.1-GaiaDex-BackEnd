const express = require('express');
const router = express.Router();

const Collection = require('../models/Collection');
const User = require('../models/User');

router.get('/', async(req, res) => {
    res.send({message: "collection"});
});

router.get('/:userId', async(req, res) =>{
    try{

        const user = await User.findById(req.params.UserID);
        return res.send(user.myPlants);
    }catch(err){
        return res.status(400).send({error: 'Error visualizing collection' + err});
    }
})

module.exports = router;