var log = require('../lib/log')(module);
var HttpError = require('../error').HttpError;
var users = require('../models/UserModel').users;
var gamePool = require('../game').gamePool;
var WordTree = require('../lib/WordTree');

var wordTree = new WordTree('./Words.txt');

module.exports = function(server, sessionStore, cookieParser) {

    var io = require('socket.io').listen(server);
    var SessionSockets = require('session.socket.io-express4'),
    sessionSockets = new SessionSockets(io, sessionStore, cookieParser());

    sessionSockets.on('connection', function (err, socket, session) {
        require('./loadUser')(sessionStore, cookieParser, socket)(socket, function(err, socket){
            if(err)
                return console.error(err);

            var user = socket.handshake.user || {};
            user.socket = socket;

            console.log(user.username + ' connected');

            function clear(){
                user.game.emit('disconnected', user.username);
                gamePool.deleteGame(user.game._id);
                user.game = undefined;
            }

            function turn() {
                if(user.game.currentTurn === null)
                    return "true";
                else
                    return user.is(user.game.currentTurn) ? "true" : "false";
            }

            socket
                .on('CreateGame', function(wordSize, fieldSize){
                    if(user.game){
                        clear();
                    }
                    gamePool.createGame(user);
                    user.game.generateField("рачье", fieldSize); // todo: replace "рачье" with searching word in database
                    user.game.emit('waiting');
                    console.log("Created game " + user.game._id);
                })
                .on('JoinGame', function(){
                    if(user.game){
                        clear();
                    }
                    if(gamePool.joinGame(user)) {
                        user.game.emit('ready', user.game.player1.username, user.game.player2.username);
                        console.log("Joined to game " + user.game._id);
                    }
                })
                .on('message', function(text, cb) {
                    room.emit('message', text);
                    cb && cb();
                })
                .on('field', function(field) {
                    if(user.game.currentTurn === null){
                        user.game.currentTurn = user;
                    }
                    if(user.is(user.game.currentTurn)) {
                        user.game.field = field;

                        var currentPlayer = user.game.player1.is(user.game.currentTurn) ? user.game.player2 : user.game.player1;
                        var secondPlayer = user.game.player2.is(user.game.currentTurn) ? user.game.player2 : user.game.player1;

                        user.game.currentTurn = currentPlayer;

                        currentPlayer.socket.emit('state', {
                            field: user.game.field,
                            turn: "true"
                        });
                        secondPlayer.socket.emit('state', {
                            field: user.game.field,
                            turn: "false"
                        });
                    }


                })
                .on('disconnect', function() {
                    console.log(user.username + ' disconnected');
                    if(user.game) {
                        console.log("Deleted game " + user.game._id);
                        clear();
                    }
                })
                .on('state', function() {
                    socket.emit('state', {
                        field: user.game.field,
                        turn: turn()
                    });
                });


            socket.on('checkWord', function(word, cb) {
                var ans = wordTree.exist(word) ? "true" : "false";
                socket.emit('checkWord', ans);
                cb && cb();
            });
        });

    });
};




