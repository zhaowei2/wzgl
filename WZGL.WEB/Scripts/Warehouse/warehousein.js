var pagesize = 15;
$(function () {

    initPagination();
    getOrganization("treeOrganization1", 1);
});

function initPagination() {
    var url = "../../Controllers/Warehouse/InoroutrecordController.ashx?action=GetInOutList";
    $.ajax({
        type: "POST",
        url: url,
        dataType: 'json',
        data: {
            "processnumber": $('#processnumber').val(),
            "organizationid": $("#selorganizationid").val(),
            "begindate": $("#inp1").val(),
            "enddate": $("#inp2").val(),
            "inorout": '入库',
            "state": '已处理',
            "organizationtype": 'FFA21F13-BD0C-4312-BDAB-952C78DC39EE',
        },
        success: function (msg) {

            //if (msg.IsSuccess == "true") {
            if (msg.length == 0) {
                $('#outList').empty();
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
                    url: "../../Controllers/Warehouse/InoroutrecordController.ashx?action=getInOutPageList",
                    type: "post",
                    data: {
                        "page": index,
                        "rows": pagesize, //每页显示页数
                        "processnumber": $('#processnumber').val(),
                        "organizationid": $("#selorganizationid").val(),
                        "begindate": $("#inp1").val(),
                        "enddate": $("#inp2").val(),
                        "inorout": '入库',
                        "state": '已处理',
                        "organizationtype": 'FFA21F13-BD0C-4312-BDAB-952C78DC39EE',
                    },
                    success: function (data) {

                        $('#outList').empty();

                        data = eval('(' + data + ')');
                        if (data.IsSuccess == "true") {
                            data = eval('(' + data.Message + ')');
                            var row = "";
                            var status = '';
                            $.each(data.rows, function (key, val) {

                                row += '<div class="item">'
                                + '<h4 class="panel-title">'
                                + '<table class="table table-hover">'
                                + '<tbody>'
                                + '<tr class="listDataTh" style="border-top: 1px solid #dddddd;">'
                                + '<td width="" title="" class="listDataThTd nowrap" style="width:6%; position: relative;overflow:hidden;white-space:nowrap;text-overflow: ellipsis;">'
                                + '<a class="pager-tree"  onclick="listTree(this)" href="#"></a>'
                                + '</td>'
                                + '<td width="" title="" class="listDataThTd nowrap" style="width:34%;overflow:hidden;white-space:nowrap;text-overflow: ellipsis;">'
                                + val.processnumber
                                + '</td>'
                                + '<td width="" title="" class="listDataThTd nowrap" style="width:30%;overflow:hidden;white-space:nowrap;text-overflow: ellipsis;">'
                                + val.organizationname
                                + '</td>'
                                + '<td width="" title="" class="listDataThTd nowrap" style="text-align:center;width:30%;overflow:hidden;white-space:nowrap;text-overflow: ellipsis;">'
                                + val.inoroutdate
                                + '</td>'
                                + '</tr>'
                                + '</tbody>'
                                + '</table>'
                                + '</h4>'
                                + '</div>';


                                row += '<div class="item_text">'
                                + '<table class="table table-hover">'
                                + '<thead>'
                                + '<tr class="listDataTh" style="border-top: 1px solid #dddddd;">'
                                 + '<td class="listDataTrTd" style="word-break: break-all;width:10%"></td>'
                                + '<td width="" title="" class="listDataThTd nowrap" style="overflow:hidden;white-space:nowrap;text-overflow: ellipsis; width: 25%;">'
                                + '品名'
                                + '</td>'
                                + '<td width="" title="" class="listDataThTd nowrap" style="overflow:hidden;white-space:nowrap;text-overflow: ellipsis;">'
                                + '数量'
                                + '</td>'
                                + '<td width="" title="" class="listDataThTd nowrap" style="overflow:hidden;white-space:nowrap;text-overflow: ellipsis;">'
                                + '单价'
                                + '</td>'
                                + '<td width="" title="" class="listDataThTd nowrap" style="overflow:hidden;white-space:nowrap;text-overflow: ellipsis;">'
                                + '金额'
                                + '</td>'
                                + '</tr>'
                                + '</thead>'
                                + '<tbody>';

                                $.each(val.detail, function (i, d) {
                                    row += '<tr class="listDataTr">'

                                    + '<td class="listDataTrTd" style="word-break: break-all;width:10%"></td>'
                                    + '<td class="listDataTrTd" style="word-break: break-all;width: 25%;">'
                                    + d.name
                                    + '</td>'
                                    + '<td class="listDataTrTd" style="word-break: break-all;">'
                                    + d.num
                                    + '</td>'
                                    + '<td class="listDataTrTd" style="word-break: break-all;">'
                                    + d.unitprice
                                    + '</td>'
                                    + '<td class="listDataTrTd" style="word-break: break-all;">'
                                    + d.amountmoney
                                    + '</td>'
                                    + '</tr>';
                                });

                                row += '</tbody>'
                                + '</table>'
                                + ' </div>';
                            });
                            $("#outList").append(row);
                        }
                    }
                });
                return false;
            }
            //ajax加载
            $("#hiddenresult").load("load.html", null, initPagination);

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
                html = '<li><a data-label="全部" href="#" onclick="getId(\'\',\'全部 \',' + type + ')">全部</a> <ul style="overflow-y: auto; height: 240px;">' + html + '  </ul> </li>';
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


function Select() {
    initPagination();
}

function Reset() {
    $("#label-active1").val("");
    $("#selorganizationid").val("");

    $("#inp1").val("");
    $("#processnumber").val("");
}