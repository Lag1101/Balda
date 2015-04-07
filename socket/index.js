var log = require('../lib/log')(module);
var HttpError = require('../error').HttpError;
var users = require('../models/UserModel').users;
var gamePool = require('../game').gamePool;
var WordTree = require('../lib/WordTree');
var Room = require('./room');

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
                user.game.player2.socket.emit('field', user.game.field);
            } else {
                gamePool.createGame(user, "рачье");
                user.game.player1.socket.emit('field', user.game.field);
            }

            var room = new Room(user.game);

            console.log(user.username + ' connected');

            socket
                .on('message', function(text, cb) {
                    room.emit('message', text);
                    cb && cb();
                })
                .on('disconnect', function () {
                    room.emit('disconnected', user.username);
                    console.log(user.username + ' disconnected');
                })
                .on('field', function(field){
                    if(field)
                        room.game.field = field;
                    room.emit('field', room.game.field);
                });


            socket.on('checkWord', function(word, cb) {
                var ans = wordTree.exist(word) ? "true" : "false";
                socket.emit('checkWord', ans);
                cb && cb();
            });
        });

    });
};


