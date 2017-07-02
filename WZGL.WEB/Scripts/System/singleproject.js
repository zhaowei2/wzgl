//    <!-- 点击显示搜索-->
var ThistrContent;
var pagesize = 20;
var url = '';
$(function () {
    //1.初始化类型
    initCombox("singleprojecttypeid","");
    //2.初始化列表
    initPagination();
    //3.弹出层初始化
    //打开窗口
    $('.btn_newly').on('click', function (event) {
        event.preventDefault();
        initCombox("type");
        $("#txt_singleprojectname").val("");
        $("#remark").val("");
        $('.cd-popup').addClass('is-visible');
        url = "../../Controllers/Systems/Singleproject.ashx?action=Add";
    });
    //关闭窗口
    $('.cd-popup-close').on('click', function (event) {

        $(".cd-popup").removeClass('is-visible');
    });

    $('.btn_return').on('click', function (event) {
        $(".cd-popup").removeClass('is-visible');
        parent.deleteGlobalShade();
    });

    $('.btn_save').on('click', function (event) {
        if ($("#txt_singleprojectname").val() == "") {
            alert("请输入单项工程名称");
            return;
        }
        if ($("#type").val() == "全部") {
            alert("请选择工程类型");
            return;
        }
        $.ajax({
            type: "POST",
            data: { singleprojectid:$("#singleprojectid").val(),singleprojectname: $("#txt_singleprojectname").val(), singleprojecttypeid: $("#type").val(), remark: $("#remark").val() },
            url: url,
            success: function (msg) {
                msg = eval('(' + msg + ')')
                if (msg.IsSuccess == true) {
                    $(".cd-popup").removeClass('is-visible');
                    initPagination();
                }
            }
        }
       )
    });
})


function initPagination() {
    var url = "../../Controllers/Systems/Singleproject.ashx?action=getCount";
    $.ajax({
        type: "POST",
        url: url,
        dataType: 'json',
        data: {
            "singleprojecttypeid": $("#singleprojecttypeid").val(),
            "singleprojectname": $("#singleprojectname").val(),
        },
        success: function (msg) {
            if (msg != '') {
                if (msg.IsSuccess == "true") {
                    if (msg.Count == 0) {
                        $('#coalmines tbody').empty();
                    }
                    var initPagination = function () {
                        // 创建分页
                        $("#Pagination").pagination(parseInt(msg.Count), {
                            num_edge_entries: 1, //边缘页数
                            num_display_entries: 10, //主体页数
                            callback: pageselectCallback,
                            items_per_page: pagesize, //每页显示页数
                            prev_text: "前一页",
                            next_text: "后一页"
                        });
                    };
                    function pageselectCallback(page_index, jq) {

                        var index = page_index + 1;
                        $.ajax(
                        {
                            url: "../../Controllers/Systems/Singleproject.ashx?action=getList",
                            type: "post",
                            data: {
                                "page": index,
                                "rows": pagesize, //每页显示页数
                                "singleprojecttypeid": $("#singleprojecttypeid").val(),
                                "singleprojectname": $("#singleprojectname").val(),
                            },
                            success: function (data) {
                                $('#coalmines tbody').empty();
                                var row = "";
                                $.each(data.rows, function (key, val) {
                                    row += '  <tr class="listDataTr">'
                                           + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                           + ' <a href="javaScript:void(0)" title="' + val.singleprojectname + '" >' + val.singleprojectname + '</a>'
                                           + ' </td>'
                                           + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                           + ' <a href="javaScript:void(0)" title=' + val.itemname + '>' + val.itemname + '</a>'
                                           + ' </td>'
                                           + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                           + ' <a href="javaScript:void(0)" title=' + val.remark + '>' + val.remark + '</a>'
                                           + ' </td>'
                                           + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                           + ' <a href="javaScript:void(0)" onclick="edit(\'' + val.singleprojectid + '\',\'' + val.singleprojecttypeid + '\',\'' + val.singleprojectname + '\',\'' + val.remark + '\')">编辑</a>'
                                           + ' <a href="javaScript:void(0)" onclick="Del(\'' + val.singleprojectid + '\')">删除</a>'
                                           + ' </td>'
                                           + ' </tr>';
                                });
                                $("#coalmines tbody").append(row);
                            }
                        });
                        return false;
                    }
                    //ajax加载
                    $("#hiddenresult").load("load.html", null, initPagination);
                }
            }
        }
    });
}



function initCombox(id, singleprojecttypeid) {
    var dictname = '单项工程类型';
    $.ajax({
        type: "POST",
        url: "../../Controllers/Systems/Singleproject.ashx?action=getType&dictname="+encodeURI(dictname),
        success: function (msg) {
            $("#" + id).empty();

            var row = "<option value='全部' class='select-cmd'>全部</option>";
            for (var i = 0; i < msg.length; i++) {
                if (msg[i].itemid==singleprojecttypeid) {
                    row += "<option value='" + msg[i].itemid + "' class='select-cmd' selected>" + msg[i].itemname + "</option>";
                }
                else {
                    row += "<option value='" + msg[i].itemid + "' class='select-cmd'>" + msg[i].itemname + "</option>";
                }
              
            }
            $("#" + id).append(row);
        }
    })
}


function edit(singleprojectid, singleprojecttypeid, singleprojectname, remark) {
    event.preventDefault();
    initCombox("type", singleprojecttypeid);
    $("#singleprojectid").val(singleprojectid);
    $("#txt_singleprojectname").val(singleprojectname);
    $("#remark").val(remark);
    $('.cd-popup').addClass('is-visible');
    url = "../../Controllers/Systems/Singleproject.ashx?action=Edit";
}

function Del(singleprojectid) {

    if (confirm("确认要删除该工程吗?")) {
        $.ajax({
            type: "POST",
            url: "../../Controllers/Systems/Singleproject.ashx?action=Del&singleprojectid=" + singleprojectid,
            success: function (msg) {
                msg = eval('(' + msg + ')');
                if (msg.IsSuccess == true) {
                    initPagination();
                }
            }
        })
    }
}

function Select()
{
    initPagination();
}

function Reset()
{
    $("#singleprojectname").val("");
    $("#singleprojecttypeid").val("全部");
}




$('#searchBtn').on("click", function (searchContent) {
    if ($('#searchContent').css("display") == "none") {
        $('#searchContent').slideDown();
    } else {
        $('#searchContent').slideUp();
    }
});


