/**
 * Created by vasiliy.lomanov on 06.04.2015.
 */

var users = require('../models/UserModel').users;
var Queue = require('../lib/Utils').Queue;

var _id = 0;
function Game() {
    this._id = _id;
    _id ++;
    this.host = null;
    this.opponent = null;
    this.field = []; // todo: need to define field structure
    this.currentTurn = null;

}

Game.Player = function(player) {
    this._id = player._id || 0;
    this.points = player.points || 0;
    this.words = player.words || [];
};

function Cell(cell){
    this.letter = cell.letter || '';
    this.points = cell.points || 0;
}

Game.prototype.generateField = function(word, size) {
    var field = [];

    var mainLineIndex = Math.floor(size/2);
    for(var i = 0; i < size; i++){
        var line = [];
        var distance = Math.abs(mainLineIndex - i);
        var count = size - distance;
        for(var k = 0; k < count; k++) {
            line.push(new Cell({
                points: distance
            }));
        }
        field.push(line);
    }

    var mainLine = field[mainLineIndex];

    var shift = Math.floor(0.5*(mainLine.length-word.length));
    for( var i = 0; i < word.length; i++ ) {
        mainLine[i+shift].letter = word[i];
    }

    for(var i = 0; i < field.length; i++){
        var line = field[i];
        for(var k = 0; k < line.length; k++){
            this.field.push(line[k]);
        }
    }
};

Game.prototype.emit = function(key, val1, val2) {
    var user1 = users.get(this.host && this.host._id);
    if( user1 && user1.socket )
        user1.socket.emit(key, val1, val2);

    var user2 = users.get(this.opponent && this.opponent._id);
    if( user2 && user2.socket )
        user2.socket.emit(key, val1, val2);
};
Game.prototype.ready = function() {
    return !!(this.host != null && this.opponent != null);
};

function GamePool(){
    this.waitingQueue = new Queue();

    this.runningQueue = new Queue();
}

GamePool.prototype.createGame = function(player1) {
    var game  = new Game();

    game.host = new Game.Player({
        _id: player1
    });
    users.get(player1).gameId = game._id;

    this.waitingQueue.push(game._id, game);

    return game;
};

GamePool.prototype.joinGame = function(player2) {
    if( this.waitingQueue.len() === 0 ) return null;

    var game = this.waitingQueue.get(this.waitingQueue.keys[0]);
    this.waitingQueue.erase(0);

    game.opponent = new Game.Player({
        _id: player2
    });
    users.get(player2).gameId = game._id;

    this.runningQueue.push(game._id, game);

    return game;
};

GamePool.prototype.deleteGame = function(id) {
    var game = this.get(id);
    if(!game) return false;

    if(game.host) {
        var host = users.get(game.host._id);
        if (host) host.gameId = null;
    }
    if(game.opponent) {
        var opponent = users.get(game.opponent._id);
        if (opponent) opponent.gameId = null;
    }

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

module.exports.gamePool = module.exports.gamePool || new GamePool();

module.exports.GamePool = GamePool;