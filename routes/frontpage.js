/**
 * Created by vasiliy.lomanov on 17.02.2015.
 */
var express = require('express');
var router = express.Router();
var config = require('config');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('frontpage', { title: config.get('title') });
});

module.exports = router;
