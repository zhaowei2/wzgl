var isAdd = true;
var start = null;
var end = null;
var tstart = null;
var tend = null;
var pagesize = 20;

$(function () { 
    tstart = getDateStr(0);
    tend = getDateStr(0);
    start = getDateStr(0);
    end = getDateStr(0);
    initcom();
    inti();
});
//部门下拉框初始化
function initcom()
{
    getOrganization("treeOrganization1", 1);
    getOrganization("treeOrganization2", 2);
    getOrganization("treeOrganization3", 3);
    getOrganization("treeOrganization4", 4);
}
function inti() {
  
    initPagination();
    //getOrganization("treeOrganization1", 1);
    getCoal("selcoalfaceid");

      
}
function intitunnel() {
 
    initTunnelPagination();
    //getOrganization("treeOrganization2", 2);
    getProject("selminingwellprojectid");
}
function initPagination() {
    var url = "../../Controllers/Production/CoalminedailyrecordController.ashx?action=getCount";
    $.ajax({
        type: "POST",
        url: url,
        dataType: 'json',
        data: {
            "start": start,
            "end": end,
            "organizationid": $("#selorganizationid").val(),
            "coalfaceid": $("#selcoalfaceid").val(),
        },
        success: function (msg) {
            if (msg != '') {
                if (msg.IsSuccess == "true") {
                    var initPagination = function () {
                        // 创建分页
                        $("#Pagination").pagination(parseInt(msg.Count), {
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
                            url: "../../Controllers/Production/CoalminedailyrecordController.ashx?action=getPageList",
                            type: "post",
                            data: {
                                "page": index,
                                "rows": pagesize, //每页显示页数
                                "start": start,
                                "end": end,
                                "organizationid": $("#selorganizationid").val(),
                                "coalfaceid": $("#selcoalfaceid").val(),
                            },
                            success: function (data) {
                                $('#coalmines tbody').empty();
                                var row = "";
                                $.each(data.rows, function (key, val) {
                                    row += '  <tr class="listDataTr">'
                                           + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                           + ' <a href="javaScript:void(0)"title="' + val.organizationname + '" >' + val.organizationname + '</a>'
                                           + ' </td>'
                                           + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                           + ' <a href="javaScript:void(0)" title=' + val.coalfacecode + '>' + val.coalfacecode + '</a>'
                                           + ' </td>'
                                           + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                           + ' <a href="javaScript:void(0)" title=' + val.coalminetype + '>' + val.coalminetype + '</a>'
                                           + ' </td>'
                                           + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                           + ' <a href="javaScript:void(0)" title=' + val.daycompletion + '>' + val.daycompletion + '</a>'
                                           + ' </td>'
                                           + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                           + ' <a href="javaScript:void(0)" onclick="edit(\'' + val.organizationid + '\',\'' + val.coalfaceid + '\',\'' + val.coalminetype + '\',\'' + val.daycompletion + '\',\'' + val.coalminedailyrecordid + '\',\'' + val.organizationname + '\')">编辑</a>'
                                            + ' &nbsp;<a href="javaScript:void(0)" onclick="del(\'' + val.coalminedailyrecordid + '\',1)">删除</a>'
                                           + ' </td>'
                                           + ' </tr>';
                                });
                                $("#coalmines tbody").append(row);
                            }
                        });
                        return false;
                    }
                    //ajax加载
                    $("#hiddenresult").load("load.html", null, initPagination);

                }
            }
        }
    });
}
//保存数据
function save()
{
    if ($("#organizationid").val()=="") {
        alert("请选择单位！");
       return;
    }
    if ($("#coalfaceid").val() == "") {
        alert("请选择工作面！");
       return;
    }
    if ($("#coalminetype").val() == "") {
        alert("请选择类型！");
       return;
    }
    if ($("#daycompletion").val() == "") {
        alert("请输入每日完成量！");
       return;
    }
    if (isNaN($("#daycompletion").val())) {
        alert("完成量请输入数字！");
        return;
    }
    var url = "";
    if (!isAdd) {
        url = "../../Controllers/Production/CoalminedailyrecordController.ashx?action=update";
    }
    else {
        url = "../../Controllers/Production/CoalminedailyrecordController.ashx?action=add";
    }
    $.ajax({
        url: url,
        type: "post",
        data: {
            "organizationid": $("#organizationid").val(),
            "coalfaceid": $("#coalfaceid").val(),
            "coalminetype": $("#coalminetype").val(),
            "daycompletion": $("#daycompletion").val(),
            "coalminedailyrecordid": $("#coalminedailyrecordid").val()
        },
        success: function (data) {
            data = eval('(' + data + ')');
            if (data.IsSuccess == "true") {
                if (isAdd) {
                    alert("材料编码添加成功！");
                }
                else {
                    alert("材料编码编辑成功！");
                    $(".cd-popup").removeClass('is-visible');
                    parent.deleteGlobalShade();
                }
                //刷新table
                initPagination();
            }
        }
    });
}

