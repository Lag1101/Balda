var checkAuth = require('../middleware/checkAuth');

module.exports = function(app) {

    app.use('/', require('./frontpage'));

    app.use('/login', require('./login'));
    app.use('/logout',checkAuth, require('./logout'));

    app.use('/testWords', checkAuth, require('./testWords'));
    app.use('/gamePage', checkAuth, require('./gamePage'));

    app.use('/users', checkAuth, require('./users'));

    app.use('/testHex', checkAuth, require('./testHex'));

    app.use('/gameList', checkAuth, require('./gameList'));
};