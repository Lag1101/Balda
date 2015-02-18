/**
 * Created by vasiliy.lomanov on 18.02.2015.
 */

var UserModel = require('UserModel');

var userCollections = new UserModel.UsersCollection("users.data");

userCollections.add({
    username : 'lag1101',
    password : 123
});

userCollections.add({
    username : 'keffir',
    password : 123
});


userCollections.save();