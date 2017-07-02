

$(function () {
    initGrid();

});
function search() {
    initGrid();
}
function reset() {
    $("#txt_Coalfacecode").val('');
}
function initGrid() {

    var html = '';
    //获取总页数
    var ss = "";
    $.ajax({
        type: "POST",
        url: "../../Controllers/Systems/Coalface.ashx?action=getPageList&type=getCount",
        dataType: 'json',
        data: {
            "Coalfacecode": $("#txt_Coalfacecode").val()
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
                            url: "../../Controllers/Systems/Coalface.ashx?action=getPageList",
                            type: "post",
                            data: {
                                "page": pageindex,
                                "rows": 20,
                                "Coalfacecode": $("#txt_Coalfacecode").val()
                            },
                            success: function (data) {
                                $('#gridTable tbody').empty();

                                var row = "";
                                $.each(data.rows, function (key, val) {
                                    //alert(val.TASK_ID);
                                    row += '  <tr class="listDataTr">'

                                              + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                              + ' <a href="javaScript:void(0)"title="' + val.Coalfacecode + '" >' + val.Coalfacecode + '</a>'
                                              + ' </td>'
                                              + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                              + ' <a href="javaScript:void(0)" title=' + val.groupcode + '>' + val.groupcode + '</a>'
                                              + ' </td>'
                                              + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                              + ' <a href="javaScript:void(0)" title=' + val.Mininglength + '>' + val.Mininglength + '</a>'
                                              + ' </td>'
                                              + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                              + ' <a href="javaScript:void(0)" title=' + val.Coalthick + '>' + val.Coalthick + '</a>'
                                              + ' </td>'
                                              + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                              + ' <a href="javaScript:void(0)" title=' + val.Mininghigh + '>' + val.Mininghigh + '</a>'
                                              + ' </td>'
                                               + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                              + ' <a href="javaScript:void(0)" title=' + val.Dip + '>' + val.Dip + '</a>'
                                              + ' </td>'
                                               + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                              + ' <a href="javaScript:void(0)" title=' + val.Pc + '>' + val.Pc + '</a>'
                                              + ' </td>'
                                               + ' </td>'
                                               + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                              + ' <a href="javaScript:void(0)" title=' + val.Monthlyoutputlevel + '>' + val.Monthlyoutputlevel + '</a>'
                                              + ' </td>'
                                              + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                              + ' <a href="javaScript:void(0)" onclick="edit(\'' + val.Coalfaceid + '\',\'' + val.Coalfacecode + '\',\'' + val.Groupcode + '\',\'' + val.Groupid + '\',\'' + val.Mininglength + '\',\'' + val.Coalthick + '\',\'' + val.Mininghigh + '\',\'' + val.Dip + '\',\'' + val.Pc + '\',\'' + val.Monthlyoutputlevel + '\')">编辑</a>'
                                               + ' &nbsp;<a href="javaScript:void(0)" onclick="del(\'' + val.Coalfaceid + '\')">删除</a>'
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
function add() {
    parent.globalShade();

    $("#Coalfaceid").val('');
    $("#Coalfacecode").val('');
    $('#Groupcode').val('');
    

    $("#Mininglength").val('');
    $("#Coalthick").val('');
    $("#Mininghigh").val('');
    $("#Dip").val('');
    $("#Pc").val('');
    $("#Monthlyoutputlevel").val('');

    $('.aui_icon').html("添加工作面");
    $("#Groupid").empty();
    //下拉框赋值
    $.ajax({
        url: "../../Controllers/Systems/Coalface.ashx?action=getfzList",
        type: "post",
        success: function (data) {
            if (data.length != 0) {
                var fz = '';
                for (var i = 0; i < data.length; i++) {
                    fz += '<option value="' + data[i].groupid + '">' + data[i].groupcode + '</option>';
                }
                $('#Groupid').append(fz);
            }
        }
    })
    $('#maskIframe').addClass('is-visible');
    url = "../../Controllers/Systems/Coalface.ashx?action=add";
    // Tunnellingprojectid, Tunnellingprojectname, Section, Coalrocktype, Coalrocktype, Supportform, Tunneltype, Tunnelnature, Designamount
}

function edit(Coalfaceid, Coalfacecode, Groupcode, Groupid, Mininglength, Coalthick, Mininghigh, Dip, Pc, Monthlyoutputlevel) {
    parent.globalShade();
    //Tunnellingprojectid, Tunnellingprojectname, Section, Coalrocktype, Coalrocktype, Supportform, Tunneltype, Tunnelnature, Designamount);
    $("#Coalfaceid").val(Coalfaceid);
    $("#Coalfacecode").val(Coalfacecode);
    $('#Groupcode').val(Groupcode);
   

    $("#Mininglength").val(Mininglength);
    $("#Coalthick").val(Coalthick);
    $("#Mininghigh").val(Mininghigh);
    $("#Dip").val(Dip);
    $("#Pc").val(Pc);
    $("#Monthlyoutputlevel").val(Monthlyoutputlevel);

    $('.aui_icon').html("编辑工作面");

    $("#Groupid").empty();
    //下拉框赋值
    $.ajax({
        url: "../../Controllers/Systems/Coalface.ashx?action=getfzList",
        type: "post",
        success: function (data) {
            if (data.length != 0) {
                var fz = '';
                for (var i = 0; i < data.length; i++) {
                    if (data[i].groupid == Groupid) {
                        fz += '<option value="' + data[i].groupid + '" selected>' + data[i].groupcode + '</option>';
                    }
                    else {
                        fz += '<option value="' + data[i].groupid + '">' + data[i].groupcode + '</option>';
                    }
                }
                $('#Groupid').append(fz);
            }
        }
    })

    $('#maskIframe').addClass('is-visible');


    url = "../../Controllers/Systems/Coalface.ashx?action=edit";

}

//保存数据
function save() {

    if ($("#Coalfacecode").val() == "") {
        alert("请输入工作面编号！");
        return;
    }

    $.ajax({
        url: url,
        type: "post",
        data: {
            "Coalfaceid": $("#Coalfaceid").val(),
            "Coalfacecode": $("#Coalfacecode").val(),
            "Groupid": $("#Groupid").val(),
            "Mininglength": $("#Mininglength").val(),
            "Coalthick": $("#Coalthick").val(),
            "Mininghigh": $("#Mininghigh").val(),
            "Dip": $("#Dip").val(),
            "Pc": $("#Pc").val(),
            "Monthlyoutputlevel": $("#Monthlyoutputlevel").val()
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

//保存分组数据
function savefz() {

    if ($("#groupcode").val() == "") {
        alert("请输入分组名称");
        return;
    }
    else {
        $.ajax({
            url: "../../Controllers/Systems/Coalface.ashx?action=savefz",
            type: "post",
            data: { groupcode: $("#groupcode").val() },
            success: function (data) {
                if (data.IsSuccess == "true") {
                    //刷新table
                    alert(data.Message);
                    init();
                } else {
                    alert(data.Message);
                }
            }
        })
    }
}

//初始化数据
function init() {
    $.ajax({
        url: "../../Controllers/Systems/Coalface.ashx?action=getfzList",
        type: "post",
        success: function (data) {
            $('#tab_fz tbody').empty();
            var row = "";
            if (data.length != 0) {
                for (var i = 0; i < data.length; i++) {
                    row += '  <tr class="listDataTr">'
                                + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                + ' <a href="javaScript:void(0)"title="' + data[i].groupcode + '" >' + data[i].groupcode + '</a>'
                                + ' </td>'
                                + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                + ' &nbsp;<a href="javaScript:void(0)" onclick="delfz(\'' + data[i].groupid + '\')">删除</a>'
                                + ' </td>'
                                + ' </tr>';
                }
            }
            $("#tab_fz tbody").append(row);

        }
    })
}

function delfz(groupid) {
    $.ajax({
        url: "../../Controllers/Systems/Coalface.ashx?action=delfz",
        type: "post",
        data: {
            "groupid": groupid,
        },
        success: function (data) {
            // data = eval('(' + data + ')');
            if (data.IsSuccess == "true") {
                //刷新table
                init();
            } else {
                alert(data.Message);
            }
        }
    });
}


//删除数据
function del(Coalfaceid) {
    $.ajax({
        url: "../../Controllers/Systems/Coalface.ashx?action=del",
        type: "post",
        data: {
            "Coalfaceid": Coalfaceid,
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