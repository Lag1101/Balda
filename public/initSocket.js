function initSocket() {

    var socket = io.connect('', {
        reconnect: true
    });

    socket.on('connect', function(){
        $('#Create').click(function(){
            socket.emit(Events.createGame, 5, 7);
        });
        $('#Join').click(function(){
            socket.emit(Events.joinGame);
        });
    });

    socket
        .on(Events.waiting, function () {
            printState("waiting for an opponent");
        })
        .on(Events.ready, function(p1, p2){
            printState(p1 + " vs " + p2);
            creating();
            socket.emit(Events.state);
        })
        .on(Events.state, function (newState) {
            state = newState;
            initNear();
            initGame();
        })
        .on(Events.points, function(points){
            statsController.setPoints(points.me, points.opponent);
        })
        .on(Events.bonusLetters, function(bonusLetters){
            statsController.setBonusLetters(bonusLetters);
        })
        .on(Events.usedWords, function(words){
            statsController.setWords(words.me, words.opponent);
        });



    function printState(state) {
        $('#state').text(state);
    }
}