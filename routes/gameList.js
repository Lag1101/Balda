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
var Queue = require('../lib/Utils').Queue;

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
    var myGames = [];
    if(req.session.gameId)
        myGames.push({
            gameId: req.session.gameId
        });

    var allGames = [];
    gamePool.waitingQueue.keys.map(function(key){
        var game = gamePool.waitingQueue.get(key);
        allGames.push({
            gameId: key,
            username: game.hostPlayer().user.username
        });
    });

    res.send({
        all: allGames,
        my: myGames
    });
});

router.post('/createGame', function(req, res, next) {
    User.findOne({username: req.session.username}, function(err, user){

        if(err) throw err;
        var game = gamePool.createGame(user);

        game.generateField(wordTree.getRandomWordByLettersCount(5), 7);
        game.fillBonusLetters();

        req.session.gameId = game._id;

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

        req.session.gameId = gameId;

        res.end();

    });

});
module.exports = router;