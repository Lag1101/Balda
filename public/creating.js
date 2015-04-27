function creating(mainParams, mainVars, own_socket) {
    var _area = $('#area');
    var send_hex = $('<div></div>')
        .attr('id', "send")
        .addClass('hex_main')
        .addClass('hex_not_send');
    var send_span = $('<span></span>').addClass('shadowSpan');
    send_hex.append(send_span);
    _area.append(send_hex);
    send_hex.css('top', 80);
    send_hex.css('left', 10);
    send_hex.click(function question() {
        if (mainParams.action == ACTION_LETTERS && mainParams.ready_to_send == SEND_READY) {
            own_socket.emit(Events.checkWord, mainVars.new_word);
        }
        else if (mainParams.action == ACTION_NONE && mainParams.ready_to_send == SEND_READY) {

            own_socket.emit(Events.turn, mainVars.new_word, mainParams.state.field);

            mainParams.ready_to_send = SEND_NOT_READY;
            mainVars.new_word = '';
            update_field(mainParams, mainVars);
        }
    });
    mainVars.sending_hex = send_hex;

    var status_panel = $('<div></div>')
        .attr('id', "status_panel")
        .addClass('style_status');

    _area.append(status_panel);
    status_panel.css('top', 10);
    status_panel.css('left', 250);
    mainVars.status = status_panel;

    for (var i = 0; i < mainVars.field_size; i++) {

        mainVars.hex_objects.push([]);

        for (var j = 0; j < mainVars.field_size - Math.abs(Math.floor(mainVars.field_size/2) - i); j++) {

            var hex_obj = $('<div></div>')
                .attr('id', "hex"+i+j);

            var span = $('<span></span>').addClass('shadowSpan');
            span.append(
                $('<p></p>')
                    .addClass('fieldForPoints')
                    .text("")
            );
            span.append(
                $('<p></p>')
                    .addClass('fieldForLetter')
                    .text("")
            );

            hex_obj.append(span);
            _area.append(hex_obj);
            hex_obj.css('top', 80 + 80 * i);
            hex_obj.css('left', 110 + 95 * j + 47.5 * Math.abs(3 - i));
            hex_obj.click(clicked_action.bind(undefined, i, j, mainParams, mainVars));

            mainVars.hex_objects[i].push(hex_obj);
        }
    }

    var my_timer_panel = $('<div></div>')
        .attr('id', "my_timer_panel")
        .addClass('style_timer');

    _area.append(my_timer_panel);
    my_timer_panel.css('top', 10);
    my_timer_panel.css('left', 10);
    my_timer_panel.text("Ваше время: ");

    mainVars.my_pannel = my_timer_panel;

    var op_timer_panel = $('<div></div>')
        .attr('id', "op_timer_panel")
        .addClass('style_timer');

    _area.append(op_timer_panel);
    op_timer_panel.css('top', 10);
    op_timer_panel.css('left', 700);
    op_timer_panel.text("Противник: ");

    mainVars.op_pannel = op_timer_panel;

    var IntervalID = setInterval(function timer_on(){
        if(mainVars.lost_time.my_time !== null)
        {
            if (mainParams.state.turn == 'true')
            {
                if(mainVars.lost_time.my_time >= SECOND) {
                    mainVars.lost_time.my_time = mainVars.lost_time.my_time - SECOND;
                }
                else {
                    if(mainVars.lost_time.op_time >= SECOND) own_socket.emit(Events.turn, mainVars.new_word, mainParams.state.field);
                    else own_socket.emit(Events.gameOver);
                }

                if(mainParams.state.roundNumber === 0) {
                    mainVars.lost_time.op_time = mainVars.lost_time.op_time - SECOND;
                }
            }
            else
            {
                if(mainVars.lost_time.op_time >= SECOND) mainVars.lost_time.op_time = mainVars.lost_time.op_time - SECOND;
            }

            var my_time = {minutes: Math.floor(mainVars.lost_time.my_time / TIME_TO_MINUTS / SECOND), seconds: Math.floor(mainVars.lost_time.my_time / SECOND) % TIME_TO_MINUTS};
            var op_time = {minutes: Math.floor(mainVars.lost_time.op_time / TIME_TO_MINUTS / SECOND), seconds: Math.floor(mainVars.lost_time.op_time / SECOND) % TIME_TO_MINUTS};

            if(mainVars.lost_time.my_time >= SECOND) {
                mainVars.my_pannel.text("Ваше время: " + my_time.minutes + ":" + (my_time.seconds >= 10 ? my_time.seconds : "0" + my_time.seconds));
            }
            else mainVars.my_pannel.text("Ваше время: 0:00");
            if(mainVars.lost_time.op_time >= SECOND) {
                mainVars.op_pannel.text("Противник: " + op_time.minutes + ":" + (op_time.seconds >= 10 ? op_time.seconds : "0" + op_time.seconds));
            }
            else mainVars.op_pannel.text("Противник: 0:00");
        }
    }, 1000);

}

