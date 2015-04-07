function initSocket() {

    var socket = io.connect('', {
        reconnect: true
    });

    socket.on('connect', function(){
        socket.emit('field');
    });

    socket.on('field', function (letters) {
        console.log(letters);
        initialize(letters);
    });

    socket.on('checkWord', function(answer){
        if(answer === "true")
        {

        }
    });
}