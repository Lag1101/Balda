function initSocket() {

    var socket = io.connect('', {
        reconnect: true
    });

    socket.on('connect', function(){
        $('#Create').click(function(){
            socket.emit('CreateGame', 5, 7);
        });
        $('#Join').click(function(){
            socket.emit('JoinGame');
        });
    });

    socket
        .on('waiting', function () {
            printState("waiting for an opponent");
        })
        .on('ready',function(p1, p2){
            printState(p1 + " vs " + p2);
            socket.emit('state');
        })
        .on('state', function (state) {
            creating();
            initialize(state, function(word,field)
            {
                socket.emit('checkAndCommit', word, field)
            });
        })
        .on('disconnected', function(username) {
            printState(username + " disconnected");
        })

    function printState(state) {
        $('#state').text(state);
    }
}