﻿var isAdd = true;
var pagesize = 15;
$(function () {
    var Data = new Date();
    calender("#inp2").init({
        format: 'yyyy-MM-dd',
        date: [Data.getFullYear(), Data.getMonth() + 1, Data.getDate()],
     
    }, function (date) {
        this.value = date
    });
    calender("#inp1").init({
        format: 'yyyy-MM-dd',
        date: [Data.getFullYear(), Data.getMonth() + 1, Data.getDate()],
     
    }, function (date) {
        this.value = date
    });


    getOrganization("treeOrganization1", 1);
    initPagination();
});


function add() {
    window.location = "AddCapital.html";
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
                html = '<li><a data-label="全部" href="#" onclick="getId(\'\',\'全部 \',' + type + ')">全部</a> <ul style="height:204px;overflow-y:auto">' + html + '  </ul> </li>';
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

function initPagination() {
    var url = "../../Controllers/Capital/CapitalSelect.ashx?action=getCount";
    $.ajax({
        type: "POST",
        url: url,
        dataType: 'json',
        data: {
            "State": $("#Status").val(),
            "Organization": $("#selorganizationid").val(),
            "StartTime": $("#inp2").val(),
            "EndTime": $("#inp1").val(),
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
                            prev_text: "上一页",
                            next_text: "下一页"
                        });
                    };
                    function pageselectCallback(page_index, jq) {

                        var index = page_index + 1;
                        $.ajax(
                        {
                            url: "../../Controllers/Capital/CapitalSelect.ashx?action=getList",
                            type: "post",
                            data: {
                                "page": index,
                                "rows": pagesize, //每页显示页数
                                "State": $("#Status").val(),
                                "Organization": $("#selorganizationid").val(),
                                "StartTime": $("#inp2").val(),
                                "EndTime": $("#inp1").val(),
                            },
                            success: function (data) {
                                $('#coalmines tbody').empty();
                                var row = "";
                                var status = '';
                                $.each(data.rows, function (key, val) {
                                    switch (val.flowstatus) {
                                        case "0":
                                            status = '未发起';
                                            break;
                                        case "1":
                                            status = '进行中';
                                            break;
                                        case "2":
                                            status = '已批准';
                                            break;
                                        case "R":
                                            status = '被打回';
                                            break;
                                        default:
                                            status = '未发起';
                                            break;

                                    }
                                    row += '  <tr class="listDataTr">'
                                           + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                           + ' <a href="javaScript:void(0)"title="' + val.submitdate + '" >' + val.submitdate + '</a>'
                                           + ' </td>'
                                           + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                           + ' <a href="javaScript:void(0)" title=' + val.applicantname + '>' + val.applicantname + '</a>'
                                           + ' </td>'
                                           + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                           + ' <a href="javaScript:void(0)" title=' + val.organizationname + '>' + val.organizationname + '</a>'
                                           + ' </td>'
                                           + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                           + ' <a href="javaScript:void(0)" title=' + val.applicantamount + '>' + val.applicantamount + '</a>'
                                           + ' </td>'
                                           + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                           + ' <a href="javaScript:void(0)" title=' + val.approveamount + '>' + val.approveamount + '</a>'
                                           + ' </td>'
                                    + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                    + ' <a href="javaScript:void(0)" title=' + status + '>' + status + '</a>'
                                    + ' </td>'
                                    + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                    + ' <a href="javaScript:void(0)" title=' + val.step_name + '>' + val.step_name + '</a>'
                                    + ' </td>'
                                    + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                    + ' <a href="javaScript:void(0)" onclick="edit(\'' + val.capitalapplicantid + '\',\'' + val.flowstatus + '\')">编辑</a>'
                                    + ' <a href="javaScript:void(0)" onclick="del(\'' + val.capitalapplicantid + '\',\'' + val.flowstatus + '\')">删除</a>'
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


//删除资金申请
function del(capitalapplicantid, status) {
    if (status == "0" || status == "R" || status=='') {
        confirmInfor("确定要删除该申请?", function () { IsOk(capitalapplicantid); }, function () { });
    }
    else {
        alert("该流程已经发起不能被删除");
        return;
    }
    


}

function IsOk(capitalapplicantid)
{
    $.ajax(
{
    url: "../../Controllers/Capital/CapitalSelect.ashx?action=Del&capitalapplicantid=" + capitalapplicantid,
    type: "post",
    success: function (data) {
        data = eval('(' + data + ')');
        if (data.IsSuccess == true) {
            initPagination();
        }
    }
}
)
}

function Return()
{
    
}



//编辑资金申请
function edit(capitalapplicantid, status) {
    if (status == "0" || status == "R" || status == '') {
        window.location = "editCapital.html?capitalapplicantid=" + capitalapplicantid;

    }
    else {
        alert("该流程已经发起不能被修改");
        return;
     }
}


function Select() {
    initPagination();
}
function Reset() {
    $("#label-active1").val("");
    $("#selorganizationid").val("");
    $("#Status").val("全部");
    $("#inp2").val("");
    $("#inp1").val("");
}
