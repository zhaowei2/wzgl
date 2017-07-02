var isAdd = true;
var pagesize = 10;
var catetory = '';
var catetory1 = '';
var dictId = "";
var dataStr = null;
var materialid = '';
$(function () {
    inti();
    inticom();
});
function inticom()
{
    getCategory('treeCategory1', 1);
    getCategory('treeCategory2', 2);
}
  
function initPagination(msg) {
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
        var index = page_index + 1
        $('#coalmines tbody').empty();
        var row = "";
        var start = (index - 1) * pagesize;
        var end = start + pagesize;
        var data = msg.slice(start, end)
        $.each(data, function (key, val) {
            row += '  <tr class="listDataTr">'
                    + ' <td class="listDataTrTd" style="word-break: break-all;">'
                    + ' <a href="javaScript:void(0)" title=' + val.name + '>' + val.categoryname + '</a>'
                    + ' </td>'
                    + ' <td class="listDataTrTd" style="word-break: break-all;">'
                    + ' <a href="javaScript:void(0)" title=' + val.num + '>' + val.num + '</a>'
                    + ' </td>'
                    + ' </tr>';
        });
        $("#coalmines tbody").append(row);

        return false;
    }
       //ajax加载
     $("#hiddenresult").load("load.html", null, initPagination);

   
}
function intitunnel(msg) {
    var initPagination = function () {
        // 创建分页
        $("#tunnlPagination").pagination(parseInt(msg.length), {
            num_edge_entries: 1, //边缘页数
            num_display_entries: 10, //主体页数
            callback: pageselectCallback,
            items_per_page: pagesize, //每页显示页数
            prev_text: "上一页",
            next_text: "下一页"
        });
    };
    function pageselectCallback(page_index, jq) {
        var index = page_index + 1
        $('#tunnelCoals tbody').empty();
        var row = "";
        var start = (index - 1) * pagesize;
        var end = start + pagesize;
        var data = msg.slice(start, end)
        $.each(data, function (key, val) {
            row += '  <tr class="listDataTr">'
                      + ' <td class="listDataTrTd" style="word-break: break-all;">'
                    + ' <a href="javaScript:void(0)"title="' + val.organizationname + '" >' + val.organizationname + '</a>'
                    + ' </td>'
                    + ' <td class="listDataTrTd" style="word-break: break-all;">'
                    + ' <a href="javaScript:void(0)" title=' + val.num + '>' + val.num + '</a>'
                    + ' </td>'
                    + ' </tr>';
        });
        $("#tunnelCoals tbody").append(row);
        return false;
    }
    //ajax加载
    $("#tunnlhiddenresult").load("load.html", null, initPagination);
}
function inti()
{
    //getCategory('treeCategory1', 1);
    getStockByCategory();
    getOrganization('selstockid');
}
function tinti() {
    // catetory1 = '';
   // getCategory('treeCategory2', 2);
    getStockByOrg();
}
//仓库类型
function selectOrg()
{
    //alert("dd");
    dictId = $("#selcoalfaceid").val();
    getOrganization('selstockid');

}
//查找
function search()
{
    inti();
}
function tsearch() {
    tinti();
}
//重置
function reset()
{  
    $("#selcoalfaceid").val('');
    $('#label-active1').text('全部');
    $("#selstockid").val('');
}
function treset() {
    $('#label-active2').text('全部');
    $("#seltcoalfaceid").val('');
    materialid = '';
}
//加载材料类型
function getCategory(name,type) {
    $.ajax({
        type: "POST",
        url: "../../Controllers/Warehouse/MaterialcategoryController.ashx?action=getList",
        dataType: 'json',
        success: function (msg) {
            if (msg != '') {
                $('#' + name).empty();
                var html = '';
                $.each(msg, function (index, org) {
                    html += ' <li><a data-label="' + org.categoryname + '" data-id="#"  onclick="getId(\'' + org.materialcategoryid + '\',\'' + org.categoryname + '\',' + type + ')">' + org.categoryname + '</a>';
                    if (org.children != null) {
                        html += getCategoryTree(org.children, type);
                    }
                    html += '</li>';

                });
                html = '<li><a data-label="全部" href="#" onclick="getId(\'\',\'全部 \',' + type + ')">全部</a> <ul>' + html + '  </ul> </li>';
                $('#' + name).html(html);
                if (type==2) {
                    initTree();
                    $(".tree").treemenu({ delay: 300 }).openActive();
                }
                
            }
        }
    });
}

