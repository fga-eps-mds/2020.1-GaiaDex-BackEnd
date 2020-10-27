const express = require('express');
const router = express.Router();


const Collection = require('../models/Collection');
const User = require('../models/User');
const MyPlant = require('../models/myPlant');
const Plant = require('../models/Plant');

router.get('/', async(req, res) => {
    res.send({message: "collection"});
});

router.get('/:userId', async(req, res) =>{
    try{
        const user = await User.findById(req.params.userId);
        const length = user.myPlants.length;
        console.log(user.myPlants.length);
        if(length > 0) {
            //mostra todas as plantas
            for(var index = 0; index < user.myPlants.length; index++) {
                var myplant = await MyPlant.findById(user.myPlants[index]);
                var typePlant = await Plant.findById(myplant.plant);
                res.send(myplant.nickname);
                //res.send(Object.values());
            }
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

module.exports = router;