/**
 * Created by vasiliy.lomanov on 17.02.2015.
 */
var express = require('express');
var router = express.Router();
var HttpError = require('../error').HttpError;
var AuthError = require('../models/user').AuthError;
var User = require('../models/user').User;

/* GET home page. */
router.route('/')
    .get(function(req, res, next) {
        res.render('login');
    })
    .post(function(req, res, next) {
        var username = req.body.username;
        var password = req.body.password;

        User.authorize(username, password, function(err, user) {
            if (err) return next(err);

            req.session.username = user.username;
            res.end();
        });
    } );

module.exports = router;
