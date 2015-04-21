function clicked_action(i,j, mainParams, mainVars) {

    if (mainParams.action == ACTION_GET_PLACE)
    {
        if(mainParams.state.field[i][j].statement == ACTIVE_EMPTY) {

            mainParams.state.field[i][j].statement = NEW_LETTER_ACTIVE;

            $('body').keypress(function(event){
                mainParams.state.field[i][j].letter = String.fromCharCode(event.which);
                $(this).off("keypress");

                changeField(1, mainParams, mainVars);
                mainParams.action = ACTION_LETTERS;
                update_field(mainParams, mainVars);
            });
            update_field(mainParams, mainVars);
        }

    }
    else if(mainParams.action == ACTION_LETTERS)
    {
        if(mainParams.state.field[i][j].statement == ACTIVE_LETTER) {

            mainParams.state.field[i][j].statement = CHANGED_LETTER;
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

            mainParams.state.field[i][j].statement = CHANGED_LETTER;
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
    }
    else if(mainParams.action == ACTION_USE_SPELL)
    {

        if(mainParams.state.field[i][j].statement == PASSIVE_LETTER) {
            mainParams.state.field[i][j].statement = FROZEN;
            mainParams.action = ACTION_NONE;

            update_field(mainParams, mainVars);
        }
        else
        {
            alert("Ну букву выбери ёпта, чо как малой");
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