//生成树
function getCategoryTree(orgs, type) {
    var html = ' <ul>';
    for (var i = 0; i < orgs.length; i++) {
        var org = orgs[i];
        html += ' <li><a data-label="' + org.categoryname + '" href="#" onclick="getId(\'' + org.materialcategoryid + '\',\'' + org.categoryname + '\',' +type + ')">' + org.categoryname + '</a>';
        if (org.children != null) {
            html += getCategoryTree(org.children, type);
        }
        html += '</li>';
    }
    html += '</ul>';
    return html;
}
//获取下拉树的id
function getId(id,category,type)
{
    switch (type) {
        case 1:
            catetory = id;
            $('#label-active1').text(category);
            break;
        case 2:
            catetory1 = id;
            $('#label-active2').text(category);
            break;
    }
}

//加载部门
function getOrganization(name) {
    $.ajax({
        type: "POST",
        url: "../../Controllers/Systems/OrganizationController.ashx?action=getListBywhere",
        data: {
            "dictid": dictId
        },
        dataType: 'json',
        success: function (msg) {
            if (msg != '') {
                $('#' + name).empty();
                var html = '<option value="">全矿</option>';
                $.each(msg, function (index, org) {
                    html += '<option value="' + org.organizationid + '">' + org.organizationname + '</option>';
                });
                $("#" + name).append(html);
            }
        }
    });
}

function getStockByCategory()
{
    $.ajax({
        type: "POST",
        url: "../../Controllers/Warehouse/StockController.ashx?action=getStockByCategory",
        dataType: 'json',
        data: {
            "organizationtype": $("#selcoalfaceid").val(),
            "organizationid": $("#selstockid").val(),
            "parentcategoryid": catetory,
        },
        success: function (msg) {
            if (msg != '') {
                //1.图标展示
                var data = '';
                $.each(msg, function (index, org) {
                    data += " ['" + org.categoryname + "'," + parseInt(org.num) + "],";
                });
                if (data != '') {
                    data = data.substr(0, data.length - 1);
                }
                data = eval("[" + data + "]");
                getColumn(getTitle(), data);
            }
            else {
                getColumn(getTitle(), []);
            }
            //2.列表展示
            initPagination(msg);
        }
    });
}

function getStockByOrg() {
    $.ajax({
        type: "POST",
        url: "../../Controllers/Warehouse/StockController.ashx?action=getStockByOrg",
        dataType: 'json',
        data: {
            "organizationtype": $("#seltcoalfaceid").val(),
            "materialid": materialid,
            "parentcategoryid": catetory1,
        },
        success: function (msg) {
            if (msg != '') {
                var data = '';
                $.each(msg, function (index, org) {
                    data += " ['" + org.organizationname + "'," + parseInt(org.num) + "],"
                });
                if (data != '') {
                    data = data.substr(0, data.length - 1);
                }
                data = eval("[" + data + "]");
                getColumn(getTitle1(), data);
            }
            else {
                getColumn(getTitle1(), []);
            }
            //加载数据列表
            intitunnel(msg);
        }
    });

}
//加载柱状图
function getColumn(title, data) {
    var maxstr = null;
    if (data.length == 0) {
        maxstr = 100;
    }
    $('#container').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: title
        },
        subtitle: {
            text: ' '
        },
        xAxis: {
            type: 'category',
            labels: {
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        },
        credits: {
            enabled: false // 禁用版权信息
        },
        yAxis: {
            min: 0,
            max:maxstr,
            title: {
                text: ''
            },
            lineWidth: 1
        },
        legend: {
            enabled: false
        },
        tooltip: {
            pointFormat: '库存量: <b>{point.y:0f}</b>'
        },
        series: [{
            name: 'num',
            data: data,
            dataLabels: {
                enabled: true,
                align: 'right',
                format: '{point.y:0f} '
            }
        }]
    });
}

