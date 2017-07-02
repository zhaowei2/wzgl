var cindex = -1, ctrindex = -1;
var pindex = [];
var user;
var state = GetQueryString('state');
var TASK_CODE = GetQueryString('TASK_CODE');
var SEQ = GetQueryString('SEQ');
var materialapplicationid = GetQueryString('materialapplicationid');
var url = '';
$(function () {
    if (state == 'add') {
        $("#Processnumber").val('CLSQ' + getNowFormatDate());
        getUserData();
        url = '../../Controllers/Check/MaterialApplyController.ashx?action=add';
    } else if (state == 'update') {
        getUserData();
        url = '../../Controllers/Check/MaterialApplyController.ashx?action=update';

        $.ajax({
            type: "POST",
            url: "../../Controllers/Check/MaterialApplyController.ashx?action=GetMaterialapplication",
            dataType: 'json',
            data: { 'materialapplicationid': materialapplicationid },
            success: function (msg) {
                if (msg != '') {
                    msg = eval('(' + msg + ')');
                    if (msg.IsSuccess == 'true') {
                        msg = eval('(' + msg.Message + ')');

                        $.ajax({
                            type: "POST",
                            url: "../../Controllers/Check/MaterialApplyController.ashx?action=GetTask",
                            dataType: 'json',
                            data: { 'TaskCode': msg.processnumber },
                            success: function (msg) {
                                if (msg != '') {
                                    msg = eval('(' + msg + ')');
                                    if (msg.IsSuccess == 'true') {
                                        if (msg.Message == '1') {
                                            $("#submit").css('display', 'none');
                                            $("#save").css('display', 'none');
                                            $("#purpose").attr("disabled", true);
                                            $("#inp1").attr("disabled", true);
                                        }
                                    }
                                }
                            }
                        });
                        $('#materialapplicationid').val(msg.materialapplicationid);
                        $('#Processnumber').val(msg.processnumber);
                        $('#proposer').val(msg.name);
                        $('#Organizationname').val(msg.organizationname);
                        $('#inp1').val(msg.submitdate);
                        $('#purpose').val(msg.useinstructions);
                        $('#proposerid').val(msg.applicantname);
                        $('#Organizationid').val(msg.organizationid);
                        $.each(msg.projects, function (i, mp) {
                            addTbody(window.index, mp);
                        });
                    }

                }
            }
        });

    } else if (TASK_CODE != null) {
        url = '../../Controllers/Check/MaterialApplyController.ashx?action=update';
        $("#save").css('display', 'none');
        $("#purpose").attr("disabled", true);
        $("#inp1").attr("disabled", true);
        $.ajax({
            type: "POST",
            url: "../../Controllers/Check/MaterialApplyController.ashx?action=GetMaterialapplication",
            dataType: 'json',
            data: { 'processnumber': TASK_CODE },
            success: function (msg) {
                if (msg != '') {
                    msg = eval('(' + msg + ')');
                    if (msg.IsSuccess == 'true') {
                        msg = eval('(' + msg.Message + ')');
                        $('#materialapplicationid').val(msg.materialapplicationid);
                        $('#Processnumber').val(msg.processnumber);
                        $('#proposer').val(msg.name);
                        $('#Organizationname').val(msg.organizationname);
                        $('#inp1').val(msg.submitdate);
                        $('#purpose').val(msg.useinstructions);
                        $('#proposerid').val(msg.applicantname);
                        $('#Organizationid').val(msg.organizationid);
                        $.each(msg.projects, function (i, mp) {
                            addTbody(window.index, mp);
                        });

                    }

                }
            }
        });


    }

    getApplicationproject_limits();
    initMaterialGrid();


    getCapitalsource();
});