//编辑数据
function edit(organizationid, coalfaceid, coalminetype, daycompletion, coalminedailyrecordid, organizationname)
{
    isAdd = false;
    getCoal("coalfaceid");
    $("#divcoalmines").css('display', 'block');
    $("#divcoatunnel").css('display', 'none');
    $("#organizationid").val(organizationid);
    $("#coalfaceid").val(coalfaceid);
    $("#coalminetype").val(coalminetype);
    $("#daycompletion").val(daycompletion);
    $("#coalminedailyrecordid").val(coalminedailyrecordid);
    $('.cd-popup').addClass('is-visible');
    $('.aui_icon').html("编辑采煤量");
   // getOrganization("treeOrganization3", 3);
    parent.globalShade();
    $('#label-active3').text(organizationname);
   
}

//显示添加页面
function add()
{
    isAdd = true;
    parent.globalShade();
    if ($("#driving").css("display")=="none") {
        $("#divcoalmines").css('display', 'block');
        $("#divcoatunnel").css('display', 'none');
        $("#organizationid").val('');
        $("#coalfaceid").val('');
        $("#coalminetype").val('');
        $("#daycompletion").val('');
        $('.cd-popup').addClass('is-visible');
        $('.aui_icon').html("添加采煤量");
        //getOrganization("treeOrganization3", 3);
        getCoal("coalfaceid");
        $('#label-active3').text('全部');

    }
    else {
        $("#divcoalmines").css('display', 'none');
        $("#divcoatunnel").css('display', 'block');
        $("#torganizationid").val('');
        $("#miningwellprojectid").val('');
        $("#daycompletion").val('');
        $('.cd-popup').addClass('is-visible');
        $('.aui_icon').html("添加掘进煤");
       // getOrganization("treeOrganization4", 4);
        getProject("miningwellprojectid");
        $('#label-active4').text('全部');
    }
  
}

//获取当前日期
function getDateStr(AddDayCount) {
    var dd = new Date();
    dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期 
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1;//获取当前月份的日期 
    var d = dd.getDate();
    return y + "-" + m + "-" + d;
}
//查找
function search()
{
    initPagination();
}
//重置
function reset()
{
    $("#txtstart").val('');
    $("#txtend").val('');
    $("#selorganizationid").val('');
    $('#label-active1').text('全部');
    $("#selcoalfaceid").val('');
    start = null;
    end = null;
}

//保存数据
function saveData()
{
    if ($("#driving").css("display") == "none") {
        save();
    }
    else {
        tsave();
    }

}
//获取工作面
function getCoal(name)
{
    $.ajax({
        url: "../../Controllers/Systems/Coalface.ashx?action=getList",
        type: "post",
        async: false,
        success: function (msg) {
            if (msg != '') {
                $('#' + name).empty();
                var html = '<option value=""> 全部</option>';
                $.each(msg, function (index, org) {
                    html += '<option value="' + org.Coalfaceid + '">' + org.Coalfacecode + '</option>';
                });
                $("#" + name).append(html);
               
            }
        }
    });

}

//获取开掘工程
function getProject(name) {
    $.ajax({
        url: "../../Controllers/Systems/Tunnellingproject.ashx?action=getList",
        type: "post",
        async:false,
        success: function (msg) {
            if (msg != '') {
                $('#' + name).empty();
                var html = '<option value="">全部 </option>';
                $.each(msg, function (index, org) {
                    html += '<option value="' + org.Tunnellingprojectid + '">' + org.Tunnellingprojectname + '</option>';
                });
                $("#" + name).append(html);
            }
        }
    });

}


