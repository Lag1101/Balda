/**
 * Created by vasiliy.lomanov on 28.04.2015.
 */

var wordTree = require('../dictionary/WordTree').wordTree;
var levenstein = require('../dictionary/levenshtein');
var fs = require('fs');
var logger = require('../lib/logger');
var async = require('async');

async.waterfall([
    function(callback){
        var weightedWords = [];

        async.map(wordTree.words, function(word){
            var stat = {
                word: word,
                levenstein: 0
            };
            wordTree.words.map(function(comparingWord){
                var distance = levenstein(word, comparingWord);

                stat.levenstein += distance < 4;
            });
            logger.debug(stat);

            weightedWords.push(stat);
        });

        callback(null, weightedWords);
    },
    function(data, callback) {
        logger.info('stats calculated');
        fs.writeFile("./WordsStats.json", JSON.stringify(data), callback);
    }
], function(err){
    if (!err) {
        logger('All good!');
    } else {
        error(err);
    }
});
