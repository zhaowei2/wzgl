var pagesize = 15;
var catetory2 = '';
$(function () { 
    intistock();
});
//库存管理
function intistock() {
    initStockPagination();
    getCategory('treeCategory2');
}
function initdiving()
{
    initDivingPagination();
}
function init()
{
    initPagination();
    getOrganization("treeOrganization1");
}
//-----------------------------------------库存材料方法---------------------------------------

function initStockPagination() {
    var url = "../../Controllers/Warehouse/StockController.ashx?action=getCount";
    $.ajax({
        type: "POST",
        url: url,
        dataType: 'json',
        data: {
            "categoryid": catetory2,
            "code": $("#txtcode").val(),
            "name": $("#txtappname").val(),
            "standard": $("#txtstandard").val(),
            "userId": "userId"
        },
        success: function (msg) {
            if (msg != '') {
                if (msg.IsSuccess == "true") {
                    var initPagination = function () {
                        // 创建分页
                        $("#stockPagination").pagination(parseInt(msg.Count), {
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
                            url: "../../Controllers/Warehouse/StockController.ashx?action=getPageList",
                            type: "post",
                            data: {
                                "page": index,
                                "rows": pagesize, //每页显示页数
                                "categoryid": catetory2,
                                "code": $("#txtcode").val(),
                                "name": $("#txtappname").val(),
                                "standard": $("#txtstandard").val(),
                                "userId": "userId"
                            },
                            success: function (data) {
                                $('#stockCoals tbody').empty();
                                var row = "";
                                $.each(data.rows, function (key, val) {
                                    row += '  <tr class="listDataTr">'
                                            + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                            + ' <a href="javaScript:void(0)"title="' + val.code + '" >' + val.code + '</a>'
                                            + ' </td>'
                                            + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                            + ' <a href="javaScript:void(0)" title=' + val.categoryname + '>' + val.categoryname + '</a>'
                                            + ' </td>'
                                            + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                            + ' <a href="javaScript:void(0)" title=' + val.name + '>' + val.name + '</a>'
                                            + ' </td>'
                                            + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                            + ' <a href="javaScript:void(0)" title=' + val.standard + '>' + val.standard + '</a>'
                                            + ' </td>'
                                            + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                            + ' <a href="javaScript:void(0)" title=' + val.unit + '>' + val.unit + '</a>'
                                            + ' </td>'
                                            + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                            + ' <a href="javaScript:void(0)" title=' + val.num + '>' + val.num + '</a>'
                                            + ' </td>'
                                            + ' </tr>';
                                });
                                $("#stockCoals tbody").append(row);
                            }
                        });
                        return false;
                    }
                    //ajax加载
                    $("#stockhiddenresult").load("load.html", null, initPagination);

                }
            }
        }
    });
}


//获取当前日期
function getDateStr(AddDayCount) {
    var dd = new Date();
    dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期 
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1;//获取当前月份的日期 
    var d = dd.getDate();
    return y + "-" + m + "-" + d;
}
//查找
function search()
{
    initPagination();
}
//重置
function reset()
{
    $("#txtstart").val('');
    $("#txtend").val('');  
    $("#selorganizationid").val('');
    $("#txtname").val('');
    $("#label-active1").html('全部');
}


