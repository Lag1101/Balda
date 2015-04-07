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
            socket.emit('field');
        })
        .on('field', function (letters) {
            console.log(letters);
            initialize(letters);
        })
        .on('checkWord', function(answer){
            if(answer === "true")
            {

            }
        })
        .on('disconnected', function(username) {
            printState(username + " disconnected");
        });

    function printState(state) {
        $('#state').text(state);
    }
}