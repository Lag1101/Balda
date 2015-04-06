var log = require('../lib/log')(module);
var HttpError = require('../error').HttpError;
var users = require('../models/UserModel').users;

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

            console.log(user.username + ' connected');

            socket.on('message', function(text, cb) {
                socket.broadcast.emit('message', user.username, text);
                cb && cb();
            });
            socket.on('disconnect', function () {
                console.log(user.username + ' disconnected');
            });
            socket.on('New Game', function(cb) {

                socket.broadcast.emit('message', user.username, text);
                cb && cb();
            });
            socket.on('checkWord', function(word, cb) {
                var ans = wordTree.exist(word) ? "true" : "false";
                socket.emit('checkWord', ans);
                cb && cb();
            });
            socket.on('GiveMeWord', function(letters_num, cb) {
                var letters = ['в', 'а', 'с', 'ё', 'к'];
                socket.emit('GiveMeWord', letters);
                cb && cb();
            });
        });

    });
};


