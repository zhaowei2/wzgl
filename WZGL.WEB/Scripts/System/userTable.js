//    <!-- 点击显示搜索-->
var compileState;
var choose_section = true;
var dutyInforMation = true;
var nameAffirm = true;//姓名
var affirm = true;//联系方式
var userAccountaffirm = true;//账号
var passwordAffirm = true;//密码
var verifyPsdAffirm = true;//确认密码
var ThistrContent;
var atThis;
//新增保存部门id
var organizationid = '';
//查询保存部门id
var selectorganizationid = '';
var userid;
var state;
var pagesize = 15;
$(function () {
    // getUserData();
    initPagination();
    getRole();
    getOrganization();
   // alert(utf8to16(base64decode(parent.user.password)));
   
    //formVerfitverify();
});
//部门title外发光
//alert("shifo")
//confirmInfor("是否删除",function(){},function(){})
    //点击显示新建弹出框
$('#searchBtn').on("click", function (searchContent) {
    if ($('#searchContent').css("display") == "none") {
        $('#searchContent').slideDown();
} else {
        $('#searchContent').slideUp();
}
});
$('.btn_vessel').on('click', 'li', function () {
    if (this.className.indexOf('btn_newly') !== -1) {
        parent.globalShade();
        compileState = 1;
        $('#userTitle').html('新建用户');
        $('#newShade').addClass("is-visible");
        $("#roleuserName").val('');
        $("#userAccount").val('').attr("disabled", false);
        $("#userPsd").val('');
        $("#duty").val('');
        $("#verifyPsd").val('');
        $('#imghead').attr("src", "../../Images/cross_uploading.png");
        $("#contactInformation").val('');
        $("#cardDrop a:first-child span").html("请选择部门");
        $('#role option')[0].selected = true;
        state = 1;
    }
});
// ph_popup_close点击关闭弹出窗
$('#newShade').on('click', 'div', function () {
    if (this.className == 'newShade_lay') {
        parent.deleteGlobalShade();
        
    }
});
$('#phPopUpClose').on('click', function () {
     parent.deleteGlobalShade();
     $('#newShade').removeClass("is-visible");
});
$('.btn_return').on('click', function (event) {
    $(".cd-popup").removeClass('is-visible');
     parent.deleteGlobalShade();
   
});
$("#userview").on('click', 'a', function () {
    if (this.className.indexOf("amend") !== -1) {
        parent.globalShade();
        compileState = 2;
        organizationid=  $(this.parentNode.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling).attr("data_id");//当前修改的dat_id
        $("#userPsd").val('');
        $("#verifyPsd").val('');
        userid = this.parentNode.parentNode.id;//获取tr的id
        atThis = this;
        $('#userTitle').html('编辑用户');
        $('#newShade').addClass("is-visible");
        state = 2;
        ThistrContent = $(this).parent().parent().html();
        var imgUrl = $(this.parentNode.parentNode.firstChild.firstChild).attr('src');
        $('#imghead').attr("src", imgUrl);
        var sectionNameCon = (this.parentNode.parentNode.firstElementChild.nextElementSibling).textContent;//获取用户名
        $("#roleuserName").val(sectionNameCon);
        var userAccount = (this.parentNode.parentNode.firstElementChild.nextElementSibling.nextElementSibling).textContent;//获取用户账号
        $("#userAccount").val(userAccount);
        $("#userAccount").attr("disabled","true");
        var duty = this.parentNode.previousElementSibling.previousElementSibling.previousElementSibling.textContent;//获得职务
        $('#duty').val(duty);
        var contactInformation = this.parentNode.previousElementSibling.textContent;//获取联系方式
        $("#contactInformation").val(contactInformation);
        //console.log(this.parentNode.previousElementSibling.previousElementSibling);
        //职务
        var data_id = $(this.parentNode.previousElementSibling.previousElementSibling).attr("data_id");
        $('#role option[value="' + data_id + '"]')[0].selected = true;
      
        var sectionContent = (this.parentNode.parentNode.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling).textContent;
        var aList = $("#cardDrop a:first-child span").html(sectionContent);

        //var NextchirdernList = this.parentNode.parentNode.firstElementChild.nextElementSibling.className;
        //$(this).parent().parent().remove();
    } else if (this.className.indexOf("delete") !== -1) {
        var atPreThis = this;
        confirmInfor("是否删除", function () {
            $(atPreThis.parentNode.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling).attr("data_id");//当前删除的dat_id
            userid = atPreThis.parentNode.parentNode.id;//获取tr的id
            //$(this).parent().parent().remove();
            delUser(atPreThis);
        }, function () { })
        
    }
});
//表单验证
//新建用户

