

var pindex = [];
var url = '../../Controllers/Plan/Plan.ashx?action=addMaterialPlan';
var url1 = '../../Controllers/Flow/Flow.ashx?action=Audit';
var TASK_CODE = '', looktype,SEQ='';
var cindex = -1, ctrindex = -1;
//加载事件
$(function () {

    $('#btnsave').click(function () {
        url = '../../Controllers/Plan/Plan.ashx?action=addMaterialPlan';
        save();
    });
    $('#btn_commit').click(function () {
        url = '../../Controllers/Plan/Plan.ashx?action=addMaterialPlan&type=send';
        //save();
    });
    $("#Processnumber").val('CLJH' + getNowFormatDate());
    $('#btn_return').click(function () {
        window.location = "bill_of_material.html";
    });
   
    TASK_CODE = GetQueryString("TASK_CODE");
    looktype = GetQueryString("looktype");
    SEQ = GetQueryString("SEQ");
    if (TASK_CODE != '' && TASK_CODE != null && TASK_CODE != undefined) {
        $('#btn_commit').hide();
        $('#btnsave').hide();
        $('#inp').hide();
        // alert(looktype);
        var location = 'bill_of_material.html';
        if (looktype == "handle") {
            location = '../handle/handle.html';//经办跟踪进来
        }
        else if (looktype == "historySeach") {
            location = '../historySeach/historySeach.html';//我的代办进来
        } else {
            location = '../commission/commission.html';//我的代办进来
            $('#btn_audit').show();
            $('#btn_back').show();
        }
        $('#btn_return').click(function () {
            window.location = location;
        });

        $('#btnapproval').show();
       
        $('#btn_audit').click(function () {
            //审核通过
             url1 = '../../Controllers/Flow/Flow.ashx?action=Audit';
            $("#tiy").slideToggle("slow");
            //audit();
        });
        $('#btn_back').click(function () {
            $("#tiy").slideToggle("slow");
            //打回操作
             url1 = '../../Controllers/Flow/Flow.ashx?action=Back';
        });

        $('#btn_act_committo').click(function () {
            auditOrBack();//审核通过/打回
        });

        initPage(TASK_CODE);
       
    } else {
        $('#btn_act_committo').click(function () {
            save();//提交
        });
        getUserInfo();
    }

   
    getOrganization();

    
});

function getUserInfo() {
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
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "";
    var seperator2 = "";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
    return currentdate;
}

//保存
function save() {
    if (!check()) {
        return;
    }
    var data = '[{"Materialplanid":"' + $('#Materialplanid').val() + '","Processnumber":"' + $('#Processnumber').val() + '","Plantype":"' + $('#Plantype').val() + '","Submitdate":"' + $('#inp1').val() + '","Organizationid":"' + $('#Organizationid').val() + '","Applicantid":"' + $('#Applicantid').val() + '","Materialexplain":"' + $('#Materialexplain').val() + '"';// + ']';
    data += ',"Date":"' + $('#inp2').val() + '","list_project":[';
    //收集工程的数据
    for (var i = 0; i < pindex.length; i++) {
        data += ' {"Materialplanprojectid":"","Projectname":"' + $('#proj' + pindex[i]).text() + '","Applicationdescription":"' + $('#app' + pindex[i]).text() + '","Aogdata":"' + $('#aogdata' + pindex[i]).text() + '" ';
        data += ',"list_detail":[';

        //收集列表的数据,在td_index的tbody内
        $("#td_" + pindex[i]).children("tr").each(function () {
            data += '{';
            var a = $(this).children();
            for (var j = 1; j < a.length; j++) {
                var slstr = "Materialid,Name,Unitprice,Unit,Num,Amountmoney";

                if (a.eq(j).attr("name") != '' && a.eq(j).attr("name") != undefined && slstr.indexOf(a.eq(j).attr("name")) > -1) {
                    if (a.eq(j).attr("name") == "Materialid" || a.eq(j).attr("name") == "Name" || a.eq(j).attr("name") == "Unit") {
                        data += '"' + a.eq(j).attr("name") + '":"' + a.eq(j).text() + '",';
                    } else {
                        data += '"' + a.eq(j).attr("name") + '":' + a.eq(j).text() + ',';
                    }
                }
            }
            data = data.substring(0, data.length - 1);
            data += '}';
        });
        // {'Materialplanprojectdetailid':'1','Num':'100','Amountmoney':'200','Unitprice':'2'},
        data += ']}';
        if (i != pindex.length - 1) {
            data += ',';
        } else {

        }
    }

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
                window.location = "bill_of_material.html";
            }
            else {
                alert(msg.Message);
            }
        }
    });
}


function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

