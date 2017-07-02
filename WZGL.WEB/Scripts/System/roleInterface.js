//角色id
var roleid = '';
//权限列表
var flimitids = '';
//新增或编辑状态
var state = 1;
var pagesize = 15;
$(function () {
    getTreeData();
    // getRoleData('','');
    initPagination();
});
//    <!-- 点击显示搜索-->
var atThis;
var ThistrContent;
$('#searchBtn').on("click",function(searchContent){
    if($('#searchContent').css("display")=="none"){
        $('#searchContent').slideDown();
    }else{
        $('#searchContent').slideUp();
    }
});
//点击显示新建弹出框
$('.btn_vessel').on('click','li',function(){
    if (this.className.indexOf('btn_newly') !== -1) {
        parent.globalShade();
        state = 1;
        $('#userTitle').html('新建角色');
        $('#newShade').addClass("is-visible");
        $('#sectionName').val(' ');
    }
});
// ph_popup_close点击关闭弹出窗
$('#newShade').on('click','div',function(){
    if (this.className == 'newShade_lay') {
        parent.deleteGlobalShade();
        $('#newShade').removeClass("is-visible");
    }
});
$('.btn_return').on('click', function (event) {
    $(".cd-popup").removeClass('is-visible');
    parent.deleteGlobalShade();
});
$('#phPopUpClose').on('click', function () {
     parent.deleteGlobalShade();
     $('#newShade').removeClass("is-visible");
    var inputList = $('.jurisdiction tr td input');//得到所有的input
    //循环判断input为checked保存在inputTrue;
    for (var i = 0; i < inputList.length; i++) {
        inputList[i].checked = false;
    }
});
$("#roleview").on('click', 'a', function () {
    if($('#userInterface').find('input').length!==0){
        return;
    }
    if (this.className.indexOf("amend") !== -1) {
        parent.globalShade();
        atThis = this;
        state = 2;
        roleid= this.parentNode.parentNode.id;
        getRoleLimit();
        $('#userTitle').html('编辑用户界面');
        $('#newShade').addClass("is-visible");

        ThistrContent=$(this).parent().parent().html();
        var sectionNameCon = (this.parentNode.parentNode.firstElementChild).textContent;
        $("#sectionName").val(sectionNameCon);
        var sectionWhereCon = $(this.parentNode.parentNode.firstElementChild.nextElementSibling).attr('data_value');
        var whereList;
        if(sectionWhereCon=="true"){
            whereList=0;
        }else if(sectionWhereCon=="false"){
            whereList=1;
        }
        var  myselect=document.getElementById("whetherReuse");
        myselect.options[whereList].selected=true;

        var NextchirdernList=this.parentNode.parentNode.firstElementChild.nextElementSibling.className;
       
    } else if (this.className.indexOf("delete") !== -1) {
        roleid = this.parentNode.parentNode.id;
        delRole(this);
       
    }
});
function btnSubmit(e){
    $(e.parentNode.parentNode).css('border','0');
    var inputName=$("input#sectionName").val();
    var inputType=$("input#sectionType1").val();
    var inputWhere=$("input#sectionWhere").val();
    var ThisClassName= e.parentNode.parentNode.firstElementChild.nextElementSibling.className;

    if(inputName&&inputType){
        $(e).parent().parent().empty().append('<td>'+inputType+'</td><td class="'+ThisClassName+'">'+inputName+'</td><td>'+inputWhere+'</td><td> <a class="amend" href="#">编辑</a> <a class="delete" href="#">删除</a></td>>')
    }else{
        alert("部门类型和部门名称不能为空")
    }
}
function btnCancel(e){
    $(e).parent().parent().empty().append(ThistrContent);
}
//$('#activityTable ul li.btn_save').on('click',function(){
//    //var sectionNameCon =  $('#sectionName').val();
//    //var  typeSelect=document.getElementById("sectionType");
//    //console.log(typeSelect);
//    //var sectionTypeCon=typeSelect.options[typeSelect.selectedIndex].text;

//   // var whetherReuse=document.getElementById("whetherReuse");
//    var whetherSectionCon=whetherReuse.options[whetherReuse.selectedIndex].text;
//    var data_value;
//    if(whetherReuse.selectedIndex=="0"){
//         data_value="true";
//    }
//    if(whetherReuse.selectedIndex=="1"){
//         data_value="false";
//    }
//    if (sectionNameCon && whetherSectionCon) {
//        $(atThis).parent().parent().remove();
//        var html='<tr><td>'+sectionNameCon+'</td><td data_value="'+data_value+'">'+whetherSectionCon+'</td><td> <a class="amend" href="#">编辑</a> <a class="delete" href="#">删除</a></td><tr>'
//        $('table#userInterface tbody').append(html);
//        $('#newShade').css('display','none');
//    }else{
//        alert("内容不能为空")
//    }
//});

