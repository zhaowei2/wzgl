var isAdd = true;
var pagesize = 15;
var catetory = '';
var catetory_update = '';
$(function () { 
    initPagination();
    initcom();
});
  
function initcom()
{
    getCategory('treeCategory', 1);
    getCategory('treeCategoryadd', 2);
}
//-----------------------------------------材料方法---------------------------------------
function initPagination() {
    $.ajax({
        type:"GET",
        url:"../../dataJson/Warehouse/material.json",
        dataType:"json",
        success:function(msg) {
            var row,a= 0,dataMsg= msg,val;
            for(;a<dataMsg.length;a++){
                val = dataMsg[a];
                row +='  <tr class="listDataTr">'
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
                + ' <a href="javaScript:void(0)" title=' + val.unitprice + '>' + val.unitprice + '</a>'
                + ' </td>'
                + ' <td class="listDataTrTd" style="word-break: break-all;">'
                + ' <a href="javaScript:void(0)" onclick="edit(\'' + val.materialid + '\',\'' + val.code + '\',\'' + val.materialcategoryid + '\',\'' + val.name + '\',\'' + val.standard + '\',\'' + val.unit + '\',\'' + val.unitprice + '\',\'' + val.categoryname + '\')">编辑</a>'
                + ' &nbsp;<a href="javaScript:void(0)" onclick="del(\'' + val.materialid + '\')">删除</a>'
                + ' </td>'
                + ' </tr>'
            }
            $("#coalmines tbody").html(row);
        }
    });
    //var url = "../../Controllers/Warehouse/MaterialController.ashx?action=getCount";
    //$.ajax({
    //    type: "POST",
    //    url: url,
    //    dataType: 'json',
    //    data: {
    //        "categoryid": catetory,
    //        "code": $("#txtcode").val(),
    //        "name": $("#txtname").val(),
    //        "standard": $("#txtstandard").val(),
    //    },
    //    success: function (msg) {
    //        if (msg != '') {
    //            if (msg.IsSuccess == "true") {
    //                var initPagination = function () {
    //                    // 创建分页
    //                    $("#Pagination").pagination(parseInt(msg.Count), {
    //                        num_edge_entries: 1, //边缘页数
    //                        num_display_entries: 10, //主体页数
    //                        callback: pageselectCallback,
    //                        items_per_page: pagesize, //每页显示页数
    //                        prev_text: "上一页",
    //                        next_text: "下一页"
    //                    });
    //                };
    //                function pageselectCallback(page_index, jq) {
    //                        var index = page_index + 1;
    //                        $.ajax(
    //                        {
    //                            url: "../../Controllers/Warehouse/MaterialController.ashx?action=getPageList",
    //                            type: "post",
    //                            data: {
    //                                "page": index,
    //                                "rows": pagesize, //每页显示页数
    //                                "categoryid": catetory,
    //                                "code": $("#txtcode").val(),
    //                                "name": $("#txtname").val(),
    //                                "standard": $("#txtstandard").val(),
    //                            },
    //                            success: function (data) {
    //                                $('#coalmines tbody').empty();
    //                                var row = "";
    //                                $.each(data.rows, function (key, val) {
    //                                    row += '  <tr class="listDataTr">'
    //                                           + ' <td class="listDataTrTd" style="word-break: break-all;">'
    //                                           + ' <a href="javaScript:void(0)"title="' + val.code + '" >' + val.code + '</a>'
    //                                           + ' </td>'
    //                                           + ' <td class="listDataTrTd" style="word-break: break-all;">'
    //                                           + ' <a href="javaScript:void(0)" title=' + val.categoryname + '>' + val.categoryname + '</a>'
    //                                           + ' </td>'
    //                                           + ' <td class="listDataTrTd" style="word-break: break-all;">'
    //                                           + ' <a href="javaScript:void(0)" title=' + val.name + '>' + val.name + '</a>'
    //                                           + ' </td>'
    //                                           + ' <td class="listDataTrTd" style="word-break: break-all;">'
    //                                           + ' <a href="javaScript:void(0)" title=' + val.standard + '>' + val.standard + '</a>'
    //                                           + ' </td>'
    //                                           + ' <td class="listDataTrTd" style="word-break: break-all;">'
    //                                           + ' <a href="javaScript:void(0)" title=' + val.unit + '>' + val.unit + '</a>'
    //                                           + ' </td>'
    //                                           + ' <td class="listDataTrTd" style="word-break: break-all;">'
    //                                           + ' <a href="javaScript:void(0)" title=' + val.unitprice + '>' + val.unitprice + '</a>'
    //                                           + ' </td>'
    //                                           + ' <td class="listDataTrTd" style="word-break: break-all;">'
    //                                           + ' <a href="javaScript:void(0)" onclick="edit(\'' + val.materialid + '\',\'' + val.code + '\',\'' + val.materialcategoryid + '\',\'' + val.name + '\',\'' + val.standard + '\',\'' + val.unit + '\',\'' + val.unitprice + '\',\'' + val.categoryname + '\')">编辑</a>'
    //                                           + ' &nbsp;<a href="javaScript:void(0)" onclick="del(\'' + val.materialid + '\')">删除</a>'
    //                                           + ' </td>'
    //                                           + ' </tr>';
    //                                });
    //                                $("#coalmines tbody").append(row);
    //                            }
    //                        });
    //                        return false;
    //                    }
    //                    //ajax加载
    //                    $("#hiddenresult").load("load.html", null, initPagination);
    //            }
    //        }
    //    }
    //});
}
//保存数据
function save()
{
    if ($('#label-active2').text() == ""||$('#label-active2').text()=='全部') {
        alert("请选择材料编码！");
        return;
    }
    if ($("#code").val() == "") {
        alert("请输入材料编码！");
       return;
    }
    if ($("#name").val() == "") {
        alert("请输入材料品名！");
       return;
    }
    if ($("#standard").val() == "") {
        alert("请输入材料规格！");
        return;
    }
    if ($("#unit").val() == "") {
        alert("请输入材料单位！");
        return;
    }
    if ($("#unitprice").val() == "") {
        alert("请输入材料单价！");
        return;
    }
    if (isNaN($("#unitprice").val())) {
        alert("材料单价请输入数字！");
        return;
    }
     //验证所选材料类别是否是末节点
    if (!checkChild()) {
        alert("请选择材料类别的末节点！");
        return;
    }
    //验证数据是否有重复项
    if (checkExist()=="true") {
        alert("已存在该编码的材料，请重新输入！");
        return;
    }
    var url = "";
    if (!isAdd) {
        url = "../../Controllers/Warehouse/MaterialController.ashx?action=update";
    }
    else {
        url = "../../Controllers/Warehouse/MaterialController.ashx?action=add";
    }
    $.ajax({
        url: url,
        type: "post",
        data: {
            "materialcategoryid": catetory_update,
            "code": $("#code").val(),
            "name": $("#name").val(),
            "standard": $("#standard").val(),
            "unit": $("#unit").val(),
            "unitprice": $("#unitprice").val(),
            "materialid": $("#materialid").val(),
            
        },
        success: function (data) {
            data = eval('(' + data + ')');
            if (data.IsSuccess == "true") {
                if (isAdd) {
                    alert("材料编码添加成功！");
                }
                else {
                    alert("材料编码编辑成功！");
                    $(".cd-popup").removeClass('is-visible');
                    parent.deleteGlobalShade();
                }
                //刷新table
                initPagination();
            }
        }
    });
}

