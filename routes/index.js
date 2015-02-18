var checkAuth = require('middleware/checkAuth');

module.exports = function(app) {

    app.use('/', require('routes/frontpage'));

    app.use('/login', require('routes/login'));
    app.use('/logout',checkAuth, require('routes/logout'));

    app.use('/game', checkAuth, require('routes/game'));
};