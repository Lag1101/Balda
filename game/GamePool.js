/**
 * Created by vasiliy.lomanov on 10.04.2015.
 */

var Queue = require('../lib/Utils').Queue;
var Game = require('./Game');

function GamePool(){
    this.waitingQueue = new Queue();

    this.runningQueue = new Queue();
}

GamePool.prototype.createGame = function(user1) {
    var game  = new Game();

    game.players.push(user1.username, new Game.Player({
        user: user1
    }));

    user1.gameId = game._id;

    this.waitingQueue.push(game._id, game);

    return game;
};

GamePool.prototype.joinGame = function(user2) {
    if( this.waitingQueue.len() === 0 ) return null;

    var game = this.waitingQueue.get(this.waitingQueue.keys[0]);
    this.waitingQueue.erase(0);

    game.players.push(user2.username, new Game.Player({
        user: user2
    }));

    user2.gameId = game._id;

    this.runningQueue.push(game._id, game);

    return game;
};

GamePool.prototype.deleteGame = function(id) {
    var game = this.get(id);
    if(!game) return false;

    if(this.players && this.players.keys)
        this.players.keys.map(function(key){
            var user = game.players.get(key).user;
            if (user) user.gameId = null;
        });

    this.waitingQueue.erase(id);
    this.runningQueue.erase(id);

    return true;
};

GamePool.prototype.get = function(_id) {
    return this.runningQueue.get(_id) || this.waitingQueue.get(_id);
};

GamePool.prototype.len = function() {
    return this.runningQueue.len() || this.waitingQueue.len();
};

module.exports = GamePool;