


$(function () {
    initGrid();

    //    删除
    $(".btn_delete").on("click", function () {
        var check = document.getElementsByName("check");
        if (check.length == 0) {
            alert("请选中要删除的数据");
            return;
        }

        //  $(this).nextAll("li").hide();
        //initGrid();
    });

    $(".btn_newly").on("click", function () {
        window.location = "add_purchaseplan.html";
    });

});

//加载页面
function initGrid() {

    var html = '';
    //获取总页数
    var ss = "";
    $.ajax({
        type: "POST",
        url: "../../Controllers/Plan/Purchase.ashx?action=getPurchasePlanList&type=getCount",
        dataType: 'json',
        data: { processnumber: $('#txt_processnumber').val(), Purchaseplantype: $('#txt_Purchaseplantype').val() },
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
                            url: "../../Controllers/Plan/Purchase.ashx?action=getPurchasePlanList",
                            type: "post",
                            data: {
                                "page": pageindex,
                                "rows": 20,
                                processnumber: $('#txt_processnumber').val(),
                                Purchaseplantype: $('#txt_Purchaseplantype').val()
                            },
                            success: function (data) {
                                $('#gridTable tbody').empty();

                                var row = "";
                                $.each(data.rows, function (key, val) {
                                    //alert(val.TASK_ID);
                                    row += '  <tr class="listDataTr">'

                                          + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                              + ' <input type="checkbox" name="check"   onclick="checkThis(this)" id="' + val.Purchaseplanid + '">'
                                              + ' </td>'
                                              + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                              + ' <a href="javaScript:void(0)"title="' + val.Processnumber + '" >' + val.Processnumber + '</a>'
                                              + ' </td>'
                                              + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                              + ' <a href="javaScript:void(0)" title=' + val.Purchaseplantype + '>' + val.Purchaseplantype + '</a>'
                                              + ' </td>'
                                              + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                              + ' <a href="javaScript:void(0)" title=' + val.Data + '>' + val.Data + '</a>'
                                              + ' </td>'
                                              + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                              + ' <a href="javaScript:void(0)" title=' + val.Organizationname + '>' + val.Organizationname + '</a>'
                                              + ' </td>'
                                              + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                              + ' <a href="javaScript:void(0)" title=' + val.Applicantname + '>' + val.Applicantname + '</a>'
                                              + ' </td>'
                                              + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                              + ' <a href="javaScript:void(0)" title=' + val.Submitdate + '>' + val.Submitdate + '</a>'
                                              + ' </td>'
                                              + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                              + ' <a href="javaScript:void(0)" title=' + val.Aogdate + '>' + val.Aogdate + '</a>'
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
                                              + ' <a href="javaScript:void(0)" title=' + val.Remark + '>' + val.Remark + '</a>'
                                              + ' </td>'
                                              + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                              + ' <a href="javaScript:void(0)" onclick="edit(\'' + val.Purchaseplanid + '\')">编辑</a>'
                                               + '&nbsp; <a href="javaScript:void(0)" onclick="del(\'' + val.Purchaseplanid + '\')">删除</a>'
                                                + '&nbsp; <a href="javaScript:void(0)" onclick="check(\'' + val.Purchaseplanid + '\')">验收</a>'
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
function edit(Purchaseplanid) {
    window.location = "add_purchaseplan.html?Purchaseplanid=" + Purchaseplanid;
}
function del(Purchaseplanid) {
    if (confirm("确认要删除该采购计划吗?")) {

        $.ajax({
            type: "POST",
            url: "../../Controllers/Plan/Purchase.ashx?action=del",
            dataType: 'json',
            data: { Purchaseplanid: Purchaseplanid },
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
    var vale = obj.checked;
    $("input[type='checkbox']").each(function () {

        if (this.checked == true) {
            this.checked = false;
        }
    });
    if (vale) {
        obj.checked = true;
    } else {
        obj.checked = false;
    }

}

//查询
function tsearch() {
    initGrid();
}
//重置
function reset() {
    $('#txt_processnumber').val('');
    $('#txt_Purchaseplantype').val('');

}
//验收
function check(Purchaseplanid)
{
    window.location = "add_materialcheck.html?Purchaseplanid=" + Purchaseplanid;
}