function initPage(TASK_CODE) {
    $.ajax({
        type: "POST",
        url: '../../Controllers/Plan/Plan.ashx?action=getMaterialPlan&TASK_CODE=' + TASK_CODE,
        dataType: 'json',
        success: function (msg) {
            if (msg != null && msg != "") {
                var dd = eval(msg);
                $('#Materialplanid').val(dd.Materialplanid);
                $('#Processnumber').val(dd.Processnumber);
                $('#Plantype').val(dd.Plantype);
                $('#inp1').val(dd.Submitdate);
                $('#Organizationid').val(dd.Organizationid);
                $('#orglabel').text(dd.OrgName);

                $('#Applicantname').val(dd.Applicantname);
                $('#Materialexplain').val(dd.Materialexplain);
                $('#inp2').val(dd.Date);

                for (var i = 0; i < dd.list_project.length; i++) {
                    addTbody(i, dd.list_project[i]);
                    for (var j = 0; j < dd.list_project[i].list_detail.length; j++) {
                        addTr(i, j, dd.list_project[i].list_detail[j]);
                    }
                }
            }
            $('.delete').hide();
            $('.shanchu').hide();
            $('.xingjian').hide();
            $('.edit').hide();

            //data += ',"Date":"' + $('#inp2').val() + '","list_project":[';
        },
        error: function (msg) {
            alert(msg.Message);
        }
    });


}

//添加工程，一个tobdy
function addTbody(index, obj) {
    var tr = "<tr class='tr1'>" +
                     "<td colspan='6'>" +
                     "<div style='width: 100% ; border: 1px solid rgb(180, 204, 238);'>" +
                     "<div style='border-bottom: 1px solid rgb(180, 204, 238);overflow: hidden; padding: 5px 10px '>" +
                     "<div style='display: inline-block;line-height: 35px'>工程名称：<span id='proj" + index + "'>" + obj.Projectname + "&nbsp;&nbsp;</span>日期：<span id='aogdata" + index + "'style='margin-left: 10px'>" + obj.Aogdata + "</span></div>" +
                     "<button type='button' class='btn btn-info edit'style='float: right;margin-left: 10px'><i></i></button>" +
                     "<button style='float: right;' type='button'  class='btn btn_delete delete'><i></i>删除</button>" +
                     "</div>" +
                     "<div style='border-bottom: 1px solid rgb(180, 204, 238); line-height: 35px;padding: 4px 10px'>说明：<span id='app" + index + "'>" + obj.Applicationdescription + "</span></div>" +
                     "<div style='margin:5px '>" +
                     "<div id='formList'> " +
                     "<ul style='margin-left: 24px;'>" +
                     "<li class='btn btn_newly xingjian' onclick=add(" + index + ") style='margin-right: 5px'><a href='#'><i></i>新建</a> </li>" +
                     "<li class='btn btn_delete shanchu' ><a href='#'><i></i>删除</a> </li> " +
                     "<li class='btn baochun' style='border: 1px solid #ccc; display: none; margin-right: 5px;ss'><a style='color: #101010 ' href='#'>保存</a> </li>" +
                     "<li class='btn quxiao' style='border: 1px solid #ccc; display: none;'><a style='color: #101010' href='#'>取消所有</a></li>" +
                     "</ul>" +
                     "</div>" +
                     "<div id='table_gridView' class='dataTable' style='margin-top: 0.5em'>" +
                     "<table class='table listDataTable' id='gridTable_" + index + "' style='border-top:1px solid #ddd;z-index:1;table-layout:auto;' border='0' cellpadding='0' cellspacing='0'> " +
                     "<thead>" +
                     " <tr class='listDataTh'>" +
                     " <td class='listDataThFirstTd' scope='col' > <input type='checkbox' click='selectAll(this.checked)'> </td>" +
                     " <td class='listDataThTd' coltext='材料编码'   style='overflow: hidden;'> <input  value='00' type='hidden'> <a style='cursor:pointer' href='#'>材料编码</a> </td>" +
                     " <td class='listDataThTd'   style='overflow: hidden;'> <input  value='00' type='hidden'> <a>材料名称</a> </td> " +
                     " <td class='listDataThTd' coltext='单价' style='overflow: hidden;'  > <input value='00' type='hidden'> <a style='cursor:pointer' href='#'>单价</a> </td> " +
                     " <td class='listDataThTd' coltext='数量'  style='overflow: hidden;' > <input  value='00' type='hidden'> <a style='cursor:pointer' href='#' >数量</a> </td>" +
                     " <td class='listDataThTd'  style='overflow: hidden;'> <input  value='00' type='hidden'> <a style='cursor:pointer' href='#' >计量单位</a> </td> " +
                     "<td class='listDataThTd'   nowrap='nowrap' style='overflow: hidden;' > <input  value='00' type='hidden'> <a style='cursor:pointer' href='#'>金额</a> </td> " +
                     "<td class='listDataThTd' style='width:120px'>操作</td> " +
                     "</tr> " +
                     "</thead> " +
                     "<tbody  id='td_" + index + "' class='dataBody'> </tbody>" +
                     "</table>" +
                     "</div>" +
                     "</div>" +
                     "</div>" +
                     "</td>" +
                     "</tr>";
    var html1 = $("#text1").val();

    $("#s3").text(html1);

    pindex.push(index);
    $("#editTbody").append(tr);
    index++;
  //  $('.cd-popup').remove();
    //删除工程
    $(".delete").on("click", function () {
        $(this).parents("tr").remove();
    });


    //    添加
    var type = 0;
    $(".xingjian").on("click", function () {

        $(this).siblings().show();

        $(".grid-button-redact").hide();
        //取消当前行
        $(".grid-button-cancel").on("click", function () {
            $(this).parent().parent().remove();
            $(".shanchu").nextAll("li").hide();
            type = 1;
        });
        //取消
        $(".quxiao").on("click", function () {
            $("#dataBody").empty();
            $(".baochun").hide();
            $(".grid-button-redact").show();
            $(this).hide();
        });


    });
    //    保存
    $(".baochun").on("click", function () {
        var tr = (this.parentNode.parentNode.nextElementSibling.firstElementChild.lastElementChild.lastElementChild);
        var tbo = (this.parentNode.parentNode.nextElementSibling.firstElementChild.lastElementChild);
        console.log(tr);
        //                console.log(tbo);
        //                $('.component-input').each(function(){
        var tdContent;
        var newfont = $('td.component-input').val();
        var newfont1 = $(this.parentNode.parentNode.nextElementSibling.firstElementChild.lastElementChild.lastElementChild);
        var inputList = newfont1.find("input.component-input");
        for (var i = 0; i < inputList.length; i++) {
            console.log(inputList[i].value)
            tdContent += "<td name='" + inputList[i].name + "'>" + inputList[i].value + "</td>";
        }
        if (tdContent) {
            $(tr).html('<td class="listDataThFirstTd" scope="col"> <input type="checkbox" click="selectAll(this.checked)"> </td>' + tdContent + '<td class="listDataThTd" style="width:120px">操作</td>');
        }
        $(tr).find('td').html(newfont);
        console.log($(tr).find('td'));
        $(".grid-button-cancel").hide();
        $(".grid-button-redact").show();
        $(".baochun").hide();
        $(this).nextAll("li").hide();


        // 操作表格
    });

    //    删除
    $(".shanchu").on("click", function () {
        var tbo = (this.parentNode.parentNode.nextElementSibling.firstElementChild.lastElementChild);
        var check = $(tbo).find("input");
        for (var i = 0; i < check.length; i++) {
            if (check[i].checked) {
                //document.getElementById(tbo.id).deleteRow(i);
                //i--;
                $(check[i].parentNode.parentNode).remove();
            }
        }
        $(this).nextAll("li").hide();
    });
}

