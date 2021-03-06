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
            if(answer === "true")
            {
                if(isNewWord(mainVars) === 1) {
                    redraw_field(mainParams, mainVars);
                    mainParams.action = ACTION_USE_SPELL;
                    if (mainVars.new_word.length < 3) {
                        mainParams.action = ACTION_NONE;
                        mainVars.status.text(TXT_TURN_END);
                    }
                    else {
                        $('body').keypress(function (event) {
                            var new_spell = String.fromCharCode(event.which);
                            switch (new_spell) {
                                case '3':
                                    if (mainVars.new_word.length < 3) {
                                        mainVars.status.text(TXT_NO_MANA + mainVars.new_word.length);
                                    }
                                    else {
                                        $(this).off("keypress");
                                        mainVars.status.text(TXT_FREEZ_EMPTY);
                                        mainParams.action = ACTION_FREEZ_EMPTY;
                                    }
                                    break;
                                case '4':
                                    if (mainVars.new_word.length < 4) {
                                        mainVars.status.text(TXT_NO_MANA + mainVars.new_word.length);
                                    }
                                    else {
                                        $(this).off("keypress");
                                        mainVars.status.text(TXT_SWAP);
                                        mainParams.action = ACTION_SWAPPING;
                                    }
                                    break;
                                case '5':
                                    if (mainVars.new_word.length < 5) {
                                        mainVars.status.text(TXT_NO_MANA + mainVars.new_word.length);
                                    }
                                    else {
                                        $(this).off("keypress");
                                        mainVars.status.text(TXT_FREEZ_LETTER);
                                        mainParams.action = ACTION_FREEZ_LETTER;
                                    }
                                    break;
                                case '6':
                                    if (mainVars.new_word.length < 6) {
                                        mainVars.status.text(TXT_NO_MANA + mainVars.new_word.length);
                                    }
                                    else {
                                        $(this).off("keypress");
                                        mainVars.status.text(TXT_CHANGE_LETTER);
                                        mainParams.action = ACTION_CHANGED;
                                    }
                                    break;
                                default:
                                    mainParams.action = ACTION_NONE;
                                    mainVars.status.text(TXT_TURN_END);
                                    break;
                            }
                        });
                        mainVars.status.text(TXT_SUCCESS + mainVars.new_word.length + TXT_SPELL_TIME);
                    }
                }
                else
                {
                    mainVars.new_word = '';
                    mainParams.ready_to_send = SEND_NOT_READY;

                    mainVars.status.text("Error_2");
                    socket.emit(Events.state);
                }
            }
            else
            {
                mainVars.new_word = '';
                mainParams.ready_to_send = SEND_NOT_READY;

                mainVars.status.text("Error_1");
                socket.emit(Events.state);
            }
        })
        .on(Events.ready, function(p1, p2){
            printState(p1 + " vs " + p2);
            creating(mainParams, mainVars, socket);
            socket.emit(Events.state);
        })
        .on(Events.state, function (newState) {
            socket.emit(Events.usedWords);
            mainParams.state = newState;
            mainVars.lost_time.my_time = newState.time.me;
            mainVars.lost_time.op_time = newState.time.opponent;

            if(newState.turn == "true")
            {
                if(mainVars.status.text() === "Error_1") {
                    mainVars.status.text(TXT_ERROR_WORD);
                }
                else if(mainVars.status.text() === "Error_2") {
                    mainVars.status.text(TXT_ANOTHER_WORD);
                }
                else mainVars.status.text(TXT_GET_FIELD);
                mainParams.action = ACTION_GET_PLACE;
            }
            else
            {
                mainVars.status.text(TXT_OPPONENT_TURN);
                mainParams.action = ACTION_WAITING;
            }
            initNear(mainParams, mainVars);
            initGame(mainParams, mainVars);
        })
        .on(Events.gameOver, function (newState) {
            mainParams.state = newState;
            mainParams.action = ACTION_NONE;
            update_field(mainParams, mainVars);
        })
        .on(Events.points, function(points){
            statsController.setPoints(points.me, points.opponent);
        })
        .on(Events.bonusLetters, function(bonusLetters){
            statsController.setBonusLetters(bonusLetters);
        })
        .on(Events.usedWords, function(words){
            statsController.setWords(words.me, words.opponent);
            mainVars.list_words = {list1: words.startWord, list2:words.me, list3:words.opponent};
        })
        .on(Events.nullSession, function(){
            console.log("Your session timed out");
            socket.disconnect();
        });



    function printState(state) {
        $('#state').text(state);
    }
}

function isNewWord(mainVars)
{
    var word_is = mainVars.new_word;
    var flag = 1;

    if(word_is !== mainVars.list_words.list1)
    {
        for(var i = 0; i < mainVars.list_words.list2.length; i++)
        {
            if(word_is === mainVars.list_words.list2[i])
            {
                flag = 0;
            }
        }
        for(var i = 0; i < mainVars.list_words.list3.length; i++)
        {
            if(word_is === mainVars.list_words.list3[i])
            {
                flag = 0;
            }
        }
    }
    else
    {
        flag = 0;
    }

    return flag;
}