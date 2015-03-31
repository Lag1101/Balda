/**
 * Created by vasiliy.lomanov on 31.03.2015.
 */

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('testWords');
});
module.exports = router;