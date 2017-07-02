/** * Created by zhao8 on 2017/1/8. */window.alert = function (str) {    //var str=str;    if (document.getElementById("shield") == null || document.getElementById("alertFram" == null)) {
        creatAlert(str);
    } else {
        //document.getElementById("shield").remove();        $("#shield").remove();        //document.getElementById("alertFram").remove();        $("#alertFram").remove();        creatAlert(str);
    }
};window.confirmInfor = function (str, okCb, cancelCb) {
    if (document.getElementById("shield1") == null || document.getElementById("alertFram1" == null)) {
        creatConfirm(str, okCb, cancelCb);
    } else {
        $("#shield1").remove();        //document.getElementById("alertFram1").remove();        $("alertFram1").remove();        creatConfirm(str, okCb, cancelCb);
    }
};$(document).ready(function () {
    //窗口大小变更事件
    $(window).resize(function () {
        $("#alertFram").css("left", window.innerWidth / 2 - 285 + "px");
        $("#alertFram1").css("left", window.innerWidth/2-285+"px");
    });
});//生成alert窗口function creatAlert(str) {
    var shield = document.createElement("DIV");    shield.id = "shield";    shield.style.position = "absolute";    shield.style.left = "0px";    shield.style.top = "0px";    shield.style.width = "100%";    shield.style.height = window.innerHeight + "px";    shield.style.background = "transparent";    shield.style.textAlign = "center";    shield.style.zIndex = "999";    var alertFram = document.createElement("DIV");    alertFram.id = "alertFram";    alertFram.style.position = "absolute";    alertFram.style.left = "50%";    alertFram.style.top = "50%";    alertFram.style.marginLeft = "-220px";    alertFram.style.marginTop = "-75px";    alertFram.style.width = "250px";    alertFram.style.height = "50px";    alertFram.style.background = "#EF5F21;";    alertFram.style.textAlign = "center";    alertFram.style.lineHeight = "50px";    alertFram.style.zIndex = "1000";    strHtml = "<div style='background:#DDD;border:1px solid #DDD;border-radius:5px;width: 100%;height: 100%;font-weight:800;'>" + str + "</div>";    alertFram.innerHTML = strHtml;    document.body.appendChild(alertFram);    document.body.appendChild(shield);    parent.alertShade();    var doAlpha = function () {
       //alertFram.style.display = "none";        $(alertFram).fadeOut();        $(shield).fadeOut();        //$(shield).fadeToggle();        //shield.style.display = "none";        parent.deleteAlertShade();
    };    setTimeout(doAlpha, 500);    alertFram.focus();    document.body.onselectstart = function () { return false; };
}function creatConfirm(str, okCb, cancelCb) {
    var windowWid =(parseInt(window.innerWidth))/2-285;
    var shield = document.createElement("DIV");    shield.id = "shield1";    shield.style.position = "absolute";    shield.style.left = "0px";    shield.style.top = "0px";    shield.style.width = "100%";    shield.style.height = window.innerHeight + "px";    shield.style.background = "transparent";    shield.style.textAlign = "center";    shield.style.zIndex = "999";    var alertFram = document.createElement("DIV");    alertFram.id = "alertFram1";    alertFram.style.position = "absolute";    alertFram.style.left = windowWid+"px";    alertFram.style.top = "20%";    //alertFram.style.marginLeft = "-225px";    alertFram.style.marginTop = "-75px";    alertFram.style.width = "350px";    alertFram.style.height = "100px";    alertFram.style.background = "#EF5F21;";    alertFram.style.textAlign = "center";    alertFram.style.lineHeight = "150px";    alertFram.style.zIndex = "1000";;    strHtml = "<ul style='list-style: none;border:1px solid #ddd;background:#fff;padding-bottom:10px;border-radius:4px;'>" +                "<li style='background:#0C87DE;padding:0 10px;text-align:left;font-size:14px;font-weight:bold;height:25px;line-height:25px;color:#fff;'>提示</li>" +                "<li style='background:#fff;padding:0 10px;text-align:center;font-size:14px;height:120px;line-height:120px;color:#2C9FCA;'>" + str + "</li>" +                 "<li id='threeLi' style='font-weight:bold; 10px;height:25px;line-height:25px;'>" +                   "<a  style='border-radius:3px;margin-right: 10px;;color:#fff;padding:3px 10px;' class='alertEve'>确认</a>" +                  "<a  style='border-radius:3px;color:#fff;padding:3px 10px;' class='confirmEve'>取消</a>" +                "</li>" +             "</ul>";    alertFram.innerHTML=strHtml;    document.body.appendChild(alertFram);    document.body.appendChild(shield);    parent.alertShade();    var enterEvent = document.getElementsByTagName("body")[0];    enterEvent.addEventListener("click", function (event) {
        var a = 1;        var target = event.target;        if (target.className == "alertEve") {
            enter();
        }        if (target.className == "confirmEve") {
            cancle();
        }
    });    function enter() {
        //console.log(okCb);
        okCb();        $(alertFram1).fadeOut();        $(shield1).fadeOut();        parent.deleteAlertShade();    }    function cancle() {
        //console.log(cancelCb);
        cancelCb();       $(alertFram1).fadeOut();        $(shield1).fadeOut();        parent.deleteAlertShade();    }    alertFram.focus();    document.body.onselectstart = function () { return false; };
}