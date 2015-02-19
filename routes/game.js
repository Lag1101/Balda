/**
 * Created by vasiliy.lomanov on 17.02.2015.
 */
var express = require('express');
var router = express.Router();
var users = require('../models/UserModel').users;

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('game', {
        user: users.get(req.session.user)
    });
});

module.exports = router;
