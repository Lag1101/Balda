var debug = require('debug'),
    logger = debug('socket:log'),
    error = debug('socket:error');
var HttpError = require('../error').HttpError;
var Game = require('../game').Game;
var gamePool = require('../game').gamePool;
var WordTree = require('../lib/WordTree');
var Events = require('../shared/Events');

var wordTree = new WordTree('./Words.txt');

module.exports = function(server, sessionStore, cookieParser) {

    var io = require('socket.io').listen(server);
    var SessionSockets = require('session.socket.io-express4'),
    sessionSockets = new SessionSockets(io, sessionStore, cookieParser());

    sessionSockets.on('connection', function (err, socket, session) {
        require('./loadUser')(sessionStore, cookieParser, socket)(socket, function(err, socket){
            if(err) error(err);

            var user = socket.handshake.user || {};
            user.socket = socket;

            logger(user.username + ' connected');

            function clear(gameId){
                var game = gamePool.get(gameId);
                if(game) {
                    console.log("Deleted game " + gameId);
                    gamePool.deleteGame(gameId);
                }
            }

            socket
                .on(Events.createGame, function(wordSize, fieldSize){
                    clear(user.gameId);

                    var game = gamePool.createGame(user);

                    game.generateField(wordTree.getRandomWordByLettersCount(wordSize), fieldSize);
                    game.fillBonusLetters();

                    game.emit(Events.waiting);

                    logger("Created game " + user.gameId);
                    logger("Games count " + gamePool.len());
                })
                .on(Events.joinGame, function(){
                    clear(user.gameId);

                    var game = gamePool.joinGame(user);
                    if(game) {
                        var player1 = game.firstPlayer().user;
                        var player2 = game.secondPlayer().user;

                        game.emit(Events.bonusLetters, game.getBonusLetters());
                        game.emit(Events.points, {me:0, opponent:0});
                        game.emit(Events.ready, player1.username, player2.username);
                        logger("Joined to game " + user.gameId);
                    }
                })
                .on(Events.message, function(text, cb) {
                    gamePool.get(user.gameId).emit(Events.message, text);
                    cb && cb();
                })
                .on('disconnect', function() {
                    logger(user.username + ' disconnected');

                    clear(user.gameId);
                })
                .on(Events.state, function() {
                    logger('state event');

                    var game = gamePool.get(user.gameId);

                    var turn = "true";
                    if(game.currentPlayerUsername === null)
                        turn = "true";
                    else
                        turn = user.is(game.currentPlayerUsername) ? "true" : "false";

                    var state = game.createState(turn);
                    logger('emited to', user.username, state);
                    socket.emit(Events.state, state);
                })
                .on(Events.checkAndCommit, function(word, field){

                    logger('checkAndCommit event', word, field);

                    var game = gamePool.get(user.gameId);
                    if(wordTree.exist(word)) {
                        if(game.currentPlayerUsername === null){
                            game.currentPlayerUsername = user.username;
                        }
                        if(game.currentPlayerUsername === user.username) {
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


                            players.keys.map(function(key){
                                var player = players.get(key);
                                var curUser =  player.user;
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
                .on(Events.checkWord, function(word, cb) {
                    logger('checkWord event', word);
                    var ans = wordTree.exist(word) ? "true" : "false";
                    socket.emit(Events.checkWord, ans);
                    cb && cb();
                })
                .on(Events.gameList, function(){
                    //console.log('gameList event');
                    this.emit(Events.gameList, gamePool.waitingQueue);
                });
        });

    });
};
