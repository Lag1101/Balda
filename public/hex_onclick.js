function clicked_action(i,j) {

    if (action == ACTION_GET_PLACE)
    {
        if(state.field[i][j].statement == ACTIVE_EMPTY) {

            state.field[i][j].statement = NEW_LETTER_ACTIVE;

            $('body').keypress(function(event){
                state.field[i][j].letter = String.fromCharCode(event.which);
                $(this).off("keypress");

                changeField(1);
                action = ACTION_LETTERS;
                update_field();
            });
            update_field();
        }

    }
    else if(action == ACTION_LETTERS)
    {
        if(state.field[i][j].statement == ACTIVE_LETTER) {

            state.field[i][j].statement = CHANGED_LETTER;
            new_word = new_word + state.field[i][j].letter;
            changeField(2);

            for(var k=0; k<near_list[i][j].length; k++)
            {
                var neaghbor = near_list[i][j][k];
                if(state.field[neaghbor.x][neaghbor.y].statement  == PASSIVE_LETTER)
                {
                    state.field[neaghbor.x][neaghbor.y].statement = ACTIVE_LETTER;
                }
                else if(state.field[neaghbor.x][neaghbor.y].statement  == NEW_LETTER_PASSIVE)
                {
                    state.field[neaghbor.x][neaghbor.y].statement = NEW_LETTER_ACTIVE;
                }
            }
            update_field();
        }
        if(state.field[i][j].statement == NEW_LETTER_ACTIVE) {

            state.field[i][j].statement = CHANGED_LETTER;
            new_word = new_word + state.field[i][j].letter;
            ready_to_send = SEND_READY;
            changeField(2);

            for(var k=0; k<near_list[i][j].length; k++)
            {
                var neaghbor = near_list[i][j][k];
                if(state.field[neaghbor.x][neaghbor.y].statement  == PASSIVE_LETTER)
                {
                    state.field[neaghbor.x][neaghbor.y].statement = ACTIVE_LETTER;
                }
                else if(state.field[neaghbor.x][neaghbor.y].statement  == NEW_LETTER_PASSIVE)
                {
                    state.field[neaghbor.x][neaghbor.y].statement = NEW_LETTER_ACTIVE;
                }
            }
            update_field();
        }
    }
};

function clicked_action_sending()
{
    socket.emit(Events.checkWord,new_word);
}

function changeField(parameter) {

    switch (parameter)
    {
        case 1:
            for (var i = 0; i < field_size; i++)
            {
                for (var j = 0; j < field_size - Math.abs(Math.floor(field_size/2) - i); j++)
                {
                    if(state.field[i][j].statement == ACTIVE_EMPTY)
                    {
                        state.field[i][j].statement = PASSIVE_EMPTY;
                    }
                    else if(state.field[i][j].statement == PASSIVE_LETTER)
                    {
                        state.field[i][j].statement = ACTIVE_LETTER;
                    }
                }
            }
            break;
        case 2:
            for (var i = 0; i < field_size; i++)
            {
                for (var j = 0; j < field_size - Math.abs(Math.floor(field_size/2) - i); j++)
                {
                    if(state.field[i][j].statement == ACTIVE_LETTER)
                    {
                        state.field[i][j].statement = PASSIVE_LETTER;
                    }
                    else if(state.field[i][j].statement == NEW_LETTER_ACTIVE)
                    {
                        state.field[i][j].statement = NEW_LETTER_PASSIVE;
                    }
                }
            }
            break;

    }

}


