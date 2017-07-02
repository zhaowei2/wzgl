var isAdd = true;

$(function () {

    var Data=new Date();
    //1.初始化日期控件
    //calender("#inp1").init({
    //    format: 'yyyy-MM-dd',
    //    date: [Data.getFullYear(), Data.getMonth+1, Data.getDate()],
    //    button: true
    //}, function (date) {
    //    this.value = date
    //});
    $("#inp1").val(getNowFormatDate1(Data));
    
    $("#txt_ApplicationNo").val(getNowFormatDate("ZJGL"));

    //1.获取当前登录人信息加载到控件
    $.ajax({
        type: "POST",
        url: '../../Controllers/Capital/Capital.ashx?action=getUser',
        dataType: 'json',
        success: function (msg) {
            $("#txt_OrganizationName").val(msg.organizationname);
            $("#txt_Organizationid").val(msg.organizationid);
            $("#txt_ApplicantName").val(msg.name);
        }
    });

    $('.btn_save').click(function () {
        save();
    });
    $('.btn_commit').click(function () {
        SubMit();
    });
    //$('.btn_return').on('click', function (event) {
    //    $(".cd-popup").removeClass('is-visible');
    //    parent.deleteGlobalShade();
    //});

});

//获取当前时间组成YYYY-MM-DD
function getNowFormatDate1(date) {
    var seperator1 = "-";
    var seperator2 = ":";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
}




function SubMit() {
    if (!isCheck()) {
        return;
    }
    var data = '[{"capitalapplicantid":"","organizationid":"' + $('#txt_Organizationid').val() + '","applicantname":"' + $('#txt_ApplicantName').val() + '","instructions":"' + $('#txt_Instructions').val() + '","applicantamount":"' + $('#txt_Applicantamount').val() + '","approveamount":"' + $('#txt_Approveamount').val() + '","submitdate":"' + $('#inp1').val() + '","remitdate":"' + $('#inp1').val() + '","applicationno":"' + $("#txt_ApplicationNo").val()+'"}]';
    $.ajax({
        type: "POST",
        url: "../../Controllers/Capital/Capital.ashx?action=addFlow&type=send",
        dataType: 'json',
        data: {
            "data": data
        },
        success: function (msg) {
            if (msg.IsSuccess == "true") {
                alert(msg.Message);
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
    var data = '[{"capitalapplicantid":"","organizationid":"' + $('#txt_Organizationid').val() + '","applicantname":"' + $('#txt_ApplicantName').val() + '","instructions":"' + $('#txt_Instructions').val() + '","applicantamount":"' + $('#txt_Applicantamount').val() + '","approveamount":"' + $('#txt_Approveamount').val() + '","submitdate":"' + $('#inp1').val() + '","remitdate":"' + $('#inp1').val() + '","applicationno":"' + $("#txt_ApplicationNo").val() + '"}]';
    $.ajax({
        url: "../../Controllers/Capital/Capital.ashx?action=addFlow&type=1",
        type: "post",
        dataType: 'json',
        data: {
            "data": data
            //"ApplicantName": $("#txt_ApplicantName").val(),
            //"OrganizationName": $("#txt_OrganizationName").val(),
            //"Organizationid": $("#txt_Organizationid").val(),
            //"Submitdate": $("#inp1").val(),
            //"Applicantamount": $("#txt_Applicantamount").val(),
            //"Approveamount": $("#txt_Approveamount").val(),
            //"Instructions": $("#txt_Instructions").val(),
            //"ApplicationNo": $("#txt_ApplicationNo").val()
        },
        success: function (data) {
           // data = eval('(' + data + ')');
            if (data.IsSuccess == "true") {
                //刷新table
                //initPagination();
                alert(data.Message);
            }
            else {
                alert("1111111111");
            }
        }
    });
}


function isCheck()
{
    if ($("#txt_Applicantamount").val() == "") {
        //alert("请填写申请金额！");
        $("#capitalWarn").html("请填写申请金额")
        errorMess();
        return false;
    }
    if (isNaN($("#txt_Applicantamount").val())) {
        //alert("申请金额请输入数字！");
        $("#capitalWarn").html("申请金额请输入数字")
        errorMess()
        return false;
    }
    return true;
}


function Rtn() {

}
//错误提示体验部分
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
