
var url = '../../Controllers/Plan/Purchase.ashx?action=addPurchasePlan';
var TASK_CODE = '', Purchaseplanid = '', ctrindex = -1, selectTr, type = 'add', ids='';
//加载事件
$(function () {
    url = '../../Controllers/Plan/Purchase.ashx?action=addPurchasePlan';
    $('#btn_save').click(function () {

       // save();
    });
    $('#btn_commit').click(function () {
        if (type == 'edit')
        {
            url = '../../Controllers/Plan/Plan.ashx?action=editMaterialPlan&type=send';
        } else if (type == 'add')
        {
            url = '../../Controllers/Plan/Plan.ashx?action=addMaterialPlan&type=send';
        }
      //  save();
    });
    $('#btn_return').click(function () {
        window.location = "bill_of_purchaseplan.html";
    });
    
    $("#Processnumber").val('CGJH' + getNowFormatDate());//任务单号

    TASK_CODE = GetQueryString("TASK_CODE");//任务单号
    Purchaseplanid = GetQueryString("Purchaseplanid");//采购ID
    ids = GetQueryString("ids");//材料计划ID串
    //TASK_CODE有值，就是通过流程点进来看的
    if (TASK_CODE != '' && TASK_CODE != null && TASK_CODE != undefined) {
        $('#btn_commit').hide();
        $('#btnsave').hide();
        $('#inp').hide();
        $('#btnapproval').show();
        url = '../../Controllers/Plan/Purchase.ashx?action=editPurchasePlan';
        $.ajax({
            type: "POST",
            url: '../../Controllers/Plan/Purchase.ashx?action=getPurchasePlan&TASK_CODE=' + TASK_CODE,
            dataType: 'json',
            success: function (msg) {
                var dd = eval(msg);
                if (dd != null) {
                    $('#Purchaseplanid').val(dd.Purchaseplanid);
                    $('#Processnumber').val(dd.Processnumber);
                    $('#Purchaseplantype').val(dd.Purchaseplantype);
                    $('#inp1').val(dd.Submitdate);
                    $('#inp2').val(dd.Data);
                    $('#inp3').val(dd.Aogdate);

                    $('#Organizationid').val(dd.Organizationid);
                    $('#Applicantname').val(dd.Applicantname);
                    $('#Applicantid').val(dd.Applicantid);
                    
                    $('#Remark').val(dd.Remark);
                    $('#orglabel').text(dd.Organizationname);
                    for (var i = 0; i < dd.list_detail.length; i++) {
                        addTr(dd.list_detail[i]);
                    }
                    $('.delete').hide();
                    $('.shanchu').hide();
                    $('.xingjian').hide();
                    $('.edit').hide();
                } else {
                    alert("获取不到数据");
                }
                //data += ',"Date":"' + $('#inp2').val() + '","list_project":[';
            },
            error: function (msg) {
                alert(msg.Message);
            }
        });
    }
    //修改进来的
    if (Purchaseplanid != '' && Purchaseplanid != null && Purchaseplanid != undefined) {
        type = 'edit';
        url = '../../Controllers/Plan/Purchase.ashx?action=editPurchasePlan';
        $.ajax({
            type: "POST",
            url: '../../Controllers/Plan/Purchase.ashx?action=getPurchasePlan&Purchaseplanid=' + Purchaseplanid,
            dataType: 'json',
            success: function (msg) {
                var dd = eval(msg);
                if (dd != null) {
                    $('#Purchaseplanid').val(dd.Purchaseplanid);
                    $('#Processnumber').val(dd.Processnumber);
                    $('#Purchaseplantype').val(dd.Purchaseplantype);
                    $('#inp1').val(dd.Submitdate);
                    $('#inp2').val(dd.Data);
                    $('#inp3').val(dd.Aogdate);
                    
                    $('#Organizationid').val(dd.Organizationid);
                    $('#Applicantname').val(dd.Applicantname);
                    $('#Applicantid').val(dd.Applicantid);
                    
                    $('#Remark').val(dd.Remark);
                    $('#orglabel').text(dd.Organizationname);
                    for (var i = 0; i < dd.list_detail.length; i++) {
                        addTr( dd.list_detail[i]);                      
                    }
                } else {
                    alert("获取不到数据");
                }
                //data += ',"Date":"' + $('#inp2').val() + '","list_project":[';
            },
            error: function (msg) {
                alert(msg.Message);
            }
        });
    }
    if (ids != '' && ids != null && ids != undefined)
    {
        type = 'add';
        getUserInfo();
        //url = '../../Controllers/Plan/Purchase.ashx?action=getPlanDetail';
        $.ajax({
            type: "POST",
            url: '../../Controllers/Plan/Plan.ashx?action=getPlanDetailList&ids=' + ids,
            dataType: 'json',
            success: function (msg) {
                //var dd = eval(msg);
                if (msg != null) {
                    for (var i = 0; i < msg.length; i++) {
                        addTr(msg[i]);
                    }
                } else {
                    alert("获取不到数据");
                }
            },
            error: function (msg) {
                alert(msg.Message);
            }
        });
    }
    getOrganization();
});

