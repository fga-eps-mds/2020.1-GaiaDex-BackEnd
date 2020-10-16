const express = require('express');
const router = express.Router();
const jsonwebtoken = require('jsonwebtoken');
const User = require('../models/User');
const userSchema = require('../schemas/userSchema');
const {auth,authConfig} = require('./auth');


router.post('/login', async(req, res ,next) => {
  try{
    const {email, password} = req.body;
    const user = await User.findOne({ email, password });
    if(!user){
        return res.status(400).send({Error: 'User not found'});
    }
    if(await password != user.password){
        return res.status(400).send({ Error: 'Incorrect password'});
    }
    user.password = undefined;
    const token = jsonwebtoken.sign({id: user.id}, authConfig.secret,{
        expiresIn: 86400,
    });
    const aToken = "Bearer "+token;
    res.header('authtoken', aToken);
    res.json({
        message: 'Auth token generated'
    }).redirect('/main');
  }catch(err){
    next(err);
  }
});

router.post('/signup', async(req, res) => {
  try {
      const newUserData = req.body;
      const result = userSchema.validate(req.body);

      await User.findOne({ username: newUserData.username});

      if ( result.error ) return res.status(400).send({ error: 'Error while signing up. ' + result.error});

      const user = new User(newUserData);
      await user.save()

      return res.send(user);
      
  } catch(err) {
      return res.status(400).send({ error: 'Error while signing up.' + err });
  }
});

router.put('/update/:id',auth, async(req, res) => {
    try {
      const user = await User.findById(req.params.id);
      const newData = req.body;

      if ( !newData.username ) newData.username = user.username;
      if ( !newData.password ) newData.password = user.password;
      if ( !newData.email ) newData.email = user.email;

      const result = userSchema.validate(newData);

      if ( result.error ) return res.status(400).send(result.error);

      await User.findOneAndUpdate({_id: req.params.id}, req.body, { useFindAndModify: false})
        
      res.send({ message: 'User updated successfully.'});

    } catch(err) {
      return res.status(400).send({ error: 'Error while updating user.' + err});
    }
});

router.delete('/delete/:id',auth, async(req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        return res.send({ message: 'User successfully deleted.' });
    } catch(err) {
        return res.status(400).send({ error: 'Error while deleting user. ' + err });
    }
});

module.exports = router;
