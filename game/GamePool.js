/**
 * Created by vasiliy.lomanov on 10.04.2015.
 */

var Queue = require('../lib/Utils').Queue;
var Game = require('./Game');
var logger = require('../lib/logger');

function GamePool(){
    this.waitingQueue = new Queue();

    this.runningQueue = new Queue();
}

GamePool.prototype.createGame = function(user1) {
    var game  = new Game();

    logger.debug('Created game ' + game._id + ' by user ' + user1.username);

    game.players.push(user1.username, new Game.Player({
        user: user1
    }));

    user1.gameId = game._id;

    this.waitingQueue.push(game._id, game);

    return game;
};

GamePool.prototype.joinGame = function(user2, gameId) {
    if( this.waitingQueue.len() === 0 ) return null;

    gameId = gameId || this.waitingQueue.keys[0];

    var game = this.waitingQueue.get(gameId);
    this.waitingQueue.erase(gameId);

    logger.debug(user2.username + ' engage in game ' + game._id);

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

GamePool.prototype.exist = function(_id) {
    return this.runningQueue.exist(_id) || this.waitingQueue.exist(_id);
};

module.exports = GamePool;