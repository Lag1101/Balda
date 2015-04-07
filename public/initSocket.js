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
            initialize(state);
        })
        .on('checkWord', function(answer){
            if(answer === "true")
            {

            }
            else
            {

            }
        })
        .on('disconnected', function(username) {
            printState(username + " disconnected");
        })

        .on('turn', function(turn){
            if(turn === "true")
            {}
            else
            {}
        });

    function printState(state) {
        $('#state').text(state);
    }
}