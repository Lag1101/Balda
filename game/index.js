/**
 * Created by vasiliy.lomanov on 06.04.2015.
 */

var _id = 0;

function Game() {
    this._id = _id;
    _id ++;
    this.player1 = null;
    this.player2 = null;
    this.field = ['t','e','s','t']; // todo: need to define field structure
}

Game.prototype.generateField = function(word, size) {
    var length = size;
    var field = [];

    var n = length;
    for(var i = 0; i < length / 2; i++) {
        n += (length - (i+1)) * 2;
    }
    for(var i = 0; i < n; i++) {
        field.push(' ');
    }
    var shift = (n-word.length)/2;
    for( var i = 0; i < word.length; i++ ) {
        field[i+shift] = word[i];
    }
    this.field = field;
};
Game.prototype.emit = function(key, val1, val2) {
    if( this.player1 && this.player1.socket )
        this.player1.socket.emit(key, val1, val2);

    if( this.player2 && this.player2.socket )
        this.player2.socket.emit(key, val1, val2);
};
Game.prototype.ready = function() {
    return !!(this.player1 != null && this.player2 != null);
};

function GamePool(){
    this.waitingQueue = [];
    this.runningQueue = [];
}

GamePool.prototype.createGame = function(player1) {
    var game  = new Game();

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

GamePool.prototype.deleteGame = function(id) {
    for(var i = 0; i < this.waitingQueue.length; i++) {
        if( this.waitingQueue[i]._id === id){
            delete this.waitingQueue[i];
            this.waitingQueue.splice(i, 1);
            break;
        }
    }
    for(var i = 0; i < this.runningQueue.length; i++) {
        if( this.runningQueue[i]._id === id){
            delete this.runningQueue[i];
            this.runningQueue.splice(i, 1);
            break;
        }
    }
};

module.exports.gamePool = module.exports.gamePool || new GamePool();

module.exports.GamePool = GamePool;