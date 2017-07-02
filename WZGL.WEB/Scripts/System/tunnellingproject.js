

$(function () {
    initGrid();

});
function search()
{
    initGrid();
}
function reset()
{
    $("#txt_Tunnellingprojectname").val('');
}
function initGrid() {

    var html = '';
    //获取总页数
    var ss = "";
    $.ajax({
        type: "POST",
        url: "../../Controllers/Systems/Tunnellingproject.ashx?action=getPageList&type=getCount",
        dataType: 'json',
        data: {
            "Tunnellingprojectname": $("#txt_Tunnellingprojectname").val()
        },
        success: function (msg) {
            if (msg != '') {
                if (msg.IsSuccess == "true") {
                    // 创建分页
                    $("#tunnlPagination").pagination(parseInt(msg.Count), {
                        num_edge_entries: 1, //边缘页数
                        num_display_entries: 10, //主体页数
                        callback: pageselectCallback,
                        items_per_page: 20, //每页显示1项
                        prev_text: "上一页",
                        next_text: "下一页"
                    });
                    //  };

                    function pageselectCallback(page_index, jq) {
                        //  alert("调用");
                        var pageindex = page_index + 1;
                        $.ajax(
                        {
                            url: "../../Controllers/Systems/Tunnellingproject.ashx?action=getPageList",
                            type: "post",
                            data: {
                                "page": pageindex,
                                "rows": 20,
                                "Tunnellingprojectname": $("#txt_Tunnellingprojectname").val()
                            },
                            success: function (data) {
                                $('#gridTable tbody').empty();

                                var row = "";
                                $.each(data.rows, function (key, val) {
                                    //alert(val.TASK_ID);
                                    row += '  <tr class="listDataTr">'
                                          + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                              + ' <input type="checkbox" name="check"   onclick="checkThis(this)" id="' + val.Tunnellingprojectid + '">'
                                              + ' </td>'
                                              + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                              + ' <a href="javaScript:void(0)"title="' + val.Tunnellingprojectname + '" >' + val.Tunnellingprojectname + '</a>'
                                              + ' </td>'
                                              + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                              + ' <a href="javaScript:void(0)" title=' + val.Section + '>' + val.Section + '</a>'
                                              + ' </td>'
                                              + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                              + ' <a href="javaScript:void(0)" title=' + val.Coalrocktype + '>' + val.Coalrocktype + '</a>'
                                              + ' </td>'
                                              + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                              + ' <a href="javaScript:void(0)" title=' + val.Supportform + '>' + val.Supportform + '</a>'
                                              + ' </td>'
                                              + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                              + ' <a href="javaScript:void(0)" title=' + val.Tunneltype + '>' + val.Tunneltype + '</a>'
                                              + ' </td>'
                                               + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                              + ' <a href="javaScript:void(0)" title=' + val.Tunnelnature + '>' + val.Tunnelnature + '</a>'
                                              + ' </td>'
                                               + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                              + ' <a href="javaScript:void(0)" title=' + val.Designamount + '>' + val.Designamount + '</a>'
                                              + ' </td>'
                                              + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                              + ' <a href="javaScript:void(0)" onclick="edit(\'' + val.Tunnellingprojectid + '\',\'' + val.Tunnellingprojectname + '\',\'' + val.Section + '\',\'' + val.Coalrocktype + '\',\'' + val.Supportform + '\',\'' + val.Tunneltype + '\',\'' + val.Tunnelnature + '\',\'' + val.Designamount + '\')">编辑</a>'
                                               + ' &nbsp;<a href="javaScript:void(0)" onclick="del(\'' + val.Tunnellingprojectid + '\')">删除</a>'
                                               + ' </td>'
                                              + ' </tr>';
                                });
                                $("#gridTable tbody").append(row);
                            }
                        })
                        return false;
                    }
                }
            }
        }
    });

}

var url = '';
//新增
function add()
{
    parent.globalShade();
    $("#Tunnellingprojectid").val('');
    $("#Tunnellingprojectname").val('');
    $('#Section').val('');
    $("#Coalrocktype").val('');
    $("#Supportform").val('');
    $("#Tunneltype").val('');
    $("#Tunnelnature").val('');
    $("#Designamount").val('');

    $('.aui_icon').html("添加采掘工程");
    $('.cd-popup').addClass('is-visible');
    url = "../../Controllers/Systems/Tunnellingproject.ashx?action=add";
   // Tunnellingprojectid, Tunnellingprojectname, Section, Coalrocktype, Coalrocktype, Supportform, Tunneltype, Tunnelnature, Designamount
}

function edit(Tunnellingprojectid, Tunnellingprojectname, Section, Coalrocktype, Supportform, Tunneltype, Tunnelnature, Designamount) {
    parent.globalShade();
    //Tunnellingprojectid, Tunnellingprojectname, Section, Coalrocktype, Coalrocktype, Supportform, Tunneltype, Tunnelnature, Designamount);
    $("#Tunnellingprojectid").val(Tunnellingprojectid);
    $("#Tunnellingprojectname").val(Tunnellingprojectname);
    $('#Section').val(Section);
    $("#Coalrocktype").val(Coalrocktype);
    
    $("#Supportform").val(Supportform);
    $("#Tunneltype").val(Tunneltype);
    $("#Tunnelnature").val(Tunnelnature);
    $("#Designamount").val(Designamount);

    $('.aui_icon').html("编辑采掘工程");
    $('.cd-popup').addClass('is-visible');
    url = "../../Controllers/Systems/Tunnellingproject.ashx?action=edit";
   
}

//保存数据
function save() {

    if ($("#Tunnellingprojectname").val() == "") {
        alert("请输入工程名称！");
        return;
    }
    
    $.ajax({
        url: url,
        type: "post",
        data: {
            "Tunnellingprojectid": $("#Tunnellingprojectid").val(),
            "Tunnellingprojectname": $("#Tunnellingprojectname").val(),
            "Section": $("#Section").val(),
            "Coalrocktype": $("#Coalrocktype").val(),
            "Supportform": $("#Supportform").val(),
            "Tunneltype": $("#Tunneltype").val(),
            "Tunnelnature": $("#Tunnelnature").val(),
            "Designamount": $("#Designamount").val()
        },
        success: function (data) {
            //data = eval('(' + data + ')');
            if (data.IsSuccess == "true") {
                //刷新table
                $(".cd-popup").removeClass('is-visible');
                parent.deleteGlobalShade();
                initGrid();
            } else {
                alert(data.Message);
            }
        }
    });
}

//删除数据
function del(Tunnellingprojectid)
{
    $.ajax({
        url :"../../Controllers/Systems/Tunnellingproject.ashx?action=del",
        type: "post",
        data: {
            "Tunnellingprojectid": Tunnellingprojectid,
        },
        success: function (data) {
           // data = eval('(' + data + ')');
            if (data.IsSuccess == "true") {
                //刷新table
                initGrid();
            } else {
                alert(data.Message);
            }
        }
    });
}