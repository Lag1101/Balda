var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var CookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var AuthError = require('./models/UserModel').AuthError;
var HttpError = require('./models/UserModel').HttpError;
var users = require('./models/UserModel').users;
var debug = require('debug')('Balda:server');
var http = require('http');
var config = require('./config');
var async = require('async');


var cookieParser = CookieParser;
var sessionStore = new session.MemoryStore();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('port', config.get('PORT'));

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.png'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
    secret: config.get('session:secret'),
    resave: false,
    saveUninitialized: true,
    store: sessionStore
}));

app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

require('./routes')(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

app.use(function(err, req, res, next) {

    if(err instanceof AuthError) {
        res.status(403);
        res.send({
            message: err.message,
            error: {}
        });
    } else {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: (app.get('env') === 'development' ? err : {})
        });
    }
});

var server = http.createServer(app);
server.listen(config.get('PORT'), function(){
    debug('Listening on ' + config.get('PORT'));
});

var io = require('socket.io').listen(server);

var SessionSockets = require('session.socket.io-express4')
    , sessionSockets = new SessionSockets(io, sessionStore, cookieParser());


sessionSockets.on('connection', function (err, socket, session) {

    function loadSession(sid, callback) {
        sessionStore.get(sid[config.get('session:key')], function(err, session) {
            if(err) {
                return callback(err, null);
            }
            if (arguments.length == 0 || !session) {
                // no arguments => no session
                return callback(new Error("Cannot load session"), null);
            } else {
                return callback(null, session);
            }
        });
    }
    function loadUser(session, callback) {

        if (session.user === undefined) {
            console.log("Session %s is anonymous", session.id);
            return callback(null, null);
        }

        console.log("retrieving user ", session.user);

        callback(null, users.get(session.user));

    }
    function loadUserBySid(sid, callback) {
        async.waterfall([
                function(callback) {
                    loadSession(sid, callback);
                },
                function(session, callback) {

                    if (!session) {
                        return callback(new HttpError(401, "No session"));
                    }

                    socket.handshake.session = session;

                    loadUser(session, callback)
                },
                function(user, callback) {
                    if (!user) {
                        callback(new HttpError(403, "Anonymous session may not connect"));
                    }

                    socket.handshake.user = user;

                    callback(null);
                }

            ],
            function(err){
                callback(err, socket);
            });
    }
    function fullLoadUser (socket, callback) {
        var cookies = socket.handshake.cookies;
        var sid = cookieParser.signedCookies(cookies, config.get('session:secret'));
        loadUserBySid(sid, callback);
    }

    fullLoadUser(socket, function(err, socket){
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
    });

});

module.exports = app;