//修改用户
//function formNull(){
//    var userPsd1 = document.getElementById("userPsd");
//    var verifyPsd = document.getElementById("verifyPsd");
//    var verifyPsd = document.getElementById("verifyPsd");
//    var passwordTip = document.getElementById("passwordTip");
//    var passwordTip1 = document.getElementById("passwordTip1");
 
//    //userPsd1.onblur = function () {
//    //用户密码
//    if (userPsd1.value == false) {
//        passwordAffirm = true;}
//  else if (/^\w{8,12}$/.test(userPsd1.value)) {
//        passwordTip.innerHTML = "";
//        passwordAffirm = true;
//    } else {
//      passwordTip.innerHTML = "请输入8至12位数字或字母";
//        passwordAffirm = false;
//    }
//    if (userPsd1.value!= false && userPsd1.value != verifyPsd.value) {
//        passwordTip1.innerHTML = "两次密码输入不同";
//        verifyPsdAffirm = false;
//    }
//    //};
//    //    密码确认
//    //verifyPsd.onblur = function () {
//    if (verifyPsd.value == false) {
//        verifyPsdAffirm = true;
//    } else if (verifyPsd.value && (verifyPsd.value == userPsd1.value)) {
//        passwordTip1.innerHTML = "";
//        verifyPsdAffirm = true;
//    } else if (verifyPsd.value != userPsd1.value) {
//        //passwordTip1.className = "control-error";
//        passwordTip1.innerHTML = "两次密码输入不同"
//        verifyPsdAffirm = false;
//    }
    

//}
//function formVerfitverifyPass(){
//    // 用户密码
//    var userPsd1 = document.getElementById("userPsd");
//    var verifyPsd = document.getElementById("verifyPsd");
//    var verifyPsd = document.getElementById("verifyPsd");
//    var passwordTip = document.getElementById("passwordTip");
//    var passwordTip1 = document.getElementById("passwordTip1");
 
//    //userPsd1.onblur = function () {
//    //用户密码
//        if (userPsd1.value == false) {
//            passwordTip.innerHTML = "密码不能为空.";
//            passwordAffirm = false;
//        } else if (/^\w{8,12}$/.test(userPsd1.value)) {
//            passwordTip.innerHTML = "";
//            passwordAffirm = true;
//        } else {
//            passwordTip.innerHTML = "请输入密码8至12位数字或字母.";
//            passwordAffirm = false;
//        }
//        if (userPsd1.value!= false && userPsd1.value != verifyPsd.value) {
//            passwordTip1.innerHTML = "两次密码输入不同";
//            verifyPsdAffirm = false;
//        }
//    //};
//    //    密码确认
    
   
//    //verifyPsd.onblur = function () {
//        if (verifyPsd.value == false) {
//            passwordTip1.innerHTML = "确认密码不能为空";
//            verifyPsdAffirm = false;
//        } else if (verifyPsd.value && (verifyPsd.value == userPsd1.value)) {
//            passwordTip1.innerHTML = "";
//            verifyPsdAffirm = true;
//        } else if (verifyPsd.value != userPsd1.value) {
//            //passwordTip1.className = "control-error";
//            passwordTip1.innerHTML = "两次密码输入不同"
//            verifyPsdAffirm = false;
//        }
    
