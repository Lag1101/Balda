/**
 * Created by vasiliy.lomanov on 15.04.2015.
 */
var logger = require('debug')('gameList');
var express = require('express');
var router = express.Router();
var User = require('../models/user').User;
var config = require('../config');
var gamePool = require('../game').gamePool;
var wordTree = require('../lib/WordTree').wordTree;

/* GET home page. */
router.get('/', function(req, res, next) {
    User.findOne({username: req.session.username}, function(err, user){

        if(err) throw err;

        res.render('gameList', {
            title: config.get('title'),
            user: user
        });
    });
});
router.get('/list', function(req, res, next) {
    //logger('list ' + JSON.decode(gamePool.waitingQueue));
    var ids = gamePool.waitingQueue.keys;

    res.send(gamePool.waitingQueue);
});

router.post('/createGame', function(req, res, next) {
    User.findOne({username: req.session.username}, function(err, user){

        if(err) throw err;
        var game = gamePool.createGame(user);

        game.generateField(wordTree.getRandomWordByLettersCount(5), 7);
        game.fillBonusLetters();

        logger("Created game " + user.gameId);
        logger("Games count " + gamePool.len());

        res.end();
    });

});

router.post('/joinGame', function(req, res, next) {
    User.findOne({username: req.session.username}, function(err, user){

        if(err) throw err;
        var gameId = req.body.gameId;

        gamePool.joinGame(user, gameId);

        res.end();

    });

});
module.exports = router;