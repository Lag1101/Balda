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

                    game.generateField(wordTree.getRandomWordByLettersCount(wordSize), fieldSize);
                    game.emit('waiting');
                    console.log("Created game " + user.gameId);
                    console.log("Games count " + gamePool.len());
                })
                .on('JoinGame', function(){
                    clear(user.gameId);

                    var game = gamePool.joinGame(user._id);
                    if(game) {
                        var player1 = users.get(game.firstPlayer()._id);
                        var player2 = users.get(game.secondPlayer()._id);
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

                    var state = gamePool.get(user.gameId).createState(turn());
                    console.log('emited to', user.username, state);
                    socket.emit('state', state);
                })
                .on('checkAndCommit', function(word, field){

                    console.log('checkAndCommit event', word, field);

                    var game = gamePool.get(user.gameId);
                    if(wordTree.exist(word)) {
                        if(game.currentTurn === null){
                            game.currentTurn = user._id;
                        }
                        if(user._id === game.currentTurn) {
                            game.setField(field);

                            game.currentTurn = (game.firstPlayer()._id === user._id) ? game.secondPlayer()._id : game.firstPlayer()._id;

                            game.players.get(user._id).addWord(word);
                            game.players.keys.map(function(key){
                                var player = game.players.get(key);
                                var curUser =  users.get(player._id);
                                var state = game.createState((game.currentTurn === player._id) ? "true" : "false");
                                console.log('emited to', curUser.username, state);
                                curUser.socket.emit('state', state);
                            });

                        }
                    }
                    else {
                        var state = game.createState("true");
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