//    };
//}
function formVerfitverify() {
   var roleuserName = document.getElementById("roleuserName");
   var roleuserNameTip = document.getElementById("roleuserNameTip");
    //roleuserName.onblur = function () {
        if (roleuserName.value) {
            roleuserNameTip.innerHTML = "";
            nameAffirm = true;
        } else {
            roleuserNameTip.innerHTML = "用户名不能为空."
            nameAffirm = false;
        }
    //};
    //用户账号
   var userAccount = document.getElementById("userAccount");
   var userAccountTip = document.getElementById("userAccountTip");
    //userAccount.onblur = function () {
        if (userAccount.value == false) {
            userAccountaffirm = false;
            userAccountTip.innerHTML = "账号由字母或数字组成."
        }else if (/^\w*$/.test(userAccount.value)) {
            userAccountTip.innerHTML = "";
            userAccountaffirm = true;
        } else {
            userAccountTip.innerHTML = "账号只能为数字或字母或下划线."
            userAccountaffirm = false;
        }
    //};
    //职务
    //    var dutyuser = document.getElementById("duty");
    //    var dutyErrMes = document.getElementById("duty_err");
    ////职务
    //    if (dutyuser.value == false) {
    //        dutyErrMes.innerHTML = "职务不能为空";
    //        dutyInforMation = false;
    //    } else if (dutyuser.value) {
    //        dutyErrMes.innerHTML = "";
    //        dutyInforMation = true;
    //    }
    
    //    联系方式验证
    var contactInformation = document.getElementById("contactInformation");
    var contactInformationTip = document.getElementById("contactInformationTip");
    //contactInformation.onblur = function () {
    if (contactInformation.value == false) {
            affirm = true;;
            contactInformationTip.innerHTML = "";
        } else if ((/^1[3|4|5|8][0-9]{9}$|^[0-9]{3,4}-[0-9]{8}$/).test(contactInformation.value)) {
            contactInformationTip.innerHTML = "";
            affirm = true;
        } else {
            contactInformationTip.innerHTML = "请输入正确的手机号码或电话号码."
            affirm = false;
        }
    //};
        var sectionHtml = $("#cardDrop a:first-child span").html();
        var sectionHtmlmess = document.getElementById("chosse_section");
        if (sectionHtml == "请选择部门") {
            sectionHtmlmess.innerHTML = "请选择部门";
            choose_section = false;
        } else {
            choose_section = true;
            sectionHtmlmess.innerHTML = "";
        }
}
//
//function btnSubmit(e) {
//    $(e.parentNode.parentNode).css('border', '0');
//    var inputName = $("input#sectionName").val();
//    var inputType = $("input#sectionType1").val();
//    var inputWhere = $("input#sectionWhere").val();
//    var ThisClassName = e.parentNode.parentNode.firstElementChild.nextElementSibling.className;


//    if (inputName && inputType) {
//        $(e).parent().parent().empty().append('<td>' + inputType + '</td><td class="' + ThisClassName + '">' + inputName + '</td><td>' + inputWhere + '</td><td> <a class="amend" href="#">编辑</a> <a class="delete" href="#">删除</a></td>>')
//    } else {
//        alert("部门类型和部门名称不能为空")
//    }
//}

//    if (inputName && inputType) {
//        $(e).parent().parent().empty().append('<td>' + inputType + '</td><td class="' + ThisClassName + '">' + inputName + '</td><td>' + inputWhere + '</td><td> <a class="amend" href="#">修改</a> <a class="delete" href="#">删除</a></td>>')
//    } else {
//        alert("部门类型和部门名称不能为空")
//    }
//}

