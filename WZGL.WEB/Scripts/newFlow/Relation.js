var url;//添加删除修改url
var pagesize = 20;
//加载方法
$(function () {
    //客户信息列表初始化数据
    loadData();
});

function loadData() {
    $('#coalmines tbody').empty();
    $.ajax(
      {
          url: "../../Controllers/Flow/Flow_Define.ashx?action=getList",
          type: "post",
          success: function (data) {
              var row = "";
              $.each(data.rows, function (key, val) {
                  row += '  <tr class="listDataTr">'
                         + ' <td class="listDataTrTd" style="word-break: break-all;">'
                         + ' <a href="javaScript:void(0)" title=' + val.DEFINE_NAME + '>' + val.DEFINE_NAME + '</a>'
                         + ' </td>'
                         + ' <td class="listDataTrTd" style="word-break: break-all;">'
                        + ' <a href="javaScript:void(0)" onclick="New(\'' + val.DEFINE_CODE + '\',\'' + val.DEFINE_NAME + '\',\'' + val.TYPE_CODE + '\',\'' + val.ADD_EMP + '\',\'' + val.REMARK + '\',\'' + val.URL + '\')">实例</a>'
                         + ' </td>'
                         + ' </tr>';
              })

              $("#coalmines tbody").append(row);
          }
      })
}
function New(DEFINE_CODE, DEFINE_NAME, TYPE_CODE, ADD_EMP, REMARK, URL) {
    var data = { DEFINE_CODE: DEFINE_CODE, DEFINE_NAME: DEFINE_NAME, TYPE_CODE: TYPE_CODE, ADD_EMP: ADD_EMP, REMARK: REMARK, URL: URL };
    $.ajax(
      {
          type: "POST",
          url: '../../Controllers/Flow/Flow_Define.ashx?action=Add',
          data:data,
          dataType: 'json',
          success: function (msg) {
              alert(msg.Message);
          },
          error: function (msg)
          {
              alert("111111");
          }
      })
}