const { response } = require('express');
const Joi = require('joi');

const User = require("../models/user");

const schema = Joi.object({
    username: Joi.string().alphanum().min(4).max(30).required(),
    password: Joi.string().min(8).required(),
    email: Joi.string().email().required()
});

class UsersController {
    
    async signup(request, response, next) {
        // This validation returns null if there is no errors
        const result = schema.validate(request.body);
    
        if(result.error) {
            // if there is an error we throw it to the errorHandler
            console.log(result.error);
            next(result.error);
        } else {
            // Looking for a user with same username that is being received in the req
            User.findOne({
                username: request.body.username
            }).then(user => { 
    
                if(user) {
                    // If user is not undefined it means that there is already an user with the username
                    const error = new Error(user.username + ' username is already being used.');
                    next(error);
                } else {
                    const user = new User({
                        username: request.body.username,
                        password: request.body.password,
                        email: request.body.email
                    });
    
                    user.save()
                        .then( result => {
                            response.send(result);
                        })
                        .catch(err => console.log(err));
                }
            });
        }
    }

    async update(request, response, next) {
        const oldInfo = {
            username: request.body.username,
            password: request.body.password,
            email: request.body.email
        }
    
        const newInfo = {
            username: request.body.updatedUsername,
            password: request.body.updatedPassword,
            email: request.body.updatedEmail
        }
    
        // This validation returns null if there is no errors
        const result = schema.validate(newInfo);
    
        if(result.error) {
            // if there is an error we throw it to the errorHandler
            console.log(result.error);
            next(result.error);
        } else {
            User.findOne({
                username: oldInfo.username
            }).then(user => {
                if(!user) {
                    const error = new Error(oldInfo.username + ' user not found.');
                    next(error);
                } else if(oldInfo.password == user.password && oldInfo.email == user.email) {
                    // Looking for a user with same username that is being received in the req
                    User.updateOne(
                        { username: oldInfo.username},
                        { $set: { 
                            username: newInfo.username,
                            password: newInfo.password,
                            email: newInfo.email 
                        }}
                    ).then( () => {
                        response.json({
                            message: 'User successfully updated.'
                        })
                    });
                } else {
                    const error = new Error('Password or email not valid, please try again.');
                    next(error);
                }
            });
        }
    }

    async delete(request, response, next) {
        // This validation returns null if there is no errors
        const result = schema.validate(request.body);
    
        if(result.error) {
            // if there is an error we throw it to the errorHandler
            console.log(result.error);
            next(result.error);
        } else {
            User.findOne({
                username: request.body.username
            }).then( user => {
                if(!user) {
                    const error = new Error(request.body.username + ' user not found.');
                    next(error);
                } else if(request.body.password == user.password && request.body.email == user.email) {
                    User.deleteOne({
                        username: user.username
                    }).then(() => {
                        response.json({
                            message: 'User successfully deleted.'
                        });
                    });
                } else {
                    const error = new Error('Password or email not valid, please try again.');
                    next(error);
                } 
            });
        }
    }

};

module.exports = UsersController;