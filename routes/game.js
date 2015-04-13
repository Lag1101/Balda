/**
 * Created by vasiliy.lomanov on 17.02.2015.
 */
var express = require('express');
var router = express.Router();
var User = require('../models/user').User;

/* GET home page. */
router.get('/', function(req, res, next) {
    User.findById(req.session.user, function(err, user){

        if(err) throw err;

        res.render('game', {
            user: user
        });
    });
});

module.exports = router;
