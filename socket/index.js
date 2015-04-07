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

            if(gamePool.joinGame(user)) {

            } else {
                gamePool.createGame(user, "рачье");
                user.game.emit('waiting');
            }

            if( user.game.ready() )
                user.game.emit('ready', user.game.player1.username, user.game.player2.username);

            console.log(user.username + ' connected');

            socket
                .on('message', function(text, cb) {
                    room.emit('message', text);
                    cb && cb();
                })
                .on('field', function(field){
                    if(field)
                        user.game.field = field;
                    user.game.emit('field', user.game.field);
                })
                .on('disconnect', function() {
                    console.log(user.username + ' disconnected');
                    user.game.emit('disconnected', user.username);
                    gamePool.deleteGame(user.game._id);
                });


            socket.on('checkWord', function(word, cb) {
                var ans = wordTree.exist(word) ? "true" : "false";
                socket.emit('checkWord', ans);
                cb && cb();
            });
        });

    });
};


