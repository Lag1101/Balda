/**
 * Created by vasiliy.lomanov on 20.04.2015.
 */


function getIo(server) {
    if( !module.exports.io && !server )
        throw new Error("Server must be first");

    if(server) {
        var io = require('socket.io').listen(server);
        io.set( 'origins', '*domain.com*:*' );
        io.use(require('socket.io-cookie-parser')());
        module.exports.io = io;
        return io;
    } else {
        return module.exports.io;
    }

}

module.exports = getIo;