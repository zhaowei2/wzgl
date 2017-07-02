
var pagesize = 15;
var catetory = '';
var dictId = "";

$(function () {
    initPagination();
    getCategory('treeCategory1',1);
    getOrganization();
});
  
//加载数据
function initPagination() {
    var url = "../../Controllers/Warehouse/StockController.ashx?action=getCount";
    $.ajax({
        type: "POST",
        url: url,
        dataType: 'json',
        data: {
            "organizationtype": $("#selcoalfaceid").val(),
            "organizationid": $("#selstockid").val(),
            "parentcategoryid": catetory,
            "code": ($("#selchange").val() == "材料编码") ? $("#txtname").val() : "",
            "name": ($("#selchange").val() == "材料编码") ? "" : $("#txtname").val()
        },
        success: function (msg) {
            if (msg != '') {
                if (msg.IsSuccess == "true") {
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
                            url: "../../Controllers/Warehouse/StockController.ashx?action=getPageList",
                            type: "post",
                            data: {
                                "page": index,
                                "rows": pagesize, //每页显示页数
                                "organizationtype": $("#selcoalfaceid").val(),
                                "organizationid": $("#selstockid").val(),
                                "parentcategoryid": catetory,
                                "sort": "code",
                                "code": ($("#selchange").val() == "材料编码") ? $("#txtname").val() : "",
                                "name": ($("#selchange").val() == "材料编码") ? "" : $("#txtname").val()
                            },
                            success: function (data) {
                                $('#coalmines tbody').empty();
                                var row = "";
                                $.each(data.rows, function (key, val) {
                                    row += '  <tr class="listDataTr">'
                                            + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                            + ' <a href="javaScript:void(0)"title="' + val.organizationname + '" >' + val.organizationname + '</a>'
                                            + ' </td>'
                                            + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                            + ' <a href="javaScript:void(0)" title=' + val.categoryname + '>' + val.categoryname + '</a>'
                                            + ' </td>'
                                            + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                            + ' <a href="javaScript:void(0)"title="' + val.code + '" >' + val.code + '</a>'
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

//仓库类型
function selectOrg()
{
    dictId = $("#selcoalfaceid").val();
    getOrganization('selstockid');

}
//查找
function search()
{
    initPagination();
}
//重置
function reset()
{
    $('#label-active1').text('全部');
    $("#selcoalfaceid").val('');
    $("#selstockid").val('');
    $("#txtname").val('')
    catetory = '';
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
                    html += ' <li><a data-label="' + org.categoryname + '" data-id="#"  onclick="getId(\'' + org.materialcategoryid + '\',\'' + org.categoryname + '\')">' + org.categoryname + '</a>';
                    if (org.children != null) {
                        html += getCategoryTree(org.children, type);
                    }
                    html += '</li>';

                });
                html = '<li><a data-label="全部" href="#" onclick="getId(\'\',\'全部 \')">全部</a> <ul>' + html + '  </ul> </li>';
                $('#'+name).html(html);
                 initTree();
                $(".tree").treemenu({ delay: 300 }).openActive();
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
function getId(id, category) {
    catetory = id;
    $('#label-active1').text(category);

}

//加载部门
function getOrganization() {
    $.ajax({
        type: "POST",
        url: "../../Controllers/Systems/OrganizationController.ashx?action=getListBywhere",
        data: {
            "dictid": dictId
        },
        dataType: 'json',
        success: function (msg) {
            if (msg != '') {
                $('#selstockid').empty();
                var html = '<option value="">全矿</option>';
                $.each(msg, function (index, org) {
                    html += '<option value="' + org.organizationid + '">' + org.organizationname + '</option>';
                });
                $("#selstockid").append(html);
            }
        }
    });
}







