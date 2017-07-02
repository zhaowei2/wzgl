//解析地址
function request(paras) {
    var url = location.href;
    var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
    var paraObj = {}
    for (i = 0; j = paraString[i]; i++) {
        paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1, j.length);
    }
    var returnValue = paraObj[paras.toLowerCase()];
    if (typeof (returnValue) == "undefined") {
        return "";
    } else {
        return returnValue;
    }
}
//登录按钮点击事件
function logOn() {
    var div = $("#msg");
    var account = $("#txtAccount").val();
    var password = $("#txtPassword").val();
    var code = $("#txtCode").val();
    var flag = "login";
    if (account == "" || password == "") {
        div.html("请输入用户名，密码");
        return;
    }

    var loading = "<img alt='载入中，请稍候...' height='20' width='20' src='Images/loading.gif' />";
    div.html(loading + "载入中，请稍候...");
    var params = { "account": account, "password": password, "code": code, "flag": flag };

    $.ajax({
        type: "post",
        url: "../Controllers/Admin/Login.ashx?flag=login",
        dataType: "json",
        data: $.param(params),
        success: function (msg) {

            if (msg) {
                if (msg.indexOf('false') > 0) {
                    var msg = eval("(" + msg + ")");//转换为json对象

                    div.html('登录失败！错误信息：' + msg.Message);
                }
                else {
                    var msg = eval("(" + msg + ")");//转换为json对象
                    if (msg.IsSuccess == "true") {
                        div.html(msg.Message);
                        var href = unescape(request("ReturnUrl"));
                        if (href == "/" || href == "") {
                            href = "../../Admin/Admin.aspx";
                        }
                        //if ($.browser.msie && ($.browser.version == "10.0"))
                        window.location.replace("../../Admin/Admin.aspx");
                    }
                    else {
                        div.html(msg.Message);
                    }
                }
            }
            else {
                div.html("未载入相关数据，请重试");
            }
        }
    });
}