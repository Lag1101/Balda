function what_it_mean(hex_obj, struct) {

    if (struct.ret_act == ACTION_GET_PLACE)
    {
        if(hex_obj.is(".hex_act_nw")) {
            $('.hex_act_nw').removeClass("hex_act_nw").addClass("hex_dis_nw");
            $('.hex_dis_ww').removeClass("hex_dis_ww").addClass("hex_act_ww");

            $('body').keypress(function(event){
                hex_obj.find('span').text(String.fromCharCode(event.which));
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
            //активировать отправку
        }
        if(hex_obj.is(".hex_act_ww")) {
            struct.ret_word = struct.ret_word + hex_obj.find('span').text();
            $('.hex_act_ww').removeClass("hex_act_ww").addClass("hex_dis_ww");
            hex_obj.removeClass("hex_dis_ww").addClass("hex_picked");
            console.log(hex_obj.attr("class"));
            get_next_letter(hex_obj);
        }
        if(hex_obj.is(".hex_send"))
        {
            alert(struct.ret_word);

            //socket.emit('checkWord',struct.ret_word);
            // отсылка
            struct.ret_word = '';
            hex_obj.removeClass("hex_send").addClass("hex_not_send");
            $('.hex_picked').removeClass("hex_picked").addClass("hex_dis_ww");
            $('.hex_act_ww').removeClass("hex_act_ww").addClass("hex_dis_ww");
            $('.hex_dis_nw').removeClass("hex_dis_nw").addClass("hex_act_nw");
            struct.ret_act = ACTION_GET_PLACE;
        }
    }
    return struct;

};

