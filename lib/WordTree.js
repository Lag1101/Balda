/**
 * Created by vasiliy.lomanov on 30.03.2015.
 */

var fs = require('fs');

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
    if( word.length <= letterNumber  )
    {
        return nodes[this.end] !== undefined;
    }
    var letter = word[letterNumber];

    if( nodes[letter] === undefined )
    {
        return false;
    }

    return nodes[letter].exist( word, letterNumber+1 );
};

function WordTree(source) {
    this.tree = new Node();

    var tree = this.tree;
    fs.readFile(source, {encoding: 'utf8'}, function (err, data) {
        if (err) throw err;
        var words = data.split('\r\n');

        words.map(function(word){tree.add(word.toLowerCase())});

        //console.log(data);
    });
}

module.exports = WordTree;