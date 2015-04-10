/**
 * Created by vasiliy.lomanov on 06.04.2015.
 */

var users = require('../models/UserModel').users;
var Utils = require('../lib/Utils');
var Queue = Utils.Queue;

var _id = 0;
function Game() {
    this._id = _id;
    _id ++;

    this.startWord = '';
    this.players = new Queue();
    this.field = []; // todo: need to define field structure
    this.currentTurn = null;
}

Game.Player = function(player) {
    this._id = player._id || 0;
    this.points = player.points || 0;
    this.words = player.words || [];
};
Game.Player.prototype.addPoints = function(points){
    this.points += points;
};
Game.Player.prototype.getPoints = function(){
    return this.points;
};
Game.Player.prototype.addWord = function(word) {
    if(word)
        this.words.push(word);
};
Game.Player.prototype.getWords = function() {
    return this.words;
};

function Cell(cell){
    this.letter = cell.letter || '';
    this.points = cell.points || 0;
}

Game.prototype.generateField = function(word, size) {
    this.startWord = word;

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
    var players = this.players;
    this.players.keys.map(function(k){
        var user = users.get(players.get(k)._id);
        if( user && user.socket )
            user.socket.emit(key, val1, val2);
    });
};
Game.prototype.ready = function() {
    return this.players.len() >= 2;
};

Game.prototype.firstPlayer = function() {
    return this.players.get(this.players.keys[0]);
};
Game.prototype.secondPlayer = function() {
    return this.players.get(this.players.keys[1]);
};
Game.prototype.getUsedWords = function() {
    var usedWords = [this.startWord];
    this.firstPlayer().getWords().map(function(word){
        usedWords.push(word);
    });
    this.secondPlayer().getWords().map(function(word){
        usedWords.push(word);
    });
    return usedWords;
};
Game.calcPointsByNewField = function(currentField, newField) {
    var points = 0;

    Utils.xRange({end: currentField.length}).map(function(i) {
        if(newField[i].letter !== currentField[i].letter)
            points += currentField[i].points;
    });

    return points;
};
Game.prototype.setField = function(field) {
    this.field = field;
};
Game.prototype.getField = function() {
    return this.field;
};
Game.prototype.createState = function(turn) {
    var state = {
        field: this.getField(),
        usedWords: this.getUsedWords(),
        turn: turn
    };

    var players = {};
    var _this = this;
    this.players.keys.map(function(key){
        var player = _this.players.get(key);
        players[users.get(player._id).username] = {
            points: player.getPoints()
        };
    });

    state.players = players;

    return state;
};

function GamePool(){
    this.waitingQueue = new Queue();

    this.runningQueue = new Queue();
}

GamePool.prototype.createGame = function(player1) {
    var game  = new Game();

    game.players.push(player1, new Game.Player({
        _id: player1
    }));

    users.get(player1).gameId = game._id;

    this.waitingQueue.push(game._id, game);

    return game;
};

GamePool.prototype.joinGame = function(player2) {
    if( this.waitingQueue.len() === 0 ) return null;

    var game = this.waitingQueue.get(this.waitingQueue.keys[0]);
    this.waitingQueue.erase(0);

    game.players.push(player2, new Game.Player({
        _id: player2
    }));

    users.get(player2).gameId = game._id;

    this.runningQueue.push(game._id, game);

    return game;
};

GamePool.prototype.deleteGame = function(id) {
    var game = this.get(id);
    if(!game) return false;

    if(this.players && this.players.keys)
    this.players.keys.map(function(key){
        var user = users.get(game.players.get(key)._id);
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

module.exports.gamePool = module.exports.gamePool || new GamePool();

module.exports.Game = Game;
module.exports.GamePool = GamePool;