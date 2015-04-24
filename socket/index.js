var logger = require('debug')('socket');
var HttpError = require('../error').HttpError;
var Game = require('../game').Game;
var gamePool = require('../game').gamePool;
var Events = require('../shared/Events');
var config = require('../config');
var loadUser = require('./loadUser');

var wordTree = require('../lib/WordTree').wordTree;

module.exports = function(sessionStore) {

    var io = require('../lib/io').io;

    function authorization(socket, cb) {

        loadUser(sessionStore)(socket, function (err, s) {
            if(err) logger(err);
            else logger(socket.handshake.user.username + " loaded");

            return cb(err, socket);
        });
    }

    io.on('connection', function(s){
        authorization(s, function(err, socket){

            var user = socket.handshake.user;
            var gameId = socket.handshake.gameId;

            if(err || !user || !gameId) {
                socket.emit(Events.nullSession);
                logger("anonimus session");
                socket.disconnect();
                return;
            }

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
                })
                .on(Events.state, function () {
                    logger('state event');

                    var turn = "true";
                    if (game.currentPlayerUsername === null)
                        turn = "true";
                    else
                        turn = (user.username === game.currentPlayerUsername) ? "true" : "false";

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

                            players.get(user.username).addWord(word);
                            players.get(user.username).addPoints(game.calcPointsByNewField(field));
                            game.setField(field);

                            game.currentPlayerUsername = (firstPlayer.id === user.username) ? secondPlayer.id : firstPlayer.id;


                            firstPlayer.socket.emit(Events.points, {
                                me: firstPlayer.getPoints(),
                                opponent: secondPlayer.getPoints()
                            });
                            secondPlayer.socket.emit(Events.points, {
                                me: secondPlayer.getPoints(),
                                opponent: firstPlayer.getPoints()
                            });

                            firstPlayer.socket.emit(Events.usedWords, {
                                me: firstPlayer.getWords(),
                                opponent: secondPlayer.getWords()
                            });
                            secondPlayer.socket.emit(Events.usedWords, {
                                me: secondPlayer.getWords(),
                                opponent: firstPlayer.getWords()
                            });


                            players.keys.map(function (key) {
                                var player = players.get(key);
                                var curUser = player.user;
                                var state = game.createState((game.currentPlayerUsername === curUser.username) ? "true" : "false");
                                logger('emited to', curUser.username, state);
                                player.socket.emit(Events.state, state);
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

                    var target = game.started ? socket : game;

                    target.emit(Events.bonusLetters, game.getBonusLetters());
                    logger('Events.ready');
                    if(game && game.firstPlayer() && game.secondPlayer()) {
                        logger('Sent', 'ready');
                        target.emit(Events.ready, game.firstPlayer().user.username, game.secondPlayer().user.username);
                        game.started = true;
                    } else {
                        logger('Sent', 'waiting');
                        target.emit(Events.waiting);
                    }
                });
        });

    });
};
