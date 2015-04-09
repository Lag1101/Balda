/**
 * Created by vasiliy.lomanov on 18.02.2015.
 */
var fs = require('fs');
var util = require('util');
var Queue = require('../lib/Utils').Queue;

function User(user){
    this._id = user._id || 0;
    this.username = user.username;
    this.password = user.password;
    this.gameId = null;
}

function UsersCollection(filename){

    this.users = new Queue();
    this.filename = filename || "./users.data";

    if(fs.existsSync(this.filename)) {
        var rawUsers = JSON.parse(fs.readFileSync(this.filename, 'utf8'));
        var _this = this;
        rawUsers.map(function(rawUser){_this.add(rawUser)});
    } else {
        this.save();
    }

    console.log(this.users);
}

UsersCollection.prototype.add = function(user) {
    var id = 1;
    if(user._id)
        id = user._id;
    else if(this.users.len() > 0)
        id = this.users.get(this.users.keys[this.users.len()-1])._id + 1;
    user._id = id;
    this.users.push(id , new User(user));
    return this.users.get(user._id);
};

UsersCollection.prototype.authorize = function(username, password, callback){
    for(var i = 0; i < this.users.len(); i++) {
        var user = this.users.get(this.users.keys[i]);
        if( user.username === username ) {
            if (user.password === password) {
                return callback(null, user);
            }
            else {
                return callback(new AuthError("Пароль неверен"));
            }
        }
    }

    var newUser = this.add({username:username, password:password});
    this.save();
    return callback(null, newUser);
};

UsersCollection.prototype.save = function() {
    var rawUsers = [];
    for(var i = 0; i < this.users.len(); i++) {
        var user = this.users.get(this.users.keys[i]);
        rawUsers.push(new User(user));
    }
    fs.writeFileSync(this.filename, JSON.stringify(rawUsers), 'utf8');
};

UsersCollection.prototype.get = function(_id) {

    if(this.users.exist(_id))
        return this.users.get(_id);
    return null;
};

function AuthError(message) {
    Error.apply(this, arguments);
    Error.captureStackTrace(this, AuthError);

    this.message = message;
}

util.inherits(AuthError, Error);

module.exports.AuthError = AuthError;
module.exports.users = module.exports.users || new UsersCollection();
module.exports.User = User;
module.exports.UsersCollection = UsersCollection;