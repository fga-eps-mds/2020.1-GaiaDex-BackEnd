const express = require('express');

const router = express.Router();

const User = require('../models/user');
const userSchema = require('../schemas/userSchema');

router.get('/', (req, res) => {
    res.json({
        message: 'Authentication!'
    });
});

router.post('/signup', async(req, res) => {

    try {

        const newUserData = req.body;
        const result = userSchema.validate(req.body);

        await User.findOne({ username: newUserData.username});

        if ( result.error ) return res.status(400).send({ error: 'Error while signing up. ' + result.error});

        const user = new User(newUserData);

        user.save()
            .then( () => {
                return res.send(user);
            })
            .catch(err => {
                return res.status(400).send({ error: 'Error while signing up. ' + err});
            });

    } catch(err) {
        return res.status(400).send({ error: 'Error while signing up.'});
    }

});

router.put('/update_user/:id', async(req, res) => {

    try {

        const user = await User.findById(req.params.id);
        const newData = req.body;

        if ( !newData.username ) newData.username = user.username;
        if ( !newData.password ) newData.password = user.password;
        if ( !newData.email ) newData.email = user.email;

        const result = userSchema.validate(newData);

        if ( result.error ) return res.status(400).send(result.error);
        
        await User.findOneAndUpdate({_id: req.params.id}, req.body, { useFindAndModify: false})
                    .then( () => {
                        res.send({ message: 'User updated successfully.'});
                    })
                    .catch(err => {
                        return res.status(400).send({ error: 'Error while updating user. ' + err});
                    });

    } catch(err) {
        return res.status(400).send({ error: 'Error while updating user.' + err});
    }

});

router.delete('/delete_user/:id', async(req, res) => {
    
    try {
        
        await User.findByIdAndDelete(req.params.id);
        return res.send({ message: 'User successfully deleted.' });

    } catch(err) {
        return res.status(400).send({ error: 'Error while deleting user. ' + err});
    }

});

module.exports = router;
