function clicked_action(i,j) {

    if (action == ACTION_GET_PLACE)
    {
        if(field[i][j].statement == ACTIVE_EMPTY) {

            field[i][j].statement = PASSIVE_LETTER;
            changeField(1);

            $('body').keypress(function(event){
                field[i][j].letter = String.fromCharCode(event.which);
                $(this).off("keypress");
                action = ACTION_LETTERS;
                field[i][j].statement = NEW_LETTER;
                update_field();
            });
            update_field();
        }
    }
};

function changeField(parameter) {

    switch (parameter)
    {
        case 1:
            for (var i = 0; i < 7; i++)
            {
                for (var j = 0; j < 7 - Math.abs(3 - i); j++)
                {
                    if(field[i][j].statement == PASSIVE_LETTER)
                    {
                        field[i][j].statement == ACTIVE_LETTER;
                    }
                }
            }
            break;

    }

}


