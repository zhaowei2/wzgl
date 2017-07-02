
var url = '../../Controllers/Plan/Check.ashx?action=addMaterialCheck';
var Purchaseplanid = '', selectTr, Materialcheckandacceptid;

//加载事件
$(function () {
    $('#btn_commit').click(function () {
        save();
    });

    $('#btn_return').click(function () {
        window.location = "bill_of_materialcheck.html";
    });

    Purchaseplanid = GetQueryString("Purchaseplanid");//采购ID
    Materialcheckandacceptid = GetQueryString("Materialcheckandacceptid");//采购ID
    //修改进来的
    if (Purchaseplanid != '' && Purchaseplanid != null && Purchaseplanid != undefined) {
        //获取采购计划的数据填写
        $.ajax({
            type: "POST",
            url: '../../Controllers/Plan/Purchase.ashx?action=getPurchasePlan&Purchaseplanid=' + Purchaseplanid,
            dataType: 'json',
            success: function (msg) {
                var dd = eval(msg);
                if (dd != null) {
                    $('#Purchaseplanid').val(dd.Purchaseplanid);
                    $('#Processnumber').val(dd.Processnumber);
                   
                    for (var i = 0; i < dd.list_detail.length; i++) {
                        addTr(dd.list_detail[i]);
                    }
                } else {
                    alert("获取不到数据");
                }

            },
            error: function (msg) {
                alert(msg.Message);
            }
        });
        getUserInfo();
    }
    //查看验收计划
    if (Materialcheckandacceptid != '' && Materialcheckandacceptid != null && Materialcheckandacceptid != undefined) {

        $('#btn_commit').hide();
        $('.xingjian').hide();
        $('.shanchu').hide();
        //获取采购计划的数据填写
        $.ajax({
            type: "POST",
            url: '../../Controllers/Plan/Check.ashx?action=getMaterialCheck&Materialcheckandacceptid=' + Materialcheckandacceptid,
            dataType: 'json',
            success: function (msg) {
                var dd = eval(msg);
                if (dd != null) {
                    $('#Purchaseplanid').val(dd.Purchaseplanid);
                    $('#Processnumber').val(dd.Processnumber);
                    $('#inp6').val(dd.Checkandacceptdate);
       
                    for (var i = 0; i < dd.list_detail.length; i++) {
                        addTr(dd.list_detail[i]);
                    }
                } else {
                    alert("获取不到数据");
                }

            },
            error: function (msg) {
                alert(msg.Message);
            }
        });
        getUserInfo();
    }
});

function getUserInfo() {
    $.ajax({
        type: "POST",
        url: '../../Controllers/Plan/Plan.ashx?action=getUserOrgName',
        dataType: 'json',
        success: function (msg) {
            var dd = eval(msg);
            if (dd != null) {
                $('#checkpersonname').val(dd.name);
                $('#checkperson').val(dd.userid);
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


//保存
function save() {
    if (!check()) {
        return;
    }
    var data = '[{"Materialcheckandacceptid":"' + $('#Materialcheckandacceptid').val() + '","Purchaseplanid":"' + $('#Purchaseplanid').val() + '","Processnumber":"' + $('#Processnumber').val();
    data += '","Checkandacceptdate":"' + $('#inp6').val() + '","checkandacceptpreson":"' + $('#checkperson').val() + '","remark":"' + $('#remark').val() + '"';
    data += ',"list_detail":[';
    //收集列表的数据,在td_index的tbody内
    $("#gridTable tbody").children("tr").each(function () {
        data += '{';
        var a = $(this).children();
        for (var j = 1; j < a.length; j++) {
            var slstr = "Materialid,Unitprice,Num,Amountmoney,";

            if (a.eq(j).attr("name") != '' && a.eq(j).attr("name") != undefined && slstr.indexOf(a.eq(j).attr("name") + ',') > -1) {
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
            "data": data
        },
        success: function (msg) {
            if (msg.IsSuccess == "true") {
                alert(msg.Message);
                window.location = "bill_of_materialcheck.html";
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
    return true;
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
}

//计算总价
function calAmount(obj) {
    var num = $(obj).val();
    var unitprice = $(obj).parent().parent().children().eq(4).find("input").val();
    var amount = parseFloat(num) * parseFloat(unitprice);
    $(obj).parent().parent().children().eq(7).find("input").val(amount);
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