//-----------------------------------------出入库记录方法---------------------------------------
//出入库记录
function initDivingPagination() {
    var url = "../../Controllers/Warehouse/InoroutrecordController.ashx?action=GetInOutList";
    $.ajax({
        type: "POST",
        url: url,
        dataType: 'json',
        data: {
            "processnumber": $('#txtprocessnumber').val(),
            "begindate": $("#inp1").val(),
            "enddate": $("#inp2").val(),
            "inorout": $("#selinorout").val(),
            "state": '已处理',
            "userId": 'userId'
        },
        success: function (msg) {

            //if (msg.IsSuccess == "true") {
            if (msg.length == 0) {
                $('#outList').empty();
            }
            var initPagination = function () {
                // 创建分页
                $("#divingPagination").pagination(parseInt(msg.length), {
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
                        "processnumber": $('#txtprocessnumber').val(),
                        "begindate": $("#inp1").val(),
                        "enddate": $("#inp2").val(),
                        "inorout": $("#selinorout").val(),
                        "state": '已处理',
                        "userId": 'userId'
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
                                + val.inorout
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
                                + '材料名称'
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
            $("#divinghiddenresult").load("load.html", null, initPagination);

            // }
        }
    });
}
//查找
function tsearch() {
    initStockPagination();
}
//重置
function treset() {
    $("#inp1").val('');
    $("#inp2").val('');
    $('#txtprocessnumber').val('');
    $("#selinorout").val('');
}
function clear()
{
    $("#txtcode").val('');
    $("#txtappname").val('');
    $("#txtstandard").val('');
    catetory2 = '';
    $("#label-active2").html('');
}
//加载材料类型
function getCategory(name) {
    $.ajax({
        type: "POST",
        url: "../../Controllers/Warehouse/MaterialcategoryController.ashx?action=getList",
        dataType: 'json',
        success: function (msg) {
            if (msg != '') {
                $('#' + name).empty();
                var html = '';
                $.each(msg, function (index, org) {
                    html += ' <li><a data-label="' + org.categoryname + '" data-id="#"  onclick="getId(\'' + org.materialcategoryid + '\',\'' + org.categoryname + '\')">' + org.categoryname + '</a>';
                    if (org.children != null) {
                        html += getTree(org.children);
                    }
                    html += '</li>';

                });
                html = '<li><a data-label="全部" href="#" onclick="getId(\'\',\'全部 \')">全部</a> <ul style="overflow-y: auto; height: 240px;">' + html + '  </ul> </li>';
                $('#' + name).html(html);
                initTree();
                $(".tree").treemenu({ delay: 300 }).openActive();
            }
        }
    });
}

//生成树
function getTree(orgs) {
    var html = ' <ul>';
    for (var i = 0; i < orgs.length; i++) {
        var org = orgs[i];
        html += ' <li><a data-label="' + org.categoryname + '" href="#" onclick="getId(\'' + org.materialcategoryid + '\',\'' + org.categoryname + '\')">' + org.categoryname + '</a>';
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
    catetory2 = id;
    $('#label-active2').text(category);
}


//出入库详情
function initDetails(id)
{
    var url = "../../Controllers/Warehouse/InoroutdetailController.ashx?action=getCount";
    $.ajax({
        type: "POST",
        url: url,
        dataType: 'json',
        data: {
            "processnumber": id
        },
        success: function (msg) {
            if (msg != '') {
                if (msg.IsSuccess == "true") {
                    var initPagination = function () {
                        // 创建分页
                        $("#detailPagination").pagination(parseInt(msg.Count), {
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
                            url: "../../Controllers/Warehouse/InoroutdetailController.ashx?action=getPageList",
                            type: "post",
                            data: {
                                "page": index,
                                "rows": pagesize, //每页显示页数
                                "processnumber": id
                            },
                            success: function (data) {
                                $('#detailCoals tbody').empty();
                                var row = "";
                                $.each(data.rows, function (key, val) {
                                    row += '  <tr class="listDataTr">'
                                            + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                            + ' <a href="javaScript:void(0)"title="' + val.name + '" >' + val.name + '</a>'
                                            + ' </td>'
                                            + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                            + ' <a href="javaScript:void(0)" title=' + val.code + '>' + val.code + '</a>'
                                            + ' </td>'
                                            + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                            + ' <a href="javaScript:void(0)" title=' + val.standard + '>' + val.standard + '</a>'
                                            + ' </td>'
                                            + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                            + ' <a href="javaScript:void(0)" title=' + val.unitprice + '>' + val.unitprice + '</a>'
                                            + ' </td>'
                                            + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                            + ' <a href="javaScript:void(0)" title=' + val.num + '>' + val.num + '</a>'
                                            + ' </td>'
                                            + ' </tr>';
                                });
                                $("#detailCoals tbody").append(row);
                                $('.cd-popup').addClass('is-visible');
                                parent.globalShade();
                            }
                        });
                        return false;
                    }
                    //ajax加载
                    $("#detailhiddenresult").load("load.html", null, initPagination);

                }
            }
        }
    });
}


//--------------------------------------待出入库记录方法
function initPagination() {
    var url = "../../Controllers/Warehouse/WarehousetaskController.ashx?action=getCount";
        $.ajax({                         
            type: "POST",
            url: url,
            dataType: 'json',
            data: {
                "begindate": $("#inp1").val(),
                "enddate": $("#inp2").val(),
                "organizationid": $("#selorganizationid").val(),
                "linliaor": $("#txtname").val()
            },
            success: function (msg) {
                $('#wareList').empty();
                if (msg != '') {
                    if (msg.IsSuccess == "true") {
                        var initPagination = function () {
                            // 创建分页
                            $("#divingPagination").pagination(parseInt(msg.Count), {
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
                                url: "../../Controllers/Warehouse/WarehousetaskController.ashx?action=getPageList",
                                type: "post",
                                data: {
                                    "page": index,
                                    "rows": pagesize, //每页显示页数
                                    "begindate": $("#inp1").val(),
                                    "enddate": $("#inp2").val(),
                                    "organizationid": $("#selorganizationid").val(),
                                    "linliaor": $("#txtname").val()
                                },
                                success: function (data) {
                                    $('#wareList').empty();
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
                                            + '<td width="" title="" class="listDataThTd nowrap" style="width:20%;overflow:hidden;white-space:nowrap;text-overflow: ellipsis;">'
                                            + val.processnumber
                                            + '</td>'
                                              + '<td width="" title="" class="listDataThTd nowrap" style="width:20%;overflow:hidden;white-space:nowrap;text-overflow: ellipsis;">'
                                            + val.organizationname
                                            + '</td>'
                                              + '<td width="" title="" class="listDataThTd nowrap" style="width:20%;overflow:hidden;white-space:nowrap;text-overflow: ellipsis;">'
                                            + val.name
                                            + '</td>'
                                            + '<td width="" title="" class="listDataThTd nowrap" style="width:20%;overflow:hidden;white-space:nowrap;text-overflow: ellipsis;">'
                                            + ' <div  style="cursor: pointer;color:#7a9bc5"   title=' + val.inorout + ' onclick="operate(\'' + val.processnumber + '\',\'' + val.inorout + '\')">' + val.inorout + '</div>'
                                            + '</td>'
                                            + '<td width="" title="" class="listDataThTd nowrap" style="text-align:center;width:20%;overflow:hidden;white-space:nowrap;text-overflow: ellipsis;">'
                                            + val.submitdate
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
                                            + '材料名称'
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
                                        $("#wareList").append(row);
                                    }
                                }
                            });
                            return false;
                        }
                        //ajax加载
                        $("#divinghiddenresult").load("load.html", null, initPagination);

                    }
                }
            }
        });
    }

//出入库操作
function operate(processnumber, inorout) {
 
    $.ajax({
        url: "../../Controllers/Warehouse/WarehousetaskController.ashx?action=GetInoroutStock",
        type: "post",
        data: {
            "processnumber": processnumber
        },
        success: function (data) {
            if (data.IsSuccess == "true") {
                if (data.result == 1) {
                    //驻矿站库存不足
                    alert("驻矿站库存不足");
                }
                if (data.result == 0) {
                    //成功
                    alert(inorout + "成功！");
                    initPagination();//重新加载
                }
               
            }
            else {

                alert(inorout + "失败！");
            }
        }
    });
}


//加载部门
function getOrganization(name) {
    $.ajax({
        type: "POST",
        url: "../../Controllers/Systems/OrganizationController.ashx?action=getList",
        dataType: 'json',
        success: function (msg) {
            if (msg != '') {
                $('#' + name).empty();
                var html = '';
                $.each(msg, function (index, org) {
                    html += ' <li><a data-label="' + org.organizationname + '" data-id="#"  onclick="get(\'' + org.organizationid + '\',\'' + org.organizationname + '\')">' + org.organizationname + '</a>';
                    if (org.children != null) {
                        html += getComTree(org.children);
                    }
                    html += '</li>';

                });
                html = '<li><a data-label="全部" href="#" onclick="get(\'\',\'全部 \')">全部</a> <ul style="overflow-y: auto; height: 240px;">' + html + '  </ul> </li>';
                $('#' + name).html(html);
                initTree1();
                $(".tree1").treemenu1({ delay: 300 }).openActive1();
            }
        }
    });
}

//生成树
function getComTree(orgs) {
    var html = ' <ul>';
    for (var i = 0; i < orgs.length; i++) {
        var org = orgs[i];
        html += ' <li><a data-label="' + org.organizationname + '" href="#" onclick="get(\'' + org.organizationid + '\',\'' + org.organizationname + '\')">' + org.organizationname + '</a>';
        if (org.children != null) {
            html += getComTree(org.children);
        }
        html += '</li>';
    }
    html += '</ul>';
    return html;
}

//获取下拉树的id
function get(id, category) {
    $("#selorganizationid").val(id)
    $('#label-active1').text(category);
}