var isAdd = true;
var capitalapplicantid='';
$(function () {
    var Data=new Date();
    capitalapplicantid=GetQueryString("capitalapplicantid");
    //1.获取资金申请数据
    $.ajax({
        type: "POST",
        url: '../../Controllers/Capital/Capital.ashx?action=getList&capitalapplicantid=' + capitalapplicantid,
        dataType: 'json',
        success: function (msg) {
            $.each(msg.rows, function (key, val) {
                $("#txt_capitalapplicantid").val(val.capitalapplicantid);
                $("#inp1").val(val.submitdate);
                $("#txt_ApplicationNo").val(val.applicationno);
                $("#txt_ApplicantName").val(val.applicantname);
                $("#txt_OrganizationName").val(val.organizationname);
                $("#txt_Organizationid").val(val.organizationid); 
                $("#txt_Applicantamount").val(val.applicantamount);
                $("#txt_Approveamount").val(val.approveamount);
                $("#txt_Instructions").val(val.instructions);    
            })
        }
    });

    $('#btnsave').click(function () {
        save();
    });
    $('#btnsubmit').click(function () {
        SubMit();
    });
});

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

function SubMit() {
    if (!isCheck) {
        return;
    } 
    var data = '[{"capitalapplicantid":"' + $('#txt_capitalapplicantid').val() + '","organizationid":"' + $('#txt_Organizationid').val() + '","applicantname":"' + $('#txt_ApplicantName').val() + '","instructions":"' + $('#txt_Instructions').val() + '","applicantamount":"' + $('#txt_Applicantamount').val() + '","approveamount":"' + $('#txt_Approveamount').val() + '","submitdate":"' + $('#inp1').val() + '","remitdate":"' + $('#inp1').val() + '","applicationno":"' + $("#txt_ApplicationNo").val() + '"}]';
    $.ajax({
        type: "POST",
        url: "../../Controllers/Capital/Capital.ashx?action=updateFlow&type=send",
        dataType: 'json',
        data: {
            "data": data
        },
        success: function (msg) {
            if (msg.IsSuccess == "true") {
                alert(msg.Message);
                window.location = "CapitalSelect.html";
            }
            else {
                alert(msg.Message);
            }
        }
    });
}

//保存数据
function save() {
    if (!isCheck()) {
        return;
    }
    var data = '[{"capitalapplicantid":"' + $('#txt_capitalapplicantid').val() + '","organizationid":"' + $('#txt_Organizationid').val() + '","applicantname":"' + $('#txt_ApplicantName').val() + '","instructions":"' + $('#txt_Instructions').val() + '","applicantamount":"' + $('#txt_Applicantamount').val() + '","approveamount":"' + $('#txt_Approveamount').val() + '","submitdate":"' + $('#inp1').val() + '","remitdate":"' + $('#inp1').val() + '","applicationno":"' + $("#txt_ApplicationNo").val() + '"}]';

    $.ajax({
        url: "../../Controllers/Capital/Capital.ashx?action=updateFlow&type=1",
        type: "post",
        dataType: 'json',
        data: {
            "data": data
        },
        success: function (data) {
           // data = eval('(' + data + ')');
            if (data.IsSuccess == "true") {
                alert(data.Message);
                window.location = "CapitalSelect.html";
            }
        }
    });
}
function isCheck() {
    if ($("#txt_Applicantamount").val() == "") {
        alert("请填写申请金额！");
        return false;
    }
    if (isNaN($("#txt_Applicantamount").val())) {
        alert("申请金额请输入数字！");
        return false;
    }
    return true;
}

function Rtn() {
     
}
