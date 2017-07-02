//    <!-- 点击显示搜索-->
var ThistrContent;
var pagesize = 20;
var url = '';
var id = '';
var xh = 0;
var did = '';
var count = 0;
$(function () {
    //1.初始化字典
    initPagination();


    //打开窗口
    $('#new1').on('click', function (event) {
        //            event.preventDefault();
        $("#sp_name").text("字典名称：");
        $("#txt_name").val("");
        $('.cd-popup').addClass('is-visible');
        parent.globalShade();
        url = "../../Controllers/Systems/Dict.ashx?action=Add";
    });
    //关闭窗口
    $('#quer').on('click', function (event) {
        console.log("2");
        if ($("#txt_name").val()=="") {
            alert("请输入名称");
            return;
        }
        var params = { dictid: $("#txt_dictid").val(), itemid: $("#txt_itemid").val(), name: $("#txt_name").val(), sort: $("#txt_XH").val() };
        $.ajax({
            type: "POST",
            url: url,
            data: params,
            success: function (msg) {
                msg = eval('(' + msg + ')');
                if (msg.IsSuccess == true) {
                    initPagination();
                }
            }
        })
    });

    $('.cd-popup-close').on('click', function (event) {
        console.log("2");

        $(".cd-popup").removeClass('is-visible');
        parent.deleteGlobalShade();

    });
    $('#fanh').on('click', function (event) {
        console.log("2");
        var xh = count + 1;
        $("#txt_XH").val(xh);
        $("#sp_name").text("字典项名称：");
        $(".cd-popup").removeClass('is-visible');
        parent.deleteGlobalShade();
    });

    $("#new").on('click', function (event) {
        if (did=="") {
            alert("请选择字典数据");
            return;
        }
        else {
            console.log("2");
            $("#sp_name").text("字典项名称：");
            $("#txt_name").val("");
            var xh = count + 1;
            $("#txt_XH").val(xh);
            $("#txt_dictid").val(did);
            $(".cd-popup").addClass('is-visible');
            parent.globalShade();
            url = "../../Controllers/Systems/Dict.ashx?action=AddItem";
        }
    });
})


