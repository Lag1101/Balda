/**
 * Created by vasiliy.lomanov on 18.02.2015.
 */
var fs = require('fs');
var util = require('util');

var _id = 0;

function User(user){
    this._id = user._id || _id++ && _id;
    this.username = user.username;
    this.password = user.password;
}

function UsersCollection(filename){

    this.users = [];
    this.filename = filename || "users.data";


    if(fs.existsSync(this.filename)) {
        var rawUsers = JSON.parse(fs.readFileSync(this.filename, 'utf8'));
        for(var i = 0; i < rawUsers.length; i++) {
            this.add(rawUsers[i]);
        }
    } else {
        console.error(e.message);
        this.users = [];
    }

}

UsersCollection.prototype.add = function(user) {
    this.users.push(new User(user));
    return this.users[this.users.length-1];
};

UsersCollection.prototype.authorize = function(username, password, callback){
    var exist = false;
    for(var i = 0; i < this.users.length; i++) {
        var user = this.users[i];
        if( user.username === username ) {
            if (user.password === password) {
                callback(null, user);
            }
            else {
                callback(new AuthError("Пароль неверен"));
            }
            exist = true;
            break;
        }
    }
    if(!exist) {
        callback(null, this.add({username:username, password:password}));
    }
};

UsersCollection.prototype.save = function() {
    var rawUsers = JSON.stringify(this.users);
    fs.writeFileSync(this.filename, rawUsers, 'utf8');
};

UsersCollection.prototype.get = function(_id) {

    for(var i = 0; i < this.users.length; i++) {
        if(_id === this.users[i]._id)
            return this.users[i];
    }
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