//工程明细下添加一行数据
function addTr(index, tr_index, obj) {

    var tr1 = "<tr class='s' id='td_" + index + "_" + tr_index + "'>" +
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
    $("#td_" + index).append(tr1);

    $(this).siblings().show();

    $(".grid-button-cancel").hide();
}

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
       // $(".tree").treemenu({ delay: 300 }).openActive();
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
                                              + ' <a href="javaScript:void(0)"title="' + val.categoryname + '" >' + val.categoryname + '</a>'
                                              + ' </td>'
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
    var a = $('#td_' + cindex + '_' + ctrindex).children();
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
    $("#cd2").removeClass('is-visible');
    parent.deleteGlobalShade();
}

//计算总价
function calAmount(obj) {
    var num = $(obj).val();
    var unitprice = $(obj).parent().parent().children().eq(4).find("input").val();
    var amount = parseFloat(num) * parseFloat(unitprice);
    $(obj).parent().parent().children().eq(7).find("input").val(amount);
}
//删除单项工程
function delProj(obj, index) {
    $(obj).parents("tr").remove();
    pindex.pop(index);
}
//编辑单项工程
function editProj(index) {
    projtype = 'edit';
    $('#text_projname').val($('#proj' + index).text());
    $('#inp3').val($('#aogdata' + index).text());
    $('#txt_sm').val($('#app' + index).text());
    $('#cd1').addClass("is-visible");
    projindex = index;
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
function check() {
    if ($('#Processnumber').val() == "") {
        alert("申请单号不能为空");
        return false;
    }
    if ($('#Applicantname').val() == "") {
        alert("申请人不能为空");
        return false;
    }
    if ($('#Organizationid').val() == "") {
        alert("请选择部门");
        return false;
    }
    if ($('#Plantype').val() == "") {
        alert("请选择计划类型");
        return false;
    }
    return true;
}

//加载流程审核数据
function LoadFlowData() {
    $.ajax({
                url: "../../Controllers/Plan/Plan.ashx?action=getFlowDetails",
                type: "post",
                data: {
                    TASK_CODE: TASK_CODE
                },
                success: function (data) {
                    $('#Table1 tbody').empty();

                    var row = "";
                    $.each(data, function (key, val) {
                        //alert(val.TASK_ID);
                        row += '  <tr class="listDataTr">'
                                    + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                    + ' <a href="javaScript:void(0)"title="' + val.STEP_CODE + '" >' + val.STEP_CODE + '</a>'
                                    + ' </td>'
                                    + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                    + ' <a href="javaScript:void(0)"title="' + val.STEP_NAME + '" >' + val.STEP_NAME + '</a>'
                                    + ' </td>'
                                     + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                    + ' <a href="javaScript:void(0)"title="' + val.SEQ + '" >' + val.SEQ + '</a>'
                                    + ' </td>'
                                    + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                    + ' <a href="javaScript:void(0)" title=' + GetStepStatusName(val.STATUS) + '>' + GetStepStatusName(val.STATUS) + '</a>'
                                    + ' </td>'
                                    + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                    + ' <a href="javaScript:void(0)" title=' + val.REVIEW_EMP_NAME + '>' + val.REVIEW_EMP_NAME + '</a>'
                                    + ' </td>'
                                    + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                    + ' <a href="javaScript:void(0)" title=' + val.REVIEW_TIME + '>' + val.REVIEW_TIME + '</a>'
                                    + ' </td>'
                                  + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                    + ' <a href="javaScript:void(0)" title=' + val.REMARK + '>' + val.REMARK + '</a>'
                                    + ' </td>'

                                    + ' </tr>';
                    });
                    $("#Table1 tbody").append(row);
                }
            });
    $.ajax({
        url: "../../Controllers/Plan/Plan.ashx?action=getFlowDetailsLog",
        type: "post",
        data: {
            TASK_CODE: TASK_CODE
        },
        success: function (data) {
            $('#Table2 tbody').empty();

            var row = "";
            $.each(data, function (key, val) {
                //alert(val.TASK_ID);
                row += '  <tr class="listDataTr">'
                            + ' <td class="listDataTrTd" style="word-break: break-all;">'
                            + ' <a href="javaScript:void(0)"title="' + val.STEP_CODE + '" >' + val.STEP_CODE + '</a>'
                            + ' </td>'
                            + ' <td class="listDataTrTd" style="word-break: break-all;">'
                            + ' <a href="javaScript:void(0)"title="' + val.STEP_NAME + '" >' + val.STEP_NAME + '</a>'
                            + ' </td>'
                             + ' <td class="listDataTrTd" style="word-break: break-all;">'
                            + ' <a href="javaScript:void(0)"title="' + val.SEQ + '" >' + val.SEQ + '</a>'
                            + ' </td>'
                            + ' <td class="listDataTrTd" style="word-break: break-all;">'
                            + ' <a href="javaScript:void(0)" title=' + val.REVIEW_EMP_NAME + '>' + val.REVIEW_EMP_NAME + '</a>'
                            + ' </td>'
                            + ' <td class="listDataTrTd" style="word-break: break-all;">'
                            + ' <a href="javaScript:void(0)" title=' + val.REVIEW_TIME + '>' + val.REVIEW_TIME + '</a>'
                            + ' </td>'
                          + ' <td class="listDataTrTd" style="word-break: break-all;">'
                            + ' <a href="javaScript:void(0)" title=' + val.REMARK + '>' + val.REMARK + '</a>'
                            + ' </td>'

                            + ' </tr>';
            });
            $("#Table2 tbody").append(row);
        }
    });

}


function auditOrBack()
{
    var reson=$('#document_content__attitude').val();
    if (reson == undefined || reson == "") {
        alert("请输入意见");
        return;
    }
    $.ajax({
        type: "POST",
        url: url1,
        dataType: 'json',
        data:{TASK_CODE:TASK_CODE,SEQ:SEQ,REASON:$('#document_content__attitude').val()},
        success: function (msg) {
            var dd = eval(msg);
            if (dd.IsSuccess= "true") {
                //window.location = "../commission/commission.html";
                alert(dd.Message);
            } else {
                alert("操作失败");
            }
        }
    });
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