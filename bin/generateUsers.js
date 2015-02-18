/**
 * Created by vasiliy.lomanov on 18.02.2015.
 */

var UserModel = require('../models/UserModel');

var userCollections = new UserModel.UsersCollection("users.data");

userCollections.add({
    _id: 0,
    username : 'lag1101',
    password : 123
});

userCollections.add({
    _id: 1,
    username : 'keffir',
    password : 123
});


userCollections.save();