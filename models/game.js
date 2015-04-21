/**
 * Created by vasiliy.lomanov on 17.04.2015.
 */

var mongoose = require('../lib/mongoose'),
    Schema = mongoose.Schema;

var Queue = require('../lib/Utils').Queue;

var schema = new Schema({
    PlayersIds: {
        type: Object,
        default: new Queue()
    },
    field: {
        type: Array,
        default: []
    },
    startWord: {
        type: String,
        default: ''
    },
    bonusLetters: {
        type: Object,
        default: new Queue()
    },
    created: {
        type: Date,
        default: Date.now
    }
});

schema.methods.Player = (function(){
    function Player(player){
        this.userId = player.userId;
        this.points = player.points || 0;
        this.words = player.words || [];
    }
    Object.defineProperty(Player.prototype, "id", { get: function () {
        return this.userId;
    }});
    Player.prototype.addPoints = function(points){
        this.points += points;
    };
    Player.prototype.getPoints = function(){
        return this.points;
    };
    Player.prototype.addWord = function(word) {
        if(word)
            this.words.push(word);
    };
    Player.prototype.getWords = function() {
        return this.words;
    };
    return Player;
})();

schema.methods.Cell = (function(){
    function Cell(cell){
        this.letter = cell.letter || '';
        this.points = cell.points || 0;
        this.statement = cell.statement || 0;
    }
    return Cell;
})();

schema.methods.generateField = function(word, size) {
    this.startWord = word;

    this.field = [];

    var mainLineIndex = Math.floor(size/2);
    for(var i = 0; i < size; i++){
        var line = [];
        var distance = Math.abs(mainLineIndex - i);
        var count = size - distance;
        for(var k = 0; k < count; k++) {
            line.push(new Game.Cell({
                points: distance
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

schema.methods.ready = function() {
    return this.players.len() >= 2;
};

schema.methods.firstPlayer = function() {
    return this.players.get(this.players.keys[0]);
};

schema.methods.secondPlayer = function() {
    return this.players.get(this.players.keys[1]);
};

schema.methods.calcPointsByNewField = function(newField) {
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

schema.methods.setField = function(field) {
    this.field = field;
};

schema.methods.getField = function() {
    return this.field;
};

schema.methods.createState = function(turn) {
    return {
        field: this.getField(),
        turn: turn
    };
};

schema.methods.fillBonusLetters = function(){
    this.bonusLetters.push('е', 2);
    this.bonusLetters.push('р', 3);
    this.bonusLetters.push('я', 5);
};

schema.methods.getBonusLetters = function(){
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

exports.Game = mongoose.model('Game', schema);