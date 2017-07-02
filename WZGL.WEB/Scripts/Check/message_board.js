// 留言板
function tij() {

$("#tiy").slideToggle("slow");
}
    

$(".btn-primary").on("click",function(){
    $("#tiy").hide();
});


$(function() {
    var hxc_area = $(".textarea_frame");
    var hxcB = $(".count");
    var hxc_max = hxc_area.attr("maxlength");

    function zwpd(val) {//全角字符判断函数
        var hxc_len = 0;//声明变量并赋值
        var qjreg = /[^\x00-\xff]/ig;//声明全角正则表达式
        for (i = 0; i < val.length; i++) {//建立for循环，为了判断每个输入的字符
            if (val[i].match(qjreg) != null) {//如果输入的字符是全角字符（=null说明是半角）则字符数为2
                hxc_len += 1;
            } else {//否的话为1
                hxc_len += 1;
            };
        };
        return hxc_len;//弹出该值
    };

    function max_content(val, max) {//函数：弹出textarea内容在规定长度下的值
        var return_val = "";//声明并赋值
        var count = 0;
        var qjreg = /[^\x00-\xff]/ig;
        for (i = 0; i < val.length; i++) {//与上面类似不赘述
            if (val[i].match(qjreg) != null) {
                count += 1;
            } else {
                count += 1;
            };
            if (count > max) {//当数字大约最大字符数时，跳出该循环
                break;
            };
            return_val += val[i];//值自增
        };
        return return_val;//弹出值
    };

    hxc_area.bind("input propertychange", function() {//为textarea文本输入框绑定事件，input为实时监听（但不支持ie），propertychange为ie专属事件效果同于input
        var hxc_val = $(this).val();//获取textarea的值
        var b_count = zwpd(hxc_val);//获取函数zwpd的值
        if (b_count == 0) {//如果textarea没有内容，则输出为0
            hxcB.text(0);
        } else if (b_count <= hxc_max) {//如果textarea的字符数小于等于最大限制字符数，则正常输出值
            hxcB.text(b_count);
        } else {//如果textarea的字符数大于最大值，则最大限制字符数打印出，内容仅取textarea中最大字符数对应的内容
            hxcB.text(hxc_max);
            $(this).val(max_content(hxc_val, hxc_max));
        };
        if (b_count >= hxc_max-10) {//还差10个字符数达到最大限制字符数时，红色高亮提醒用户
            hxcB.css("color", "red");
        } else {//反之不提醒
            hxcB.css("color", "#000");
        };
    });
    hxc_area.trigger("input");//文档载入时触发textarea的input的事件，（0/200）正常显示；否则（/200）这样显示
});





