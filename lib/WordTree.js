/**
 * Created by vasiliy.lomanov on 30.03.2015.
 */

var fs = require('fs');
var Queue = require('./Utils').Queue;

module.exports = (function(){
    function Node(){
        this.nodes = {};
    }

    Node.prototype.end = '#';

    Node.prototype.add = function(word, letterNumber) {
        letterNumber = letterNumber || 0;

        if( word.length <= letterNumber )
        {
            this.nodes[this.end] = {};
            return;
        }
        var letter = word[letterNumber];

        if ( this.nodes[letter] === undefined )
            this.nodes[letter] = new Node();

        this.nodes[letter].add(word, letterNumber+1)
    };
    Node.prototype.exist = function(word, letterNumber){
        letterNumber = letterNumber || 0;
        if( word.length <= letterNumber  )
        {
            return this.nodes[this.end] !== undefined;
        }
        var letter = word[letterNumber];

        if( this.nodes[letter] === undefined )
        {
            return false;
        }

        return this.nodes[letter].exist( word, letterNumber+1 );
    };

    function WordTree(source) {
        this.tree = new Node();
        this.words = [];
        this.wordsByLength = new Queue();

        this.load(source);
    }
    WordTree.prototype.load = function(filename){
        var fs = require('fs');
        var data = fs.readFileSync(filename, 'utf8');

        this.words = data.split('\n');

        for(var i = this.words.length; i--;){
            var word = this.words[i].replace('\r','').toLowerCase();

            this.words[i] = word;

            if(!this.wordsByLength.exist(word.length))
                this.wordsByLength.push(word.length, []);

            this.wordsByLength.get(word.length).push(word);
        }
        this.createTree();
    };
    WordTree.prototype.createTree = function(){
        var tree = new Node();
        this.words.map(function(word){
            tree.add(word);
        });
        this.tree = tree;
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