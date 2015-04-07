/**
 * Created by vasiliy.lomanov on 07.04.2015.
 */

function Room(game){
    this.game = game;
}

Room.prototype.emit = function(key, val) {
    if( this.game.player1 && this.game.player1.socket )
        this.game.player1.socket.emit(key, val);

    if( this.game.player2 && this.game.player2.socket )
        this.game.player2.socket.emit(key, val);
};

Room.prototype.emit = function(key, val1, val2) {
    if( this.game.player1 && this.game.player1.socket )
        this.game.player1.socket.emit(key, val1, val2);

    if( this.game.player2 && this.game.player2.socket )
        this.game.player2.socket.emit(key, val1, val2);
};

module.exports = Room;