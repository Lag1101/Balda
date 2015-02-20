var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var AuthError = require('./models/UserModel').AuthError;
var debug = require('debug')('Balda:server');
var http = require('http');
var config = require('./config');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.png'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
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

var port = config.get('PORT');
app.set('port', port);

var server = http.createServer(app);

server.listen(port, function(){
    debug('Listening on ' + port);
});

require('./socket')(server);

module.exports = app;
