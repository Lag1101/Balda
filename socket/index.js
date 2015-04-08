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

            function clear(gameId){
                var game = gamePool.get(gameId);
                if(game) {
                    console.log("Deleted game " + gameId);
                    gamePool.deleteGame(gameId);
                }
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
                    clear(user.gameId);

                    var game = gamePool.createGame(user._id);

                    game.generateField("рачье", fieldSize); // todo: replace "рачье" with searching word in database
                    game.emit('waiting');
                    console.log("Created game " + user.gameId);
                    console.log("Games count " + gamePool.len());
                })
                .on('JoinGame', function(){
                    clear(user.gameId);

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

                    clear(user.gameId);
                })
                .on('state', function() {
                    console.log('state event');

                    var state = {
                        field: gamePool.get(user.gameId).field,
                        turn: turn()
                    };
                    console.log('emited to', user.username, state);
                    socket.emit('state', state);
                })
                .on('checkAndCommit', function(word, field){

                    console.log('checkAndCommit event', word, field);

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
                            {
                                var state = {
                                    field: game.field,
                                    turn: "true"
                                };
                                console.log('emited to', users.get(currentPlayerId).username, state);
                                users.get(currentPlayerId).socket.emit('state', state);
                            }
                            {
                                var state = {
                                    field: game.field,
                                    turn: "false"
                                };
                                console.log('emited to', users.get(secondPlayerId).username, state);
                                users.get(secondPlayerId).socket.emit('state', state);
                            }
                        }
                    }
                    else {
                        var state = {
                            field: game.field,
                            turn: "true"
                        };
                        console.log('emited to', user.username, state);
                        socket.emit('state', state);
                    }
                })
                .on('checkWord', function(word, cb) {
                    console.log('checkWord event', word);
                    var ans = wordTree.exist(word) ? "true" : "false";
                    socket.emit('checkWord', ans);
                    cb && cb();
                });
        });

    });
};
