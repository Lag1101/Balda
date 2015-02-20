/**
 * Created by vasiliy.lomanov on 20.02.2015.
 */

function tuneServer(server) {
    var io = require('socket.io').listen(server);
    io
        .on('connection', function(socket){

            console.log('connected' + JSON.stringify(socket.id));

            socket
                .on('chat message', function(msg){
                    io.emit('chat message', msg);
                })
                .on('disconnect', function(reason){
                    console.log('disconnected: ' + reason);
                });
        });
}

exports.tuneServer = tuneServer;