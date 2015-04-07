/**
 * Created by vasiliy.lomanov on 06.04.2015.
 */

var _id = 0;

function Queue(){
    this.length = 0;
    this.elements = {};
    this.keys = [];
}

Queue.prototype.push = function(key, val){
    if(val === undefined) return null;

    var sKey = key.toString();

    this.keys.push(sKey);
    this.elements[sKey] = val;
};
Queue.prototype.erase = function(key){
    var sKey = key.toString();
    if(this.exist(sKey)){
        this.keys.splice(this.keys.indexOf(sKey), 1);
        this.elements[sKey] = undefined;
    }

};
Queue.prototype.len = function(){
    return this.keys.length;
};
Queue.prototype.get = function(key){
    var sKey = key.toString();
    return this.elements[sKey];
};
Queue.prototype.exist = function(key){
    var sKey = key.toString();
    return this.elements[sKey] !== undefined;
};

function Game() {
    this._id = _id;
    _id ++;
    this.player1 = null;
    this.player2 = null;
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
    if( this.player1 && this.player1.socket )
        this.player1.socket.emit(key, val1, val2);

    if( this.player2 && this.player2.socket )
        this.player2.socket.emit(key, val1, val2);
};
Game.prototype.ready = function() {
    return !!(this.player1 != null && this.player2 != null);
};

function GamePool(){
    this.waitingQueue = new Queue();

    this.runningQueue = new Queue();
}

GamePool.prototype.createGame = function(player1) {
    var game  = new Game();

    game.player1 = player1;
    player1.game = game;

    this.waitingQueue.push(game._id, game);
};

GamePool.prototype.joinGame = function(player2) {
    if( this.waitingQueue.len() === 0 ) return null;

    var game = this.waitingQueue.get(this.waitingQueue.keys[0]);
    this.waitingQueue.erase(0);

    game['player2'] = player2;
    player2['game'] = game;

    this.runningQueue.push(game._id, game);

    return game;
};

GamePool.prototype.deleteGame = function(id) {
    this.waitingQueue.erase(id);
    this.runningQueue.erase(id);
};

module.exports.gamePool = module.exports.gamePool || new GamePool();

module.exports.GamePool = GamePool;