function btnCancel(e) {
    $(e).parent().parent().empty().append(ThistrContent);
}
$('#activityTable ul li.btn_save').on('click', function () {
    var img = $('#imghead').attr('src');//头像
    var userName = $("#roleuserName").val();//用户姓名
    var userId = $("#userAccount").val();//用户名
    //var userPsd = $("#userPsd").val();//用户密码
    var userDutyText = $("#duty").val();//职务
    var contactInformation = $("#contactInformation").val();//联系方式
    var sectionContext = $("#cardDrop a:first-child span").html();//获取部门
    var role = document.getElementById("role");
    var roleText = role.options[role.selectedIndex].text;
    var roleid = role.options[role.selectedIndex].value;
    if(compileState == 1){
        //新建
        formVerfitverify();
        //formVerfitverifyPass();
        if (nameAffirm) {
            if (userAccountaffirm) {
                //if (passwordAffirm) {
                    //if (verifyPsdAffirm) {
                        if (choose_section) {
                                if (affirm) {
                                        addUser(userName, userId, userDutyText, contactInformation, organizationid, roleid, img, sectionContext, roleText);
                                } else {
                                    errorMess();
                            } 
                        } else {
                            errorMess();
                    //    }
                    //} else {
                    //    errorMess();
                //    }
                //} else {
                //    errorMess();
                    
                }
            } else {
                errorMess();
               
            }
        } else {
            errorMess();
        
        }
    }
    //修改
    if(compileState==2){
        //修改
        formVerfitverify();
        //formNull();
        if (nameAffirm) {
            if (choose_section) {
                if (dutyInforMation) {
                    if (dutyInforMation) {
                        if (affirm) {
                            //if (passwordAffirm) {
                                //if (verifyPsdAffirm) {
                                    updateUser(userName, userId, userDutyText, contactInformation, organizationid, roleid, img, sectionContext, roleText, atThis);
                            //    }else{
                            //        errorMess();
                            //    }
                            //} else {
                            //    errorMess();
                            //}
                        } else {
                            errorMess();
                        }
                    } else {
                        errorMess();
                    }
                } else {
                    errorMess();
                }
            } else {
                errorMess();
            }
        } else {
            errorMess();
        }
    }
    
    //if (compileState == 1) {
    //    if(nameAffirm){
    //        if(affirm){
    //        }
    //    }else{
    //        if (compileState == 1) {
    //            formVerfitverify();
    //            formVerfitverifyPass();
    //        }
    //    }
        //if (affirm) {
        //    if (sectionContext == "请选择部门") {
        //        alert("请选择部门");
        //    } else {
        //        if (userDutyText) {
        //            if (userName) {
        //                if (userId && userAccountaffirm) {
        //                    if (userPsd && passwordAffirm) {
        //                        if (contactInformation) {
        //                            //if (state == 1) {
        //                            //    addUser(userName, userId, userPsd, userDutyText, contactInformation, organizationid, roleid, img, sectionContext, roleText);
        //                            //}
        //                            //else {
        //                            //    updateUser(userName, userId, userPsd, userDutyText, contactInformation, organizationid, roleid, img, sectionContext, roleText, atThis);
        //                            //}
        //                        } else {
        //                            alert("联系方式不能为空")
        //                        }
        //                    } else {
        //                        alert("用户密码不能为空");
        //                    }
        //                } else { alert("用户账号不能为空"); }
        //            } else {
        //                alert("用户姓名不能为空");
        //            }
        //        } else {
        //            alert("职务不能为空");
        //        }
        //    }
    //    } else {
    //        alert("验证信息有误请核对");
    //    }
    //}
    //if (compileState == 2) {
    //    if (sectionContext == "请选择部门") {
    //        alert("请选择部门");
    //    } else {
    //        if (userDutyText) {
    //                        if (contactInformation) {
    //                            if (state == 1) {
    //                                addUser(userName, userId, userPsd, userDutyText, contactInformation, organizationid, roleid, img, sectionContext, roleText);
    //                            }
    //                            else {
    //                                updateUser(userName, userId, userPsd, userDutyText, contactInformation, organizationid, roleid, img, sectionContext, roleText, atThis);
    //                            }
    //                        } else {
    //                            alert("联系方式不能为空")
    //                        }
    //        } else {
    //            alert("职务不能为空");
    //        }
    //    }
    //} else {
    //    alert("验证信息有误请核对");
    //}
    });