//获取材料申请项目权限
function getApplicationproject_limits() {
    $.ajax({
        type: "POST",
        url: "../../Controllers/Check/MaterialApplyController.ashx?action=getApplicationproject_limits",
        dataType: 'json',
        success: function (msg) {
            $('#sel').empty();
            if (msg != '') {

                msg = eval('(' + msg + ')');
                if (msg.IsSuccess == 'true') {
                    var limits;

                    msg = eval('(' + msg.Message + ')');
                    if (msg.length > 0) {
                        $.each(msg, function (index, data) {
                            limits += ' <option value="' + data.itemid + '" class="select-cmd">' + data.itemname + '</option>';

                        });
                        $('#sel').append(limits);
                        mold = msg[0].itemid;
                        moldtext = msg[0].itemname;
                        setTypeShow(msg[0].itemid);
                    }
                }


            }
        }
    });
}

//获取单项工程类型权限
function getSingleproject_limits() {
    $.ajax({
        type: "POST",
        url: "../../Controllers/Check/MaterialApplyController.ashx?action=getSingleproject_limits",
        dataType: 'json',
        success: function (msg) {
            $('#epc1').empty();
            $('#sel2').empty();
            if (msg != '') {
                msg = eval('(' + msg + ')');
                if (msg.IsSuccess == 'true') {
                    var limits;

                    msg = eval('(' + msg.Message + ')');
                    if (msg.length > 0) {
                        $.each(msg, function (index, data) {
                            limits += ' <option value="' + data.itemid + '" class="select-cmd">' + data.itemname + '</option>';

                        });
                        $('#sel2').append(limits);
                        medi = msg[0].itemid;
                        meditext = msg[0].itemname;
                        getSingleproject(msg[0].itemid);
                    }
                }

            }
        }
    });
}

//获取单项工程
function getSingleproject(typeid) {
    $.ajax({
        type: "POST",
        url: "../../Controllers/Systems/Singleproject.ashx?action=getListById",
        dataType: 'json',
        data: { 'singleprojecttypeid': typeid, 'singleprojectname': '' },
        success: function (msg) {
            $('#epc1').empty();
            if (msg != '') {
                // msg = eval('(' + msg + ')');
                //   if (msg.IsSuccess == 'true') {
                var limits;

                //       msg = eval('(' + msg.Message + ')');
                $.each(msg, function (index, data) {
                    limits += ' <option value="' + data.singleprojecttypeid + '" class="select-cmd">' + data.singleprojectname + '</option>';

                });
                $('#epc1').append(limits);
                engineering = msg[0].singleprojectid;
                engineeringtext = msg[0].singleprojectname;
                //    }

            }
        }
    });
}

//获取工作面
function getCoalface() {
    $.ajax({
        type: "POST",
        url: "../../Controllers/Systems/Coalface.ashx?action=getList",
        dataType: 'json',
        success: function (msg) {
            $('#epc1').empty();
            if (msg != '') {
                //  msg = eval('(' + msg + ')');
                //  if (msg.IsSuccess == 'true') {
                var limits;

                //      msg = eval('(' + msg.Message + ')');
                $.each(msg, function (index, data) {
                    limits += ' <option value="' + data.Coalfaceid + '" class="select-cmd">' + data.Coalfacecode + '</option>';

                });
                $('#epc1').append(limits);
                engineering = msg[0].Coalfaceid;
                engineeringtext = msg[0].Coalfacecode;
                //  }

            }
        }
    });
}

//获取开掘工程
function getTunnellingproject() {
    $.ajax({
        type: "POST",
        url: "../../Controllers/Systems/Tunnellingproject.ashx?action=getList",
        dataType: 'json',
        success: function (msg) {
            $('#epc1').empty();
            if (msg != '') {
                //  msg = eval('(' + msg + ')');
                //    if (msg.IsSuccess == 'true') {
                var limits;

                //     msg = eval('(' + msg.Message + ')');
                $.each(msg, function (index, data) {
                    limits += ' <option value="' + data.Tunnellingprojectid + '" class="select-cmd">' + data.Tunnellingprojectname + '</option>';

                });
                $('#epc1').append(limits);
                engineering = msg[0].Tunnellingprojectid;
                engineeringtext = msg[0].Tunnellingprojectname;

                // }

            }
        }
    });
}


