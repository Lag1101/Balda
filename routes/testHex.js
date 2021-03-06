/**
 * Created by vasiliy.lomanov on 14.04.2015.
 */

var express = require('express');
var router = express.Router();
var config = require('../config');
var User = require('../models/user').User;

/* GET home page. */
router.get('/', function(req, res, next) {
    User.findOne({username: req.session.username}, function(err, user){

        if(err) throw err;

        res.render('testHex', {
            title: config.get('title'),
            user: user
        });
    });
});

module.exports = router;
