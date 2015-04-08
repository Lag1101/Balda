function creating()
{
    var _area = $('#area');
    var hex_obj;

    _area.append('<div id = "send" class="hex_main hex_not_send"><span></span></div>');
    $('#send').offset({top: 50, left: 20 });

    for (i = 0; i < 7; i++) {
        for (j = 0; j < 7 - Math.abs(3 - i); j++) {
            var k = i > 3 ? i - 3 + j : j;
            _area.append('<div id = "hex' + i + k + '" class="hex_main hex_dis_nw"><span>');
            hex_obj = $('#hex' + i + k);
            hex_obj.offset({top: 50 + 85 * i, left: 50 + 105 * j + 52.5 * Math.abs(3 - i)});
        }
    }
}

function initialize(state, sendCallback) {

    var player, needed_action;

    alert(state.turn);

    if(state.turn === "true") {
        player = ACTIVE_PLAYER;
        needed_action = ACTION_GET_PLACE;
    }
    else {
        player = PASSIVE_PLAYER;
        needed_action = ACTION_NONE;
    }

    var i, j;
    var counter = 0;
    var hex_obj;
    var struct = {ret_act: needed_action, ret_word: '', ret_field: state.field};

    $('#send').click(function () {
        struct = clicked_action($(this), struct, sendCallback);
        needed_action = struct.ret_act;
    });

    for (i = 0; i < 7; i++) {
        for (j = 0; j < 7 - Math.abs(3 - i); j++) {
            var k = i>3?i-3+j:j;
            hex_obj = $('#hex' + i + k);

            hex_obj.click(function () {
                struct = clicked_action($(this), struct, sendCallback);
                needed_action = struct.ret_act;
            });
            hex_obj.find('span').text(state.field[counter]);
            if(! state.field[counter] == '')
            {
                hex_obj.removeClass("hex_dis_nw").addClass("hex_dis_ww");
            }
            counter++;
        }

    }
    counter = 0;

    if(player === ACTIVE_PLAYER)
    {
        get_near_hexes(state.field);
    }

    /*
    for (j = 1; j < 6; j++) {
        hex_obj = $('#hex3' + j);
        hex_obj.find('span').text(letters[j - 1]);
        hex_obj.removeClass("hex_act_nw").addClass("hex_dis_ww");
    }
    */


    /* //вывод ID
    for (i = 0; i < 7; i++) {
        for (j = 0; j < 7 - Math.abs(3 - i); j++) {
            var k = i>3?i-3+j:j;
            hex_obj = $('#hex' + i + k);
            hex_obj.find('span').text(hex_obj.attr("id"));
        }
    }
    */

}

