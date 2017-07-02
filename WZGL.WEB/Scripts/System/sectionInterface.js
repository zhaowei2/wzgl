/**
 * Created by Hoswing on 2016/12/23.
 */
//�����ʾ�½�������
var ThistrContent;
var html = '';
var typecombox;
//本级id或父级id
var id = '';
//部门等级
var orglevel=0;
//部门类型id
var TypeValue = '';
//部门类型名称
var TypeText = '';
//部门名称
var inputName = '';
//编辑前部门名称
var oldName = '';
//一级部门类型
var oneType;
//二级部门类型
var twoType;
//三级部门类型
var threeType;
//四级部门类型
var fourType;
var threeTdData;
//资金账户
$(function () {
    getData();
    getOrgType();
});
$('.btn_vessel').on('click', 'li', function () {
    if (this.className.indexOf('btn_newly') !== -1) {
        parent.globalShade();
        $('form .form-group #sectionName').val('');

        $('#sectionType').html(oneType);
        
        var myselect = document.getElementById("sectionType");
        myselect.selectedIndex=0;
        $('.cd-popup').addClass("is-visible");
    }
});
// ph_popup_close����رյ�����
$('#phPopUpClose').on('click', function () {
    parent.deleteGlobalShade();
    $('.cd-popup').removeClass("is-visible");
});
$('.btn_return').on('click', function (event) {
    $(".cd-popup").removeClass('is-visible');
    parent.deleteGlobalShade();
});
$('#newShade').on('click', 'div', function () {
    if (this.className == 'newShade_lay') {
            parent.deleteGlobalShade();
        $('#newShade').css('display', 'none');
    }
});
$("#orgview").on('click', 'a', function () {
    if ($('#sectionInterface').find('input').length !== 0) {
        return;
    }
    if (this.className.indexOf("addChirdren") !== -1) {
        //添加
        var defaultSelectIndex = (this.parentNode.parentNode.firstElementChild.nextElementSibling.firstElementChild).textContent;
        var idlevel= (this.parentNode.parentNode.firstElementChild.firstElementChild.textContent).split(',');
        id = idlevel[0];

        if (idlevel[1]=='4') {
            alert("此部门已经是最大级数不可添加子级！");
            return;
        }
        if (defaultSelectIndex == 'FFA21F13-BD0C-4312-BDAB-952C78DC39EE') {
            alert("此部门类型不可添加子级！");
            return;
        } 

        orglevel = Number(idlevel[1]) + 1;
        switch (orglevel) {
            case 1:
                typecombox = oneType;
                break;
            case 2:
                typecombox = twoType;
                break;
            case 3:
                typecombox = threeType;
                break;
            case 4:
                typecombox = fourType;
                break;
        }
        var chirdrenList = this.parentNode.parentNode.firstElementChild.className;
        var capitalManageList = (this.parentNode.parentNode.firstElementChild.nextElementSibling.nextElementSibling).textContent;
        //console.log(chirdrenList);
        var NextchirdernList = chirdrenList.slice(0, chirdrenList.length - 1) + (chirdrenList[chirdrenList.length - 1] * 1 + 1);
        //console.log(NextchirdernList);
        var html = '<tr style="background: #ddd;"><td class="' + NextchirdernList + '"><span></span><input id="sectionName" type="text"/></td><td><select id="sectionType1" >' +
            typecombox+
           '</select></td><td></td>' + capitalManageList + '<td><a onclick="btnSubmit(this,1)" >保存</a>&nbsp;&nbsp;<a  onclick="newBtnCancel(this)">取消</a></td></tr>';
        $(this.parentNode.parentNode).after(html);
    } else if (this.className.indexOf("amend") !== -1) {
        //编辑
        var defaultSelectIndex = (this.parentNode.parentNode.firstElementChild.nextElementSibling.firstElementChild).textContent;
        var idlevel = (this.parentNode.parentNode.firstElementChild.firstElementChild.textContent).split(',');
        id = idlevel[0];
        orglevel = Number(idlevel[1]);
        switch (idlevel[1]) {
            case '1':
                typecombox = oneType;
                break;
            case '2':
                typecombox = twoType;
                break;
            case '3':
                typecombox = threeType;
                break;
            case '4':
                typecombox = fourType;
                break;
        }
        ThistrContent = $(this).parent().parent().html();
        $(this.parentNode.parentNode).css('backgroundColor', '#ddd');
        var chirdrenList = this.parentNode.parentNode.firstElementChild.className;
        var NextchirdernList = chirdrenList.slice(0, chirdrenList.length - 1) + (chirdrenList[chirdrenList.length - 1] * 1);
        var sectionTypeCon = (this.parentNode.parentNode.firstElementChild.nextElementSibling).textContent;
        var sectionNameCon = (this.parentNode.parentNode.firstElementChild.lastElementChild).textContent;
        var capitalManageCon = (this.parentNode.parentNode.firstElementChild.nextElementSibling.nextElementSibling).textContent;
        oldName = sectionNameCon;
        var html1 = '<td class="' + NextchirdernList + '"><input  id="sectionName" value="' + sectionNameCon + '" type="text"/></td>' +
            '<td ><select name="" id="sectionType1">' + typecombox
           + '</select></td><td>' + capitalManageCon + '</td><td><a onclick="btnSubmit(this,2)" >保存</a>&nbsp;&nbsp;<a  onclick="editBtnCancel(this)">取消</a></td>';
        $(this.parentNode.parentNode).empty().append(html1);
        $('#sectionType1 option[value="' + defaultSelectIndex + '"]')[0].selected = true;//根据value设置option的selected=true;
        $("#sectionType1").prop("disabled", true);

    } else if (this.className.indexOf("delete") !== -1) {
        //删除
        var idlevel = (this.parentNode.parentNode.firstElementChild.firstElementChild.textContent).split(',');
        id = idlevel[0];
        delOrg(this);
    }
});