//获取其它项目名称
function getOtherproject(typeid) {
    $.ajax({
        type: "POST",
        url: "../../Controllers/Systems/OtherprojectController.ashx?action=getList",
        dataType: 'json',
        data: { 'otherprojecttypeid': typeid, 'otherprojectname': '' },
        success: function (msg) {
            $('#epc1').empty();
            if (msg != '') {
                //  msg = eval('(' + msg + ')');
                //    if (msg.IsSuccess == 'true') {
                var limits;

                //     msg = eval('(' + msg.Message + ')');
                $.each(msg, function (index, data) {
                    limits += ' <option value="' + data.otherprojectid + '" class="select-cmd">' + data.otherprojectname + '</option>';

                });
                $('#epc1').append(limits);
                engineering = msg[0].otherprojectid;
                engineeringtext = msg[0].otherprojectname;
                //   }

            }
        }
    });
}

//获取其它项目类型
function getOtherprojectType() {
    $.ajax({
        type: "POST",
        url: "../../Controllers/Systems/Dict.ashx?action=getListById",
        dataType: 'json',
        data: { 'dictid': '285E50DD-A12D-45B6-B0A1-4E47B8D1BFFE' },
        success: function (msg) {
            $('#epc1').empty();
            $('#sel2').empty();
            if (msg != '') {
                //    msg = eval('(' + msg + ')');
                //   if (msg.IsSuccess == 'true') {
                var limits;

                //        msg = eval('(' + msg.Message + ')');
                $.each(msg, function (index, data) {
                    limits += ' <option value="' + data.itemid + '" class="select-cmd">' + data.itemname + '</option>';

                });

                $('#sel2').append(limits);
                medi = msg[0].itemid;
                meditext = msg[0].itemname;
                getOtherproject(msg[0].itemid);
                //  }

            }
        }
    });
}

//获取资金来源
function getCapitalsource() {
    $.ajax({
        type: "POST",
        url: "../../Controllers/Systems/Dict.ashx?action=getListById",
        dataType: 'json',
        data: { 'dictid': '1DC61C52-DB0C-4B52-9F7C-A0F4C99A2BCC' },
        success: function (msg) {
            $('#zhj').empty();
            if (msg != '') {
                //    msg = eval('(' + msg + ')');
                //   if (msg.IsSuccess == 'true') {
                var limits;

                //        msg = eval('(' + msg.Message + ')');
                $.each(msg, function (index, data) {
                    limits += ' <option value="' + data.itemid + '" class="select-cmd">' + data.itemname + '</option>';

                });

                $('#zhj').append(limits);
                capital = msg[0].itemid;
                capitaltext = msg[0].itemname;

                //  }

            }
        }
    });
}

//查询
function search() {
    initMaterialGrid();
}

//重置
function reset() {
    $('#txt_name').val('');
    $('#txt_code').val('');
}

//查询材料列表
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

//计算总价
function calAmount(obj) {
    var num = $(obj).val();
    var unitprice = $(obj).parent().parent().children().eq(4).find("input").val();
    var amount = parseFloat(num) * parseFloat(unitprice);
    $(obj).parent().parent().children().eq(7).find("input").val(amount);
}

//材料DIV列表选中事件
function sureMaterial(materialid, name, code, unitprice, unit) {
    var a = $('#td_' + cindex + '_' + ctrindex).children();
    for (var j = 1; j < a.length; j++) {

        if (a.eq(j).attr("name") != '' && a.eq(j).attr("name") != undefined) {
            if (a.eq(j).attr("name") == "materialid") {
                $(a.eq(j)).find("input").val(materialid);
            } else if (a.eq(j).attr("name") == "name") {
                $(a.eq(j)).find("input").val(name);
            }
            else if (a.eq(j).attr("name") == "code") {
                $(a.eq(j)).find("input").val(code);
            }
            else if (a.eq(j).attr("name") == "unitprice") {
                $(a.eq(j)).find("input").val(unitprice);
            }
            else if (a.eq(j).attr("name") == "unit") {
                $(a.eq(j)).find("input").val(unit);
            }
        }
    }
    $("#cd2").removeClass('is-visible');
    parent.deleteGlobalShade();
}

