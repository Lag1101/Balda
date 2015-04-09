function get_next_letter(hex_obj)
{
    var i,j;
    for (i = 0; i < 7; i++)
    {
        for (j = 0; j < 7 - Math.abs(3 - i); j++)
        {
            var k = i>3?i-3+j:j;

            if(hex_obj.attr("id") == $('#hex'+i+k).attr("id"))
            {

                var i1 = i - 1, i2 = i + 1, k1 = k - 1, k2 = k + 1; // угроза

                var topleft = $('#hex' + i1 + k1);
                var topright = $('#hex' + i1 + k);
                var left = $('#hex' + i + k1);
                var right = $('#hex' + i + k2);
                var botleft = $('#hex' + i2 + k);
                var botright = $('#hex' + i2 + k2);

                if (topleft.is(".hex_dis_ww")) topleft.removeClass("hex_dis_ww").addClass("hex_act_ww");
                if (topright.is(".hex_dis_ww")) topright.removeClass("hex_dis_ww").addClass("hex_act_ww");
                if (right.is(".hex_dis_ww")) right.removeClass("hex_dis_ww").addClass("hex_act_ww");
                if (left.is(".hex_dis_ww")) left.removeClass("hex_dis_ww").addClass("hex_act_ww");
                if (botleft.is(".hex_dis_ww")) botleft.removeClass("hex_dis_ww").addClass("hex_act_ww");
                if (botright.is(".hex_dis_ww")) botright.removeClass("hex_dis_ww").addClass("hex_act_ww");

                return;
            }
        }
    }
}

function get_near_hexes(field)
{
    var i, j, counter = 0;

    for (i = 0; i < 7; i++)
    {
        for (j = 0; j < 7 - Math.abs(3 - i); j++)
        {
            var k = i>3?i-3+j:j;

            if(! field[counter].letter == '')
            {

                var i1 = i - 1, i2 = i + 1, k1 = k - 1, k2 = k + 1; // угроза

                var topleft = $('#hex' + i1 + k1);
                var topright = $('#hex' + i1 + k);
                var left = $('#hex' + i + k1);
                var right = $('#hex' + i + k2);
                var botleft = $('#hex' + i2 + k);
                var botright = $('#hex' + i2 + k2);

                if (topleft.is(".hex_dis_nw")) topleft.removeClass("hex_dis_nw").addClass("hex_act_nw");
                if (topright.is(".hex_dis_nw")) topright.removeClass("hex_dis_nw").addClass("hex_act_nw");
                if (right.is(".hex_dis_nw")) right.removeClass("hex_dis_nw").addClass("hex_act_nw");
                if (left.is(".hex_dis_nw")) left.removeClass("hex_dis_nw").addClass("hex_act_nw");
                if (botleft.is(".hex_dis_nw")) botleft.removeClass("hex_dis_nw").addClass("hex_act_nw");
                if (botright.is(".hex_dis_nw")) botright.removeClass("hex_dis_nw").addClass("hex_act_nw");

            }

            counter++;
        }
    }

    counter = 0;
}