//错误提示体验部分
function errorMess(){
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
$(".toast-close-button").click(function () {
    $("#toast-container").hide();
});
$('#secBtn').on('click', 'button', function () {
    if (this.className.indexOf('btn-reset') !== -1) {
        $('#userName').val("");
        $('#rolebox').val("");
        $('#section_name').val(""); 
        $('#job').val("");
    }
});
//获取用户列表
function getUserData() {
    $.ajax({
        type: "POST",
        url: "../../Controllers/Systems/UserController.ashx?action=getPageList",
        dataType: 'json',
        //data: { 'rolename': rolename, 'isreuse': isreuse },
        success: function (msg) {
            if (msg != '') {
              var  html = '';
                //html = '<table id="sectionInterface" class="table table-responsive">'
                //    + '<thead>'
                //    + '<tr>'
                //     + '<th>头像</th>'
                //    + '<th>用户姓名</th>'
                //    + '<th>用户账号</th>'
                //    + '<th>部门名称</th>'
                //    + '<th>职务</th>'
                //    + '<th>角色名称</th>'
                //    + '<th>联系方式</th>'
                //    + '<th>操作</th>'
                //    + '</tr>'
                //    + '</thead>'
                //    + '<tbody>';

                $.each(msg.rows, function (index, user) {
                    html += '<tr id="' + user.userid + '">'
                        + '<td><img border="0" src="' + user.icons + '" width="30" height="30" ></td>'
                        + '<td>' + user.name + '</td>'
                        + '<td>' + user.username + '</td>'
                        + '<td >' + user.organizationname + '</td>'
                        + '<td data_id="' + user.organizationid + '">' + user.organizationname + '</td>'
                        + '<td>' + user.job + '</td>'
                        + '<td data_id="' + user.roleid + '">' + user.rolename + '</td>'
                        + '<td>' + user.phone + '</td>'
                        + '<td>'
                        + '<a class="amend" href="#">编辑</a>&nbsp;&nbsp;'
                        + '<a class="delete" href="#">删除</a>'
                        + '</td>'
                        + '</tr>';
                });

                //html += '</tbody></table>';

                $('#sectionInterface tbody').html(html);
            }
            //else {
            //    html = '<table id="sectionInterface" class="table table-responsive">'
            //     + '<thead>'
            //     + '<tr>'
            //     + '<th>用户姓名</th>'
            //     + '<th>用户账号</th>'
            //     + '<th>职务</th>'
            //     + '<th>联系方式</th>'
            //     + '<th>操作</th>'
            //    + ' </tr></thead><tobdy></tbody></table>';
            //    $('#userview').html(html);
            //}
        }
    });
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
                    html += ' <li><a data-label="' + org.organizationname + '" data-id="#"  onclick="getId(\'' + org.organizationid + '\',\'' + org.organizationname + '\',1)">' + org.organizationname + '</a>';
                    if (org.children != null) {
                        html += getTree(org.children,1);
                    }
                    html += '</li>';

                });
               $('#orgtree').html(html);
                initTree1();
               $(".tree1").treemenu1({ delay: 300 }).openActive1();
                getSelectOrganization(msg, 'treeOrganization1', 2)
            }
        }
    });
}



//获取角色表
function getRole() {
    $.ajax({
        type: "POST",
        url: "../../Controllers/Systems/RoleController.ashx?action=getList",
        dataType: 'json',
        //data: { 'rolename': rolename, 'isreuse': isreuse },
        success: function (msg) {
            if (msg != '') {
                var roles = '';
                $.each(msg, function (index, role) {
                    roles += '<option value="' + role.roleid + '">' + role.rolename + '</option>';

                });
                $('#role').append(roles);
                $('#rolebox').append('<option value="">全部</option>');
                $('#rolebox').append(roles);
            }

        }
    });
}

//添加用户
function addUser(name, username, job, phone, organizationid, roleid, img, sectionContext, roleText) {
    $.ajax({
        type: "POST",
        url: "../../Controllers/Systems/UserController.ashx?action=add",
        dataType: 'json',
        data: { 'name': name, 'username': username, 'job': job, 'phone': phone, 'organizationid': organizationid, 'roleid': roleid, 'Icon': img },
        success: function (msg) {
            if (msg != '') {
                msg = eval('(' + msg + ')');
                if (msg.IsSuccess == 'true') {

                    var html = '<tr id="' + msg.id + '"> ' +
                                '<td><img border="0" src="' + img + '" width="30" height="30" ></td>' +
                                '<td>' + name + '</td>' +
                                '<td>' + username + '</td>' +
                                '<td data_id="' + organizationid + '">' + sectionContext + '</td>' +
                                '<td>' + job + '</td>' +
                                '<td data_id="' + roleid + '">' + roleText + '</td>' +
                                '<td>' + phone + '</td>' +
                                '<td><a class="amend">编辑</a>&nbsp;&nbsp;<a class="delete">删除</a>' +
                                 ' &nbsp;&nbsp; <a  href="#" onclick="rePaw(\'' + msg.id + '\')">重置密码</a>' +
                                '</td>' +
                                '</tr>';
                    $('table#sectionInterface tbody').append(html);
                   //parent.deleteGlobalShade();
                    //$("#newShade").slideUp();
                    $('#newShade').addClass("is-visible");
                    $("#roleuserName").val('');
                    $("#userAccount").val('').attr("disabled", false);
                    $("#userPsd").val('');
                    $("#duty").val('');
                    $("#verifyPsd").val('');
                    $('#imghead').attr("src", "../../Images/cross_uploading.png");
                    $("#contactInformation").val('');
                    $("#cardDrop a:first-child span").html("请选择部门");
                    $('#role option')[0].selected = true;
                    alert(msg.Message);
                } else {
                    alert(msg.Message);
                }


            }

        }
    });
}