//-----------------------------------------掘进煤方法---------------------------------------
function initTunnelPagination() {
    var url = "../../Controllers/Production/TunnellingdailyrecordController.ashx?action=getCount";
    //获取总页数
    var ss = "";
    $.ajax({
        type: "POST",
        url: url,
        dataType: 'json',
        data: {
            "start": tstart,
            "end": tend,
            "organizationid": $("#seltorganizationid").val(),
            "miningwellprojectid": $("#selminingwellprojectid").val(),
        },
        success: function (msg) {
            if (msg != '') {
                if (msg.IsSuccess == "true") {
                    var initPagination = function () {
                        // 创建分页
                        $("#tunnlPagination").pagination(parseInt(msg.Count), {
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
                            url: "../../Controllers/Production/TunnellingdailyrecordController.ashx?action=getPageList",
                            type: "post",
                            data: {
                                "page": index,
                                "rows": pagesize, //每页显示页数
                                "start": tstart,
                                "end": tend,
                                "organizationid": $("#seltorganizationid").val(),
                                "miningwellprojectid": $("#selminingwellprojectid").val(),
                            },
                            success: function (data) {
                                $('#tunnelCoals tbody').empty();
                                var row = "";
                                $.each(data.rows, function (key, val) {
                                    row += '  <tr class="listDataTr">'
                                           + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                           + ' <a href="javaScript:void(0)"title="' + val.organizationname + '" >' + val.organizationname + '</a>'
                                           + ' </td>'
                                           + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                           + ' <a href="javaScript:void(0)" title=' + val.miningwellprojectname + '>' + val.miningwellprojectname + '</a>'
                                           + ' </td>'
                                           + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                           + ' <a href="javaScript:void(0)" title=' + val.tunneltype + '>' + val.tunneltype + '</a>'
                                           + ' </td>'
                                           + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                           + ' <a href="javaScript:void(0)" title=' + val.daycompletion + '>' + val.daycompletion + '</a>'
                                           + ' </td>'
                                           + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                           + ' <a href="javaScript:void(0)" onclick="tedit(\'' + val.organizationid + '\',\'' + val.miningwellprojectid + '\',\'' + val.daycompletion + '\',\'' + val.tunnellingdailyrecordid + '\',\'' + val.organizationname + '\')">编辑</a>'
                                            + ' <a href="javaScript:void(0)" onclick="del(\'' + val.tunnellingdailyrecordid + '\',2)">删除</a>'
                                           + ' </td>'
                                           + ' </tr>';
                                });
                                $("#tunnelCoals tbody").append(row);
                            }
                        });
                        return false;
                    }
                    //ajax加载
                    $("#tunnlhiddenresult").load("load.html", null, initPagination);

                }
            }
        }
    });
}
//保存数据
function tsave() {
    var url = "";
    if ($("#torganizationid").val() == "") {
        alert("请选择单位！");
       return;
    }
    if ($("#miningwellprojectid").val() == "") {
        alert("请选择施工地点！");
       return;
    }
    if ($("#tdaycompletion").val() == "") {
        alert("请输入每日完成量！");
       return;
    }
    if (isNaN($("#tdaycompletion").val())) {
        alert("完成量请输入数字！");
       return;
    }
    if (!isAdd) {
        url = "../../Controllers/Production/TunnellingdailyrecordController.ashx?action=update";
    }
    else {
        url = "../../Controllers/Production/TunnellingdailyrecordController.ashx?action=add";
    }
    $.ajax({
        url: url,
        type: "post",
        data: {
            "organizationid": $("#torganizationid").val(),
            "miningwellprojectid": $("#miningwellprojectid").val(),
            "daycompletion": $("#tdaycompletion").val(),
            "tunnellingdailyrecordid": $("#tunnellingdailyrecordid").val()
        },
        success: function (data) {
            data = eval('(' + data + ')');
            if (data.IsSuccess == "true") {
                if (isAdd) {
                    alert("材料编码添加成功！");
                }
                else {
                    alert("材料编码编辑成功！");
                    $(".cd-popup").removeClass('is-visible');
                    parent.deleteGlobalShade();
                }
                //刷新table
                initTunnelPagination();
            }
        }
    });
}