function getUserInfo()
{
    $.ajax({
        type: "POST",
        url: '../../Controllers/Plan/Plan.ashx?action=getUserOrgName',
        dataType: 'json',
        success: function (msg) {
            var dd = eval(msg);
            if (dd != null) {
                $('#Applicantname').val(dd.name);
                $('#Applicantid').val(dd.userid);
                $('#Organizationid').val(dd.organizationid);
                $('#orglabel').text(dd.organizationname);
                
            } else {
                alert("获取不到用户数据");
            }
        }
    });
}
//材料明细下添加一行数据
function addTr(obj) {

    var tr1 = "<tr class='s' >" +
                   "<td name=''><input type=\"checkbox\" name=\"check\" /></td>" +
                   "<td name='Materialid' style='display:none'>" + obj.Materialid + "</td>" +
                   "<td name='Code'>" + obj.Code + "</td>" +
                   "<td name='Name' >" + obj.Name + "</td>" +
                   "<td name='Unitprice'>" + obj.Unitprice + "</td>" +
                   "<td name='Num'>" + obj.Num + "</td>" +
                   "<td name='Unit'>" + obj.Unit + "</td>" +
                   "<td name='Amountmoney'>" + obj.Amountmoney + "</td>" +
                   "<td ><input type=\"button\" value=\"取消\"  class=\"grid-button-cancel\">" +
                   "</td>" +
                   "</tr>";
    $("#gridTable").append(tr1);
    $(this).siblings().show();
    $(".grid-button-cancel").hide();
}

//------------------------------------------------------------------------------------------------------------
//获取部门列表
function getOrganization() {
    $.ajax({
        type: "POST",
        url: "../../Controllers/Systems/OrganizationController.ashx?action=getList",
        dataType: 'json',
        success: function (msg) {
            if (msg != '') {
                $('#orgtree').empty();
                var html = '';
                $.each(msg, function (index, org) {
                    html += ' <li><a data-label="' + org.organizationname + '" data-id="#"  onclick="getId(\'' + org.organizationid + '\',\'' + org.organizationname + '\')">' + org.organizationname + '</a>';
                    if (org.children != null) {
                        html += getTree(org.children);
                    }
                    html += '</li>';

                });
                $('#orgtree').html(html);
                initTree();
                $(".tree").treemenu({ delay: 300 }).openActive();
            }
        }
    });
    $(function () {
        //$(".tree").treemenu({ delay: 300 }).openActive();
    });
}
//获取部门树id
function getId(id, name) {
    organizationid = id;
    $('#Organizationid').val(id);
    $('#orglabel').text(name);
}
//生成树
function getTree(orgs) {
    var html = ' <ul>';
    for (var i = 0; i < orgs.length; i++) {
        var org = orgs[i];
        html += ' <li><a data-label="' + org.organizationname + '" href="#" onclick="getId(\'' + org.organizationid + '\',\'' + org.organizationname + '\')">' + org.organizationname + '</a>';
        if (org.children != null) {
            html += getTree(org.children);
        }
        html += '</li>';
    }
    html += '</ul>';
    return html;
}