//切换类型处理方法
function setTypeShow(d) {
    if (d == "083DED4B-D763-475F-AC13-B533307785C3") {
        $("#qit").show();
        $("#gcm").text('其它项目');
        typename = '其它项目';
        getOtherprojectType();
    } else if (d == "0DEC9037-6C7D-41EF-91F9-BFC5B3C04B62") {
        $("#qit").show();
        $("#gcm").text('单项工程');
        typename = '单项工程';
        getSingleproject_limits()
    } else if (d == "4ACACFB4-F189-4E27-A807-0320C56A8BD5") {
        $("#qit").hide();
        typename = '';
        getTunnellingproject();
    } else if (d == "4051825A-BFEF-4C45-AD57-CEF778D47464") {
        $("#qit").hide();
        typename = '';
        getCoalface();
    }
}

//保存
function save() {
    //if (!check()) {
    //    return;
    //}
    submitData('0');
}
//保存数据提交流程
function submit() {
    if (TASK_CODE == null) {
        submitData('1');
    }
    else {
        tij();
    }

}

//审核提交流程
function submitflow() {
    // submitData('0');
    $.ajax({
        type: "POST",
        url: "../../Controllers/Flow/Flow.ashx?action=Audit",
        dataType: 'json',
        data: {
            'TASK_CODE': TASK_CODE,
            'SEQ': SEQ,
            'REASON': $('#document_content__attitude').val()
        },
        success: function (msg) {
            if (msg != '') {

                //if (msg.IsSuccess == 'true') {
                //    msg = eval('(' + msg.Message + ')');

                //}
                alert(msg.Message);
            }
        }
    });
}

//提交数据
function submitData(flowstate) {


    var data = '{"materialapplicationid":"' + $('#materialapplicationid').val() + '","processnumber":"' + $('#Processnumber').val() + '","organizationid":"' + $('#Organizationid').val() + '","applicantname":"' + $('#proposerid').val() + '","useinstructions":"' + $('#purpose').val() + '","submitdate":"' + $('#inp1').val() + '",';

    data += '"projects":[';
    for (var i = 0; i < pindex.length; i++) {
        var capitalsource = '';
        if (TASK_CODE != null && TASK_CODE != '') {
            capitalsource = $('#capital_' + pindex[i]).val()
        }
        data += ' {"xh":0,"materialapplicationprojectid":"","materialapplicationid":"","applicationprojecttype":"' + $('#mold_' + pindex[i]).text() + '","applicationprojectname":"' + $('#engi_' + pindex[i]).text() + '","capitalsource":"' + capitalsource + '" ';
        data += ',"madetail":[';

        //收集列表的数据,在td_index的tbody内
        $("#td_" + pindex[i]).children("tr").each(function () {
            data += '{';
            var a = $(this).children();
            for (var j = 1; j < a.length; j++) {
                var slstr = "materialid,name,unitprice,unit,applicannum,applicanamount";

                if (a.eq(j).attr("name") != '' && a.eq(j).attr("name") != undefined && slstr.indexOf(a.eq(j).attr("name")) > -1) {
                    if (a.eq(j).attr("name") == "materialid" || a.eq(j).attr("name") == "name" || a.eq(j).attr("name") == "unit") {
                        data += '"' + a.eq(j).attr("name") + '":"' + a.eq(j).find("input").val() + '",';
                    } else {
                        data += '"' + a.eq(j).attr("name") + '":' + a.eq(j).find("input").val() + ',';
                    }
                }
            }
            data = data.substring(0, data.length - 1);
            data += '},';
        });
        // {'Materialplanprojectdetailid':'1','Num':'100','Amountmoney':'200','Unitprice':'2'},
        data = data.substring(0, data.length - 1);
        data += ']}';
        if (i != pindex.length - 1) {
            data += ',';
        } else {

        }
    }

    data += ']}';
    $.ajax({
        type: "POST",
        url: url,
        dataType: 'json',
        data: {
            "materialapply": data,
            "flowstate": flowstate
        },
        success: function (msg) {
            msg = eval('(' + msg + ')');

            alert(msg.Message);

        }
    });
}

