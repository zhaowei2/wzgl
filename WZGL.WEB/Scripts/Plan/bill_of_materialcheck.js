
$(function () {
    initGrid();
});

//加载页面
function initGrid() {

    var html = '';
    //获取总页数
    var ss = "";
    $.ajax({
        type: "POST",
        url: "../../Controllers/Plan/Check.ashx?action=getMaterialCheckList&type=getCount",
        dataType: 'json',
        data: { checkname: $('#txt_name').val() },
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
                            url: "../../Controllers/Plan/Check.ashx?action=getMaterialCheckList",
                            type: "post",
                            data: {
                                "page": pageindex,
                                "rows": 20,
                                checkname: $('#txt_name').val()
                            },
                            success: function (data) {
                                $('#gridTable tbody').empty();

                                var row = "";
                                $.each(data.rows, function (key, val) {
                                    //alert(val.TASK_ID);
                                    row += '  <tr class="listDataTr">'

                                              + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                              + ' <a href="javaScript:void(0)"title="' + val.Checkandacceptdate + '" >' + val.Checkandacceptdate + '</a>'
                                              + ' </td>'
                                              + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                              + ' <a href="javaScript:void(0)" title=' + val.CheckandacceptpresonName + '>' + val.CheckandacceptpresonName + '</a>'
                                              + ' </td>'
                                              + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                              + ' <a href="javaScript:void(0)" title=' + val.Remark + '>' + val.Remark + '</a>'
                                              + ' </td>'
                                               + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                              + ' <a href="javaScript:void(0)" onclick="look(\'' + val.Materialcheckandacceptid + '\')">查看</a>'
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

//查询
function tsearch()
{
    initGrid();
}
//重置
function treset() {
    $('#txt_name').val('');
}

function look(Materialcheckandacceptid )
{
    window.location = "add_materialcheck.html?Materialcheckandacceptid=" + Materialcheckandacceptid;
}