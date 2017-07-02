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
})


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
    var url = "../../Controllers/Capital/CapitalFlow.ashx?action=getCount&Oneself=2";
    $.ajax({
        type: "POST",
        url: url,
        dataType: 'json',
        data: {
            "flowrecordtype": $("#cmb_type").val(),
            "source": $("#cmb_ly").val(),
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
                            url: "../../Controllers/Capital/CapitalFlow.ashx?action=getList&Oneself=2",
                            type: "post",
                            data: {
                                "page": index,
                                "rows": pagesize, //每页显示页数
                                "flowrecordtype": $("#cmb_type").val(),
                                "source": $("#cmb_ly").val(),
                                "Organization": $("#selorganizationid").val(),
                                "StartTime": $("#inp2").val(),
                                "EndTime": $("#inp1").val(),
                            },
                            success: function (data) {
                                $('#coalmines tbody').empty();
                                var row = "";

                                for (var i = 0; i < data.length; i++) {
                                    row += '  <tr class="listDataTr">'
                                           + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                           + ' <a href="javaScript:void(0)" title=' + data[i].appeardate + '>' + data[i].appeardate + '</a>'
                                           + ' </td>'
                                           + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                           + ' <a href="javaScript:void(0)"title="' + data[i].organizationname + '" >' + data[i].organizationname + '</a>'
                                           + ' </td>'
                                           + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                           + ' <a href="javaScript:void(0)" title=' + data[i].flowrecordtype + '>' + data[i].flowrecordtype + '</a>'
                                           + ' </td>'
                                           + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                           + ' <a href="javaScript:void(0)" title=' + data[i].source + '>' + data[i].source + '</a>'
                                           + ' </td>'
                                           + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                           + ' <a href="javaScript:void(0)" title=' + data[i].processnumber + '>' + data[i].processnumber + '</a>'
                                           + ' </td>'
                                           + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                           + ' <a href="javaScript:void(0)" title=' + data[i].amount + '>' + data[i].amount + '</a>'
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

function Select() {
    initPagination();
}
function Reset() {
    $("#label-active1").val("");
    $("#selorganizationid").val("");
    $("#cmb_type").val("全部");
    $("#cmb_ly").val("全部");
    $("#inp2").val("");
    $("#inp1").val("");
}