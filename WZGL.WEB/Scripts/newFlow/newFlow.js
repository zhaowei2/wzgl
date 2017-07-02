

$(function () {
    loadData();
});


function loadData()
{
    $.ajax({
        type: "POST",
        url: '../../Controllers/Flow/Flow.ashx?action=getTypeAndFlowList',
        dataType: 'json',
        success: function (msg) {
            var html='';
            var msg = eval(msg);
            for(var i=0;i<msg.length;i++)
            {
                html += ' <div class="menu_list lf"> <div><h4><span>' + msg[i].type.TYPE_NAME + '</span></h4></div><ul>';
               
                for (var j = 0; j < msg[i].list.length; j++) {
                    html += '<li><a href="' + msg[i].list[j].URL + '?DEFINE_CODE=' + msg[i].list[j].DEFINE_CODE + '&TYPE_CODE=' + msg[i].list[j].TYPE_CODE + '">' + msg[i].list[j].DEFINE_NAME + '</a></li>';
                }
               html+='  </ul></div>';  
            }
           // alert(html);
            $('#administrativeTabContent').html(html);
        },
        error: function (msg) {
            $.messager.alert('提示', msg.Message, "error");
        }
    });
}


