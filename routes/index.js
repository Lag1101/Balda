
module.exports = function(app) {

    app.use('/', require('./frontpage'));
    app.use('/users', require('./users'));
    app.use('/game', require('./game'));

};