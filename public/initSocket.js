function initSocket(mainParams, mainVars) {

    var socket = io.connect('', {
        reconnect: true
    });

    socket
        .on('connect', function(){
            console.log("connected");
            setTimeout(function(){
                socket.emit(Events.ready);
            }, 500);
        })
        .on('disconnect', function(){
            console.log("disconnected");
        })
        .on(Events.waiting, function () {
            printState("waiting for an opponent");
        })
        .on(Events.checkWord, function(answer){
            console.log(answer);
            if(answer === "true")
            {
                redraw_field(mainParams ,mainVars);
                mainParams.action = ACTION_USE_SPELL;
                mainVars.status.text("Слово засчитано! Используйте особую способность ценой не более " + mainVars.new_word.length + " манны");
            }
            else
            {
                mainVars.new_word = '';
                mainParams.ready_to_send = SEND_NOT_READY;

                mainVars.status.text("Error");
                socket.emit(Events.state);
            }
        })
        .on(Events.ready, function(p1, p2){
            printState(p1 + " vs " + p2);
            creating(mainParams, mainVars, socket);
            socket.emit(Events.state);
        })
        .on(Events.state, function (newState) {
            mainParams.state = newState;
            if(newState.turn == "true")
            {
                if(mainVars.status.text() !== "Error") {
                    mainVars.status.text("Ваш ход. Выберите поле для новой буквы.");
                }
                else mainVars.status.text("Такого слова нет, придумайте другое!");
                mainParams.action = ACTION_GET_PLACE;
            }
            else
            {
                mainVars.status.text("Ход соперника. Ожидайте ...");
                mainParams.action = ACTION_WAITING;
            }
            initNear(mainParams, mainVars);
            initGame(mainParams, mainVars);
        })
        .on(Events.points, function(points){
            statsController.setPoints(points.me, points.opponent);
        })
        .on(Events.bonusLetters, function(bonusLetters){
            statsController.setBonusLetters(bonusLetters);
        })
        .on(Events.usedWords, function(words){
            statsController.setWords(words.me, words.opponent);
        })
        .on(Events.nullSession, function(){
            console.log("Your session timed out");
            socket.disconnect();
        });



    function printState(state) {
        $('#state').text(state);
    }
}