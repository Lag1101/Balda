/**
 * Created by vasiliy.lomanov on 18.02.2015.
 */
var fs = require('fs');

function User(user){
    this.username = user.username;
    this.password = user.password;
}

function UsersCollection(filename){

    this.users = [];
    this.filename = filename;

    try{
        var rawUsers = JSON.parse(fs.readFileSync(this.filename, 'utf8'));
        for(var i = 0; i < rawUsers.length; i++) {
            this.add(rawUsers[i]);
        }
    } catch (e) {
        console.error(e.message);
        this.users = [];
    }

}

UsersCollection.prototype.add = function(user) {
    this.users.push(new User(user));
};
UsersCollection.prototype.save = function() {
    var rawUsers = JSON.stringify(this.users);
    fs.writeFileSync(this.filename, rawUsers, 'utf8');
};

module.exports.User = User;
module.exports.UsersCollection = UsersCollection;