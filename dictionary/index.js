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
        this.words = [];
        this.wordsByLength = new Queue();

        this.load(source);
    }
    WordTree.prototype.load = function(filename){
        var data = fs.readFileSync(filename, 'utf8');

        this.words = data.split('\n');

        for(var i = this.words.length; i--;){
            var word = this.words[i].replace('\r','').toLowerCase();

            this.words[i] = word;

            if(!this.wordsByLength.exist(word.length))
                this.wordsByLength.push(word.length, []);

            this.wordsByLength.get(word.length).push(word);
        }
    };
    WordTree.prototype.createTree = function(cb){
        var tree = this.tree;
        var words = this.words;
        async.series([
            function(cb) {
                tree.clear();
                return cb();
            },
            function(cb){
                words.map(function(word){
                    tree.add(word);
                });
                return cb();
            }
        ], function(err){
            return cb && cb(err);
        });
    };
    WordTree.prototype.exist = function(word){
        return this.tree.exist(word);
    };

    WordTree.prototype.calcStats = function(cb){
        var tree = this.tree;
        async.series([
            function(cb) {
                tree.calcStats();
                return cb();
            }
        ], function(err){
            return cb && cb(err);
        });

    };
    WordTree.prototype.getRandomWordByLettersCount = function(lettersCount) {

        return this.tree.getEasyWordByLength(lettersCount);
    };

    return WordTree;
})();

module.exports.WordTree = WordTree;
module.exports.wordTree = module.exports.wordTree || new WordTree('./Words.txt');