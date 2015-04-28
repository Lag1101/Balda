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

        for(var i = 0; i < wordTree.words.length; i++){
            var word = wordTree.words[i];
            logger.debug(word);
            var stat = {
                word: word,
                levenstein: 0
            };
            for(var k = 0; k < wordTree.words.length; k++){
                var comparingWord = wordTree.words[k];
                var distance = levenstein(word, comparingWord);

                stat.levenstein += distance < 4;
            }

            weightedWords.push(stat);
        }

        callback(null, weightedWords);
    },
    function(data, callback) {
        logger.info('stats calculated');
        fs.writeFile("./WordsStats.json", JSON.stringify(data), callback);
    }
], function(err){
    if (!err) {
        logger.info('All good!');
    } else {
        error(err);
    }
});