//编辑用户
function updateUser(name, username,job, phone, organizationid, roleid, img, sectionContext, roleText, e) {
    $.ajax({
        type: "POST",
        url: "../../Controllers/Systems/UserController.ashx?action=edit",
        dataType: 'json',
        data: { 'userid': userid, 'name': name, 'username': username, 'job': job, 'phone': phone, 'organizationid': organizationid, 'roleid': roleid, 'Icon': img },
        success: function (msg) {
            if (msg != '') {
                msg = eval('(' + msg + ')');
                if (msg.IsSuccess == 'true') {
                    $(e).parent().parent().remove();
                    var html = '<tr id="' + userid + '"> ' +
                        '<td><img border="0" src="' + img + '" width="30" height="30" ></td>'+
                        '<td>' + name + '</td>' +
                        '<td>' + username + '</td>' +
                        '<td data_id="' + organizationid + '">' + sectionContext + '</td>' +
                        '<td>' + job + '</td>' +
                        '<td data_id="' + roleid + '">' + roleText + '</td>' +
                        '<td>' + phone + '</td>' +
                        '<td><a class="amend">编辑</a>&nbsp;&nbsp;<a class="delete">删除</a>' +
                        ' &nbsp;&nbsp; <a  href="#" onclick="rePaw(\'' + userid + '\')">重置密码</a>' +
                        '</td>' +
                        '</tr>';
                    $('#sectionInterface').append(html);
                    parent.deleteGlobalShade();
                    //$("#newShade").slideUp();
                    $(".cd-popup").removeClass('is-visible');
                    alert(msg.Message);
                } else {
                    alert(msg.Message);
                }
            }

        }
    });
}

//删除
function delUser(e) {
    $.ajax({
        type: "POST",
        url: "../../Controllers/Systems/UserController.ashx?action=deluser",
        dataType: 'json',
        data: { 'userid': userid },
        success: function (msg) {
            if (msg != '') {
                msg = eval('(' + msg + ')');
                if (msg.IsSuccess == 'true') {
                    $(e).parent().parent().remove();
                }

                alert(msg.Message);
            }

        }
    });
}

//生成树
function getTree(orgs,type) {
    var html = ' <ul>';
    for (var i = 0; i < orgs.length; i++) {
        var org = orgs[i];
        html += ' <li><a data-label="' + org.organizationname + '" href="#" onclick="getId(\'' + org.organizationid + '\',\'' + org.organizationname + '\',' + type + ')">' + org.organizationname + '</a>';
        if (org.children != null) {
            html += getTree(org.children, type);
        }
        html += '</li>';
    }
    html += '</ul>';
    return html;
}
//获取部门树id
function getId(id, name, type) {
    if (type==1) {
        organizationid = id;
        $('#orglabel').text(name);
    }
    else {
        selectorganizationid = id;
        $('#label-active1').text(name);
    }
 
}



