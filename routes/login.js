/**
 * Created by vasiliy.lomanov on 17.02.2015.
 */
var express = require('express');
var router = express.Router();
var HttpError = require('../error').HttpError;
var AuthError = require('../models/UserModel').AuthError;
var users = require('../models/UserModel').users;

/* GET home page. */
router.route('/')
    .get(function(req, res, next) {
        res.render('login', {
            user: users.get(req.session.user)
        });
    })
    .post(function(req, res, next) {
        var username = req.body.username;
        var password = req.body.password;

        users.authorize(username, password, function(err, user) {
            if (err) {
                return next(err);
            }

            req.session.user = user._id;
            res.end();
        });

    } );

module.exports = router;
