var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var CookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var HttpError = require('./models/UserModel').HttpError;
var http = require('http');
var config = require('./config');
var AuthError = require('./models/UserModel').AuthError;


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
app.use(express.static(path.join(__dirname, 'shared')));

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
    console.log('Listening on ' + config.get('PORT'));
});

require('./socket')(server, sessionStore, cookieParser);

module.exports = app;