function initPagination() {
   $('#sectionInterface tbody').empty();
    var url = "../../Controllers/Systems/UserController.ashx?action=getList";
    $.ajax({
        type: "POST",
        url: url,
        dataType: 'json',
        data: {
            "username": $('#userName').val(),
            "role": $('#rolebox').val(),
            "organizationid": selectorganizationid,
            "job": $('#job').val(),
        },
        success: function (msg) {
            if (msg != '') {
                
                var initPagination = function () {
                    // 创建分页
                    $("#Pagination").pagination(parseInt(msg.length), {
                        num_edge_entries: 1, //边缘页数
                        num_display_entries: 10, //主体页数
                        callback: pageselectCallback,
                        items_per_page: pagesize, //每页显示页数
                        prev_text: "上一页",
                        next_text: "下一页"
                    });
                };
                function pageselectCallback(page_index, jq) {

                    var index = page_index + 1;
                    $.ajax(
                    {
                        url: "../../Controllers/Systems/UserController.ashx?action=getPageList",
                        type: "post",
                        data: {
                            "page": index,
                            "rows": pagesize, //每页显示页数
                            "username": $('#userName').val(),
                            "role": $('#rolebox').val(),
                            "organizationid": selectorganizationid,
                            "job": $('#job').val(),
                        },
                        success: function (data) {

                            var row = "";
                            if (data != '') {
                                html = '';
                                //html = '  <table id="userInterface" class="table table-responsive">'
                                //        + '<thead><tr>'
                                //        + '<th>角色名称</th>'
                                //        + '<th>是否部门复用</th>'
                                //        + '<th>操作</th>'
                                //        + ' </tr></thead><tobdy>';

                                $.each(data.rows, function (index, user) {
                                    html += '<tr id="' + user.userid + '">'
                                    //if (user.icons=='') {
                                    //    + '<td><img border="0" src="../../Images/man.jpg" width="30" height="30" ></td>'
                                    //}
                                    //else {
                                        + '<td><img border="0" src="' + user.icons + '" width="30" height="30" ></td>'
                                   // }
                                  
                                    + '<td>' + user.name + '</td>'
                                    + '<td>' + user.username + '</td>'
                                    + '<td data_id="' + user.organizationid + '">' + user.organizationname + '</td>'
                                    + '<td>' + user.job + '</td>'
                                    + '<td data_id="' + user.roleid + '">' + user.rolename + '</td>'
                                    + '<td>' + user.phone + '</td>'
                                    + '<td>'
                                    + '<a class="amend" href="#">编辑</a>&nbsp;&nbsp;'
                                    + '<a class="delete" href="#">删除</a>&nbsp;&nbsp;'
                                    + '<a  href="#" onclick="rePaw(\'' + user.userid + '\')">重置密码</a>'
                                    + '</td>'
                                    + '</tr>';
                                });

                                // html += '</tbody></table>';

                                $('#sectionInterface tbody').html(html);
                            }
                            //else {
                            //    html = '  <table id="userInterface" class="table table-responsive">'
                            //           + '<thead><tr>'
                            //           + '<th>角色名称</th>'
                            //           + '<th>是否部门复用</th>'
                            //           + '<th>操作</th>'
                            //           + ' </tr></thead><tobdy></tbody></table>';
                            //    $('#roleview').html(html);
                            //}
                            //    $("#coalmines tbody").append(row);
                        }
                    });
                    return false;
                }
                //ajax加载
                $("#hiddenresult").load("load.html", null, initPagination);




            }
        }
    });



}


//查询
function selectUser() {
    initPagination();
}

//加载查询部门
function getSelectOrganization(data,name, type) {
  
                $('#' + name).empty();
                var html = '';
                $.each(data, function (index, org) {
                    html += ' <li><a data-label="' + org.organizationname + '" data-id="#"  onclick="getId(\'' + org.organizationid + '\',\'' + org.organizationname + '\',' + type + ')">' + org.organizationname + '</a>';
                    if (org.children != null) {
                        html += getTree(org.children, type);
                    }
                    html += '</li>';

                });
                html = '<li><a data-label="全部" href="#" onclick="getId(\'\',\'全部 \',' + type + ')">全部</a> <ul style="height:204px;overflow-y:auto   ;">' + html + '  </ul> </li>';
                $('#' + name).html(html);
                  initTree();
                $(".tree").treemenu({ delay: 300 }).openActive();
                //initTree();
                //$(".tree").treemenu({ delay: 300 }).openActive();
   
}

//重置密码
function rePaw(id) {
    $.ajax({
        type: "POST",
        url: "../../Controllers/Systems/UserController.ashx?action=reset",
        dataType: 'json',
        data: { 'userid': id },
        success: function (msg) {
            if (msg != '') {
                msg = eval('(' + msg + ')');
               

                alert(msg.Message);
            }

        }
    });
}







