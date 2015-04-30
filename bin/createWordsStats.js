/**
 * Created by vasiliy.lomanov on 28.04.2015.
 */

var wordTree = require('../dictionary').wordTree;
var fs = require('fs');
var logger = require('../lib/logger');
var async = require('async');


async.series([
    function(cb) {
        return wordTree.createTree(cb);
    },
    function(cb){
        return wordTree.calcStats(cb);
    }
], function(err){
    logger.info('WordTree created and calc');

    logger.info(wordTree.getRandomWordByLettersCount(5));
});
