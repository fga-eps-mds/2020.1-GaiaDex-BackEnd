const express = require('express');
const router = express.Router();

const User = require('../models/User');
const MyPlant = require('../models/myPlant');
const Plant = require('../models/Plant');
const plantNotification = require('../models/plantNotification');

router.get('/', async(req, res) => {
    res.send({message: "collection"});
});

router.get('/:userId', async(req, res) =>{
    try{
        const user = await User.findById(req.params.userId);
        const length = user.myPlants.length;
        console.log(user.myPlants.length);
        if(length > 0) {
            var plantArray=[];
            for(var index = 0; index < user.myPlants.length; index++) {
                var myplant = await MyPlant.findById(user.myPlants[index]);
                var typePlant = await Plant.findById(myplant.plant);
                var objplant = "{\"nickname\" : \"" + myplant.nickname + "\", \"commonName\" : \"" + typePlant.commonName + "\", \"profilePicture\" : \"" + typePlant.profilePicture + "\"}";
                var objplant = JSON.parse(objplant);
                plantArray.push(objplant);
            }

            res.send(plantArray);
            //return res.send(user.myPlants[0]);
            //return res.send({message: "collection!!"})

            // const data = new Date();
            // const tempo = {
            //     "dia": data.getDate(),
            //     "mes": data.getMonth()+1,
            //     "ano": data.getFullYear(),
            // }

        }else{
            return res.send({message: "No plants in my collection"});
        }
    }catch(err){
        return res.status(400).send({error: 'Error visualizing collection' + err});
    }
})
router.post('/:myPlantID', async(req,res) =>{
    try{
        const {water, fertilize} = req.body
        const notification = await plantNotification.create(water, fertilize);
        const myplant = await MyPlant.findById(req.params.myPlantID);

        await notification.save();

        myplant.notifications.push(notification);

        await myplant.save();

        return res.send({ message: 'Notification successfully registered.' });

    }catch(err){
        return res.status(400).send({error: 'Error adding notification' + err});
    }
})

module.exports = router;