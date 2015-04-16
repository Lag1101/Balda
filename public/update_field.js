function update_field()
{
    var state_field = state.field;
    var state_player = (state.turn == "true") ? ACTIVE_PLAYER : PASSIVE_PLAYER;

    for (var i = 0; i < 7; i++)
    {
        for (var j = 0; j < 7 - Math.abs(3 - i); j++)
        {
            hex_objects[i][j].find('.fieldForLetter').text(state_field[i][j].letter);
            hex_objects[i][j].find('.fieldForPoints').text(state_field[i][j].points);

            //hex_objects[i][j].find('.fieldForLetter').text(hex_objects[i][j].attr("id"));

            if(state_player == ACTIVE_PLAYER)
            {
                switch (state_field[i][j].statement)
                {
                    case ACTIVE_EMPTY:
                        hex_objects[i][j].removeClass().addClass("hex_main").addClass("hex_active_empty");
                        break;
                    case ACTIVE_LETTER:
                        hex_objects[i][j].removeClass().addClass("hex_main").addClass("hex_active_letter");
                        break;
                    case PASSIVE_EMPTY:
                        hex_objects[i][j].removeClass().addClass("hex_main").addClass("hex_passive_empty");
                        break;
                    case PASSIVE_LETTER:
                        hex_objects[i][j].removeClass().addClass("hex_main").addClass("hex_passive_letter");
                        break;
                    case NEW_LETTER_ACTIVE:
                        hex_objects[i][j].removeClass().addClass("hex_main").addClass("hex_active_letter").addClass("hex_new_letter");
                        break;
                    case NEW_LETTER_PASSIVE:
                        hex_objects[i][j].removeClass().addClass("hex_main").addClass("hex_passive_letter").addClass("hex_new_letter");
                        break;
                    case CHANGED_LETTER:
                        hex_objects[i][j].removeClass().addClass("hex_main").addClass("hex_picked");
                        break;
                    default:
                        break;
                }
                if(ready_to_send == SEND_READY)
                {
                    sending_hex.removeClass().addClass("hex_main").addClass("hex_send");
                }
                else if(ready_to_send == SEND_NOT_READY)
                {
                    sending_hex.removeClass().addClass("hex_main").addClass("hex_not_send");
                }
            }
            else
            {
                hex_objects[i][j].removeClass().addClass("hex_main").addClass("hex_opponent_turn");
            }
        }
    }
}
