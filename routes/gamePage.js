/**
 * Created by vasiliy.lomanov on 07.04.2015.
 */
var express = require('express');
var router = express.Router();
var User = require('../models/user').User;
//var Game = require('../models/user').Game;
var gamePool = require('../game').gamePool;
var Game = require('../game').Game;

var config = require('../config');
var logger = require('../lib/logger');
var HttpError = require('../error').HttpError;

/* GET home page. */
router.get('/', function(req, res, next) {
    logger.info(req.query);

    var game = gamePool.get(req.query.id);
    if(!game) throw new HttpError(401, "Игра не найдена");

    if( game.hostPlayer().id !== req.session.username && (game.opponentPlayer() && game.opponentPlayer().id !== req.session.username)) {
        throw new HttpError(403, "Доступ запрещен");
    }

    User.findOne({username: req.session.username}, function(err, user){
        if(err || !user) throw new HttpError(401, "");

        res.render('gamePage', {
            title: config.get('title'),
            user: user
        });
    });


});
module.exports = router;