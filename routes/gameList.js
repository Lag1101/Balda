/**
 * Created by vasiliy.lomanov on 15.04.2015.
 */
var express = require('express');
var router = express.Router();
var User = require('../models/user').User;
var config = require('../config');

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
module.exports = router;