//获取用户信息
function getUserData() {
    $.ajax({
        type: "POST",
        url: "../../Controllers/Systems/UserController.ashx?action=getLoginUser",
        dataType: 'json',
        //data: { 'rolename': rolename, 'isreuse': isreuse },
        success: function (data) {
            if (data != '') {
                data = eval('(' + data + ')');
                if (data.IsSuccess == 'true') {
                    user = eval('(' + data.Message + ')');
                    $('#proposer').val(user.name);
                    $('#Organizationname').val(user.organizationname);
                    $('#proposerid').val(user.userid);
                    $('#Organizationid').val(user.organizationid);
                }
                else {
                    alert(data.Message);
                }
            }

        }
    });
}

//删除单项工程
function delProj(obj, index) {
    $(obj).parents("tr").remove();
    pindex.pop(index);
}

//添加工程，一个tobdy
function addTbody(index, obj) {
    var tr = "<tr class='tr1'>" +
                    "<td colspan='6'>" +
                    "<div style='width: 100% ; border: 1px solid rgb(180, 204, 238);'>" +
                    "<div style='border-bottom: 1px solid rgb(180, 204, 238);overflow: hidden; padding: 5px 10px '>" +
                    "<div style='display: inline-block;line-height: 35px'>" +
                    "<b>项目类型&nbsp;:&nbsp;</b><span><i style='display:none'id='mold_" + index + "'>" + obj.applicationprojecttype + "</i>" + obj.projecttype + "</span>";
    if (obj.secondtypeid != '') {
        tr += "<span style='margin-left: 25px' id='s2'><b>" + obj.typename + "类型&nbsp;:&nbsp;</b></span><span><i style='display:none' fdddddd='medi_" + index + "'>" + obj.secondtypeid + "</i>" + obj.secondtypename + "</span>";
    }

    tr += "<span style='margin-left: 25px'><b>工程名称&nbsp;:&nbsp;</b></span><span><i style='display:none' id='engi_" + index + "'>" + obj.applicationprojectname + "</i>" + obj.projectname + "</span>";


    if (TASK_CODE != null && TASK_CODE != '') {
        tr += "<div id='capitalDiv_" + index + "'style='margin-left: 25px;display:inline-block; ><span style='display:inline-block'><b>资金来源&nbsp;:&nbsp;</b></span><span style='display:inline-block'> <select id='capital_" + index + "' name='资金来源' class='form-control ' onchange='zhj()'>" +
        "<option value='277428E7-B22A-4E28-BEB7-B460BA589FA9' class='select-cmd'>矿机动</option>" +
        "<option value='E483C545-362D-47CF-AEE3-4E3B22E9F277' class='select-cmd'>专业机动</option>" +
        "<option value='9BF8F1BE-9074-47B1-9123-B3486B65871D' class='select-cmd'>用料单位</option>" +
        "</select></span></div>";
    }


    tr += "</div><button type='button' class='btn btn-info edit'style='float: right;margin-left: 10px'><i></i></button>" +
      "<button style='float: right;' type='button'  class='btn btn_delete delete'  onclick='delProj(this," + index + ")'><i></i>删除</button>" +
      "</div>" +
      "<div style='margin:5px '>" +
      "<div id='formList'> " +
      "<ul style='margin-left: 24px;'>" +
      "<li class='btn btn_newly xingjian' onclick=add(" + index + ") style='margin-right: 5px'><a href='#'><i></i>新建</a> </li>" +
      "<li class='btn btn_delete shanchu'><a href='#'><i></i>删除</a> </li> " +
      "<li class='btn baochun' style='border: 1px solid #ccc; display: none; margin-right: 5px;ss'><a style='color: #101010 ' href='#'>保存</a> </li>" +
      "<li class='btn quxiao' style='border: 1px solid #ccc; display: none;'><a style='color: #101010' href='#'>取消所有</a></li>" +
      "</ul>" +
      "</div>" +
      "<div id='table_gridView' class='dataTable' style='margin-top: 0.5em'>" +
      "<table class='table listDataTable'  id='gridTable_" + index + "' style='border-top:1px solid #ddd;z-index:1;table-layout:auto;' border='0' cellpadding='0' cellspacing='0'> " +
      "<thead>" +
      " <tr class='listDataTh'>" +
      " <td class='listDataThFirstTd' scope='col'> <input type='checkbox' click='selectAll(this.checked)'> </td>" +
      " <td class='listDataThTd' coltext='材料编码'  style='overflow: hidden;'> <input  value='00' type='hidden'> <a style='cursor:pointer' href='#'>材料编码</a> </td>" +
      " <td class='listDataThTd'   style='overflow: hidden;'> <input  value='00' type='hidden'> <a>材料名称</a> </td> " +
      " <td class='listDataThTd' coltext='单价' style='overflow: hidden;'> <input value='00' type='hidden'> <a style='cursor:pointer' href='#'>单价</a> </td> " +
      " <td class='listDataThTd' coltext='数量'  style='overflow: hidden;'> <input  value='00' type='hidden'> <a style='cursor:pointer' href='#' >数量</a> </td>" +
      " <td class='listDataThTd'  style='overflow: hidden;'> <input  value='00' type='hidden'> <a style='cursor:pointer' href='#' >计量单位</a> </td> " +
      "<td class='listDataThTd'   nowrap='nowrap' style='overflow: hidden;'> <input  value='00' type='hidden'> <a style='cursor:pointer' href='#'>金额</a> </td> " +
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
    //
    $("#s3").text(html1);
    projindex = index;
    pindex.push(index);



    $("select option:selected").text();

    $("#editTbody").append(tr);

    if (obj.capitalsource != '') {
        $("#capital_" + index + "  option[value='" + obj.capitalsource + "']").attr("selected", true);
    }

    $('#cj1').removeClass("is-visible");
    //删除工程
    $(".delete").on("click", function () {
        $(this).parents("tr").remove();
    });

    $(".edit").on("click", function () {
        amend = 3;
        $('#cj1').addClass('is-visible');
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
            var hb = (this.parentNode.parentNode.nextElementSibling.firstElementChild.lastElementChild);
            //                    console.log(hb);
            $(hb).empty();
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

        var tdContent;
        var newfont = $('td.component-input').val();
        var newfont1 = $(this.parentNode.parentNode.nextElementSibling.firstElementChild.lastElementChild.lastElementChild);
        var inputList = newfont1.find("input.component-input");
        for (var i = 1; i < inputList.length; i++) {
            console.log(inputList[i].value);
            tdContent += "<td>" + inputList[i].value + "</td>";
            console.log(tdContent);
        }
        if (tdContent) {
            $(tr).html('<td class="listDataThFirstTd" scope="col"> <input type="checkbox" click="selectAll(this.checked)"> </td>' + tdContent + '<td class="listDataThTd" style="width:120px">操作</td>');
        }
        $(tr).find('td').html(newfont);
        $(".grid-button-cancel").hide();
        $(".grid-button-redact").show();
        $(".baochun").hide();
        $(this).nextAll("li").hide();


        // 操作表格
    });
    //    删除
    $(".shanchu").on("click", function () {
        console.log("1");
        var tbo = this.parentNode.parentNode.nextElementSibling.firstElementChild.lastElementChild;
        //console.log(tbo.id);
        //var check = document.getElementsByName("check");
        var check = $(tbo).find("input");
        //console.log(check);
        for (var i = 0; i < check.length; i++) {
            if (check[i].checked == true) {
                //console.log(check[i]);
                $(check[i].parentNode.parentNode).remove();
                /* document.getElementById(tbo.id).deleteRow(i);
                 i--;*/
            }
        }
        $(this).nextAll("li").hide();
    });


    $.each(obj.madetail, function (i, md) {
        addTr(window.index, window.tr_index, md);
    });
    window.index++;
}

