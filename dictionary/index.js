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
    WordTree.prototype.createTree = function(cb){
        var tree = this.tree;
        var filename = this.filename;
        async.series([
            function(cb) {
                tree.clear();
                return cb();
            },
            function(cb){
                var data = fs.readFileSync(filename, 'utf8');

                var words = data.split('\n');

                for(var i = words.length; i--;){
                    var word = words[i].replace('\r','').toLowerCase();

                    tree.add(word);
                }

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

        return this.tree.getEasyWordByLength(2*lettersCount); // todo fucking x2
    };

    return WordTree;
})();

module.exports.WordTree = WordTree;
module.exports.wordTree = module.exports.wordTree || new WordTree('./Words.txt');