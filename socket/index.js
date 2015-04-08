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
                gamePool.get(user.gameId).emit('disconnected', user.username);
                gamePool.deleteGame(user.gameId);
                user.gameId = null;
            }

            function turn() {
                var game = gamePool.get(user.gameId);
                if(game.currentTurn === null)
                    return "true";
                else
                    return user.is(game.currentTurn) ? "true" : "false";
            }

            socket
                .on('CreateGame', function(wordSize, fieldSize){
                    if(user.gameId){
                        clear();
                    }
                    var game = gamePool.createGame(user._id);

                    game.generateField("рачье", fieldSize); // todo: replace "рачье" with searching word in database
                    game.emit('waiting');
                    console.log("Created game " + user.gameId);
                })
                .on('JoinGame', function(){
                    if(user.gameId){
                        clear();
                    }
                    var game = gamePool.joinGame(user._id);
                    if(game) {
                        var player1 = users.get(game.hostId);
                        var player2 = users.get(game.opponentId);
                        game.emit('ready', player1.username, player2.username);
                        console.log("Joined to game " + user.gameId);
                    }
                })
                .on('message', function(text, cb) {
                    gamePool.get(user.gameId).emit('message', text);
                    cb && cb();
                })
                .on('disconnect', function() {
                    console.log(user.username + ' disconnected');
                    if(user.gameId) {
                        console.log("Deleted game " + user.gameId);
                        clear();
                    }
                })
                .on('state', function() {
                    socket.emit('state', {
                        field: gamePool.get(user.gameId).field,
                        turn: turn()
                    });
                })
                .on('checkAndCommit', function(word, field){
                    var game = gamePool.get(user.gameId);
                    if(wordTree.exist(word)) {
                        if(game.currentTurn === null){
                            game.currentTurn = user;
                        }
                        if(user.is(game.currentTurn)) {
                            game.field = field;

                            var currentPlayerId = game.hostId.is(game.currentTurn) ? game.opponentId : game.hostId;
                            var secondPlayerId = game.opponentId.is(game.currentTurn) ? game.opponentId : game.hostId;

                            game.currentTurn = currentPlayerId;

                            users.get(currentPlayerId).socket.emit('state', {
                                field: game.field,
                                turn: "true"
                            });
                            users.get(secondPlayerId).socket.emit('state', {
                                field: game.field,
                                turn: "false"
                            });
                        }
                    }
                    else {
                        socket.emit('state', {
                            field: game.field,
                            turn: "true"
                        });
                    }
                })
                .on('checkWord', function(word, cb) {
                    var ans = wordTree.exist(word) ? "true" : "false";
                    socket.emit('checkWord', ans);
                    cb && cb();
                });
        });

    });
};
