/**
 * Created by vasiliy.lomanov on 17.02.2015.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('frontpage', { title: 'Express' });
});

module.exports = router;
