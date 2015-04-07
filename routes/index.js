var checkAuth = require('../middleware/checkAuth');

module.exports = function(app) {

    app.use('/', require('./frontpage'));

    app.use('/login', require('./login'));
    app.use('/logout',checkAuth, require('./logout'));

    app.use('/game', checkAuth, require('./game'));

    app.use('/testWords', require('./testWords'));
    app.use('/test_page', checkAuth, require('./test_page'));
};