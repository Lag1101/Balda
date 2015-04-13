/**
 * Created by vasiliy.lomanov on 13.04.2015.
 */

var express = require('express');
var router = express.Router();
var HttpError = require('../error').HttpError;
var AuthError = require('../models/user').AuthError;
var User = require('../models/user').User;

/* GET home page. */
router.route('/')
    .get(function(req, res, next) {

        User.find(function(err, users) {
            if(err) throw err;

            res.send(users);
        })
    });

module.exports = router;