$('#activityTable ul li.btn_save').on('click', function () {
    var sectionNameCon = $('#sectionName').val();
    var whetherReuse = document.getElementById("whetherReuse");
    var whetherSectionCon = whetherReuse.options[whetherReuse.selectedIndex].value;
    var data_value;
    //获得input的checked的id
    var inputTrue = '';//初始化保存所有的checked的checkBox
    var inputList = $('.jurisdiction tr td input');//得到所有的input
    //循环判断input为checked保存在inputTrue;
    for (var i = 0; i < inputList.length; i++) {
        if (inputList[i].checked == true) {
            inputTrue+= inputList[i].id+',';
        }
        inputList[i].checked = false;
    }
    //以上为获得input的checked的id
    if (whetherReuse.selectedIndex == "0") {
        data_value = "true";
    }
    if (whetherReuse.selectedIndex == "1") {
        data_value = "false";
    }
    if (sectionNameCon == " " || whetherSectionCon == " ") {
        alert("角色名称不能为空");
    } else {
        if (state==1) {
            addRole(sectionNameCon, whetherSectionCon, inputTrue);
        }
        else {
            updateRole(sectionNameCon, whetherSectionCon, inputTrue);
        }
    }
});
$('#secBtn').on('click', 'button', function () {
    if (this.className.indexOf('btn-reset') !== -1) {
        $('#userName').val(" ");
        $('#YesNo').val('3');
    }
});
//生成权限树
function getTreeData() {
    $.ajax({
        type: "POST",
        url: "../../Controllers/Systems/RoleController.ashx?action=getSystemlimitsList",
        dataType: 'json',
        success: function (msg) {
            if (msg != '') {
                html = ' <table class="table jurisdiction table-responsive">'
                        + '<thead> <tr><th>角色名称</th> <th>权限分配</th> </tr></thead>'
                        + '<tobdy>';
               
                getTree(msg);

                html += '</tbody></table>';

                $('#roletreeview').html(html);
            }
            else {
                html = ' <table class="table jurisdiction table-responsive">'
                        + '<thead> <tr><th>角色名称</th> <th>权限分配</th> </tr></thead>'
                        + '<tobdy></tbody></table>';
                $('#roletreeview').html(html);
            }
        }
    });
}
//获取角色
function getRoleData(rolename, isreuse) {
    $.ajax({
        type: "POST",
        url: "../../Controllers/Systems/RoleController.ashx?action=getPageList",
        dataType: 'json',
        data: { 'rolename': rolename, 'isreuse': isreuse },
        success: function (msg) {
            if (msg != '') {
                $('#roleview tbody').empty();
                //html = '  <table id="userInterface" class="table table-responsive">'
                //        + '<thead><tr>'
                //        + '<th>角色名称</th>'
                //        + '<th>是否部门复用</th>'
                //        + '<th>操作</th>'
                //        + ' </tr></thead><tobdy>';

                $.each(msg.rows, function (index, role) {
                    var isreuse = role.isreuse == true ? '是' : '否';
                    html += '  <tr id="' + role.roleid + '">'
                        + '<td>' + role.rolename + '</td>'
                        + '<td data_value="' + role.isreuse + '">' + isreuse + '</td>'
                        +'<td>'
                        + '<a class="amend" href="#">编辑</a>&nbsp&nbsp'
                        +'<a class="delete" href="#">删除</a>'
                        +'</td>'
                        +' </tr>';
                });

               // html += '</tbody></table>';

                $('#roleview tbody').html(html);
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
        }
    });
}
function initPagination() {
    $('#roleview tbody').empty();
    var url = "../../Controllers/Systems/RoleController.ashx?action=getList";
    $.ajax({
        type: "POST",
        url: url,
        dataType: 'json',
        data: {
            "rolename": $('#userName').val(),
            "isreuse": $('#YesNo').val(),
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
                            url: "../../Controllers/Systems/RoleController.ashx?action=getPageList",
                            type: "post",
                            data: {
                                "page": index,
                                "rows": pagesize, //每页显示页数
                                "rolename": $('#userName').val(),
                                "isreuse": $('#YesNo').val(),
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

                                    $.each(data.rows, function (index, role) {
                                        var isreuse = role.isreuse == true ? '是' : '否';
                                        html += '  <tr id="' + role.roleid + '">'
                                            + '<td>' + role.rolename + '</td>'
                                            + '<td data_value="' + role.isreuse + '">' + isreuse + '</td>'
                                            + '<td>'
                                            + '<a class="amend" href="#">编辑</a>&nbsp&nbsp'
                                            + '<a class="delete" href="#">删除</a>'
                                            + '</td>'
                                            + ' </tr>';
                                    });

                                   // html += '</tbody></table>';

                                    $('#roleview tbody').html(html);
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
//生成树
function getTree(limits) {
    $.each(limits, function (index, limit) {
        var cls = '';
        switch (limit.limitlevel) {
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
        var checked = '';
        if (flimitids.indexOf(limit.limitid) != -1) {
            checked = 'checked="checked"';
        }
        html += '<tr>'
                + ' <td class="' + cls + '"><span></span>' + limit.limitname + '</td>'
                + ' <td><input id="' + limit.limitid + '" type="checkbox" ' + checked + ' /><label>显示</label></td>'
                + '</tr>';
        if (limit.children != null) {
            getTree(limit.children);
        }
    });
}
//添加权限
function addRole(rolename, isreuse,limitids) {
    $.ajax({
        type: "POST",
        url: "../../Controllers/Systems/RoleController.ashx?action=add",
        dataType: 'json',
        data: { 'rolename': rolename, 'isreuse': isreuse, 'limitids': limitids },
        success: function (msg) {
            if (msg != '') {
                msg = eval('(' + msg + ')');
                if (msg.IsSuccess == "true") {

                    var isreuses = isreuse == 'true' ? '是' : '否';
                    var html = '<tr id="' + msg.id + '"><td>' + rolename + '</td><td data_value="' + isreuse + '">' + isreuses + '</td><td> <a class="amend" href="#">编辑</a> <a class="delete" href="#">删除</a></td><tr>'
                    $('table#userInterface tbody').append(html);
                    //parent.deleteGlobalShade();
                   // $('#newShade').css('display', 'none');
                  
                }
                alert(msg.Message);
            }
            
        }
    });
}


//编辑权限
function updateRole(rolename, isreuse,limitids) {
    $.ajax({
        type: "POST",
        url: "../../Controllers/Systems/RoleController.ashx?action=update",
        dataType: 'json',
        data: { 'roleid':roleid,'rolename': rolename,'isreuse':isreuse, 'limitids': limitids },
        success: function (msg) {
            if (msg != '') {
                msg = eval('(' + msg + ')');
                if (msg.IsSuccess == "true") {
                    $(atThis).parent().parent().remove();
                    var isreuses = isreuse == 'true' ? '是' : '否'
                    var html = '<tr id="' + roleid + '"><td>' + rolename + '</td><td data_value="' + isreuse + '">' + isreuses + '</td><td> <a class="amend" href="#">编辑</a> <a class="delete" href="#">删除</a></td><tr>'
                    $('table#userInterface tbody').append(html);
                    parent.deleteGlobalShade();
                    $('#newShade').removeClass("is-visible");
                    //$('#newShade').css('display', 'none');
                }
                alert(msg.Message);
            }
        }
    });
}

//删除
function delRole(page) {

    confirmInfor("确认删除?",function(){
     $.ajax({
        type: "POST",
        url: "../../Controllers/Systems/RoleController.ashx?action=delete",
        dataType: 'json',
        data: { 'roleid': roleid },
        success: function (msg) {
            if (msg != '') {
                msg = eval('(' + msg + ')');

                if (msg.IsSuccess == "true") { 
                    $(page).parent().parent().remove();
                }
                alert(msg.Message);
            }

        }
    });
    },function(){})
   
}

//获取角色权限
function getRoleLimit() {
    $.ajax({
        type: "POST",
        url: "../../Controllers/Systems/RoleController.ashx?action=getRoleauthorizationList",
        dataType: 'json',
        data: { 'roleid': roleid },
        success: function (msg) {
            if (msg != '') {
                msg = eval('(' + msg + ')');
                if (msg.IsSuccess == "true") {
                    flimitids = msg.ids;
                    $('#roletreeview').empty();
                    getTreeData();
                }
                else {
                    alert(msg.Message);
                }
              
            }

        }
    });
}

//查询
function selectRole() {
    initPagination();
    //var userName = $('#userName').val();
    //var YesNo = $('#YesNo').val();
    //getRoleData($('#userName').val(), $('#YesNo').val());
}