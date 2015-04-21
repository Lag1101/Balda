var logger = require('debug')('socket');
var HttpError = require('../error').HttpError;
var Game = require('../game').Game;
var gamePool = require('../game').gamePool;
var Events = require('../shared/Events');
var config = require('../config');
var loadUser = require('./loadUser');
var Queue = require('../lib/Utils').Queue;

var wordTree = require('../lib/WordTree').wordTree;

module.exports = function(sessionStore) {

    var io = require('../lib/io').io;

    function authorization(socket, cb) {

        loadUser(sessionStore)(socket, function (err, s) {
            if(err) logger(err);
            else logger(socket.handshake.user.username + " loaded");

            return cb(socket);
        });
    }

    io.on('connection', function(s){
        authorization(s, function(socket){
            var user = socket.handshake.user || {};
            var gameId = socket.handshake.gameId;
            var game = gamePool.get(gameId);

            game.players.get(user.username).setSocket(socket);

            logger(user.username + ' connected');


            socket
                .on(Events.message, function (text, cb) {
                    game.emit(Events.message, text);
                    cb && cb();
                })
                .on('disconnect', function () {
                    logger(user.username + ' disconnected');

                    //clear(user.gameId);
                })
                .on(Events.state, function () {
                    logger('state event');

                    //var game = gamePool.get(user.gameId);

                    var turn = "true";
                    if (game.currentPlayerUsername === null)
                        turn = "true";
                    else
                        turn = user.is(game.currentPlayerUsername) ? "true" : "false";

                    var state = game.createState(turn);
                    logger('emited to', user.username, state);
                    socket.emit(Events.state, state);
                })
                .on(Events.checkAndCommit, function (word, field) {

                    logger('checkAndCommit event', word, field);

                    //var game = gamePool.get(user.gameId);
                    if (wordTree.exist(word)) {
                        if (game.currentPlayerUsername === null) {
                            game.currentPlayerUsername = user.username;
                        }
                        if (game.currentPlayerUsername === user.username) {
                            var players = game.players;
                            var firstPlayer = game.firstPlayer();
                            var secondPlayer = game.secondPlayer();
                            var firstUser = firstPlayer.user;
                            var secondUser = secondPlayer.user;

                            players.get(user.username).addWord(word);
                            players.get(user.username).addPoints(game.calcPointsByNewField(field));
                            game.setField(field);

                            game.currentPlayerUsername = (firstPlayer.id === user.username) ? secondPlayer.id : firstPlayer.id;


                            firstUser.socket.emit(Events.points, {
                                me: firstPlayer.getPoints(),
                                opponent: secondPlayer.getPoints()
                            });
                            secondUser.socket.emit(Events.points, {
                                me: secondPlayer.getPoints(),
                                opponent: firstPlayer.getPoints()
                            });

                            firstUser.socket.emit(Events.usedWords, {
                                me: firstPlayer.getWords(),
                                opponent: secondPlayer.getWords()
                            });
                            secondUser.socket.emit(Events.usedWords, {
                                me: secondPlayer.getWords(),
                                opponent: firstPlayer.getWords()
                            });


                            players.keys.map(function (key) {
                                var player = players.get(key);
                                var curUser = player.user;
                                var state = game.createState((game.currentPlayerUsername === curUser.username) ? "true" : "false");
                                logger('emited to', curUser.username, state);
                                curUser.socket.emit(Events.state, state);
                            });

                        }
                    }
                    else {
                        var state = game.createState("true");
                        logger('emited to', user.username, state);
                        socket.emit(Events.state, state);
                    }
                })
                .on(Events.checkWord, function (word, cb) {
                    logger('checkWord event', word);
                    var ans = wordTree.exist(word) ? "true" : "false";
                    socket.emit(Events.checkWord, ans);
                    cb && cb();
                })
                .on(Events.ready, function() {
                    logger('Events.ready');
                    if(game && game.firstPlayer() && game.secondPlayer()) {
                        logger('Sent', 'ready');
                        game.emit(Events.ready, game.firstPlayer().user.username, game.secondPlayer().user.username);
                    } else {
                        logger('Sent', 'waiting');
                        game.emit(Events.waiting);
                    }
                });
        });

    });
};