//------------------------------------------------------------------------------------------------------------
function initMaterialGrid() {
    getCategory('lxtree', 1);
    var html = '';
    //获取总页数
    var ss = "";
    $.ajax({
        type: "POST",
        url: "../../Controllers/Plan/Plan.ashx?action=getMaterialList&type=getCount",
        dataType: 'json',
        data: { caterotyid: $('#caterotyid').val(), searchtype: $('#txt_type').val(), namecode: $('#txt_namecode').val() },
        success: function (msg) {
            if (msg != '') {
                if (msg.IsSuccess == "true") {
                    // 创建分页
                    $("#tunnlPagination").pagination(parseInt(msg.Count), {
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
                                caterotyid: $('#caterotyid').val(),
                                searchtype: $('#txt_type').val(),
                                namecode: $('#txt_namecode').val()
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
function sureMaterial(materialid, name, code, unitprice, unit) {
    var a = selectTr.children();
    for (var j = 1; j < a.length; j++) {

        if (a.eq(j).attr("name") != '' && a.eq(j).attr("name") != undefined) {
            if (a.eq(j).attr("name") == "Materialid") {
                $(a.eq(j)).find("input").val(materialid);
            } else if (a.eq(j).attr("name") == "Name") {
                $(a.eq(j)).find("input").val(name);
            }
            else if (a.eq(j).attr("name") == "Code") {
                $(a.eq(j)).find("input").val(code);
            }
            else if (a.eq(j).attr("name") == "Unitprice") {
                $(a.eq(j)).find("input").val(unitprice);
            }
            else if (a.eq(j).attr("name") == "Unit") {
                $(a.eq(j)).find("input").val(unit);
            }
        }
    }
    $(".cd-popup").removeClass('is-visible');
    parent.deleteGlobalShade();
}

//计算总价
function calAmount(obj) {
    var num = $(obj).val();
    var unitprice = $(obj).parent().parent().children().eq(4).find("input").val();
    var amount = parseFloat(num) * parseFloat(unitprice);
    $(obj).parent().parent().children().eq(7).find("input").val(amount);
}


//保存
function save() {
    if (!check()) {
        return;
    }
    var data = '[{"Purchaseplanid":"' + $('#Purchaseplanid').val() + '","Processnumber":"' + $('#Processnumber').val();
    data += '","Purchaseplantype":"' + $('#Purchaseplantype').val() + '","Submitdate":"' + $('#inp1').val() + '","Organizationid":"' + $('#Organizationid').val();
    data += '","Applicantid":"' + $('#Applicantid').val() + '","Remark":"' + $('#Remark').val() + '","Aogdate":"' + $('#inp3').val() + '"';// + ']';
    data += ',"Data":"' + $('#inp2').val() + '","list_detail":[';
        //收集列表的数据,在td_index的tbody内
    $("#gridTable tbody").children("tr").each(function () {
            data += '{';
            var a = $(this).children();
            for (var j = 1; j < a.length; j++) {
                var slstr = "Materialid,Unitprice,Num,Amountmoney,";

                if (a.eq(j).attr("name") != '' && a.eq(j).attr("name") != undefined && slstr.indexOf(a.eq(j).attr("name")+',') > -1) {
                    if (a.eq(j).attr("name") == "Materialid") {
                        data += '"' + a.eq(j).attr("name") + '":"' + a.eq(j).text() + '",';
                    } else {
                        data += '"' + a.eq(j).attr("name") + '":' + a.eq(j).text() + ',';
                    }
                }
            }
            data = data.substring(0, data.length - 1);
            data += '},';
          
    });
    //data = data.substring(0, data.length - 1);
    data += ']}]';
    $.ajax({
        type: "POST",
        url: url,
        dataType: 'json',
        data: {
            "data": data,"ids":ids
        },
        success: function (msg) {
            if (msg.IsSuccess == "true") {
                alert(msg.Message);
                window.location = "bill_of_purchaseplan.html";
            }
            else {
                alert(msg.Message);
            }
        }
    });
}


function check() {
    //if ($('#Processnumber').val() == "") {
    //    alert("申请单号不能为空");
    //    return false;
    //}
    //if ($('#Applicantname').val() == "") {
    //    alert("申请人不能为空");
    //    return false;
    //}
    //if ($('#Organizationid').val() == "") {
    //    alert("请选择部门");
    //    return false;
    //}
    //if ($('#Plantype').val() == "") {
    //    alert("请选择计划类型");
    //    return false;
    //}
    return true;
}

//查询
function search() {
    initMaterialGrid();
}
//重置
function reset() {
    $('#caterotyid').val('');
    $('#txt_lx').text('请选择类型');
    $('#txt_namecode').val('');
}

//加载材料类型
function getCategory(name, type) {
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
                        html += getTree(org.children, type);
                    }
                    html += '</li>';

                });
                if (type == 1) {
                    html = '<li><a data-label="全部" href="#" onclick="getId(\'\',\'全部 \',' + type + ')">全部</a> <ul style="height:204px;overflow-y:auto;">' + html + '  </ul> </li>';
                }
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
        html += ' <li><a data-label="' + org.categoryname + '" href="#" onclick="getId(\'' + org.materialcategoryid + '\',\'' + org.categoryname + '\',' + type + ')">' + org.categoryname + '</a>';
        if (org.children != null) {
            html += getTree(org.children, type);
        }
        html += '</li>';
    }
    html += '</ul>';
    return html;
}
//获取下拉树的id
function getId(id, category, type) {
    switch (type) {
        case 1:
            $('#caterotyid').val(id);
            $('#txt_lx').text(category);
            break;
        case 2:
            catetory_update = id;
            // $('#label-active2').text(category);
            break;
    }
}