function initNear(mainParams, mainVars)
{
    for (var i = 0; i < mainVars.field_size; i++) {
        mainVars.near_list.push([]);
        for (var j = 0; j < mainVars.field_size - Math.abs(Math.floor(mainVars.field_size/2) - i); j++) {
            mainVars.near_list[i].push(getNeaghbors(i,j, mainParams));
        }
    }
}

function getNeaghbors(x,y, mainParams) {

    var neighborsIndexies = [];
    if( x < Math.floor(mainParams.state.field.length/2) ) {
        neighborsIndexies = [
            [0,-1],
            [0,1],
            [-1, -1],
            [-1, 0],
            [1, 0],
            [1, 1]
        ];
    } else if(x > Math.floor(mainParams.state.field.length/2)) {
        neighborsIndexies = [
            [0,-1],
            [0,1],
            [1, -1],
            [1, 0],
            [-1, 0],
            [-1, 1]
        ];
    } else {
        neighborsIndexies = [
            [0,-1],
            [0,1],
            [1, -1],
            [1, 0],
            [-1, 0],
            [-1, -1]
        ];
    }

    var neighbors = [];
    for(var i = 0 ; i < neighborsIndexies.length; i++) {
        var X = neighborsIndexies[i][0];
        var Y = neighborsIndexies[i][1];

        if(mainParams.state.field[x+X] && mainParams.state.field[x+X][y+Y])
            neighbors.push({x:x+X, y:y+Y});
    }
    return neighbors;
}

function initGame(mainParams, mainVars)
{
    for (var i = 0; i < mainVars.field_size; i++) {
        for (var j = 0; j < mainVars.field_size - Math.abs(Math.floor(mainVars.field_size/2) - i); j++) {
            var _statement = mainParams.state.field[i][j].statement;
            if(mainParams.state.field[i][j].letter != '' && _statement != FROZEN_LETTER)
            {
                mainParams.state.field[i][j].statement = PASSIVE_LETTER;

                for(var k=0; k<mainVars.near_list[i][j].length; k++)
                {
                    var neaghbor = mainVars.near_list[i][j][k];
                    var _neaghbor_state = mainParams.state.field[neaghbor.x][neaghbor.y].statement;
                    if(_neaghbor_state  != PASSIVE_LETTER )
                    {
                        if (_neaghbor_state != FROZEN_LETTER && _neaghbor_state != FROZEN_EMPTY) mainParams.state.field[neaghbor.x][neaghbor.y].statement = ACTIVE_EMPTY;
                    }
                }
            }
        }
    }
    update_field(mainParams, mainVars);
}

function redraw_field(mainParams ,mainVars)
{
    for (var i = 0; i < mainVars.field_size; i++) {
        for (var j = 0; j < mainVars.field_size - Math.abs(Math.floor(mainVars.field_size/2) - i); j++) {
            var thisStatement = mainParams.state.field[i][j].statement;
            if(thisStatement == ACTIVE_LETTER || thisStatement == PICKED_LETTER || thisStatement == FROZEN_LETTER)
            {
                mainParams.state.field[i][j].statement = PASSIVE_LETTER;
            }
            else if (thisStatement == FROZEN_EMPTY)
            {
                mainParams.state.field[i][j].statement = PASSIVE_EMPTY;
            }
        }
    }
    update_field(mainParams, mainVars);
}