//工程明细下添加一行数据
function addTr(index, tr_index, obj) {

    var tr1 = "<tr class='s' id='td_" + index + "_" + tr_index + "'>" +
                 "<td><input  type=\"checkbox\" name=\"check\"/> </td>" +
                   "<td name='materialid' style='display:none'><input  class=\"form-control component-input\"  type=\"text\"  name=\"materialid\" value='" + obj.materialid + "'> </td>" +
                 "<td name='code' ><input  name=\"code\"   class=\"form-control component-input\" readonly type=\"text\" value='" + obj.code + "' style='width: 70%;display: inline-block;' >" +
                 "<a id='liebiao' onclick='dakai(" + index + "," + tr_index + ")' class='btn btn-info' style='position: relative;top: -1px;margin-left: 5px;with:20%;'>列表</a></td>" +
                 "<td name='name' ><input  class=\"form-control component-input\"  type=\"text\" readonly name=\"name\" value='" + obj.name + "' > </td>" +
                 "<td name='unitprice'><input  class=\"form-control component-input\"  type=\"text\" readonly name=\"unitprice\" value='" + obj.unitprice + "' ></td>" +
                 "<td name='applicannum'><input  class=\"form-control component-input\"  type=\"text\"   name=\"applicannum\" value='" + obj.applicannum + "' onchange='calAmount(this)'></td>" +
                 "<td  name='unit'><input  class=\"form-control component-input\"  type=\"text\"  readonly  name=\"unit\" value='" + obj.unit + "' ></td>" +
                 "<td name='applicanamount'><input  class=\"form-control component-input\"  type=\"text\" readonly  name=\"applicanamount\"  value='" + obj.applicanamount + "'  ></td>" +
                 "<td><input type=\"button\" value=\"取消\"  class=\"grid-button-cancel\">" +

                 "</td>" +
                 "</tr>";
    $("#td_" + index).append(tr1);

    window.tr_index++;
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
                    html = '<li><a data-label="全部" href="#" onclick="getId(\'\',\'全部 \',' + type + ')">全部</a> <ul style="overflow-y: auto; height: 204px;">' + html + '  </ul> </li>';
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
            $('#label-active').text(category);
            break;
        case 2:
            catetory_update = id;
            // $('#label-active2').text(category);
            break;
    }
}

