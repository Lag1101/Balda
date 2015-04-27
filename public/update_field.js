function update_field(mainParams, mainVars)
{
    var state_field = mainParams.state.field;
    var state_player = (mainParams.state.turn == "true") ? ACTIVE_PLAYER : PASSIVE_PLAYER;

    for (var i = 0; i < 7; i++)
    {
        for (var j = 0; j < 7 - Math.abs(3 - i); j++)
        {
            mainVars.hex_objects[i][j].find('.fieldForLetter').text(state_field[i][j].letter);

            //hex_objects[i][j].find('.fieldForLetter').text(hex_objects[i][j].attr("id"));
            if(state_player == ACTIVE_PLAYER)
            {
                switch (state_field[i][j].statement)
                {
                    case ACTIVE_EMPTY:
                        mainVars.hex_objects[i][j].removeClass().addClass("hex_main").addClass("hex_active_empty");
                        mainVars.hex_objects[i][j].find('.fieldForPoints').text(state_field[i][j].points);
                        break;
                    case ACTIVE_LETTER:
                        mainVars.hex_objects[i][j].removeClass().addClass("hex_main").addClass("hex_active_letter");
                        mainVars.hex_objects[i][j].find('.fieldForPoints').text("");
                        break;
                    case PASSIVE_EMPTY:
                        mainVars.hex_objects[i][j].removeClass().addClass("hex_main").addClass("hex_passive_empty");
                        mainVars.hex_objects[i][j].find('.fieldForPoints').text(state_field[i][j].points);
                        break;
                    case PASSIVE_LETTER:
                        mainVars.hex_objects[i][j].removeClass().addClass("hex_main").addClass("hex_passive_letter");
                        mainVars.hex_objects[i][j].find('.fieldForPoints').text("");
                        break;
                    case NEW_LETTER_ACTIVE:
                        mainVars.hex_objects[i][j].removeClass().addClass("hex_main").addClass("hex_active_letter").addClass("hex_new_letter");
                        mainVars.hex_objects[i][j].find('.fieldForPoints').text(state_field[i][j].points);
                        break;
                    case NEW_LETTER_PASSIVE:
                        mainVars.hex_objects[i][j].removeClass().addClass("hex_main").addClass("hex_passive_letter").addClass("hex_new_letter");
                        mainVars.hex_objects[i][j].find('.fieldForPoints').text(state_field[i][j].points);
                        break;
                    case PICKED_LETTER:
                        mainVars.hex_objects[i][j].removeClass().addClass("hex_main").addClass("hex_picked");
                        break;
                    case FROZEN_LETTER:
                        mainVars.hex_objects[i][j].removeClass().addClass("hex_main").addClass("hex_frozen");
                        mainVars.hex_objects[i][j].find('.fieldForPoints').text("");
                        break;
                    case FROZEN_EMPTY:
                        mainVars.hex_objects[i][j].removeClass().addClass("hex_main").addClass("hex_frozen");
                        mainVars.hex_objects[i][j].find('.fieldForPoints').text(state_field[i][j].points);
                        break;
                    case SWAPED:
                        mainVars.hex_objects[i][j].removeClass().addClass("hex_main").addClass("hex_swaped");
                        mainVars.hex_objects[i][j].find('.fieldForPoints').text("");
                        break;
                    default:
                        break;
                }
                if(mainParams.ready_to_send == SEND_READY)
                {
                    mainVars.sending_hex.removeClass().addClass("hex_main").addClass("hex_send");
                }
                else if(mainParams.ready_to_send == SEND_NOT_READY)
                {
                    mainVars.sending_hex.removeClass().addClass("hex_main").addClass("hex_not_send");
                }
            }
            else
            {
                if(state_field[i][j].letter != '') {
                    mainVars.hex_objects[i][j].removeClass().addClass("hex_main").addClass("hex_opponent_turn");
                    mainVars.hex_objects[i][j].find('.fieldForPoints').text("");
                }
                else
                {
                    mainVars.hex_objects[i][j].removeClass().addClass("hex_main").addClass("hex_opponent_turn_empty");
                    mainVars.hex_objects[i][j].find('.fieldForPoints').text(state_field[i][j].points);
                }

            }
        }
    }
}
