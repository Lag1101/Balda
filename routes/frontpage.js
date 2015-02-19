/**
 * Created by vasiliy.lomanov on 17.02.2015.
 */
var express = require('express');
var router = express.Router();
var config = require('config');
var users = require('../models/UserModel').users;

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('frontpage', {
        title: config.get('title'),
        user: users.get(req.session.user)
    });
});

module.exports = router;
