/**
 * Created by vasiliy.lomanov on 15.04.2015.
 */
var logger = require('../lib/logger');
var express = require('express');
var router = express.Router();
var User = require('../models/user').User;
var config = require('../config');
var gamePool = require('../game').gamePool;
var wordTree = require('../dictionary').wordTree;
var Queue = require('../lib/Utils').Queue;
var HttpError = require('../error').HttpError;

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
    if(req.session.gameId && gamePool.exist(req.session.gameId))
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

        if(req.session.gameId)
            gamePool.deleteGame(req.session.gameId);
        var game = gamePool.createGame(user);

        game.generateField(wordTree.getRandomWordByLettersCount(5, 0.0, 0.1), 7);
        game.fillBonusLetters();

        req.session.gameId = game._id;

        logger.info("Created game " + user.gameId);
        logger.info("Games count " + gamePool.len());

        res.end();
    });

});

router.post('/joinGame', function(req, res, next) {

    if(gamePool.get(req.body.gameId).hostPlayer().id === req.session.username)
    {
        res.status(403);
        return res.send("It's your game");
    }

    User.findOne({username: req.session.username}, function(err, user){

        if(err) throw err;
        var gameId = req.body.gameId;

        gamePool.joinGame(user, gameId);

        req.session.gameId = gameId;

        return res.end();
    });

});
module.exports = router;