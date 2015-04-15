function creating()
{
    var _area = $('#area');
    var send_hex = $('<div></div>')
        .attr('id', "send")
        .addClass('hex_main')
        .addClass('hex_not_send');

    var send_span = $('<span></span>').addClass('shadowSpan');

    send_hex.append(send_span);
    _area.append(send_hex);
    //send_hex.offset({top: 50, left: 20 });
    send_hex.css('top', 50);
    send_hex.css('left', 20);

    for (var i = 0; i < field_size; i++) {

        hex_objects.push([]);

        for (var j = 0; j < field_size - Math.abs(field_size/2 - i); j++) {

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

            //hex_obj.offset({top: 50 + 85 * i, left: 50 + 105 * j + 52.5 * Math.abs(3 - i)});
            hex_obj.css('top', 50 + 85 * i);
            hex_obj.css('left', 50 + 105 * j + 52.5 * Math.abs(3 - i));

            hex_obj.click(function () {
                clicked_action.bind(undefined,i,j);
            });

            hex_objects[i].push(hex_obj);
        }
    }
}

function initNear()
{
    for (var i = 0; i < field_size; i++) {
        near_list.push([]);
        for (var j = 0; j < field_size - Math.abs(field_size / 2 - i); j++) {
            near_list[i].push(getNeaghbors(i,j));
        }
    }
}

function getNeaghbors(x,y) {

    var neighborsIndexies = [];
    if( y < field.length/2 ) {
        neighborsIndexies = [
            [0,-1],
            [0,1],
            [-1, -1],
            [-1, 0],
            [1, 0],
            [1, 1]
        ];
    } else if(y > field.length/2) {
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
        var X = neighborsIndexies[i][1];
        var Y = neighborsIndexies[i][0];
        var neighbor = field[y+Y][x+X];

        if(neighbor)
            neighbors.push({x:X,y:Y});
    }
    return neighbors;
}

function initGame()
{
    for (var i = 0; i < field_size; i++) {
        for (var j = 0; j < field_size - Math.abs(field_size/2 - i); j++) {
            if(field[i][j].letter !== '')
            {
                field[i][j].statement = PASSIVE_LETTER;
                for(var k=0; k<near_list[i][j].length(); k++)
                {
                    var neaghbor = near_list[i][j][k];
                    if(field[neaghbor.x][neaghbor.y].statement  !== PASSIVE_LETTER)
                    {
                        field[neaghbor.x][neaghbor.y].statement = ACTIVE_EMPTY;
                    }
                }
            }
        }
    }
    update_field();
}


