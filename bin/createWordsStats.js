/**
 * Created by vasiliy.lomanov on 28.04.2015.
 */

var wordTree = require('../dictionary').wordTree;
var fs = require('fs');
var logger = require('../lib/logger');
var async = require('async');

async.series([
    wordTree.createTree,
    wordTree.calcStats
],
function(err){
    if(err)
        error(err);
    else
        logger.info('WordTree created and calc');
});
