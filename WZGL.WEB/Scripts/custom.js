/**    通用查询部分*********/
$(document).ready(function () {
    $(".search").click(function () {
        $(".searchFromTable").slideToggle("slow");
    });
});

/**         生产记录部分*************/
$(".tabs-itm").click(function () {
    var l = $(this).attr("id");
    if (l == "active1") {
        $("#active1").addClass("active-box");
        $("#active2").removeClass("active-box");
        $("#active3").removeClass("active-box");
        $("#yield").show();
        $("#driving").hide();
        $("#stocking").hide();

    } else if (l == "active2") {
        $("#active2").addClass("active-box");
        $("#active1").removeClass("active-box");
        $("#active3").removeClass("active-box");
        $("#yield").hide();
        $("#driving").show();
        $("#stocking").hide();
    }
    else if (l == "active3") {
        $("#active3").addClass("active-box");
        $("#active1").removeClass("active-box");
        $("#active2").removeClass("active-box");
        $("#yield").hide();
        $("#driving").hide();
        $("#stocking").show();

    }
});



/**         我的账号部分*************/
$(".tabs-itm").click(function () {
    var id = $(this).attr("id");
    if (id == "record") {
        $("#record").addClass("active-box");
        $("#application").removeClass("active-box");
        $("#jl").show();
        $("#sq").hide();
    } else if (id == "application") {
        $("#record").removeClass("active-box");
        $("#application").addClass("active-box");
        $("#sq").show();
        $("#jl").hide();
    }

})

//获取当天日期时分秒的字符串形式
function getNowFormatDate(name) {
    var date = new Date();
    var seperator1 = "";
    var seperator2 = "";
    var month = date.getMonth() + 1;//月
    var strDate = date.getDate();//日
    var strHour = date.getHours();//时
    var strMin = date.getMinutes();//分
    var strSec = date.getSeconds();//秒
    var strMill = date.getMilliseconds();//毫秒

    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    if (strHour >= 0 && strHour <= 9) {
        strHour = "0" + strHour;
    }
    if (strMin >= 0 && strMin <= 9) {
        strMin = "0" + strMin;
    }
    if (strSec >= 0 && strSec <= 9) {
        strSec = "0" + strSec;
    }
    if (strMill >= 0 && strMill <= 9) {
        strMill = "00" + strMill;
    } else if (strMill >= 10 && strMill <= 99) {
        strMill = "0" + strMill;
    }

    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + strHour + seperator2 + strMin + seperator2 + strSec + seperator2 + strMill;
    if (name != null && name != undefined && name != "") {
        return name + currentdate;
    }
    return currentdate;
}
//获取url传值的参数值
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;

}

//获取主流程状态名字
function GetFlowStatusName(status) {
    switch (status) {
        case "": return "未启动"; break;
        case "0": return "未启动"; break;
        case "1": return "审核中"; break;
        case "R": return "被拒绝"; break;
        case "E": return "已结束"; break;
    }
}

//获取每一步的步骤名称
function GetStepStatusName(status) {
    if (status == "0") {
        return "未启动";
    } else if (status == "1") {
        return "发起流程";
    }
    else if (status == "B") {
        return "打回上一步";
    }
    else if (status == "S") {
        return "打回发起人";
    }
    else if (status.indexOf('-') > -1) {
        return "未审核";
    }
    else {
        return "审核通过";
    }
}