function btnSubmit(e,state) {
    $(e.parentNode.parentNode).css('backgroundColor', 'transparent');
    //节点名字
     inputName = $("input#sectionName").val();
    var myselect = document.getElementById("sectionType1");
    var index = myselect.selectedIndex;
    //下拉框值
     TypeValue = myselect.options[index].value;
    TypeText = myselect.options[index].text;
    //console.log(TypeText);
    //var inputType=$('input#sectionType1 option:selected').val();
    var ThisClassName = e.parentNode.parentNode.firstElementChild.className;
    //、、资金管理内容
     threeTdData = e.parentNode.parentNode.firstElementChild.nextElementSibling.nextElementSibling.textContent;
    if (inputName && TypeText) {
        if (state=='1') {
            addOrg(e);
        }
        else {
            updateOrg(e);
        }
        

    } else {
        alert("内容不能为空")
    }
}
function newBtnCancel(e) {
    $(e).parent().parent().remove();
}
function editBtnCancel(e) {
    $(e.parentNode.parentNode).css('backgroundColor', 'transparent');
    $(e).parent().parent().empty().append(ThistrContent);
}
//        //�½������
$('#activityTable ul li.btn_save').on('click', function () {
    inputName = $('form .form-group #sectionName').val();
    var myselect = document.getElementById("sectionType");
    var index = myselect.selectedIndex;
    //占线下拉框值
    TypeValue = myselect.options[index].value;
    TypeText = myselect.options[index].text;
    //            console.log(myselect.options[index].text);
    //            var sectionTypeCon = $('form .form-group #sectionType').val();
    //var capitalManageSelect = document.getElementById("capitalManageSelect");
    //var capitalIndex = capitalManageSelect.selectedIndex;
    ////、、资金管理下拉框值
    //var capitalValue = capitalManageSelect.options[index].value;
    //var capitalText = capitalManageSelect.options[index].text;
    orglevel = 1;
    if (inputName && TypeText) {
         addOrg(null);
        //parent.deleteGlobalShade();
        //$('#newShade').css('display', 'none');
    } else {
        alert("部门名称不能为空")
    }
})

