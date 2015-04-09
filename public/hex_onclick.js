function clicked_action(hex_obj, struct, sendCallback) {

    if (struct.ret_act == ACTION_GET_PLACE)
    {
        if(hex_obj.is(".hex_act_nw")) {
            $('.hex_act_nw').removeClass("hex_act_nw").addClass("hex_dis_nw");
            $('.hex_dis_ww').removeClass("hex_dis_ww").addClass("hex_act_ww");

            $('body').keypress(function(event){
                hex_obj.find('.fieldForLetter').text(String.fromCharCode(event.which));
                $(this).off("keypress");
            });
            
            hex_obj.removeClass("hex_dis_nw").addClass("hex_act_ww").addClass("hex_new");
            struct.ret_act = ACTION_LETTERS;
        }
    }
    else if(struct.ret_act == ACTION_LETTERS)
    {
        if(hex_obj.is(".hex_new") && hex_obj.is(".hex_act_ww"))
        {
            hex_obj.removeClass("hex_new");
            $('.hex_not_send').removeClass("hex_not_send").addClass("hex_send");
            struct = changeField(struct, hex_obj);
        }
        if(hex_obj.is(".hex_act_ww")) {
            struct.ret_word = struct.ret_word + hex_obj.find('.fieldForLetter').text();
            $('.hex_act_ww').removeClass("hex_act_ww").addClass("hex_dis_ww");
            hex_obj.removeClass("hex_dis_ww").addClass("hex_picked");
            get_next_letter(hex_obj);
        }
        if(hex_obj.is(".hex_send"))
        {
            sendCallback(struct.ret_word, struct.ret_field);
            // обнулить прошлые изменения
            $('.hex_picked').removeClass("hex_picked").addClass("hex_dis_ww");
            $('.hex_act_ww').removeClass("hex_act_ww").addClass("hex_dis_ww");
            $('.hex_send').removeClass("hex_send").addClass("hex_not_send");
        }
    }
    return struct;

};

function changeField(struct, hex_obj) {

    var i, j, counter = 0;
    for (i = 0; i < 7; i++) {
        for (j = 0; j < 7 - Math.abs(3 - i); j++) {
            var k = i > 3 ? i - 3 + j : j;

            if (hex_obj.attr("id") == $('#hex' + i + k).attr("id")) {
                struct.ret_field[counter].letter = hex_obj.find('.fieldForLetter').text();
            }
            counter++;
        }
    }
    counter = 0;
    return struct;
}


