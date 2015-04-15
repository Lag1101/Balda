/**
 * Created by vasiliy.lomanov on 07.04.2015.
 */

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('gamePage');
});
module.exports = router;