//验证所选材料类别是否是末节点
function checkChild() {
    var result = false;
    $.ajax({
        url: '../../Controllers/Warehouse/MaterialcategoryController.ashx?action=getChild',
        type: "post",
        data: {
            "parentcategoryid": catetory_update
        },
        async: false,
        success: function (data) {
             // data = eval('(' + data + ')');
            if (data.length==0) {
                result= true;
            }
            else {
                result = false;
            }
        }
    });
    return result;
}

//判断数据是否存在
function checkExist() {
    var result = false;
    $.ajax({
        url: '../../Controllers/Warehouse/MaterialController.ashx?action=isExit',
        type: "post",
        data: {
            "code": $("#code").val(),
            "id": (isAdd == true) ? "" : $("#materialid").val()
        },
        async: false,
        success: function (msg) {
            if (msg != '') {
                msg = eval('(' + msg + ')')
                result = msg.IsSuccess;
            }
        }
    });
    return result;
}

//编辑数据
function edit(materialid, code, materialcategoryid, name, standard, unit, unitprice,categoryname)
{
    isAdd = false;
    parent.globalShade();
    $("#materialid").val(materialid);
    $("#code").val(code);
    $('#label-active2').text(categoryname);
    catetory_update = materialcategoryid;
    $("#name").val(name);
    $("#standard").val(standard);
    $("#unit").val(unit);
    $("#unitprice").val(unitprice);
    $('.cd-popup').addClass('is-visible');
    $('.aui_icon').html("编辑材料");
   // getCategory('treeCategoryadd', 2);
}

//显示添加页面
function add()
{
    isAdd = true;
    parent.globalShade();
    $("#materialid").val('');
    $("#code").val('');
    $('#label-active2').text('全部');
    catetory_update = '';
    $("#name").val('');
    $("#standard").val('');
    $("#unit").val('');
    $("#unitprice").val('');
    $('.cd-popup').addClass('is-visible');
    $('.aui_icon').html("添加材料");
   // getCategory('treeCategoryadd',2);
}

//查找
function search()
{
    initPagination();
}
//重置
function reset()
{
    $('.label-active').text('全部');
    $("#txtcode").val('');
    $("#txtname").val('');
    $("#txtstandard").val('');
    catetory = '';
    catetory_update = '';
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
                        html += getTree(org.children,type);
                    }
                    html += '</li>';
                });
                if (type==1) {
                    html = '<li><a data-label="全部" href="#" onclick="getId(\'\',\'全部 \',' + type + ')">全部</a> <ul  style="overflow-y: auto; height: 240px;">' + html + '  </ul> </li>';
                }
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
function getTree(orgs,type) {
    var html = ' <ul>';
    for (var i = 0; i < orgs.length; i++) {
        var org = orgs[i];
        html += ' <li><a data-label="' + org.categoryname + '" href="#" onclick="getId(\'' + org.materialcategoryid + '\',\'' + org.categoryname + '\',' +type + ')">' + org.categoryname + '</a>';
        if (org.children != null) {
            html += getTree(org.children, type);
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
            catetory_update = id;
            $('#label-active2').text(category);
            break;
    }
}
//删除
function del(id) {
    confirmInfor("确定要删除该材料编码吗？", function () {
        $.ajax({
            type: "POST",
            url: "../../Controllers/Warehouse/MaterialController.ashx?action=delete",
            dataType: 'json',
            data: { 'materialid': id },
            success: function (msg) {
                if (msg != '') {
                    msg = eval('(' + msg + ')')
                    if (msg.IsSuccess == 'true') {
                        alert("材料编码添加成功！");
                        //刷新table
                        initPagination();
                    }
                    alert(msg.Message);
                }
            }
        });

    }, function () { });
 


}
