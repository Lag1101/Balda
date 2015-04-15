function update_field(state)
{
    var state_field = state.field;
    var state_player = state.turn === "true" ? ACTIVE_PLAYER : PASSIVE_PLAYER;

    for (var i = 0; i < 7; i++)
    {
        for (var j = 0; j < 7 - Math.abs(3 - i); j++)
        {
            hex_objects[i][j].find('.fieldForLetter').text(state_field[counter].letter);
            hex_objects[i][j].find('.fieldForPoints').text(state_field[counter].points);

            if(state_player === ACTIVE_PLAYER)
            {
                switch (state_field[i][j].statement)
                {
                    case ACTIVE_EMPTY:
                        hex_objects[i][j].removeClass();
                        hex_objects[i][j].addClass(".hex_main");
                        hex_objects[i][j].addClass(".hex_active_empty");
                        break;
                    case ACTIVE_LETTER:
                        hex_objects[i][j].removeClass();
                        hex_objects[i][j].addClass(".hex_main");
                        hex_objects[i][j].addClass(".hex_active_letter");
                        break;
                    case PASSIVE_EMPTY:
                        hex_objects[i][j].removeClass();
                        hex_objects[i][j].addClass(".hex_main");
                        hex_objects[i][j].addClass(".hex_passive_empty");
                        break;
                    case PASSIVE_LETTER:
                        hex_objects[i][j].removeClass();
                        hex_objects[i][j].addClass(".hex_main");
                        hex_objects[i][j].addClass(".hex_passive_letter");
                        break;
                    case NEW_LETTER:
                        hex_objects[i][j].removeClass();
                        hex_objects[i][j].addClass(".hex_main");
                        hex_objects[i][j].addClass(".hex_new_letter");
                        break;
                    default:
                        break;
                }
            }
            else
            {
                hex_objects[i][j].removeClass();
                hex_objects[i][j].addClass(".hex_main");
                hex_objects[i][j].addClass(".hex_opponent_turn");
            }
        }
    }
}
