/**
 * Created by vasiliy.lomanov on 06.04.2015.
 */

var users = require('../models/UserModel').users;
var Queue = require('../lib/Utils').Queue;

var _id = 0;
function Game() {
    this._id = _id;
    _id ++;
    this.hostId = null;
    this.opponentId = null;
    this.field = ['t','e','s','t']; // todo: need to define field structure
    this.currentTurn = null;
}

Game.prototype.generateField = function(word, size) {
    var field = [];

    var n = size;
    for(var i = 0; i < size / 2 - 1; i++) {
        n += (size - (i+1)) * 2;
    }
    for(var i = 0; i < n; i++) {
        field.push('');
    }
    var shift = (n-word.length)/2;
    for( var i = 0; i < word.length; i++ ) {
        field[i+shift] = word[i];
    }
    this.field = field;
};

Game.prototype.emit = function(key, val1, val2) {
    var user1 = users.get(this.hostId);
    if( user1 && user1.socket )
        user1.socket.emit(key, val1, val2);

    var user2 = users.get(this.opponentId);
    if( user2 && user2.socket )
        user2.socket.emit(key, val1, val2);
};
Game.prototype.ready = function() {
    return !!(this.hostId != null && this.opponentId != null);
};

function GamePool(){
    this.waitingQueue = new Queue();

    this.runningQueue = new Queue();
}

GamePool.prototype.createGame = function(player1) {
    var game  = new Game();

    game.hostId = player1;
    users.get(player1).gameId = game._id;

    this.waitingQueue.push(game._id, game);

    return game;
};

GamePool.prototype.joinGame = function(player2) {
    if( this.waitingQueue.len() === 0 ) return null;

    var game = this.waitingQueue.get(this.waitingQueue.keys[0]);
    this.waitingQueue.erase(0);

    game.opponentId = player2;
    users.get(player2).gameId = game._id;

    this.runningQueue.push(game._id, game);

    return game;
};

GamePool.prototype.deleteGame = function(id) {
    this.waitingQueue.erase(id);
    this.runningQueue.erase(id);
};

GamePool.prototype.get = function(_id) {
    return this.runningQueue.get(_id) || this.waitingQueue.get(_id);
};

module.exports.gamePool = module.exports.gamePool || new GamePool();

module.exports.GamePool = GamePool;