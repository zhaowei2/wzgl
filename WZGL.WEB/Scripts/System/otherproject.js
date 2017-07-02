//    <!-- 点击显示搜索-->
var ThistrContent;
var pagesize = 20;
var url = '';
$(function () {
    //1.初始化类型
    initCombox("otherprojecttypeid", "", "select");
    //2.初始化列表
    initPagination();
    //3.弹出层初始化
    //打开窗口
    $('.btn_newly').on('click', function (event) {
        event.preventDefault();
        initCombox("type","","");
        $("#txt_otherprojectname").val("");
        $("#remark").val("");
        $('.cd-popup').addClass('is-visible');
        parent.globalShade();
       
        url = "../../Controllers/Systems/OtherprojectController.ashx?action=Add";
    });
    //关闭窗口
    $('.cd-popup-close').on('click', function (event) {
        parent.deleteGlobalShade();
        $(".cd-popup").removeClass('is-visible');
    });

    $('.btn_return').on('click', function (event) {
        $(".cd-popup").removeClass('is-visible');
        parent.deleteGlobalShade();
    });

    $('.btn_save').on('click', function (event) {
        if ($("#txt_otherprojectname").val() == "") {
            alert("请输入其他项目名称");
            return;
        }
        if ($("#type").val() == "全部") {
            alert("请选择项目类型");
            return;
        }
        $.ajax({
            type: "POST",
            data: { otherprojectid: $("#otherprojectid").val(), otherprojectname: $("#txt_otherprojectname").val(), otherprojecttypeid: $("#type").val(), projectdescription: $("#remark").val() },
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
    var url = "../../Controllers/Systems/OtherprojectController.ashx?action=getCount";
    $.ajax({
        type: "POST",
        url: url,
        dataType: 'json',
        data: {
            "otherprojectname": $("#otherprojectname").val(),
            "otherprojecttypeid": $("#otherprojecttypeid").val(),
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
                            url: "../../Controllers/Systems/OtherprojectController.ashx?action=getList",
                            type: "post",
                            data: {
                                "page": index,
                                "rows": pagesize, //每页显示页数
                                "otherprojectname": $("#otherprojectname").val(),
                                "otherprojecttypeid": $("#otherprojecttypeid").val(),
                            },
                            success: function (data) {
                                $('#coalmines tbody').empty();
                                var row = "";
                                for (var i = 0; i < data.length; i++) {
                                    row += '  <tr class="listDataTr">'
                                          + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                          + ' <a href="javaScript:void(0)" title="' + data[i].otherprojectname + '" >' + data[i].otherprojectname + '</a>'
                                          + ' </td>'
                                          + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                          + ' <a href="javaScript:void(0)" title=' + data[i].itemname + '>' + data[i].itemname + '</a>'
                                          + ' </td>'
                                          + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                          + ' <a href="javaScript:void(0)" title=' + data[i].projectdescription + '>' + data[i].projectdescription + '</a>'
                                          + ' </td>'
                                          + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                          + ' <a href="javaScript:void(0)" onclick="edit(\'' + data[i].otherprojectid + '\',\'' + data[i].otherprojecttypeid + '\',\'' + data[i].otherprojectname + '\',\'' + data[i].projectdescription + '\')">编辑</a>'
                                          + ' <a href="javaScript:void(0)" onclick="Del(\'' + data[i].otherprojectid + '\')">删除</a>'
                                          + ' </td>'
                                          + ' </tr>';
                                }
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



function initCombox(id, otherprojecttypeid,caozuo) {
    var dictname = "其它项目类型";
    $.ajax({
        type: "POST",
        url: "../../Controllers/Systems/Singleproject.ashx?action=getType&dictname="+encodeURI(dictname),
        success: function (msg) {
            $("#" + id).empty();
            if (caozuo=='select') {
                var row = "<option value='全部' class='select-cmd'>全部</option>";
            }
            for (var i = 0; i < msg.length; i++) {
                if (msg[i].itemid == otherprojecttypeid) {
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


function edit(otherprojectid, otherprojecttypeid, otherprojectname, projectdescription) {
    event.preventDefault();
    initCombox("type", otherprojecttypeid,"");
    $("#otherprojectid").val(otherprojectid);
    $("#txt_otherprojectname").val(otherprojectname);
    $("#remark").val(projectdescription);
    $('.cd-popup').addClass('is-visible');
    url = "../../Controllers/Systems/OtherprojectController.ashx?action=Edit";
}

function Del(otherprojectid) {

    if (confirm("确认要删除该工程吗?")) {
        $.ajax({
            type: "POST",
            url: "../../Controllers/Systems/OtherprojectController.ashx?action=Del&otherprojectid=" + otherprojectid,
            success: function (msg) {
                msg = eval('(' + msg + ')');
                if (msg.IsSuccess == true) {
                    initPagination();
                }
            }
        })
    }
}

function Select() {
    initPagination();
}

function Reset() {
    $("#txt_otherprojectname").val("");
    $("#otherprojecttypeid").val("全部");
}


$('#searchBtn').on("click", function (searchContent) {
    if ($('#searchContent').css("display") == "none") {
        $('#searchContent').slideDown();
    } else {
        $('#searchContent').slideUp();
    }
});