function goback() {
    window.location = "materialapplyselect.html";
}
////获取部门列表
//function getOrganization() {
//    $.ajax({
//        type: "POST",
//        url: "../../Controllers/Systems/OrganizationController.ashx?action=getList",
//        dataType: 'json',
//        success: function (msg) {
//            if (msg != '') {
//                $('#orgtree').empty();
//                var html = '';
//                $.each(msg, function (index, org) {
//                    html += ' <li><a data-label="' + org.organizationname + '" data-id="#"  onclick="getId(\'' + org.organizationid + '\',\'' + org.organizationname + '\')">' + org.organizationname + '</a>';
//                    if (org.children != null) {
//                        html += getTree(org.children);
//                    }
//                    html += '</li>';

//                });
//                $('#orgtree').html(html);
//                initTree();
//                $(".tree").treemenu({ delay: 300 }).openActive();
//            }
//        }
//    });
//    $(function () {
//        $(".tree").treemenu({ delay: 300 }).openActive();
//    });
//}
////获取部门树id
//function getId(id, name) {
//    organizationid = id;
//    $('#Organizationid').val(id);
//    $('#orglabel').text(name);
//}
////生成树
//function getTree(orgs) {
//    var html = ' <ul>';
//    for (var i = 0; i < orgs.length; i++) {
//        var org = orgs[i];
//        html += ' <li><a data-label="' + org.organizationname + '" href="#" onclick="getId(\'' + org.organizationid + '\',\'' + org.organizationname + '\')">' + org.organizationname + '</a>';
//        if (org.children != null) {
//            html += getTree(org.children);
//        }
//        html += '</li>';
//    }
//    html += '</ul>';
//    return html;
//}