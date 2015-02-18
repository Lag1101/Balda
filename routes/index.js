
module.exports = function(app) {

    app.use('/', require('routes/frontpage'));
    app.use('/users', require('routes/users'));
    app.use('/game', require('routes/game'));

    app.use('/login', require('routes/login'));
    app.use('/logout', require('routes/logout'));
};