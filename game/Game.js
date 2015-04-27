/**
 * Created by vasiliy.lomanov on 10.04.2015.
 */

var Utils = require('../lib/Utils');
var Queue = Utils.Queue;

var _id = 1;
function Game() {
    this._id = _id;
    _id ++;

    this.startWord = '';

    this.players = new Queue();
    this.field = []; // todo: need to define field structure
    this.currentPlayerUsername = null;

    this.bonusLetters = new Queue();

    this.started = false;
    this.lastActive = null;

    this.roundNumber = 0;
}

Game.Player = function(player) {
    this.user = player.user;
    this.points = player.points || 0;
    this.words = player.words || [];
    this.socket = player.socket || null;
    this.timeToLoose = 300000;

};
Object.defineProperty(Game.Player.prototype, "id", { get: function () {
    return this.user.username;
}});


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
Game.Player.prototype.setSocket = function(socket) {
    this.socket = socket;
};

Game.Cell = function(cell){
    this.letter = cell.letter || '';
    this.points = cell.points || 0;
    this.statement = cell.statement || 0;
};

Game.calcPoints = function(distance){
    var max = 4, min = 1;

    var constPart = distance + min;
    var dynamicPart = Math.floor((max - min)*Math.random());

    return constPart + dynamicPart;
};

Game.prototype.generateField = function(word, size) {
    this.startWord = word;

    this.field = [];

    var mainLineIndex = Math.floor(size/2);
    for(var i = 0; i < size; i++){
        var line = [];
        var distance = Math.abs(mainLineIndex - i);
        var count = size - distance;
        for(var k = 0; k < count; k++) {
            line.push(new Game.Cell({
                points: Game.calcPoints(distance)
            }));
        }
        this.field.push(line);
    }

    var mainLine = this.field[mainLineIndex];

    var shift = Math.floor(0.5*(mainLine.length-word.length));
    for( var i = 0; i < word.length; i++ ) {
        mainLine[i+shift].letter = word[i];
    }
};

Game.prototype.emit = function(key, val1, val2) {

    var players = this.players;
    this.players.keys.map(function(k){
        var player = players.get(k);
        if( player.socket )
            player.socket.emit(key, val1, val2);
    });
};
Game.prototype.ready = function() {
    return this.players.len() >= 2;
};

Game.prototype.hostPlayer = function() {
    return this.players.get(this.players.keys[0]);
};
Game.prototype.opponentPlayer = function() {
    return this.players.get(this.players.keys[1]);
};
Game.prototype.firstPlayer = function(user) {
    return (this.hostPlayer().id === user.username) ? this.hostPlayer() : this.opponentPlayer();
};
Game.prototype.secondPlayer = function(user) {
    return (this.hostPlayer().id === user.username) ? this.opponentPlayer() : this.hostPlayer();
};
Game.prototype.touch =function () {
    var date = new Date();

    if(!this.lastActive)
        this.lastActive = date;

    if(!this.currentPlayerUsername){
        this.hostPlayer().timeToLoose -= (date.getTime() - this.lastActive.getTime());
        this.opponentPlayer().timeToLoose -= (date.getTime() - this.lastActive.getTime());
    } else {
        var player = this.players.get(this.currentPlayerUsername);
        player.timeToLoose -= (date.getTime() - this.lastActive.getTime());
    }

    var players = this.players;
    this.players.keys.map(function(k){
        var player = players.get(k);
        if( player.timeToLoose < 0 )
            player.timeToLoose = 0;;
    });

    this.lastActive = date;
};
Game.prototype.calcPointsByNewField = function(newField) {
    var points = 0;
    var currentField = this.field;
    var bonusLetters = this.bonusLetters;

    Utils.xRange({end: currentField.length}).map(function(i) {
        var line = currentField[i];
        var nLine = newField[i];
        Utils.xRange({end: line.length}).map(function(k) {
            var cell = line[k];
            var nCell = nLine[k];
            var newLetter = nCell.letter;
            if (newLetter !== cell.letter) {
                points += cell.points;
                if (bonusLetters.exist(newLetter))
                    points += bonusLetters.get(newLetter);
            }
        });
    });

    return points;
};

Game.prototype.setField = function(field) {
    this.field = field;
};
Game.prototype.getField = function() {
    return this.field;
};
Game.prototype.createState = function(player) {
    var me = this.players.get(player.user.username);
    var opponent = (this.hostPlayer().user.username === me.user.username) ? this.opponentPlayer() : this.hostPlayer();


    var turn = (!this.currentPlayerUsername || this.currentPlayerUsername === player.user.username) ? "true" : "false";

    return {
        time: {
            me: me.timeToLoose,
            opponent: opponent.timeToLoose
        },
        field: this.getField(),
        turn: turn,
        roundNumber: this.roundNumber
    };
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
        bonusLettersCells.push(new Game.Cell({
            letter: letter,
            points: bonusLetters.get(letter)
        }));
    });

    return bonusLettersCells;
};


module.exports = Game;