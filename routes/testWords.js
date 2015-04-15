/**
 * Created by vasiliy.lomanov on 31.03.2015.
 */

var express = require('express');
var router = express.Router();
var User = require('../models/user').User;
var config = require('../config');

/* GET home page. */
router.get('/', function(req, res, next) {
    User.findById(req.session.user, function(err, user){

        if(err) throw err;

        res.render('testWords', {
            title: config.get('title'),
            user: user
        });
    });
});
module.exports = router;