//更新数据
function tedit(organizationid, miningwellprojectid, daycompletion, tunnellingdailyrecordid,organizationname) {

    isAdd = false;
   // getOrganization("treeOrganization4", 4);
    getProject("miningwellprojectid");
    $("#divcoalmines").css('display', 'none');
    $("#divcoatunnel").css('display', 'block');
    $("#torganizationid").val(organizationid);
    $("#miningwellprojectid").val(miningwellprojectid);
    $("#tdaycompletion").val(daycompletion);
    $("#tunnellingdailyrecordid").val(tunnellingdailyrecordid);
    $('.cd-popup').addClass('is-visible');
    parent.globalShade();
    $('.aui_icon').html("编辑掘进煤");
    $('#label-active4').text(organizationname);

}
//查找
function tsearch() {
    initTunnelPagination();
}
//重置
function treset() {
    $("#txttunnelstart").val('');
    $("#txttunnelend").val('');
    $("#seltorganizationid").val('');
    $("#selminingwellprojectid").val('');
    $('#label-active2').text('全部');
    tstart = null;
    tend = null;
}


//加载部门
function getOrganization(name, type) {
    $.ajax({
        type: "POST",
        url: "../../Controllers/Systems/OrganizationController.ashx?action=getList",
        dataType: 'json',
        success: function (msg) {
            if (msg != '') {
                $('#' + name).empty();
                var html = '';
                $.each(msg, function (index, org) {
                    html += ' <li><a data-label="' + org.organizationname + '" data-id="#"  onclick="getId(\'' + org.organizationid + '\',\'' + org.organizationname + '\',' + type + ')">' + org.organizationname + '</a>';
                    if (org.children != null) {
                        html += getTree(org.children, type);
                    }
                    html += '</li>';

                });
                html = '<li><a data-label="全部" href="#" onclick="getId(\'\',\'全部 \',' + type + ')">全部</a> <ul>' + html + '  </ul> </li>';
                $('#' + name).html(html);
                if (type==4) {
                    initTree();
                    $(".tree").treemenu({ delay: 300 }).openActive();
                }
             
            }
        }
    });
}

//生成树
function getTree(orgs, type) {
    var html = ' <ul>';
    for (var i = 0; i < orgs.length; i++) {
        var org = orgs[i];
        html += ' <li><a data-label="' + org.organizationname + '" href="#" onclick="getId(\'' + org.organizationid + '\',\'' + org.organizationname + '\',' + type + ')">' + org.organizationname + '</a>';
        if (org.children != null) {
            html += getTree(org.children,type);
        }
        html += '</li>';
    }
    html += '</ul>';
    return html;
}
//获取下拉树的id
function getId(id, category, type) {
    switch (type) {
        case 1:
            $("#selorganizationid").val(id)
            $('#label-active1').text(category);
            break;
        case 2:
            $("#seltorganizationid").val(id)
            $('#label-active2').text(category);
            break;
        case 3:
            $("#organizationid").val(id)
            $('#label-active3').text(category);
            break;
        case 4:
            $("#torganizationid").val(id)
            $('#label-active4').text(category);
            break;
    }
}

//删除
function del(id, type) {
    var url = "";
    confirmInfor("确定要该记录吗？", function () {
        if (type == 1) {
            url = "../../Controllers/Production/CoalminedailyrecordController.ashx?action=delete";
        }
        else {
            url = "../../Controllers/Production/TunnellingdailyrecordController.ashx?action=delete";

        }
        $.ajax({
            type: "POST",
            url: url,
            dataType: 'json',
            data: { 'id': id },
            success: function (msg) {
                if (msg != '') {
                    msg = eval('(' + msg + ')')
                    if (msg.IsSuccess == 'true') {
                        //刷新table
                        if (type == 1) {
                            initPagination();
                        }
                        else {
                            initTunnelPagination();

                        }
                        initPagination();
                    }
                    alert(msg.Message);
                }
            }
        });
    }, function () { });

  
}