//获取部门列表
function getData() {
    $.ajax({
        type: "POST",
        url: "../../Controllers/Systems/OrganizationController.ashx?action=getList",
        dataType: 'json',
        success: function (msg) {
            if (msg != '') {
                html = '<table id="sectionInterface" class="table table-responsive">'
                         + '<thead> <tr><th>部门名称</th><th>部门类型</th><th>资金账户</th><th>操作</th></tr></thead>'
                         + ' <tbody>';
                getTree(msg)

                html += '</tbody></table>';

                $('#orgview').html(html);
            }
            else {
                html = '<table id="sectionInterface" class="table table-responsive">'
                                        + '<thead> <tr><th>部门名称</th><th>部门类型</th><th>资金账户</th> <th>操作</th></tr></thead>'
                                        + ' <tbody></tbody></table>';
                $('#orgview').html(html);
            }
        }
    });
}
//生成树
function getTree(orgs) {
    $.each(orgs, function (index, org) {
        var cls = '';
        switch (org.orglevel) {
            case '1':
                cls = 'part0';
                break;
            case '2':
                cls = 'part1';
                break;
            case '3':
                cls = 'part2';
                break;
            case '4':
                cls = 'part3';
                break;
        }
        if (org.organizationtype == "B933AF9E-B57E-40F5-9284-E24BE8EA21FF" || org.organizationtype == "FFA21F13-BD0C-4312-BDAB-952C78DC39EE") {
            html += '<tr>'
                 + '<td class="' + cls + '"><span><b style="display:none">' + org.organizationid + ',' + org.orglevel + '</b></span><i>' + org.organizationname + '</i></td>'
                 + '<td><b style="display:none">' + org.organizationtype + '</b>' + org.typename + '</td>'
                + '<td>是</td>'
                 + '<td>'
                 + '<a class="addChirdren" >添加子级</a>&nbsp;&nbsp;'
                 + '<a class="amend" >编辑</a>&nbsp;&nbsp;'
                 + '<a class="delete" >删除</a>'
                 + '</td>'
                 + '</tr>';
           
        }
        else {
            html += '<tr>'
                + '<td class="' + cls + '"><span><b style="display:none">' + org.organizationid + ',' + org.orglevel + '</b></span><i>' + org.organizationname + '</i></td>'
                + '<td><b style="display:none">' + org.organizationtype + '</b>' + org.typename + '</td>'
               + '<td>否</td>'
                + '<td>'
                + '<a class="addChirdren" >添加子级</a>&nbsp;&nbsp;'
                + '<a class="amend" >编辑</a>&nbsp;&nbsp;'
                + '<a class="delete" >删除</a>'
                + '</td>'
                + '</tr>';
          
        }
        if (org.children != null) {
            getTree(org.children);
        }

    });
}
//获取部门类型
function getOrgType() {
    $.ajax({
        type: "POST",
        url: "../../Controllers/Systems/OrganizationController.ashx?action=getOrgType",
        dataType: 'json',
        success: function (msg) {
            if (msg != '') {
              
                var types = $.grep(msg, function (type) {
                    return type.itemid == '15E7C568-F284-433F-8BA1-AE83167C2383';
                });
                oneType = '<option value="15E7C568-F284-433F-8BA1-AE83167C2383">' + types[0].itemname + '</option>';

                 types = $.grep(msg, function (type) {
                     return type.itemid == 'B933AF9E-B57E-40F5-9284-E24BE8EA21FF';
                });
                 twoType = '<option value="B933AF9E-B57E-40F5-9284-E24BE8EA21FF">' + types[0].itemname + '</option>';

                 types = $.grep(msg, function (type) {
                     return type.itemid == 'FFA21F13-BD0C-4312-BDAB-952C78DC39EE' || type.itemid == '2067DC4D-D0D1-4239-880E-9D7BE2EABE07';
                });

                 threeType = '<option value="' + types[0].itemid + '">' + types[0].itemname + '</option>'
               + '<option value="' + types[1].itemid + '">' + types[1].itemname + '</option>';

                 types = $.grep(msg, function (type) {
                     return type.itemid == 'C70CEDCC-FB20-436E-B35A-AA5A7BD8C488';
                 });
                 fourType = '<option value="C70CEDCC-FB20-436E-B35A-AA5A7BD8C488">' + types[0].itemname + '</option>';
            }
        }
    });

    //oneType = '<option value="15E7C568-F284-433F-8BA1-AE83167C2383">战线</option>';
    //twoType = '<option value="B933AF9E-B57E-40F5-9284-E24BE8EA21FF">专业主管部门</option>';
    //threeType = '<option value="FFA21F13-BD0C-4312-BDAB-952C78DC39EE">材料使用单位</option>'
    //          + '<option value="2067DC4D-D0D1-4239-880E-9D7BE2EABE07">材料主管部门</option>';
    //fourType = '<option value="C70CEDCC-FB20-436E-B35A-AA5A7BD8C488">矿属仓库</option>';
    $('#sectionType').append(oneType);
}
//新增部门
function addOrg(e) {
    if (orglevel==1) {
        id = '';
    }
    $.ajax({
        type: "POST",
        url: "../../Controllers/Systems/OrganizationController.ashx?action=add",
        dataType: 'json',
        data:{'organizationname':inputName,'organizationtype':TypeValue,'parentid':id,'orglevel':orglevel },
        success: function (msg) {
            if (msg != '') {
                msg= eval('(' + msg + ')')
                if (msg.IsSuccess == 'true') {

                    var cls = '';
                    switch (orglevel) {
                        case 1:
                            cls = 'part0';
                            break;
                        case 2:
                            cls = 'part1';
                            break;
                        case 3:
                            cls = 'part2';
                            break;
                        case 4:
                            cls = 'part3';
                            break;
                        case 5:
                            cls = 'part4';
                            break;
                        default:
                            cls = 'part5';
                            break;
                    }
                    if (e == null) {
                        if (TypeValue == 'B933AF9E-B57E-40F5-9284-E24BE8EA21FF' ||
                          TypeValue == 'FFA21F13-BD0C-4312-BDAB-952C78DC39EE') {
                            $('table#sectionInterface tbody').append('<tr><td class="' + cls + '"><span><b style="display:none">' + msg.id + ',' + orglevel + '</b></span><i>' + inputName + '</i></td><td><b style="display:none">' + TypeValue + '</b>' + TypeText + '</td><td>是</td><td><a class="addChirdren" >添加子级</a>&nbsp;&nbsp; <a class="amend" >编辑</a>&nbsp;&nbsp;<a class="delete" >删除</a></td></tr>');
                        }
                        else {
                            $('table#sectionInterface tbody').append('<tr><td class="' + cls + '"><span><b style="display:none">' + msg.id + ',' + orglevel + '</b></span><i>' + inputName + '</i></td><td><b style="display:none">' + TypeValue + '</b>' + TypeText + '</td><td>否</td><td><a class="addChirdren" >添加子级</a>&nbsp;&nbsp; <a class="amend" >编辑</a>&nbsp;&nbsp;<a class="delete" >删除</a></td></tr>');
                        }
                          //  var html = '<tr><td class="part0"><span></span>' + sectionNameCon + '</td><td>' + sectionTypeCon + '</td><td><a class="addChirdren" >添加子级</a> <a class="amend" >编辑</a> <a class="delete" >删除</a></td><tr>'
                    }
                    else
                    {
                      
                        if (TypeValue == 'B933AF9E-B57E-40F5-9284-E24BE8EA21FF' ||
                         TypeValue == 'FFA21F13-BD0C-4312-BDAB-952C78DC39EE') {
                            $(e).parent().parent().empty().append('<td class="' + cls + '"><span><b style="display:none">' + msg.id + ',' + orglevel + '</b></span><i>' + inputName + '</i></td><td><b style="display:none">' + TypeValue + '</b>' + TypeText + '</td><td>是</td><td><a class="addChirdren" >添加子级</a> &nbsp;&nbsp;<a class="amend" >编辑</a>&nbsp;&nbsp; <a class="delete" >删除</a></td>');
                        }
                        else {
                            $(e).parent().parent().empty().append('<td class="' + cls + '"><span><b style="display:none">' + msg.id + ',' + orglevel + '</b></span><i>' + inputName + '</i></td><td><b style="display:none">' + TypeValue + '</b>' + TypeText + '</td><td>否</td><td><a class="addChirdren" >添加子级</a> &nbsp;&nbsp;<a class="amend" >编辑</a>&nbsp;&nbsp; <a class="delete" >删除</a></td>');
                        }
                    }
                 
                }
                alert(msg.Message);
            }
        }
});
}
//编辑部门
function updateOrg(e) {
    $.ajax({
        type: "POST",
        url: "../../Controllers/Systems/OrganizationController.ashx?action=update",
        dataType: 'json',
        data: { 'organizationid': id, 'organizationname': inputName, 'organizationtype': TypeValue, 'oldName': oldName },
        success: function (msg) {
            if (msg != '') {
                msg = eval('(' + msg + ')')
                if (msg.IsSuccess == 'true') {

                    var cls = '';
                    switch (orglevel) {
                        case 1:
                            cls = 'part0';
                            break;
                        case 2:
                            cls = 'part1';
                            break;
                        case 3:
                            cls = 'part2';
                            break;
                        case 4:
                            cls = 'part3';
                            break;
                        case 5:
                            cls = 'part4';
                            break;
                        default:
                            cls = 'part5';
                            break;
                    }

                        $(e).parent().parent().empty().append('<td class="' + cls + '"><span><b style="display:none">' + id + ',' + orglevel + '</b></span>' + inputName + '</td><td><b style="display:none">' + TypeValue + '</b>' + TypeText + '</td><td>' + threeTdData + '</td><td><a class="addChirdren" >添加子级</a> <a class="amend" >编辑</a> <a class="delete" >删除</a></td>>')
                }
                alert(msg.Message);
            }
        }
    });
}
//删除部门
function delOrg(e) {

    confirmInfor("确认删除?", function () {
        $.ajax({
            type: "POST",
            url: "../../Controllers/Systems/OrganizationController.ashx?action=delete",
            dataType: 'json',
            data: { 'organizationid': id },
            success: function (msg) {
                if (msg != '') {
                    msg = eval('(' + msg + ')')
                    if (msg.IsSuccess == 'true') {


                        $(e).parent().parent().remove();
                    }
                    alert(msg.Message);
                }
            }
        });
    }, function () { })
   
}