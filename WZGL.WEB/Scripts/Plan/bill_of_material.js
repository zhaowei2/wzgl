

$(function () {
    initGrid();
    var type = 0
    $(".xingjian").on("click", function () {
        window.location = "add_material.html";
    });
    $(".faqi").on("click", function () {
        var check = document.getElementsByName("check");
        var ids = '';
        var len = 0;
        for (var i = 0; i < check.length; i++) {
            if (check[i].checked) {
                len++;
            }
        }
        if (len < 1) {
            alert("请选择需要生成的材料计划");
            return;
        }
        for (var i = 0; i < check.length; i++) {
            if (check[i].checked) {
                var childr = $(check[i]).parent().parent().children();
                if ($(childr[7]).text().replace(/(^\s*)|(\s*$)/g, "") == "已生成") {
                    alert("只能发起处于未发起状态的计划！");
                    return;
                }
                ids += check[i].id + ',';
            }

            window.location = 'add_purchaseplan.html?ids=' + ids;
        }


    });

    //    删除
    $(".shanchu").on("click", function () {
        var check = document.getElementsByName("check");
        if (check.length == 0) {
            alert("请选中要删除的数据");
            return;
        }
        if (confirm("确认要删除该工程吗?")) {
            for (var i = 0; i < check.length; i++) {
                if (check[i].checked) {
                    $.ajax({
                        type: "POST",
                        url: "../../Controllers/Plan/Plan.ashx?action=del",
                        dataType: 'json',
                        data: { Materialplanid: check[i].id },
                        success: function (msg) {
                            if (msg != '') {
                                if (msg.IsSuccess == "true") {
                                    document.getElementById('dataBody').deleteRow(i - 1);
                                    alert(msg.Message);
                                    return;
                                } else {
                                    alert(msg.Message);
                                    return;
                                }
                            } else {
                                alert('服务区交互失败');
                            }
                        }
                    });

                }
            }
        }
        //  $(this).nextAll("li").hide();
        //initGrid();
    });

});
function initGrid() {

    var html = '';
    //获取总页数
    var ss = "";
    $.ajax({
        type: "POST",
        url: "../../Controllers/Plan/Plan.ashx?action=getMaterialPlanList&type=getCount",
        dataType: 'json',
        data: {
            processnumber: $('#txt_processnumber').val(),
            plantype: $('#txt_Plantype').val()
        },
        success: function (msg) {
            if (msg != '') {
                if (msg.IsSuccess == "true") {
                    // 创建分页
                    $("#tunnlPagination").pagination(parseInt(msg.Count), {
                        num_edge_entries: 1, //边缘页数
                        num_display_entries: 10, //主体页数
                        callback: pageselectCallback,
                        items_per_page: 20, //每页显示1项
                        prev_text: "上一页",
                        next_text: "下一页"
                    });
                    //  };

                    function pageselectCallback(page_index, jq) {
                        //  alert("调用");
                        var pageindex = page_index + 1;
                        $.ajax(
                        {
                            url: "../../Controllers/Plan/Plan.ashx?action=getMaterialPlanList",
                            type: "post",
                            data: {
                                "page": pageindex,
                                "rows": 20,
                                processnumber: $('#txt_processnumber').val(),
                                plantype: $('#txt_Plantype').val()
                            },
                            success: function (data) {
                                $('#gridTable tbody').empty();

                                var row = "";
                                $.each(data.rows, function (key, val) {
                                    //alert(val.TASK_ID);
                                    row += '  <tr class="listDataTr">'

                                          + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                              + ' <input type="checkbox" name="check"   onclick="checkThis(this)" id="' + val.Materialplanid + '">'
                                              + ' </td>'
                                              + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                              + ' <a href="javaScript:void(0)"title="' + val.Processnumber + '" >' + val.Processnumber + '</a>'
                                              + ' </td>'
                                              + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                              + ' <a href="javaScript:void(0)"title="' + val.Plantype + '" >' + val.Plantype + '</a>'
                                              + ' </td>'
                                              + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                              + ' <a href="javaScript:void(0)" title=' + val.Submitdate + '>' + val.Submitdate + '</a>'
                                              + ' </td>'
                                              + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                              + ' <a href="javaScript:void(0)" title=' + val.OrgName + '>' + val.OrgName + '</a>'
                                              + ' </td>'
                                              + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                              + ' <a href="javaScript:void(0)" title=' + val.Applicantname + '>' + val.Applicantname + '</a>'
                                              + ' </td>'
                                              + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                              + ' <a href="javaScript:void(0)" title=' + val.ADD_EMPNAME + '>' + val.ADD_EMPNAME + '</a>'
                                              + ' </td>'

                                              + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                              + ' <a href="javaScript:void(0)" title=' + (val.Status == "0" ? "未生成" : "已生成") + '>' + (val.Status == "0" ? "未生成" : "已生成") + '</a>'
                                              + ' </td>'
                                                 + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                              + ' <a href="javaScript:void(0)" title=' + GetFlowStatusName(val.FlowStatus) + '>' + GetFlowStatusName(val.FlowStatus) + '</a>'
                                              + ' </td>'
                                              + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                              + ' <a href="javaScript:void(0)" title=' + val.SEQ + '>' + val.SEQ + '</a>'
                                              + ' </td>'
                                              + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                              + ' <a href="javaScript:void(0)" title=' + val.STEP_NAME + '>' + val.STEP_NAME + '</a>'
                                              + ' </td>'
                                                + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                              + ' <a href="javaScript:void(0)" title=' + val.Materialexplain + '>' + val.Materialexplain + '</a>'
                                              + ' </td>'
                                              + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                              + ' <a href="javaScript:void(0)" onclick="tedit(\'' + val.Materialplanid + '\')">编辑</a>'
                                              + '&nbsp; <a href="javaScript:void(0)" onclick="tdel(\'' + val.Materialplanid + '\')">删除</a>'
                                              + ' </td>'
                                              + ' </tr>';
                                });
                                $("#gridTable tbody").append(row);
                            }
                        })
                        return false;
                    }
                }
            }
        }
    });

}

//编辑
function tedit(Materialplanid) {
    window.location = "edit_material.html?Materialplanid=" + Materialplanid;
}
//删除
function tdel(Materialplanid) {
    if (confirm("确认要删除该计划吗?")) {
        $.ajax({
            type: "POST",
            url: "../../Controllers/Plan/Plan.ashx?action=del",
            dataType: 'json',
            data: { Materialplanid: Materialplanid },
            success: function (msg) {
                msg = eval('(' + msg + ')')
                if (msg != '') {
                    if (msg.IsSuccess == "true") {
                        initGrid();
                        return;
                    } else {
                        alert(msg.Message);
                        return;
                    }
                } else {
                    alert('服务区交互失败');
                }
            }
        });
    }
}
function checkThis(obj) {
    //var vale = obj.checked;
    //$("input[type='checkbox']").each(function () {

    //    if (this.checked == true) {
    //        this.checked = false;
    //    }
    //});
    //if (vale) {
    //    obj.checked = true;
    //} else {
    //    obj.checked = false;
    //}

}

//查询
function tsearch() {
    initGrid();
}
//重置
function reset() {
    $('#txt_processnumber').val('');
}

function sortTable(value) {

}