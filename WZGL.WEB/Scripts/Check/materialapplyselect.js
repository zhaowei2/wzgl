var isAdd = true;
var pagesize = 15;
$(function () {

    initPagination();
    getOrganization("treeOrganization1", 1);


    $.ajax({
        type: "POST",
        url: "../../Controllers/Warehouse/InoroutrecordController.ashx?action=getInPageList",
        dataType: 'json',
        success: function (msg) {
            if (msg != '') {
                msg = eval('(' + msg + ')');
                if (msg.IsSuccess == 'true') {
                    var limits;

                    msg = eval('(' + msg.Message + ')');
                    if (msg.length > 0) {
                        $.each(msg, function (index, data) {
                            limits += ' <option value="' + data.itemid + '" class="select-cmd">' + data.itemname + '</option>';

                        });
                        $('#sel2').append(limits);
                        medi = msg[0].itemid;
                        meditext = msg[0].itemname;
                        getSingleproject(msg[0].itemid);
                    }
                }

            }
        }
    });
});

function initPagination() {
    var url = "../../Controllers/Check/MaterialApplyController.ashx?action=getList";
    $.ajax({
        type: "POST",
        url: url,
        dataType: 'json',
        data: {
            "processnumber": $('#processnumber').val(),
            "organizationid": $("#selorganizationid").val(),
            "submitdate": $("#inp2").val(),
            "userid": parent.user.userid,
        },
        success: function (msg) {
            if (msg != '') {
                //if (msg.IsSuccess == "true") {
                if (msg.length == 0) {
                    $('#coalmines tbody').empty();
                }
                var initPagination = function () {
                    // 创建分页
                    $("#Pagination").pagination(parseInt(msg.length), {
                        num_edge_entries: 1, //边缘页数
                        num_display_entries: 10, //主体页数
                        callback: pageselectCallback,
                        items_per_page: pagesize, //每页显示页数
                        prev_text: "上一页",
                        next_text: "下一页"
                    });
                };
                function pageselectCallback(page_index, jq) {

                    var index = page_index + 1;
                    $.ajax(
                    {
                        url: "../../Controllers/Check/MaterialApplyController.ashx?action=getPageList",
                        type: "post",
                        data: {
                            "page": index,
                            "rows": pagesize, //每页显示页数
                            "processnumber": $('#processnumber').val(),
                            "organizationid": $("#selorganizationid").val(),
                            "submitdate": $("#inp2").val(),
                            "userid": parent.user.userid,
                        },
                        success: function (data) {
                            $('#coalmines tbody').empty();
                            var row = "";
                            var status = '';
                            $.each(data.rows, function (key, val) {

                                row += '  <tr class="listDataTr">'
                                       + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                       + ' <a href="javaScript:void(0)"title="' + val.name + '" >' + val.name + '</a>'
                                       + ' </td>'
                                       + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                       + ' <a href="javaScript:void(0)" title=' + val.organizationname + '>' + val.organizationname + '</a>'
                                       + ' </td>'
                                       + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                       + ' <a href="javaScript:void(0)" title=' + val.processnumber + '>' + val.processnumber + '</a>'
                                       + ' </td>'
                                       + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                       + ' <a href="javaScript:void(0)" title=' + val.submitdate + '>' + val.submitdate + '</a>'
                                       + ' </td>'
                                + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                + ' <a href="addmaterialapplication.html?state=update&materialapplicationid=' + val.materialapplicationid + '">编辑</a>&nbsp;&nbsp;'
                                           + ' <a href="#" onclick="del(\'' + val.materialapplicationid + '\',\'' + val.processnumber + '\')">删除</a>'
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
            else {
                $('#coalmines tbody').empty();
            }
            // }
        }
    });
}



//加载部门
function getOrganization(name, type) {
    $.ajax({
        type: "POST",
        url: "../../Controllers/Systems/OrganizationController.ashx?action=getList",
        dataType: 'json',
        success: function (msg) {
            if (msg != '') {
                $('#' + name).empty();
                var html = '';
                $.each(msg, function (index, org) {
                    html += ' <li><a data-label="' + org.organizationname + '" data-id="#"  onclick="getId(\'' + org.organizationid + '\',\'' + org.organizationname + '\')">' + org.organizationname + '</a>';
                    if (org.children != null) {
                        html += getTree(org.children, type);
                    }
                    html += '</li>';

                });
                html = '<li><a data-label="全部" href="#" onclick="getId(\'\',\'全部 \',' + type + ')">全部</a> <ul style="overflow-y: auto; height: 204px;">' + html + '  </ul> </li>';
                $('#' + name).html(html);
                initTree();
                $(".tree").treemenu({ delay: 300 }).openActive();
            }
        }
    });
}

//生成树
function getTree(orgs, type) {
    var html = ' <ul>';
    for (var i = 0; i < orgs.length; i++) {
        var org = orgs[i];
        html += ' <li><a data-label="' + org.organizationname + '" href="#" onclick="getId(\'' + org.organizationid + '\',\'' + org.organizationname + '\',' + type + ')">' + org.organizationname + '</a>';
        if (org.children != null) {
            html += getTree(org.children);
        }
        html += '</li>';
    }
    html += '</ul>';
    return html;
}

//获取下拉树的id
function getId(id, category) {
    $("#selorganizationid").val(id)
    $('#label-active1').text(category);
}

function add() {
    window.location = "addmaterialapplication.html?state=add";
}


function Select() {
    initPagination();
}

function Reset() {
    $("#label-active1").val("");
    $("#selorganizationid").val("");
    $("#applicantname").val("");
    $("#inp2").val("");
    $("#processnumber").val("");
}

function del(materialapplicationid,processnumber) {

    confirmInfor("确认删除?", function () {
        $.ajax({
            type: "POST",
            url: "../../Controllers/Check/MaterialApplyController.ashx?action=del",
            dataType: 'json',
            data: { "materialapplicationid": materialapplicationid, "processnumber": processnumber },
            success: function (msg) {
                if (msg != '') {
                    msg = eval('(' + msg + ')');
                    if (msg.IsSuccess == 'true') {
                        initPagination();
                  
                    }
                    alert(msg.Message);

                }
            }
        });
    }, function () { })
  
}