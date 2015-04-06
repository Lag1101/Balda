function initialize(letters) {

    var player = ACTIVE_PLAYER;
    var needed_action = ACTION_GET_PLACE;

    var i, j;
    var _area = $('#area');
    var hex_obj;
    var struct = {ret_act: needed_action, ret_word: ''};

    _area.append('<div id = "send" class="hex_main hex_not_send"><span></span></div>');
    $('#send').offset({top: 50, left: 20 });
    $('#send').click(function () {
        struct = what_it_mean($(this), struct );
        needed_action = struct.ret_act;
    });

    for (i = 0; i < 7; i++) {
        for (j = 0; j < 7 - Math.abs(3 - i); j++) {
            var k = i>3?i-3+j:j;
            _area.append('<div id = "hex' + i + k + '" class="hex_main hex_act_nw"><span>');
        }
        for (j = 0; j < 7 - Math.abs(3 - i); j++) {
            var k = i>3?i-3+j:j;
            hex_obj = $('#hex' + i + k);
            hex_obj.offset({top: 50 + 85 * i, left: 50 + 105 * j + 52.5 * Math.abs(3 - i)});
            hex_obj.click(function () {
                struct = what_it_mean($(this), struct );
                needed_action = struct.ret_act;
            });
        }
    }

    for (j = 1; j < 6; j++) {
        hex_obj = $('#hex3' + j);
        hex_obj.find('span').text(letters[j - 1]);
        hex_obj.removeClass("hex_act_nw").addClass("hex_dis_ww");
    }

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