//获取柱状体标题
function getTitle1() {
    var organizationtype = $("#selcoalfaceid").val();
    var name = $("#txtname").val() == null ? '' : $("#txtname").val();
    var parentcategoryid = catetory;
    var html = '';
    if (organizationtype == '') {
        if (name == '' && parentcategoryid == '') {
            html += '全矿';
        }
        else if (name != '' && parentcategoryid == '') {
            html += $("#txtname").val();
        }
        else if (name == '' && parentcategoryid != '') {
            html += $("#label-active1").text();
        }
        else {
            html += $("#txtname").val();
            html += $("#label-active1").text();
        }
    }
    else {
        var ware = '';
        if (name == '' && parentcategoryid == '') {
            if (organizationtype == 'C70CEDCC-FB20-436E-B35A-AA5A7BD8C488') {
                html += '矿属仓库';
                ware = '矿属仓库';
            }
            else {
                html += '用料单位';
                ware = '用料单位';
            }
        }
        else if (name != '' && parentcategoryid == '') {
            html += $("#txtname").val();
        }
        else if (name == '' && parentcategoryid != '') {
            html += ware;
            html += $("#label-active1").text();
        }
        else {
            html += $("#txtname").val();
            html += $("#label-active1").text();
        }
    }
    html += "仓库统计";
    return html;
}
//获取柱状体标题
function getTitle() {
    var organizationtype = $("#selcoalfaceid").val();
    var organizationid = $("#selstockid").val() == null ? '' : $("#selstockid").val();
    var parentcategoryid = catetory;
    var html = '';
    if (organizationtype == '') {
        if (organizationid == '' && parentcategoryid == '') {
            html += '全矿';
        }
        else if (organizationid != '' && parentcategoryid == '') {
            html += $("#selstockid").find("option:selected").text();
        }
        else if (organizationid == '' && parentcategoryid != '') {

            html += $("#label-active1").text();
        }
        else {
            html += $("#selstockid").find("option:selected").text();
            html += $("#label-active1").text();
        }
    }
    else {
        var ware = '';
        if (organizationid == '' && parentcategoryid == '') {
            if (organizationtype == 'C70CEDCC-FB20-436E-B35A-AA5A7BD8C488') {
                html += '矿属仓库';
                ware = '矿属仓库';
            }
            else {
                html += '用料单位';
                ware = '用料单位';
            }
        }
        else if (organizationid != '' && parentcategoryid == '') {
            html += $("#selstockid").find("option:selected").text();
        }
        else if (organizationid == '' && parentcategoryid != '') {
            html += ware;
            html += $("#label-active1").text();
        }
        else {
            html += $("#selstockid").find("option:selected").text();
            html += $("#label-active1").text();
        }
    }
    html += "类别库存统计";
    return html;
}


function initMaterialGrid() {
    $('#cd2').addClass('is-visible');
    var html = '';
    //获取总页数
    var ss = "";
    $.ajax({
        type: "POST",
        url: "../../Controllers/Plan/Plan.ashx?action=getMaterialList&type=getCount",
        dataType: 'json',
        data: { name: $('#txt_name').val(), code: $('#txt_code').val() },
        success: function (msg) {
            if (msg != '') {
                if (msg.IsSuccess == "true") {
                    // 创建分页
                    $("#matPagination").pagination(parseInt(msg.Count), {
                        num_edge_entries: 1, //边缘页数
                        num_display_entries: 10, //主体页数
                        callback: pageselectCallback,
                        items_per_page: 6, //每页显示1项
                        prev_text: "上一页",
                        next_text: "下一页"
                    });
                    //  };

                    function pageselectCallback(page_index, jq) {
                        //  alert("调用");
                        var pageindex = page_index + 1;
                        $.ajax(
                        {
                            url: "../../Controllers/Plan/Plan.ashx?action=getMaterialList",
                            type: "post",
                            data: {
                                "page": pageindex,
                                "rows": 6,
                                name: $('#txt_name').val(),
                                code: $('#txt_code').val()
                            },
                            success: function (data) {
                                $('#materialTable tbody').empty();

                                var row = "";
                                $.each(data.rows, function (key, val) {
                                    //alert(val.TASK_ID);
                                    row += '  <tr class="listDataTr">'
                                              + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                              + ' <a href="javaScript:void(0)"title="' + val.code + '" >' + val.code + '</a>'
                                              + ' </td>'
                                              + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                              + ' <a href="javaScript:void(0)" title=' + val.name + '>' + val.name + '</a>'
                                              + ' </td>'
                                              + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                              + ' <a href="javaScript:void(0)" title=' + val.unitprice + '>' + val.unitprice + '</a>'
                                              + ' </td>'
                                              + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                              + ' <a href="javaScript:void(0)" title=' + val.unit + '>' + val.unit + '</a>'
                                              + ' </td>'
                                              + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                              + '  <button class="btn btn-info" onclick="sureMaterial(\'' + val.materialid + '\',\'' + val.name + '\',\'' + val.code + '\',\'' + val.unitprice + '\',\'' + val.unit + '\')">确定</button>'
                                              + ' </td>'

                                              + ' </tr>';
                                });
                                $("#materialTable tbody").append(row);
                            }
                        })
                        return false;
                    }
                }
            }
        }
    });

}

//材料DIV列表选中事件
function sureMaterial(id, name, code, unitprice, unit) {
    materialid = id;
    $("#cd2").removeClass('is-visible');
}






