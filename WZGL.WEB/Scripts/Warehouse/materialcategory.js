var isAdd = true;
var pagesize = 10;
var catetory = '';
$(function () {
    getData();
    getCategory();
});
//-----------------------------------------材料类别类别方法---------------------------------------
//保存数据
function save(state, e) {
    var url = "";
    if (state == 2) {
        url = "../../Controllers/Warehouse/MaterialcategoryController.ashx?action=update";
    }
    else {
        url = "../../Controllers/Warehouse/MaterialcategoryController.ashx?action=add";
    }
    if (state == undefined) {
        if ($("#categoryname").val() == '') {
            alert("请输入名称！");
            return;
        }
        inputName = $("#categoryname").val();
        id = 0;
        level = 1;
    }
    //判断同级树下是否有重名
    if (isExit()=="true") {
        alert("该级目录下已存在该材料类别！");
        return;
    }
    $.ajax({
        url: url,
        type: "post",
        data: {
            "materialcategoryid": id,
            "categoryname": inputName,
            "parentcategoryid": id,
            "level": level
        },
        success: function (data) {
            data = eval('(' + data + ')');
            if (data.IsSuccess == "true") {
                //刷新table

                var cls = '';
                switch (level) {
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
                if (state == 2) {
                    alert("材料类别修改成功！");
                    $(e).parent().parent().empty().append('<td class="' + cls + '"><span><b style="display:none">' + id + ',' + level + '</b></span><i>' + inputName + '</i></td><td><a class="addChirdren" href="javascript:void(0)"  >添加子级</a> <a class="amend" href="javascript:void(0)"  >编辑</a> <a class="delete" href="javascript:void(0)"  >删除</a></td>>')
                }
                else {
                    alert("材料类别添加成功！");
                    if (e == null) {
                        $(".cd-popup").removeClass('is-visible');
                        parent.deleteGlobalShade();
                        $('table#sectionInterface tbody').append('<tr><td class="' + cls + '"><span><b style="display:none">' + data.id + ',' + level + '</b></span><i>' + inputName + '</i></td><td><a class="addChirdren" href="javascript:void(0)"  >添加子级</a>&nbsp;&nbsp; <a class="amend" href="javascript:void(0)"  >编辑</a>&nbsp;&nbsp;<a class="delete" href="javascript:void(0)"  >删除</a></td></tr>');
                        //  $('table#sectionInterface tbody').append('<tr><td class="' + cls + '"><span><b style="display:none">' + data.id + ',' + level + '</b></span><i>' + inputName + '</i></td><td><a class="addChirdren" href="javascript:void(0)"  >添加子级</a>&nbsp;&nbsp; <a class="amend" href="javascript:void(0)"  >编辑</a>&nbsp;&nbsp;<a class="delete" href="javascript:void(0)"  >删除</a></td></tr>');

                    }
                    else {
                        $(e).parent().parent().empty().append('<td class="' + cls + '"><span><b style="display:none">' + data.id + ',' + level + '</b></span><i>' + inputName + '</i></td><td><a class="addChirdren" href="javascript:void(0)"  >添加子级</a> &nbsp;&nbsp;<a class="amend" href="javascript:void(0)"  >编辑</a>&nbsp;&nbsp; <a class="delete" href="javascript:void(0)"  >删除</a></td>');
                    }
                }

            }
        }
    });
}
//判断同级树下是否有重名
function isExit()
{
    var result = false;
    $.ajax({
        type: "POST",
        url: "../../Controllers/Warehouse/MaterialcategoryController.ashx?action=isExit",
        dataType: 'json',
        async: false,
        data: {
            "categoryname": inputName,
            "parentcategoryid": id,
            "id": (status == 2) ? id : ""
        },
        success: function (msg) {
            if (msg != '') {
                msg = eval('(' + msg + ')')
                result = msg.IsSuccess;
            }
        }
    });
    return result;
}

//删除
function del(e) {

    confirmInfor("确定要删除该材料类别吗？", function () {
        $.ajax({
            type: "POST",
            url: "../../Controllers/Warehouse/MaterialcategoryController.ashx?action=delete",
            dataType: 'json',
            data: { 'materialcategoryid': id },
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
    }, function () { });



}

//显示添加页面
function add() {
    $("#categoryname").val('');
    parent.globalShade();
    $('.cd-popup').addClass('is-visible');
    $('.aui_icon').html("添加材料类别");
    $('.label-active').text('全部');
}

//查找
function search() {
    getData();
}

//重置
function reset() {
    $("#txtcategoryname").val('');
    $('.label-active').text('全部');
    catetory = '';
}

//获取材料类别列表
function getData() {
    $.ajax({
        type: "POST",
        url: "../../Controllers/Warehouse/MaterialcategoryController.ashx?action=getList",
        dataType: 'json',
        data: {
            "categoryname": $("#txtcategoryname").val(),
            "parentcategoryid": catetory
        },
        success: function (msg) {
            if (msg != '') {
                html = '<table id="sectionInterface" class="table table-responsive">'
                  + '<thead> <tr class="listDataTh" style="background: #F4F5F5;">'

                        + '<td width="" title="材料类别" class="listDataThTd nowrap" style="overflow:hidden;white-space:nowrap;text-overflow: ellipsis;vertical-align:middle; " >'
                          + '<a style="cursor:pointer" href="javascript:void(0)"  >材料类别</a>'
                         + ' </td>'
                         + ' <td width="" title="操作" class="listDataThTd nowrap" style="overflow:hidden;white-space:nowrap;text-overflow: ellipsis; vertical-align:middle; text-align:center ">'
                         + ' <a style="cursor:pointer" href="javascript:void(0)"  >操作</a>'
                         + ' </td>'

                           + '   </tr></thead>'
                  + ' <tbody>';
                getTree(msg)

                html += '</tbody></table>';

                $('#orgview').html(html);

            }
        }
    });
}

//生成树
function getTree(orgs) {
    $.each(orgs, function (index, org) {
        var cls = '';
        switch (org.matlevel) {
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
            case '5':
                cls = 'part4';
                break;
            default:
                cls = 'part5';
                break;
        }
        html += '<tr>'
                + '<td class="' + cls + '"><span><b style="display:none">' + org.materialcategoryid + ',' + org.matlevel + '</b></span><i>' + org.categoryname + '</i></td>'
                + '<td>'
                + '<a class="addChirdren" href="javascript:void(0)"  >添加子级</a>&nbsp;&nbsp;'
                + '<a class="amend" href="javascript:void(0)"  >编辑</a>&nbsp;&nbsp;'
                + '<a class="delete" href="javascript:void(0)"  >删除</a>'
                + '</td>'
                + '</tr>';
        if (org.children != null) {
            getTree(org.children);
        }

    });
}

//加载材料类型
function getCategory() {
    $.ajax({
        type: "POST",
        url: "../../Controllers/Warehouse/MaterialcategoryController.ashx?action=getList",
        dataType: 'json',
        success: function (msg) {
            if (msg != '') {
                $('#treeCategory').empty();
                var html = '';
                $.each(msg, function (index, org) {
                    html += ' <li><a data-label="' + org.categoryname + '" data-id="#"  onclick="getId(\'' + org.materialcategoryid + '\',\'' + org.categoryname + '\')">' + org.categoryname + '</a>';
                    if (org.children != null) {
                        html += getComTree(org.children);
                    }
                    html += '</li>';
                });
                html = '<li><a data-label="全部" href="javascript:void(0)"   onclick="getId(\'\',\'全部 \')">全部</a> <ul>' + html + '  </ul> </li>';
                $('#treeCategory').html(html);
                initTree();
                $(".tree").treemenu({ delay: 300 }).openActive();
            }
        }
    });
}

//生成树
function getComTree(orgs) {
    var shtml = ' <ul>';
    for (var i = 0; i < orgs.length; i++) {
        var org = orgs[i];
        shtml += ' <li><a data-label="' + org.categoryname + '" href="javascript:void(0)"   onclick="getId(\'' + org.materialcategoryid + '\',\'' + org.categoryname + '\')">' + org.categoryname + '</a>';
        if (org.children != null) {
            shtml += getComTree(org.children);
        }
        shtml += '</li>';
    }
    shtml += '</ul>';
    return shtml;
}

//获取下拉树的id
function getId(id, category) {
    catetory = id;
    $('#label-active1').text(category);

}
