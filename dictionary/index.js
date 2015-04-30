/**
 * Created by vasiliy.lomanov on 30.03.2015.
 */

var fs = require('fs');
var async = require('async');
var logger = require('../lib/logger');
var Queue = require('./../lib/Utils').Queue;

var bindings = require('bindings');

var WordTree = (function(){
    function WordTree(source) {
        this.tree = bindings('WordTree');
        this.filename = source;
    }

    function isWord(word){
        for(var i = 0; i < word.length; i++)
            if(word[i] < 'а' || word[i] > 'я')
                return false;
        return true;
    }

    WordTree.prototype.createTree = function(cb){
        var tree = this.tree;
        var filename = this.filename;
        tree.clear();

        var data = fs.readFileSync(filename, 'utf8');

        var words = data.split('\n');

        for(var i = words.length; i--;){
            var word = words[i].replace('\r','').toLowerCase();

            if(!isWord(word)) continue;

            tree.add(word);
        }
        return cb && cb(null);
    };
    WordTree.prototype.exist = function(word){
        return this.tree.exist(word);
    };

    WordTree.prototype.calcStats = function(cb){
        this.tree.calcStats();
        return cb && cb(null);
    };
    WordTree.prototype.getRandomWordByLettersCount = function(lettersCount, start, end) {

        return this.tree.getWordByLength(lettersCount, start, end);
    };

    return WordTree;
})();

module.exports.WordTree = WordTree;
module.exports.wordTree = module.exports.wordTree || new WordTree('./Words.txt');