/**
 * Created by vasiliy.lomanov on 10.04.2015.
 */

var Utils = require('../lib/Utils');
var Queue = Utils.Queue;
var users = require('../models/UserModel').users;

var _id = 0;
function Game() {
    this._id = _id;
    _id ++;

    this.startWord = '';
    this.players = new Queue();
    this.field = []; // todo: need to define field structure
    this.currentTurn = null;

    this.bonusLetters = new Queue();
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
Game.prototype.calcPointsByNewField = function(newField) {
    var points = 0;
    var currentField = this.field;
    var bonusLetters = this.bonusLetters;

    Utils.xRange({end: currentField.length}).map(function(i) {
        var newLetter = newField[i].letter;
        if(newLetter !== currentField[i].letter){
            points += currentField[i].points;
            if(bonusLetters.exist(newLetter))
                points += bonusLetters.get(newLetter);
        }
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
    return state;
};

Game.prototype.fillBonusLetters = function(){
    this.bonusLetters.push('е', 2);
    this.bonusLetters.push('р', 3);
    this.bonusLetters.push('я', 5);
};

Game.prototype.getBonusLetters = function(){
    var bonusLettersCells = [];
    var bonusLetters = this.bonusLetters;

    bonusLetters.keys.map(function(letter){
        bonusLettersCells.push(new Cell({
            letter: letter,
            points: bonusLetters.get(letter)
        }));
    });

    return bonusLettersCells;
};


module.exports = Game;