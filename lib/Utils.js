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

        if(!this.exist(sKey))
            this.keys.push(sKey);
        this.elements[sKey] = val;
    };
    Queue.prototype.erase = function(key){
        var sKey = key.toString();
        if(this.exist(sKey)){
            this.keys.splice(this.keys.indexOf(sKey), 1);
            delete this.elements[sKey];
            //this.elements[sKey] = undefined;
        }
    };
    Queue.prototype.len = function(){
        return this.keys.length;
    };
    Queue.prototype.get = function(key){
        if(key === null || key === undefined) return null;
        var sKey = key.toString();
        return this.elements[sKey];
    };
    Queue.prototype.exist = function(key){
        if(!key) return false;
        var sKey = key.toString();
        return this.elements[sKey] !== undefined;
    };
    //Queue.prototype.For = function(callback) {
    //    for(var i = 0; i < this.keys.length; i++ ) {
    //        var key = this.keys[i];
    //        var element = this.get(key);
    //
    //        if( false == callback(i, key, element) )
    //            break;
    //    }
    //};
    Queue.prototype.stringify = function() {

    };
    return Queue;
})();

module.exports.xRange = (function(){
    function xRange(segment){
        var begin = segment.begin || 0;
        var end = segment.end;
        var step = segment.step || 1;

        var res = [];

        for(var i = begin; i < end; i += step) {
            res.push(i);
        }
        return res;
    }
    return xRange;
})();


