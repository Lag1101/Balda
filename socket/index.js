
var logger = require('../lib/logger');
var HttpError = require('../error').HttpError;
var Game = require('../game').Game;
var gamePool = require('../game').gamePool;
var Events = require('../shared/Events');
var config = require('../config');
var loadUser = require('./loadUser');
var async = require('async');

var wordTree = require('../dictionary').wordTree;
async.series([
        wordTree.createTree.bind(wordTree),
        wordTree.calcStats.bind(wordTree)
    ],
    function(err){
        if(err)
            error(err);
        else
            logger.info('WordTree created and calc');
    });

module.exports = function(sessionStore) {

    var io = require('../lib/io').io;

    function authorization(socket, cb) {

        loadUser(sessionStore)(socket, function (err, s) {
            if(err) logger.error(err);
            else logger.info(socket.handshake.user.username + " loaded");

            return cb(err, socket);
        });
    }

    io.on('connection', function(s){
        authorization(s, function(err, socket){

            var user = socket.handshake.user;
            var gameId = socket.handshake.gameId;

            if(err || !user || !gameId) {
                socket.emit(Events.nullSession);
                logger.info("anonimus session");
                socket.disconnect();
                return;
            }

            var game = gamePool.get(gameId);
            var players = game.players;


            game.players.get(user.username).setSocket(socket);

            logger.info(user.username + ' connected');

            socket
                .on(Events.message, function (text, cb) {
                    game.emit(Events.message, text);
                    cb && cb();
                })
                .on('disconnect', function () {
                    logger.info(user.username + ' disconnected');
                })
                .on(Events.state, function () {
                    logger.info('state event');

                    game.touch();

                    var state = game.createState(game.players.get(user.username));
                    logger.info('emited to', user.username, state);
                    socket.emit(Events.state, state);
                })
                .on(Events.turn, function (word, field) {
                    logger.info('turn event', word, field);

                    game.touch();

                    if (wordTree.exist(word)) {
                        if (game.currentPlayerUsername === null) {
                            game.currentPlayerUsername = user.username;
                        }
                        if (game.currentPlayerUsername === user.username) {

                            var currentPLayer = game.firstPlayer(user);
                            var secondPlayer = game.secondPlayer(user);

                            players.get(user.username).addWord(word);
                            players.get(user.username).addPoints(game.calcPointsByNewField(field));
                            game.setField(field);

                            currentPLayer.socket.emit(Events.points, {
                                me: currentPLayer.getPoints(),
                                opponent: secondPlayer.getPoints()
                            });
                            secondPlayer.socket.emit(Events.points, {
                                me: secondPlayer.getPoints(),
                                opponent: currentPLayer.getPoints()
                            });

                            if(secondPlayer.timeToLoose > 0)
                                game.currentPlayerUsername = secondPlayer.id;

                            game.roundNumber++;
                            players.keys.map(function (key) {
                                var player = players.get(key);
                                var curUser = player.user;
                                var state = game.createState(player);

                                logger.info('emited to', curUser.username, state);
                                player.socket.emit(Events.state, state);
                            });
                        }
                    }
                    else {
                        var state = game.createState(game.players.get(user.username));
                        logger.info('emited to', user.username, state);
                        socket.emit(Events.state, state);
                    }
                })
                .on(Events.checkWord, function (word, cb) {
                    logger.info('checkWord event', word);
                    var ans = wordTree.exist(word) ? "true" : "false";
                    socket.emit(Events.checkWord, ans);
                    cb && cb();
                })
                .on(Events.ready, function() {

                    var target = game.started ? socket : game;

                    target.emit(Events.bonusLetters, game.getBonusLetters());
                    logger.info('Events.ready');
                    if(game && game.hostPlayer() && game.opponentPlayer()) {
                        logger.info('Sent', 'ready');
                        target.emit(Events.ready, game.hostPlayer().id, game.opponentPlayer().id);
                        game.started = true;
                        game.touch();
                    } else {
                        logger.info('Sent', 'waiting');
                        target.emit(Events.waiting);
                    }
                })
                .on(Events.gameOver, function(){
                    players.keys.map(function (key) {
                        var player = players.get(key);
                        var state = game.createState(player);
                        state.turn = "false";
                        player.socket.emit(Events.gameOver, state);
                    });

                    setTimeout(function(){
                        gamePool.deleteGame(gameId);
                        socket.disconnect();
                        logger.info('Game', gameId, 'deleted');
                    },config.get("game:timeToDeleteInactiveGameMs"))
                })
                .on(Events.usedWords, function() {
                    var me = game.players.get(user.username);
                    var opponent = (game.hostPlayer().id === me.id) ? game.opponentPlayer() : game.hostPlayer();
                    socket.emit(Events.usedWords, {
                        startWord: game.startWord,
                        me: me.getWords(),
                        opponent: opponent.getWords()
                    });
                })
                .on('error', function(err){
                    logger.error(err);
                })
                .on(Events.bonuses.changeTime, function(target/*"me", "opponent"*/, howMuchMs){
                    (target === "me" ? game.firstPlayer(user) : game.secondPlayer(user)).timeToLoose += howMuchMs;
                    game.touch();
                });
        });

    });
};
