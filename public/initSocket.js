function initSocket() {

    var socket = io.connect('', {
        reconnect: true
    });

    socket.on('connect', function(){
        socket.emit('GiveMeWord', 5);
        });

    socket.on('GiveMeWord', function (letters) {
        initialize(letters);
    });

    socket.on('checkWord', function(answer){
        if(answer === "true")
        {

        }
    });
}