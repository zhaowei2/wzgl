/// <reference path="E:\WZGL\WZGL.WEB\home/homePage.html" />
//登录按钮点击事件
function logOn() {
    if($('#userName')!==' '&&$('#userName')!==null&&$('#passWord')!==' '&&$('#passWord')!==null){
        window.location.replace('home/homePage.html')
    }
    ////test();
    //$.ajax({
    //    type: "POST",
    //    url: "../../Controllers/Systems/LoginController.ashx?action=login",
    //    dataType: 'json',
    //    data: { 'userName': $('#userName').val(), 'passWord': $('#passWord').val() },
    //    success: function (msg) {
    //        if (msg != '') {
    //            msg = eval('(' + msg + ')');
    //            if (msg.IsSuccess == "true") {
    //                window.location.replace("home/homePage.html");
    //            }
    //            $('#verifyInfor').html(msg.Message);
    //
    //        }
    //
    //    },
    //    error: function (XMLHttpRequest, textStatus, errorThrown) {
    //        alert(XMLHttpRequest.status);
    //        alert(XMLHttpRequest.readyState);
    //        alert(textStatus);
    //    }
    //});

}

//function test() {
//    $.ajax({
//        type: "POST",
//        url: "../../Controllers/Check/MaterialApplyController.ashx?action=add",
//        dataType: 'json',
//        //data: { 'userName': $('#userName').val(), 'passWord': $('#passWord').val() },
//        success: function (msg) {
//            if (msg != '') {
//              var uu=  JSON.stringify(msg);
//              $.ajax({
//                  type: "POST",
//                  url: "../../Controllers/Check/MaterialApplyController.ashx?action=add",
//                  dataType: 'json',
//                  data: { 'tt': uu },
//                  success: function (msg) {
//                      if (msg != '') {
//                          var uu = JSON.stringify(msg);
//                          var p = 0;
//
//                      }
//
//                  },
//                  error: function (XMLHttpRequest, textStatus, errorThrown) {
//                      alert(XMLHttpRequest.status);
//                      alert(XMLHttpRequest.readyState);
//                      alert(textStatus);
//                  }
//              });
//
//            }
//
//        },
//        error: function (XMLHttpRequest, textStatus, errorThrown) {
//            alert(XMLHttpRequest.status);
//            alert(XMLHttpRequest.readyState);
//            alert(textStatus);
//        }
//    });
//
//
//
//    //var uu=' ['+
//    //'{\"madetail\":[{\"xh\":0,\"materialapplicationdetailid\":\"1\",\"materialapplicationprojectid\":\"1\",\"materialid\":\"1\",\"unitprice\":0,\"applicannum\":1,\"applicanamount\":1,\"approvenum\":1,\"approveamount\":1},'+
//    //               '{\"xh\":0,\"materialapplicationdetailid\":\"2\",\"materialapplicationprojectid\":\"2\",\"materialid\":\"2\",\"unitprice\":0,\"applicannum\":2,\"applicanamount\":2,\"approvenum\":2,\"approveamount\":2}],' +
//    //               '\"xh\":0,\"materialapplicationprojectid\":\"1\",\"materialapplicationid\":\"1\",\"applicationprojecttype\":\"1\",\"applicationprojectname\":\"1\",\"capitalsource\":\"1\"},' +
//    //'{\"madetail\":[{\"xh\":0,\"materialapplicationdetailid\":\"1\",\"materialapplicationprojectid\":\"1\",\"materialid\":\"1\",\"unitprice\":0,\"applicannum\":1,\"applicanamount\":1,\"approvenum\":1,\"approveamount\":1},' +
//    //               '{\"xh\":0,\"materialapplicationdetailid\":\"2\",\"materialapplicationprojectid\":\"2\",\"materialid\":\"2\",\"unitprice\":0,\"applicannum\":2,\"applicanamount\":2,\"approvenum\":2,\"approveamount\":2}],' +
//    //               '\"xh\":0,\"materialapplicationprojectid\":\"1\",\"materialapplicationid\":\"1\",\"applicationprojecttype\":\"1\",\"applicationprojectname\":\"1\",\"capitalsource\":\"1\"}' +
//    //']';
//
//}