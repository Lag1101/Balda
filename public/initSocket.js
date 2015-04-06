function initSocket() {

    var socket = io.connect('', {
        reconnect: true
    });

    socket.on('connect', function(){
        alert('123');
        socket.emit('GiveMeWord', 5);
        });

    socket.on('GiveMeWord', function (letters) {
        initialize(letters);
    });
}