function initPagination() {
    var url = "../../Controllers/Systems/Dict.ashx?action=getCount";
    $.ajax({
        type: "POST",
        url: url,
        dataType: 'json',
        data: {
            "dictname": $("#txt_name").val(),
        },
        success: function (msg) {
            if (msg != '') {
                if (msg.IsSuccess == "true") {
                    if (msg.Count == 0) {
                        $('#stockCoals1 tbody').empty();
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
                            url: "../../Controllers/Systems/Dict.ashx?action=getList",
                            type: "post",
                            data: {
                                "page": index,
                                "rows": pagesize, //每页显示页数
                                "dictname": $("#txt_name1").val(),
                            },
                            success: function (data) {
                                $('#stockCoals1 tbody').empty();
                                var row = "";
                                $.each(data.rows, function (key, val) {
                                    row += '  <tr class="listDataTr" onclick="showItem(\'' + val.dictid + '\')">'
                                           + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                           + ' <a href="javaScript:void(0)" title="' + val.dictname + '" >' + val.dictname + '</a>'
                                           + ' </td>'
                                           + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                           + ' <a href="javaScript:void(0)" onclick="edit(\'' + val.dictid + '\',\'' + val.dictname + '\')">编辑</a>'
                                           + ' <a href="javaScript:void(0)" onclick="Del(\'' + val.dictid + '\')">删除</a>'
                                           + ' </td>'
                                           + ' </tr>';
                                });
                                $("#stockCoals1 tbody").append(row);
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

function initPagination1(dictid) {
    var url = "../../Controllers/Systems/Dict.ashx?action=getItemCount&dictid=" + dictid;
    $.ajax({
        type: "POST",
        url: url,
        dataType: 'json',
        success: function (msg) {
            if (msg != '') {
                count = msg.Count;
                if (msg.IsSuccess == "true") {
                    if (msg.Count == 0) {
                        $('#stockCoals tbody').empty();
                    }
                    var initPagination = function () {
                        // 创建分页
                        $("#Pagination1").pagination(parseInt(msg.Count), {
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
                            url: "../../Controllers/Systems/Dict.ashx?action=getItemList&dictid=" + dictid + "&sort=sort&order=ASC",
                            type: "post",
                            data: {
                                "page": index,
                                "rows": pagesize, //每页显示页数
                                "dictname": $("#dictname").val(),
                            },
                            success: function (data) {
                                $('#stockCoals tbody').empty();
                                var row = "";
                                $.each(data, function (key, val) {
                                    row += '  <tr class="listDataTr" onclick="showItem1(\'' + val.itemid + '\',\'' + val.sort + '\')">'
                                           + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                           + ' <a href="javaScript:void(0)" title="' + val.sort + '" >' + val.sort + '</a>'
                                           + ' </td>'
                                           + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                           + ' <a href="javaScript:void(0)" title="' + val.itemname + '" >' + val.itemname + '</a>'
                                           + ' </td>'
                                           + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                           + ' <a href="javaScript:void(0)" onclick="edititem(\'' + val.itemid + '\',\'' + val.dictid + '\',\'' + val.itemname + '\',\'' + val.sort + '\')">编辑</a>'
                                           + ' <a href="javaScript:void(0)" onclick="DelItem(\'' + val.itemid + '\')">删除</a>'
                                           + ' </td>'
                                           + ' </tr>';
                                });
                                $("#stockCoals tbody").append(row);
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



function edit(dictid, dictname) {
    $("#sp_name").text("字典名称：");
    $("#txt_name").val(dictname);
    $("#txt_dictid").val(dictid);
    $('.cd-popup').addClass('is-visible');
    parent.globalShade();
    url = "../../Controllers/Systems/Dict.ashx?action=Edit";
}

function edititem(itemid,dictid,itemname, sort)
{

    $("#txt_dictid").val(dictid);
    $("#txt_itemid").val(itemid);
    $("#txt_name").val(itemname);
    $("#txt_XH").val(sort);
    $("#sp_name").text("字典项名称：");
    $('.cd-popup').addClass('is-visible');
        parent.globalShade();
    url = "../../Controllers/Systems/Dict.ashx?action=EditItem";
}

function Del(dictid) {
    if (confirm("确认要删除该字典吗?")) {
        $.ajax({
            type: "POST",
            url: "../../Controllers/Systems/Dict.ashx?action=Del&dictid=" + dictid,
            success: function (msg) {
                msg = eval('(' + msg + ')');
                if (msg.IsSuccess == true) {
                    initPagination();
                }
            }
        })
    }
}

function DelItem(itemid)
{
    if (confirm("确认要删除该字典项吗?")) {
        $.ajax({
            type: "POST",
            url: "../../Controllers/Systems/Dict.ashx?action=DelItem&itemid=" + itemid,
            success: function (msg) {
                msg = eval('(' + msg + ')');
                if (msg.IsSuccess == true) {
                    initPagination1(did);
                }
            }
        })
    }
}

function showItem(dictid) {
    did = dictid;
    initPagination1(dictid);
}

function showItem1(itemid, sort) {
    id = itemid;
    xh = sort;
}

function Select() {
    initPagination();
}

function Reset() {
    $("#txt_name").val("");
}



function up() {
    if (id == '') {
        alert('请选择您要移动的行');
        return
    }
    xh = parseInt(xh);
    if (xh == 1) {
        alert("已经是第一行了");
        return
    }

    $.ajax({
        type: "POST",
        url: "../../Controllers/Systems/Dict.ashx?action=up&dictid="+did+"&itemid=" + id + "&sort=" + xh,
        success: function (msg) {
            msg = eval('(' + msg + ')');
            if (msg.IsSuccess == true) {
                xh = xh - 1;
                initPagination1(did);
            }
        }
    })
}
function down() {

    if (id == '') {
        alert('请选择您要移动的行');
        return;
    }
    if (xh == count) {
        alert('该记录已经是最后一行了');
        return;
    }
    xh = parseInt(xh);
    $.ajax({
        type: "POST",
        url: "../../Controllers/Systems/Dict.ashx?action=down&dictid=" + did + "&itemid=" + id + "&sort=" + xh,
        success: function (msg) {
            msg = eval('(' + msg + ')');
            if (msg.IsSuccess == true) {
                xh = xh + 1;
                initPagination1(did);
            }
        }
    })
}
