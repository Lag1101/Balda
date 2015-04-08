/**
 * Created by vasiliy.lomanov on 30.03.2015.
 */

var fs = require('fs');

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

        var tree = this.tree;
        var fs = require('fs');
        var data = fs.readFileSync(source, 'utf8');

        var words = data.split('\n');

        words.map(function(word){
            tree.add(word.replace('\r','').toLowerCase());
        });
    }
    WordTree.prototype.exist = function(word){
        return this.tree.exist(word);
    };

    return WordTree;
})();