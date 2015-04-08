/**
 * Created by vasiliy.lomanov on 18.02.2015.
 */
var fs = require('fs');
var util = require('util');
var Queue = require('../lib/Utils').Queue;

var _id = 0;

function User(user){
    this._id = user._id || _id;
    this.username = user.username;
    this.password = user.password;
    this.socket = null;
    this.game = null;
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
}

UsersCollection.prototype.add = function(user) {
    _id ++;
    this.users.push(_id, new User(user));
    return this.users.get(user._id);
};

UsersCollection.prototype.authorize = function(username, password, callback){
    var exist = false;
    this.users.For(function(index, id, user){
        if( user.username === username ) {
            if (user.password === password) {
                callback(null, user);
            }
            else {
                callback(new AuthError("Пароль неверен"));
            }
            exist = true;
            return false;
        }
    });
    if(!exist) {
        var newUser = this.add({username:username, password:password});
        this.save();
        callback(null, newUser);
    }
};

UsersCollection.prototype.save = function() {
    var rawUsers = [];
    this.users.For(function(index, key, user){
        rawUsers.push(user);
    });
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