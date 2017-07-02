var user;
var html;
var nameVerifyInfor = true;
var passVerifyInfor = true;
var passWordVerifyInfor = true;
var phoneVerify = true;
function formVerfitverify() {
var roleuserName, roleuserNameTip, userPsd, passwordTip, verifyPsd, passwordTip1, contactInformation, contactInformationTip;
roleuserName = document.getElementById("roleuserName");
roleuserNameTip = document.getElementById("roleuserNameTip");
    if (roleuserName.value) {
        //roleuserNameTip.className = " control-success";
        //roleuserNameTip.firstChild.nodeValue = "用户名正确."
        roleuserNameTip.innerHTML = "";
        nameVerifyInfor = true;
    } else {
        //roleuserNameTip.className = "control-error";
        roleuserNameTip.innerHTML = "用户名不能为空."
        nameVerifyInfor = false;
    }
userPsd1 = document.getElementById("userPsd");
//console.log(userPsd1);
passwordTip = document.getElementById("passwordTip");
    if (userPsd1.value == false) {
        passwordTip.innerHTML = "";
        passVerifyInfor = true;
    }
    else if (userPsd1.value && /^\w{8,12}$/.test(userPsd1.value)) {
        passVerifyInfor = true;
        passwordTip.innerHTML = "";
        verifyPsd = document.getElementById("verifyPsd");
        passwordTip1 = document.getElementById("passwordTip1");
        if (verifyPsd.value == false) {
            passwordTip1.innerHTML = "";
        } else if (verifyPsd.value && (verifyPsd.value == userPsd1.value)) {
            passWordVerifyInfor = true;
            passwordTip1.innerHTML = "";
        } else if (verifyPsd.value != userPsd1.value) {
            passwordTip1.innerHTML = "新密码和确认密码不一样";
            passWordVerifyInfor = false;
            //errorMess();
        };
    } else {
        passwordTip.innerHTML = "请输入新密码8至12位数字或字母";
        passVerifyInfor = false;
    }
//    密码确认

var userPsdold = document.getElementById("userPsdold");
//    联系方式验证
contactInformation = document.getElementById("contactInformation");
contactInformationTip = document.getElementById("contactInformationTip");
    if (contactInformation.value == false) {
        contactInformationTip.innerHTML = "联系方式不能为空."
        phoneVerify = false;
        //errorMess();
    } else if ((/^1[3|4|5|8][0-9]{9}$|^[0-9]{3,4}-[0-9]{8}$/).test(contactInformation.value)) {
        phoneVerify = true;
        contactInformationTip.innerHTML = "";
    } else {
        contactInformationTip.innerHTML = "请输入正确的手机号码或电话号码."
        phoneVerify = false;
        //errorMess();
};
}
//错误信息
function errorMess() {
    $("#toast-container").show();
    $(".toast-progress").animate({ width: 300 }, "slow");
    $(".toast-progress").animate({ width: 0 }, 3000, function () {
        $("#toast-container").hide();
    });
    $(".toast-error").hover(
        function () {
            //光标悬停时执行
            $(".toast-progress").stop(true);
            $(".toast-progress").hide();
            $(".toast-progress").animate({ width: 300 }, "slow");
        },
        function () {
            $(".toast-progress").show();
            $(".toast-progress").animate({ width: 300 }, "slow");
            $(".toast-progress").animate({ width: 0 }, 3000, function () {
                $("#toast-container").hide();
            });
        }
    );
};
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
                    $('#imghead').attr('src', user.icons);
                    $('#org').val(user.organizationname);
                    $('#duty').val(user.job);
                    $('#userAccount').val(user.username);
                    $('#roleuserName').val(user.name);
                    $('#contactInformation').val(user.phone);
                    $('#userPhoto').attr("src", user.icons);
                }
                else {
                    alert(data.Message);
                }
            }

        }
    });
}

