/**
 * Created by vasiliy.lomanov on 06.04.2015.
 */

function Game() {
    this.player1 = null;
    this.player2 = null;
    this.field = ['t','e','s','t']; // todo: need to define field structure
}

Game.prototype.generateField = function(word) {
    var length = word.length;
    var field = [];

    var n = length;
    for(var i = 0; i < length / 2; i++) {
        n += (length - (i+1)) * 2;
    }
    for(var i = 0; i < n; i++) {
        field.push('');
    }
    var shift = (n-length)/2;
    for( var i = 0; i < length; i++ ) {
        field[i+shift] = word[i];
    }
    this.field = field;
};

function GamePool(){
    this.waitingQueue = [];
    this.runningQueue = [];
}

GamePool.prototype.createGame = function(player1, word) {
    var game  = new Game();
    game.generateField(word);

    game.player1 = player1;
    player1.game = game;

    this.waitingQueue.push(game);
};

GamePool.prototype.joinGame = function(player2) {
    if( this.waitingQueue.length === 0 ) return null;

    var game = this.waitingQueue[0];
    this.waitingQueue.splice(0, 1);
    game.player2 = player2;
    player2.game = game;

    this.runningQueue.push(game);

    return game;
};


module.exports.gamePool = module.exports.gamePool || new GamePool();

module.exports.GamePool = GamePool;