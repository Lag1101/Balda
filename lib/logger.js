/**
 * Created by vasiliy.lomanov on 17.04.2015.
 */

var debug = require('debug');

module.exports = function(m){
    var pathParts = m.filename.split('\\');
    var name = pathParts[pathParts.length-1].replace('.js', '');
    return {
        log: debug(name + ":log"),
        error: debug(name + ":error")
    }
};