function clicked_action(i,j, mainParams, mainVars) {

    if (mainParams.action == ACTION_GET_PLACE)
    {
        if(mainParams.state.field[i][j].statement == ACTIVE_EMPTY) {

            mainParams.state.field[i][j].statement = NEW_LETTER_ACTIVE;
            mainParams.action = ACTION_WAITING;
            mainVars.status.text("Хороший выбор. Введите букву с клавиатуры.");

            $('body').keypress(function(event){
                if(event.which >= 1072 && event.which <= 1103) {
                    mainParams.state.field[i][j].letter = String.fromCharCode(event.which);
                    $(this).off("keypress");
                    mainVars.status.text("Отлично, приступайте ко вводу слова, последовательно выбирая буквы.");
                    changeField(1, mainParams, mainVars);
                    mainParams.action = ACTION_LETTERS;
                    update_field(mainParams, mainVars);
                }
                else
                {
                    mainVars.status.text("Проверьте язык клавиатуры!");
                }
            });
            update_field(mainParams, mainVars);
        }

    }
    else if(mainParams.action == ACTION_LETTERS)
    {
        if(mainParams.state.field[i][j].statement == ACTIVE_LETTER) {

            mainParams.state.field[i][j].statement = PICKED_LETTER;
            mainVars.new_word = mainVars.new_word + mainParams.state.field[i][j].letter;
            changeField(2, mainParams, mainVars);

            for(var k=0; k<mainVars.near_list[i][j].length; k++)
            {
                var neaghbor = mainVars.near_list[i][j][k];
                if(mainParams.state.field[neaghbor.x][neaghbor.y].statement  == PASSIVE_LETTER)
                {
                    mainParams.state.field[neaghbor.x][neaghbor.y].statement = ACTIVE_LETTER;
                }
                else if(mainParams.state.field[neaghbor.x][neaghbor.y].statement  == NEW_LETTER_PASSIVE)
                {
                    mainParams.state.field[neaghbor.x][neaghbor.y].statement = NEW_LETTER_ACTIVE;
                }
            }
            update_field(mainParams, mainVars);
        }
        if(mainParams.state.field[i][j].statement == NEW_LETTER_ACTIVE) {

            mainParams.state.field[i][j].statement = PICKED_LETTER;
            mainVars.new_word = mainVars.new_word + mainParams.state.field[i][j].letter;
            mainParams.ready_to_send = SEND_READY;
            changeField(2, mainParams, mainVars);


            for(var k=0; k<mainVars.near_list[i][j].length; k++)
            {
                var neaghbor = mainVars.near_list[i][j][k];
                if(mainParams.state.field[neaghbor.x][neaghbor.y].statement  == PASSIVE_LETTER)
                {
                    mainParams.state.field[neaghbor.x][neaghbor.y].statement = ACTIVE_LETTER;
                }
                else if(mainParams.state.field[neaghbor.x][neaghbor.y].statement  == NEW_LETTER_PASSIVE)
                {
                    mainParams.state.field[neaghbor.x][neaghbor.y].statement = NEW_LETTER_ACTIVE;
                }
            }
            update_field(mainParams, mainVars);
        }
        mainVars.status.text("Нажав на гекс слева вверху, вы можете отослать слово: " + mainVars.new_word);
    }
    else if(mainParams.action == ACTION_FREEZ_LETTER)
    {
        if(mainParams.state.field[i][j].statement == PASSIVE_LETTER) {
            mainParams.state.field[i][j].statement = FROZEN_LETTER;
            mainParams.action = ACTION_NONE;

            update_field(mainParams, mainVars);
        }
    }
    else if(mainParams.action == ACTION_FREEZ_EMPTY)
    {
        if(mainParams.state.field[i][j].statement == PASSIVE_EMPTY) {
            mainParams.state.field[i][j].statement = FROZEN_EMPTY;
            mainParams.action = ACTION_NONE;

            update_field(mainParams, mainVars);
        }
    }
    else if(mainParams.action == ACTION_SWAPPING)
    {

        if(mainVars.buffer === null) {
            mainParams.state.field[i][j].statement = SWAPED;
            mainVars.buffer = {buf_hex:mainParams.state.field[i][j], buf_i:i, buf_j:j};
        }
        else if(!(i === mainVars.buffer.buf_i && j === mainVars.buffer.buf_j) )
        {
            mainParams.state.field[i][j].statement = SWAPED;
            mainParams.state.field[mainVars.buffer.buf_i][mainVars.buffer.buf_j] = mainParams.state.field[i][j];
            mainParams.state.field[i][j] = mainVars.buffer.buf_hex;
            mainVars.buffer = null;

            mainParams.action = ACTION_NONE;
        }
        update_field(mainParams, mainVars);
    }
    else if(mainParams.action == ACTION_CHANGED)
    {
        if(mainVars.buffer === null) {
            mainVars.buffer = "выбрано";
            if (mainParams.state.field[i][j].statement == PASSIVE_LETTER) {
                mainParams.state.field[i][j].statement = CHANGED;
                update_field(mainParams, mainVars);
                $('body').keypress(function (event) {
                    if (event.which >= 1072 && event.which <= 1103) {
                        mainParams.state.field[i][j].letter = String.fromCharCode(event.which);
                        $(this).off("keypress");
                        mainVars.status.text("Буква изменена! Нажмите отправку для передачи хода.");
                        mainParams.action = ACTION_NONE;
                        mainVars.buffer = null;
                        update_field(mainParams, mainVars);
                    }
                    else {
                        mainVars.status.text("Проверьте язык клавиатуры!");
                    }

                });
            }
        }
    }
};

function changeField(parameter, mainParams, mainVars) {

    switch (parameter)
    {
        case 1:
            for (var i = 0; i < mainVars.field_size; i++)
            {
                for (var j = 0; j < mainVars.field_size - Math.abs(Math.floor(mainVars.field_size/2) - i); j++)
                {
                    if(mainParams.state.field[i][j].statement == ACTIVE_EMPTY)
                    {
                        mainParams.state.field[i][j].statement = PASSIVE_EMPTY;
                    }
                    else if(mainParams.state.field[i][j].statement == PASSIVE_LETTER)
                    {
                        mainParams.state.field[i][j].statement = ACTIVE_LETTER;
                    }
                }
            }
            break;
        case 2:
            for (var i = 0; i < mainVars.field_size; i++)
            {
                for (var j = 0; j < mainVars.field_size - Math.abs(Math.floor(mainVars.field_size/2) - i); j++)
                {
                    if(mainParams.state.field[i][j].statement == ACTIVE_LETTER)
                    {
                        mainParams.state.field[i][j].statement = PASSIVE_LETTER;
                    }
                    else if(mainParams.state.field[i][j].statement == NEW_LETTER_ACTIVE)
                    {
                        mainParams.state.field[i][j].statement = NEW_LETTER_PASSIVE;
                    }
                }
            }
            break;

    }

}


