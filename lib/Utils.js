/**
 * Created by vasiliy.lomanov on 08.04.2015.
 */
module.exports.Queue = (function(){
    function Queue (){
        this.length = 0;
        this.elements = {};
        this.keys = [];
    }

    Queue.prototype.push = function(key, val){
        if(val === undefined) return null;

        var sKey = key.toString();

        this.keys.push(sKey);
        this.elements[sKey] = val;
    };
    Queue.prototype.erase = function(key){
        var sKey = key.toString();
        if(this.exist(sKey)){
            this.keys.splice(this.keys.indexOf(sKey), 1);
            this.elements[sKey] = undefined;
        }
    };
    Queue.prototype.len = function(){
        return this.keys.length;
    };
    Queue.prototype.get = function(key){
        var sKey = key.toString();
        return this.elements[sKey];
    };
    Queue.prototype.exist = function(key){
        var sKey = key.toString();
        return this.elements[sKey] !== undefined;
    };
    return Queue;
})();


