/**
 * Created by vasiliy.lomanov on 30.03.2015.
 */

var fs = require('fs');
var async = require('async');
var logger = require('../lib/logger');
var Queue = require('./../lib/Utils').Queue;

var WordTree = (function(){
    function WordTree(source) {
        this.tree = require('./cpp/build/Release/WordTree.node');
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
        try{
            var tree = this.tree;
            var words = this.words;

            tree.clear();
            async.waterfall([function(cb){
                    words.map(function(word){
                        tree.add(word);
                    });
                    cb(null);
                }],
            function(err){
                return cb && cb(err);
            });

        } catch(e){
            return cb && cb(e.message);
        }

    };
    WordTree.prototype.exist = function(word){
        return this.tree.exist(word);
    };

    WordTree.prototype.getRandomWordByLettersCount = function(lettersCount) {
        var words = this.wordsByLength.get(lettersCount);

        var n = Math.floor(Math.random()*words.length);

        return words[n];
    };

    return WordTree;
})();

module.exports.WordTree = WordTree;
module.exports.wordTree = module.exports.wordTree || new WordTree('./Words.txt');