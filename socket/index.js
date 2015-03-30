var log = require('../lib/log')(module);
var HttpError = require('../error').HttpError;
var users = require('../models/UserModel').users;


module.exports = function(server, sessionStore, cookieParser) {

    var io = require('socket.io').listen(server);
    var SessionSockets = require('session.socket.io-express4'),
    sessionSockets = new SessionSockets(io, sessionStore, cookieParser());

    sessionSockets.on('connection', function (err, socket, session) {
        require('./loadUser')(sessionStore, cookieParser, socket)(socket, function(err, socket){
            if(err)
                return console.error(err);

            var user = socket.handshake.user;

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
        });

    });
};