//保存用户基本信息
function save() {
    formVerfitverify();
    if (nameVerifyInfor) {
        if (phoneVerify) {
            if (passVerifyInfor) {
                if (passWordVerifyInfor) {

                } else {
                    errorMess();
                    return;
                }
            } else {
                errorMess();
                return;
            }
        } else {
            errorMess();
            return;
        }
    } else {
        errorMess();
        return;
    }
    var ss = $("#imghead")[0].src;
    var password='';
    if ($('#userPsdold').val() != '' && $('#userPsd').val() != '' && $('#verifyPsd').val() != '') {
        password = $('#userPsd').val();
       
        if (hex_md5($('#userPsdold').val()).toUpperCase() != user.password) {
            alert('原密码输入不正确！');
            return;
        }
    }
    $.ajax({
        type: "POST",
        url: "../../Controllers/Systems/UserController.ashx?action=updateUser",
        dataType: 'json',
        data: { 'userid': user.userid, 'name': $('#roleuserName').val(), 'Icon': $("#imghead")[0].src, 'phone': $('#contactInformation').val(), 'password': password },
        success: function (data) {
            if (data != '') {
                data = eval('(' + data + ')');
                    alert(data.Message);
                    
            }

        }
    });
}

//注销登录
function loginOut() {
    $.ajax({
        type: "POST",
        url: "../../Controllers/Systems/LoginController.ashx?action=logOut",
        dataType: 'json',
        success: function (data) {
            if (data != '') {
                data = eval('(' + data + ')');
                if (data.IsSuccess=='true') {
                    window.location.replace("../login.html");
                }
                else {
                    alert(data.Message);
                }
             


            }

        }
    });
}

//获取当前用户权限
function getUserRole() {
    $.ajax({
        type: "POST",
        url: "../../Controllers/Systems/SystemlimitsController.ashx?action=getUserRoleList",
        dataType: 'json',
        success: function (data) {
            if (data != '') {
                html = '';
                data = data.sort(compare('orders'));
                 $.each(data, function (index, limit) {
                     //if (limit.limitname == '仓库管理' || limit.limitname == '资金管理') {
                     //    return true;
                     //}
                     //排序
                   
                    if (index==0) {
                        html += ' <li id="' + limit.limitid + '" class="zero-menu-item" >';
                    }
                    else{
                        html += ' <li id="' + limit.limitid + '" class="zero-menu-item" style="display:none;">';
                    }


                    html += '<ul>' +
                        '<li class="pL10">' + limit.limitname + '</li>';

                    if (limit.children != null) {
                        limit.children = limit.children.sort(compare('orders'))
                        setLimitTree(limit.children);
                    }


                    html +=' </ul>'+
                          ' </li>';
                });

               // html += '</ul>';

                 $('#test0').html(html);

                 var htmlf = ' <ul class="functionManagemen">';

              
                $.each(data, function (index, limit) {
                    //if (limit.limitname == '仓库管理' || limit.limitname == '资金管理') {
                    //    return true;
                    //}
                    if (index==0) {
                        htmlf +=  '<li class="active">';
                    }
                    else{
                        htmlf +=  '<li class="">';
                    }
                   
                    htmlf += '<a menu_id="' + limit.limitid + '" class="foot-menu-name">' + limit.limitname + '</a> </li>';
                       
                });
                htmlf += '</ul>';
                $('#asideFooter').html(htmlf);
            }

        }
    });
}


//生成功能树
function setLimitTree(limits) {
    $.each(limits, function (index, limit) {
        html += " <li class='first-menu-item'>";
        if (limit.children !=null) {
            if (index==0) {
         html +=  " <a href='#"+limit.limitid+"' class='first-menu-name active'><span class='icon-main-menu'><img src='../Images/2.png' /></span><h5>"+limit.limitname+"</h5></a>";
         }
        else {
            html += " <a href='#" + limit.limitid + "' class='first-menu-name'><span class='icon-main-menu'><img src='../Images/2.png' /></span><h5>" + limit.limitname + "</h5></a>";
            }
             html +=  "   <ul style='display:block;' class='second-menu' >";
        }
        else {
            html += "   <ul style='display:block;' class='second-menu second-menu-pad' >";
        }
       

        if (limit.children != null) {
            limit.children = limit.children.sort(compare('orders'))
            $.each(limit.children,function(indexc,limitc){

                html +=  "<li class='second-menu-item'>"+
                         "<a class='second-menu-content' href='#" + limitc.limitid + "'>" + limitc.limitname + "</a>" +
                         "</li>";
            });              
        }
        else {
            html += "<li class='second-menu-item'>" +
                        "<a class='second-menu-content' href='#" + limit.limitid + "'>" + limit.limitname + "</a>" +
                        "</li>";
        }
          html +=  "  </ul>"+
            " </li>";

    });

   
}


