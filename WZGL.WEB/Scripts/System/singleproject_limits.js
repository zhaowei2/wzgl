var singleprojectType;
var singleprojectLimits;
var inputDateId = '';
var limitss = [];
$(function () {
    getOrgLimitsList();
});
//点击保存时间


$(".btn_save").on("click", function () {
     limitss = [];

    var trList = $("table#limitsset tbody tr");
    for (var i = 0, inputList = []; i < trList.length; i++) {
        var ids = '';
        if (($("#" + trList[i].id + " td input:checked").length > 0)) {
            ids = trList[i].id + ',';
        }
        else {
            continue;
        }
        //if(trList[i])
        inputList[i] = $(trList[i]).find("input");
        for (var j = 0; j < inputList[i].length; j++) {
            if (inputList[i][j].checked == true) {
                ids += inputList[i][j].getAttribute("data_id") + '+';
            }
        }
        limitss.push(ids);
    }

    var limits = JSON.stringify(limitss);

    $.ajax({
        type: "POST",
        url: "../../Controllers/Systems/Singleproject_limitsController.ashx?action=configSingleprojectLimits",
        dataType: 'json',
        data: { 'SingleprojectLimits': limits},
        success: function (msg) {
            if (msg != '') {
                msg = eval('(' + msg + ')');
               
                    alert(msg.Message);
                
            }

        }
    });
})
//生成单项工程部门配置列表
function getOrg() {
    $.ajax({
        type: "POST",
        url: "../../Controllers/Systems/Singleproject_limitsController.ashx?action=getOrgList",
        dataType: 'json',
        success: function (msg) {
            if (msg != '') {
                msg = eval('(' + msg + ')');
                if (msg.IsSuccess == "true") {

                    data = eval('(' + msg.Message + ')');
                    //$('#limitsset tobdy').empty();
                    var html = '';

                    $.each(data, function (index, org) {

                        if (org.organizationid == '4C030409-DAE7-4154-A7EC-C6684AE78C6D') {
                            var yy = '';
                        }
                        //筛选出部门的单项工程权限
                        var Limitss = $.grep(singleprojectLimits, function (Limits) {
                            return Limits.organizationid == org.organizationid;
                        });

                        var Limitss = JSON.stringify(Limitss);

                        html += '  <tr id="' + org.organizationid + '"> '
                               + '<td class="part0"><span></span>' + org.organizationname + '</td>';


                        $.each(singleprojectType, function (indext, type) {
                            var checked = '';
                            if (Limitss.indexOf(type.itemid) != -1) {
                                checked = 'checked="checked"';
                            }

                            html += '<td><input type="checkbox" data_id="' + type.itemid + '"  ' + checked + ' /><label>' + type.itemname + '</label></td>';

                        });

                        html += '</tr>';

                    });


                    $('#limitsset tbody').html(html);

                }
                else {
                    alert(msg.Message);
                }
            }

        }
    });
}

//获取单项工程类型
function getSingleprojectType() {
    $.ajax({
        type: "POST",
        url: "../../Controllers/Systems/Singleproject_limitsController.ashx?action=getSingleprojectType",
        dataType: 'json',
        success: function (msg) {
            if (msg != '') {
                msg = eval('(' + msg + ')');
                if (msg.IsSuccess == "true") {

                    singleprojectType = eval('(' + msg.Message + ')');

                    getOrg();
                }
                else {
                    alert(msg.Message);
                }
            }

        }
    });
}

//获取部门单项工程权限
function getOrgLimitsList() {
    $.ajax({
        type: "POST",
        url: "../../Controllers/Systems/Singleproject_limitsController.ashx?action=getOrgLimitsList",
        dataType: 'json',
        success: function (msg) {
            if (msg != '') {
                msg = eval('(' + msg + ')');
                if (msg.IsSuccess == "true") {

                    singleprojectLimits = eval('(' + msg.Message + ')');

                    getSingleprojectType();
                }
                else {
                    alert(msg.Message);
                }
            }

        }
    });
}


