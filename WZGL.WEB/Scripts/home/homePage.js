/**
 * Created by Hoswing on 2016/12/9.
 */
//点击切换流程

window.onload = function () {
    $("#portal").html("<div class='tabs-item-wrapper showBlock'><iframe id='d1' src='material.html'></iframe></div>");
        
        
        //labelListContent.onload = function () {
        //    //console.log()
        //}
};
$("#home").on("click", function () {
    $("#portal").html("<div class='tabs-item-wrapper showBlock'><iframe id='d1' src='material.html'></iframe></div>");
})
$(document).ready(function () {
    //窗口大小变更事件
    $(window).resize(function () {
        setThumbnailList();
    });
    
    
});
$(function () {
    //storeManagement();
    addNav();//添加导航
    createNav();
    addDAta();
    getUserData();
    getUserRole();
});
function addBadageLabel() {
    $("#badgeLabel").empty().html($("#navWidth li").length);
}
$('.transaction').on("click", function (e) {
    var target = e.target;
    //console.log($(target).attr("class"));
    if ($(target).attr("class").indexOf("clickSwitcher") !== -1 && target.id == "handle") {
        $(target).removeClass("clickSwitcher").siblings().addClass('clickSwitcher');
        //console.log(target);
        $(target).css("border", "1px solid #ddd").css("borderBottom", "transparent");
        $("#commission").css("border", "1px solid transparent").css("borderBottomColor", "#ddd");
        $("#handleContent").css("display", "block");
        $("#commissionContent").css("display", "none");
    }
    if ($(target).attr("class").indexOf("clickSwitcher") !== -1 && target.id == "commission") {
        $(target).removeClass("clickSwitcher").siblings().addClass('clickSwitcher');
        $(target).css("border", "1px solid #ddd").css("borderBottom", "transparent");
        $("#handle").css("border", "1px solid transparent").css("borderBottomColor", "#ddd");
        $("#handleContent").css("display", "none");
        $("#commissionContent").css("display", "block");
    }

});
// header 用户头像
$('#header .header-userInfor .userPhoto').on('mouseover', function () {
    $('#header .header-userInfor .user-control').addClass("expansionShow").removeClass("expansionHide");
    $('#header .header-userInfor .userPhoto').css("backgroundColor", "#2197DD");
});
$('#header .header-userInfor .userPhoto').on('mouseout', function () {
    $('#header .header-userInfor .user-control').removeClass("expansionShow").addClass("expansionHide");
    $('#header .header-userInfor .userPhoto').css("backgroundColor", "#0C85BF");
    //$('#header .header-userInfor .userPhoto').css("backgroundColor","#0C86C0");
    //$('#header .header-userInfor .user-control').css("display","none");
});
//732
//686
//788
//742
//设置缩略图ul-padding

function setNavWidth() {
    //var navMaxWidth = parseInt($("#navMaxWidth").css('width'));
    ////console.log(navMaxWidth);
    //var navWidth = parseFloat($("#navWidth").css('width'));
    ////console.log(navWidth);
    //var ulWidth = 0;
    //if (navWidth > (navMaxWidth - 46)) {
    //    $("#navWidth").parent().css("width", (navMaxWidth - 46) + "px");
    //    $("#navWidth").css("position", "absolute");
    //    $("#navWidth").css("left","-"+ (navWidth - navMaxWidth + "px"));
    //    var liListWidth = $("#navWidth li");
    //    for (var i = 0; i < liListWidth.length; i++) {
    //        ulWidth += parseInt($(liListWidth[i]).css("width"));
    //    }
    //    $("#navWidth").css("width",ulWidth+"px")
    //}
    //导航
    var $navTabs = $(".navbar-tabs");
    //ulparent
    var $navTabPanel = $navTabs.find(".navbar-tabs-panel");
    //ul
    var $navTabUl = $navTabPanel.find(".header-nav");
    var $navTabPreview = $("#navbar-tabs-preview");
    var $navTabS = $navTabUl.find(".nav-1.activeBlue");
    var navUlWidth = $navTabS.outerWidth();
    var navPanelWidth = $navTabs.width() - 46;
    
    var liListWidth = $("#navWidth li");
       for (var i = 0; i < liListWidth.length; i++) {
           navUlWidth += parseInt($(liListWidth[i]).css("width"));
      }
    if (navPanelWidth < navUlWidth) {
        $navTabPanel.width(navPanelWidth);
        $navTabUl.width(navUlWidth);
        //var $navTabS = $navTabUl.find(".nav-1.activeBlue");
        var _width = $navTabS.outerWidth();
        var _left = $navTabS.position().left;
        var _right = navUlWidth - _left - _width;
        if (_left > 0) {
            if (_left + _width <= navPanelWidth) {
                $navTabUl.css({
                    "position": "absolute",
                    "left": "0px"
                })
            } else {
                if (_right + _width <= navPanelWidth) {
                    $navTabUl.css({
                        "position": "absolute",
                        "left": "-" + (navUlWidth - navPanelWidth) + "px"
                    })
                } else {
                    $navTabUl.css({
                        "position": "absolute",
                        "left": "-" + parseInt(_left - navPanelWidth / 2) + "px"
                    })
                }
            }
        } else {
            $navTabUl.css({
                "position": "absolute",
                "left": "0px"
            })
        }
    } else {
        $navTabPanel.width("auto");
        $navTabUl.width("auto");
        $navTabUl.css({
            "position": "static",
            "left": "0px"
        })
    }
}
//点击经办流程添加导航
function addNavList(thisNav) {
    //console.log(thisNav);
    console.log("1")
    $("a").removeClass("activeTxt");
    $(thisNav).addClass("activeTxt");
    var thisClassName = ($(thisNav).attr('class'));
    //console.log(thisClassName);
    if (thisNav.className.indexOf("open2") === -1) {
        var navText = thisNav.innerText;
        var navSrc = $(thisNav).attr('href');
        $(thisNav).addClass("open2");
        $("#header .header-nav").append("<li class='nav-1'><a onclick='locationList(this)'  href='" + navSrc + "'>" +
        "" + navText + "</a><i onclick='navClose(this)' class='fa fa-times'></i></li>");
        //添加label标签
        addThumbnail(thisNav);
    }
    $("#header .header-nav a[href=" + $(thisNav).attr('href') + "]").parent().addClass("activeBlue").siblings().removeClass("activeBlue");
    setNavWidth();
    addBadageLabel();
 

}
//添加label标签addThumbnail（）
function addThumbnail(thisNav) {
    //console.log(thisNav); 
    if (thisNav.className.indexOf("open2") !== -1) {
        var tsNavHref = thisNav.getAttribute('href');
        var label = thisNav.innerText;
        var iframeContent = "";
        var labelListContent = $("#portal").html();
        //console.log(labelListContent);
       //
//        VAR D1 = DOCUMENT.GETeLEMENTbYiD("PORTAL");
//        VAR IFRAMECONTER = D1.GETeLEMENTSbYtAGnAME('IFRAME')[0];
//        IFRAMECONTER.ONLOAD = FUNCTION () {
//            IFRAMEcONTENT = IFRAMECONTER;
//        }
//        //CONSOLE.LOG(WINDOW.FRAMES["D1"])
//        CONSOLE.LOG($(IFRAMECONTER.CONTENTdOCUMENT));
//        CONSOLE.LOG(IFRAMECONTER.CONTENTwINDOW.DOCUMENT);
//        CONSOLE.LOG($(IFRAMECONTER.CONTENTwINDOW.DOCUMENT.BODY).HTML());
//        CONSOLE.LOG($("IFRAME").CONTENTS().FIND("BODY").HTML());
//        $("#IFRAME").LOAD(FUNCTION () {
//            ALERT($("IFRAME").CONTENTS().FIND("BODY").HTML());
//
//        });
        //console.log($("#"+tsNavHref))
        //console.log(frames[tsNavHref]);
        ///console.log(window.frames[+tsNavHref].document.getElementById(tsNavHref));
        //var labelListContent=
        //console.log(labelListContent);
        //console.log(labelListContent);
       
        html2canvas(document.getElementById("portal"), {
            onrendered: function (canvas) {
                var img = canvas.toDataURL();
                console.log(img);
                $("#tabsContainer").append('<li><a href="' + tsNavHref + '"><div class="status-box"><span class="status">当前页面</span></div>' +
        '<div class="nav-title">' + label + '</div></a><img style="width:300px;height:200px;" src="' + img + '"/><i class="fa fa-times"></i></li>');
            }
        });
       
        //console.log(labelListContent);
    }
}
//添加
function addNav() {
    var menuList = $('#leftAside #accordion1>li>ul>li>a');
    //console.log(menuList);
    for (var i = 0; i < menuList.length; i++) {
        menuList[i].onclick = function () {

            //console.log(this);
            locationList(this);
            addNavList(this);
            setNavWidth();
        }
    }
}

//点击导航关闭删除导航
function navClose(e) {
    //console.log($(e).parent());
    //console.log($(e).parent()[0].nextSibling);
    var liPrev = ($(e).parent()[0].previousSibling).childNodes;
    //console.log($(e).parent()[0].nextSibling)
    var secondMenuActive;
    var deleteShadeList = $(e).parent("li").children("a")[0].getAttribute("href");//点击获得a的href
    $("#tabsContainer li a[href='" + deleteShadeList + "']").parent().remove();
    if ($(e).parent()[0].nextSibling) {
        var liNextSib = ($(e).parent()[0].nextSibling).childNodes;
        $($(e).parent()[0].nextSibling).addClass('activeBlue');
        $($(e).parent()[0].nextSibling).siblings().removeClass('activeBlue');
        secondMenuActive = $($(e).parent()[0].nextSibling).find("a").attr("href");
        AddSecondMenuActiveBg(secondMenuActive);
        locationList(liNextSib[0]);
        setNavWidth();
    } else {
        //console.log(liPrev.length);
        if (liPrev.length > 1) {
            $($(e).parent()[0].previousSibling).addClass('activeBlue');
            $($(e).parent()[0].previousSibling).siblings().removeClass('activeBlue');
            secondMenuActive = $($(e).parent()[0].previousSibling).find("a").attr("href");
            AddSecondMenuActiveBg(secondMenuActive);
            locationList(liPrev[0]);
            setNavWidth();
        }
        else {
            location.href = "homePage.html";
            setNavWidth();
            $("a").removeClass("activeTxt");
        }
    }
    var eGrandFather = $(e).parent();
    eGrandFather.remove();
    //获得i父元素a的href属�?
    //根据属性找到左边栏的啊a,并且移除class=“open1�?
    var leftNav;
    if (leftNav = $($("#leftAside li a[href=" + $(e).parent().children("a")[0].hash + "]"))) {
        //console.log(leftNav);
        $(leftNav).removeClass("open2");
    }
    addBadageLabel();
}

//项目管理点击生成导航
function createNav() {
    var menuSecondList = $("#test0 li ul.second-menu li.second-menu-item a");
    //console.log(menuSecondList);
    for (var i = 0; i < i.length; i++) {
        menuSecondList[i].onclick = function () {
            //console.log(this)
        }
    }
}

var EventUtil = {
    /* ��Ԫ������¼�������� */
    addHandler: function (element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent('on' + type, handler);
        } else {
            element['on' + type] = handler;
        }
    },
    /*��ȡevent���󷽷�*/
    getEvent: function (event) {
        return event ? event : window.event;
    },
    /*��ȡ�¼�ԴDOMԪ�ط�������Ϊʹ�����¼�ð������Ҫ�ҵ��¼���ԴͷDOM���ж��Ƿ���һ���˵��������¼�*/
    getTarget: function (event) {
        return event.target || event.srcElement;
    }
};

var managemen = document.getElementById("asideContainer");
var CollapsibleMenu = function (firstMenu) {
    this.init(firstMenu);
};
CollapsibleMenu.prototype.init = function (firstMenu) {
    //console.log(firstMenu);
    this.firstMenu = firstMenu;   // ����һ���˵������ul
    this.reset();
    //console.log(firstMenu.querySelectorAll('.second-menu'))
    //this.secondMenus = firstMenu.querySelectorAll('.second-menu');   // ��������˵����ul
    //this.secondMenus = firstMenu.querySelectorAll('li ul.second-menu'); 
    //console.log(this.secondMenus);
    //this.firstMenusName=firstMenu.querySelectorAll('.first-menu-name');
    //console.log(this.firstMenusName);
    //this.activeIndex = -1; // ��ʼactiveIndex
    this.setOnClick();

};
CollapsibleMenu.prototype.reset = function () {
    this.activeIndex = -1;
    this.secondMenus = this.firstMenu.querySelectorAll('li ul.second-menu');
    this.firstMenusName = this.firstMenu.querySelectorAll('.first-menu-name');
};
CollapsibleMenu.prototype.setOnClick = function () {
    EventUtil.addHandler(this.firstMenu, 'click', function (e) {
        var target;
        e = EventUtil.getEvent(e);
        target = EventUtil.getTarget(e);
        //console.log(target);
        if (target.tagName.toUpperCase() === 'A' && target.className.indexOf('first-menu-name') !== -1) {
            this.onFirstMenuNameClick(target);
        } else if (target.parentNode.tagName.toUpperCase() === 'A' && target.parentNode.className.indexOf('first-menu-name') !== -1) {
            this.onFirstMenuNameClick(target.parentNode)
        } else if (target.parentNode.parentNode.tagName.toUpperCase() === 'A' && target.parentNode.parentNode.className.indexOf('first-menu-name') !== -1) {
            this.onFirstMenuNameClick(target.parentNode.parentNode)
        } else if (target.tagName.toUpperCase() === "A" && target.className.indexOf('second-menu-content') !== -1) {
            locationList(target);
            addNavList(target);
        }
    }.bind(this));
};
CollapsibleMenu.prototype.onFirstMenuNameClick = function (event) {
    var secondMenu = event.nextElementSibling;
    if($(secondMenu).css("display")=="block"){
        $(secondMenu).slideUp();
        $(event).removeClass("active");
    } else {
        $(secondMenu).slideDown();
        $(event).addClass("active");
        $(secondMenu).parent().siblings(".first-menu-item").children(".second-menu").slideUp();
        $(event).parent().siblings(".first-menu-item").children().removeClass("active");
    }
//var secondMenuBro = event;
//    var index = this.getSecondMenuIndex(secondMenu);
//    //console.log(index);
//    //console.log(this.activeIndex);
//    if (this.activeIndex === -1) {
//        $(secondMenu).slideDown();
//        //$(secondMenu).css('display','none');
//        secondMenuBro.classList.add("open1");
//        secondMenuBro.classList.add("active");
//        //console.log(secondMenuBro);
//        this.activeIndex = index;
//    } else {
//        //console.log(index);
//        if (this.activeIndex === index) {
//            $(secondMenu).slideUp();
//            //$(secondMenu).css('display','block');
//            //console.log(secondMenu);
//            secondMenuBro.classList.remove('open1');
//            secondMenuBro.classList.remove("active");
//            this.activeIndex = -1;
//        } else {
//            $(this.secondMenus[this.activeIndex]).slideUp();
//            //$(this.secondMenus[this.activeIndex]).css('display','none');
//            this.firstMenusName[this.activeIndex].classList.remove('open1');
//            this.firstMenusName[this.activeIndex].classList.remove('active')
//            $(secondMenu).slideDown();
//            //$(secondMenu).css('display','block');
//            secondMenuBro.classList.add('open1');
//            secondMenuBro.classList.add('active');

//            this.activeIndex = index;
//        }
//    }
};
CollapsibleMenu.prototype.getSecondMenuIndex = function (secondMenu) {
    var secondMenus = this.secondMenus;
    //console.log(secondMenus);
    var i, len;
    for (i = 0, len = secondMenus.length; i < len; i++) {
        if (secondMenus[i] === secondMenu) {
            return i;
        }
    }
    return -2;
};



//功能菜单
//$("#home").on("click", function () {
//    $("#portal").html("<iframe src='material.html'></iframe>");
//})
function locationList(target) {
    //console.log(target);
    var target = target;
    var Ahref = $(target).attr("href");
    var aText = $(target).html();
    //console.log(aText);
    //$("#portal").empty();
    if (Ahref == "#newFlow") {
        console.log("3")
        addThumbnail(target);
        //$("#portal").children("div").removeClass("showBlock");
        //$("#portal").append("<iframe src='../Page/newFlow/newFlow.html'></iframe></div>");
        $("#portal").append("<iframe src='../Page/newFlow/newFlow.html'></iframe>");
        
    }
    if (Ahref == "#commission") {
        //$("#portal").children("div").removeClass("showBlock");
        $("#portal").append("<iframe src='../Page/commission/commission.html'></iframe>");
    }
    if (Ahref == "#36C966A2-7932-44A6-B2A5-7DF65BDC58FB") {
        //$("#portal").children("div").removeClass("showBlok");
        $("#portal").append("<iframe src='../Page/Warehouse/materialcategory.html'></iframe>");//材料类别
    }
    if (Ahref == "#82C2BC3F-F3A1-41A9-B72E-16CB80B384EE") {
        //$("#portal").children("div").removeClass("showBlock");
        $("#portal").append("<iframe src='../Page/Production/coalminedailyrecord.html'></iframe>");
    }
    if (Ahref == "#DF6F78D3-851E-41F1-8815-A7841B001068") {
        $("#portal").children("div").removeClass("showBlock");
        $("#portal").append("<div class='tabs-item-wrapper showBlock'><iframe src='../Page/Warehouse/material.html'></iframe></div>");
    }
    if (Ahref == "#handle") {
        $("#portal").children("div").removeClass("showBlock");
        $("#portal").append("<div class='tabs-item-wrapper showBlock'><iframe src='../Page/handle/handle.html'></iframe></div>");
    }
    if (Ahref == "#historySeach") {
        $("#portal").children("div").removeClass("showBlock");
        $("#portal").append("<div class='tabs-item-wrapper showBlock'><iframe src='../Page/historySeach/historySeach.html'></iframe></div>");
    }
    if (Ahref == "#51F7CEFB-3FE7-4108-B175-0FB312B77FF9") {
        $("#portal").children("div").removeClass("showBlock");
        $("#portal").append("<div class='tabs-item-wrapper showBlock'><iframe src='../Page/Capital/Capital.html'></iframe></div>");
    }

    if (Ahref == "#C1018F0A-ECB5-422A-B7D9-71E7BB168B5A") {
        $("#portal").html("<div class='tabs-item-wrapper showBlock'><iframe src='../Page/Capital/AddCapital.html'></iframe></div>");
    }

    if (Ahref == "#1EA2577E-DB05-4B0D-A0B7-D94641D642A3") {
        $("#portal").html("<div class='tabs-item-wrapper showBlock'><iframe src='../Page/Capital/CapitalSelect.html'></iframe></div>");
    }
    if (Ahref == "#D3E165AD-EEA1-48AA-AACE-B3389138A23F") {
        $("#portal").html("<div class='tabs-item-wrapper showBlock'><iframe src='../Page/Capital/AllCapital.html'></iframe></div>");
    }
    if (Ahref == "#639B4105-9D7E-4729-918A-C60E58D239DA") {
        $("#portal").html("<div class='tabs-item-wrapper showBlock'><iframe src='../Page/Capital/CapitalFlow.html'></iframe></div>");
    }
    if (Ahref == "#DDFC6E9D-8901-4504-9B86-3CFDCBAE71C8") {
        $("#portal").html("<div class='tabs-item-wrapper showBlock'><iframe src='../Page/Capital/CapitalTJ.html'></iframe></div>");
    }


    if (Ahref == "#65C5602F-812E-4B75-9B83-2B4B0107A5F0") {
    } else if (Ahref == "#06E66687-53BA-41D8-B684-EC26A4D98F36") {
        $("#portal").html("<div class='tabs-item-wrapper showBlock'><iframe src='../Page/Plan/bill_of_material.html'></iframe></div>");
    }
    if (Ahref == "#159C63B0-2137-4395-B3A7-DF8BD49424A1") {
        $("#portal").html("<div class='tabs-item-wrapper showBlock'><iframe src='../Page/System/userTable.html'></iframe></div>");
    }
    if (Ahref == "#14846AE9-1DD2-4B11-A521-ABCADB34CDA5") {
        $("#portal").html("<iframe src='../Page/System/roleInterface.html'></iframe>");
    }
    if (Ahref == "#9CA6B03B-96AE-4539-A283-2C76F7109966") {
        $("#portal").html("<iframe src='../Page/System/sectionInterface.html'></iframe>");
    }
    if (Ahref == "#ECF98248-F819-497A-8ACC-44909CEEA8EF") {
        $("#portal").html("<iframe src='../Page/System/singleproject.html'></iframe>");
    }
    if (Ahref == "#AFD57A1F-8194-43D5-B24E-6F616DA14FD3") {
        $("#portal").html("<iframe src='../Page/System/singleproject_limits.html'></iframe>");
    }
    if (Ahref == "#C505E4B0-6AFA-4A2D-9C95-2D812B0B3EE1") {
        $("#portal").html("<iframe src='../Page/System/applicationproject_limits.html'></iframe>");
    }
    if (Ahref == "#986B96A2-C561-4A71-8099-2C6184D73BF3") {
        $("#portal").html("<iframe src='../Page/Warehouse/mywarehousebydirectly.html'></iframe>");
    }
    if (Ahref == "#F5BC6AF6-9F3F-4513-9227-6AA041EF53C5") {
        $("#portal").html("<iframe src='../Page/System/tunnellingproject.html'></iframe>");
    } else if (Ahref == "#DA6DB310-6142-4207-965D-E5FB67FBA3BF")
    {
        $("#portal").html("<iframe src='../Page/System/coalface.html'></iframe>");
    } else if (Ahref == "#DB3E9CA4-2C5E-415C-970E-9DB1F75EFBD3")
    {
        $("#portal").html("<iframe src='../Page/Plan/bill_of_purchaseplan.html'></iframe>"); //采购计划列表
    }
    else if (Ahref == "#45364B42-1425-4A65-9EEC-957CA2D80907")
    {
        $("#portal").html("<iframe src='../Page/Plan/add_purchaseplan.html'></iframe>"); //新建采购计划
    } else if (Ahref == "#2DFA1150-0F9B-4817-AA0C-07AF99B55CD4")
    {
        $("#portal").html("<iframe src='../Page/Plan/bill_of_materialcheck.html'></iframe>"); //材料验收查询
    }
    if (Ahref == "#852D5877-2CCA-4E13-B8EC-C9AE54E701D6") {
        $("#portal").html("<iframe src='../Page/Warehouse/mywarestatistics.html'></iframe>");
    }
    if (Ahref == "#10571AE6-803E-48A1-BA5A-864D299D7C36") {
        $("#portal").html("<iframe src='../Page/System/Dict.html'></iframe>");
    }
    if (Ahref == "#D7FCE4C1-68C3-4DF5-9908-9049EBF694B6") {
        $("#portal").html("<iframe src='../Page/Warehouse/mywareinquiry.html'></iframe>");
    }
    if (Ahref == "#4582C37D-2B84-4C32-8A0F-C4542E884BEE") {
        $("#portal").html("<iframe src='../Page/System/otherproject.html'></iframe>");
    }

    if (Ahref == "#D5144F66-4A65-4A29-90E0-4AE2E2E8DA04") {
        $("#portal").html("<iframe src='../Page/Check/addmaterialapplication.html?TASK_CODE=CLSQ20170113154422&SEQ=2'></iframe>");
        //state=add
        //state=update&materialapplicationid=94054BA3-6784-4D0F-AA66-8BDC946F10B0
        //TASK_CODE=CLSQ20170113154422&SEQ=2
    }

    if (Ahref == "#84A1E855-B8CB-474D-97CF-521392DA9CEE") {
        $("#portal").html("<iframe src='../Page/Check/materialapplyselect.html'></iframe>");
    }

    if (Ahref == "#CE229170-9972-4FB5-B858-1BB70815FAFA") {
        $("#portal").html("<iframe src='../Page/Warehouse/warehousein.html'></iframe>");
    }

    if (Ahref == "#50D207FE-C4E4-4E53-B1D0-A68EBE99E7B2") {
        $("#portal").html("<iframe src='../Page/Check/warehouseinorout.html'></iframe>");
    }
  
    
}
function addDAta() {
    //var managemen = document.getElementById("asideContainer");
    //console.log(managemen);

    //for (var i = 0; i < managemen.length; i++) {
    //    managemen[i].onclick = function () {
    //        $("#test0").empty();
    //        var $this = $(this);
    //        var textDetail = $this[0].textContent;
    //        $this.parent().siblings().removeClass("function-active1");
    //        $this.parent().addClass("function-active1");
    //        //console.log(CollapsibleMenu().activeIndex)
    //        requestDataDispose(this);
    //        test0.reset();
            // var menu2=document.getElementById("test0"); 
            //console.log(menu2);
            //var test1=new CollapsibleMenu(menu0);
            //test0(menu2);
            //addNav();
        //}

    //}

}
//模块跳转

    //console.log(managemen);
var AsideFootMenu = function (footMenu) {
    this.init(footMenu);
}
AsideFootMenu.prototype.init = function(footMenu) {
    this.footMenu = footMenu;
    //console.log(footMenu)
        this.setOnClick();
}
AsideFootMenu.prototype.setOnClick = function () {
    //console.log(this.footMenu);
        EventUtil.addHandler(this.footMenu, 'click', function (e) {
            var target;
            e = EventUtil.getEvent(e);
            target = EventUtil.getTarget(e);
            if(target.tagName.toUpperCase() === 'A' && target.className.indexOf('foot-menu-name') !== -1) {
                this.onFootMenuNameClick(target);
    }
    }.bind(this));
};
AsideFootMenu.prototype.onFootMenuNameClick = function (a) {
    $(a).parent().addClass("active").siblings().removeClass("active");;
    var clickMe = ("#" + $(a).attr('menu_id'));
    $(clickMe).css("display", "block").siblings().css("display","none");

}
var asideFoot = new AsideFootMenu(managemen);
var test0 = new CollapsibleMenu(managemen);
//function storeManagement() {
//    var storeManagemenData = "<div ><li>仓库管理</li><li class='first-menu-item'><a  href='#1' class='first-menu-name'><span class='icon-main-menu'><img src='../Images/2.png'/></span><h5>仓库管理</h5></a>" +
//        "<ul class='second-menu' id='dataId0'><li class='second-menu-item'>" +
//        "<a class='second-menu-content' href='#2'>我的仓库</a></li><li class='second-menu-item'><a class='second-menu-content' href='#category'>材料类别管理</a></li>" +
//        "<li class='second-menu-item'><a class='second-menu-content' href='#material'>材料编码库管理</a></li><li class='second-menu-item'><a class='second-menu-content' href='#4'>材料回收管理</a></li>" + "<li class='second-menu-item'>" +
//        "<a class='second-menu-content' href='#6'>周转性材料管理</a></li>" + "<li class='second-menu-item'>" +
//        "<a class='second-menu-content' href='#7'>全矿库存查询</a></li></ul></div>"+
//        "<div><li>资金管理</li><li class='first-menu-item'><a  href='#8' class='first-menu-name'><span class='icon-main-menu'><img src='../Images/2.png'/></span> <h5>资金管理</h5></a>" +
//        "<ul class='second-menu' id='dataId1'><li class='second-menu-item'>" +
//        "<a class='second-menu-content' href='#9'>我的账户</a></li><li class='second-menu-item'>" +
//        "<a class='second-menu-content' href='#10'>新建资金申请</a></li>" + "<li class='second-menu-item'>" +
//        "<a class='second-menu-content' href='#11'>资金申请查询</a></li>" + "<li class='second-menu-item'>" +
//        "<a class='second-menu-content' href='#12'>全矿资金账户查询</a></li>" + "<li class='second-menu-item'>" +
//        "<a class='second-menu-content' href='#flowSelect'>资金账户流水查询</a></li></ul></li></div>" +
//         "<div><li>生产与预算</li><li class='first-menu-item'><a  href='#13' class='first-menu-name'><span class='icon-main-menu'><img src='../Images/2.png'/></span><h5>生产记录</h5></a>" +
//        "<ul class='second-menu' id='dataId2'><li class='second-menu-item'>" +
//        "<a class='second-menu-content' href='#coalminedailyrecord'>原煤生产记录</a></li><li class='second-menu-item'><a class='second-menu-content' href='#'>开拓掘进记录</a></li></ul></li>" +
//        "<li class='first-menu-item'><a  href='#15' class='first-menu-name'><span class='icon-main-menu'><img src='../Images/2.png'/></span><h5>月度生产计划</h5></a>" +
//        "<ul class='second-menu ' id='dataId3'><li class='second-menu-item'><a class='second-menu-content' href='#113'>月度生产经营汇总计划</a></li>" +
//        "<li class='second-menu-item'><a class='second-menu-content' href='#16'>月度原煤生产经营计划</a></li>" +
//        "<li class='second-menu-item'><a class='second-menu-content' href='#17'>月度开拓掘进计划</a></li>" +
//        "<li class='second-menu-item'><a class='second-menu-content' href='#18'>月度支撑钢使用及修旧计划</a></li>" +
//        "<li class='second-menu-item'><a class='second-menu-content' href='#19'>月度单项工程计划</a></li>" +
//        "<li class='second-menu-item'><a class='second-menu-content' href='#20'>月度后勤单位工作计划</a></li></ul></li>" +
//        "<li class='first-menu-item'><a  href='#21' class='first-menu-name'><span class='icon-main-menu'><img src='../Images/2.png'/></span><h5>年生产计划</h5></a>" +
//        "<ul class='second-menu ' id='dataId4'><li class='second-menu-item'><a class='second-menu-content' href='#22'>采面接替与原煤产量滚动计划</a></li>" +
//        "<li class='second-menu-item'><a class='second-menu-content' href='#'>年度井巷工程排队计划</a></li></ul></li>" +
//        "<li class='first-menu-item'><a  href='23' class='first-menu-name'><span class='icon-main-menu'><img src='../Images/2.png'/></span><h5>年度材料预算</h5></a>" +
//        "<ul class='second-menu ' id='dataId5'><li class='second-menu-item'>" +
//        "<a class='second-menu-content' href='#24'>年度全矿材料预算</a></li><li class='second-menu-item'>" +
//        "<a class='second-menu-content' href='#25'>年度大型材料预算</a></li><li class='second-menu-item'>" +
//        "<a class='second-menu-content' href='#26'>年度原煤生产材料指标</a></li><li class='second-menu-item'>" +
//        "<a class='second-menu-content' href='#27'>年度开拓掘进材料指标</a></li></ul></li>" +
//        "<li class='first-menu-item'><a  href='#28' class='first-menu-name'><span class='icon-main-menu'><img src='../Images/2.png'/></span><h5>月度材料计划</h5></a>" +
//        "<ul class='second-menu collapse' id='dataId6'><li class='second-menu-item'><a class='second-menu-content' href='#'>月度全矿材料预算</a></li>" +
//        "<li class='second-menu-item'><a class='second-menu-content' href='#29'>月度大型材料预算</a></li>" +
//        "<li class='second-menu-item'><a class='second-menu-content' href='#30'>月度原煤生产材料指标</a></li>" +
//        "<li class='second-menu-item'><a class='second-menu-content' href='#31'>月度开拓掘进材料指标</a></li>" +
//        "<li class='second-menu-item'><a class='second-menu-content' href='#32'>单位材料限额指标</a></li></ul></li></div>" +
//         "<div><li>计划与验收</li>" +
//        "<li class='first-menu-item'><a  href='#33' class='first-menu-name'><span class='icon-main-menu'><img src='../Images/2.png'/></span><h5>材料计划</h5></a>" +
//        "<ul class='second-menu ' id='dataId7'><li class='second-menu-item'><a class='second-menu-content' href='#34'>新建材料计划</a></li>" +
//        "<li class='second-menu-item'><a class='second-menu-content' href='#35'>材料计划查询</a></li></ul></li><li class='first-menu-item'><a  href='#36' class='first-menu-name'><span class='icon-main-menu'><img src='../Images/2.png'/></span><h5>采购计划</h5></a>" +
//        "<ul class='second-menu ' id='dataId8'><li class='second-menu-item'><a class='second-menu-content' href='#37'>新建采购计划</a></li><li class='second-menu-item'><a class='second-menu-content' href='#'>采购计划查询</a></li></ul></li>" +
//        "<li class='first-menu-item'><a  href='#38' class='first-menu-name'><span class='icon-main-menu'><img src='../Images/2.png'/></span><h5>材料验收</h5></a>" +
//        "<ul class='second-menu ' id='dataId9'><li class='second-menu-item'><a class='second-menu-content' href='#39'>新建验收通知</a></li>" +
//        "<li class='second-menu-item'><a class='second-menu-content' href='#40'>材料验收查询</a></li></div>" +
          
//     "<div><li>批控与考核</li><li class='first-menu-item'><a  href='#41' class='first-menu-name'><span class='icon-main-menu'><img src='../Images/2.png'/></span> <h5> 材料批控</h5></a>" +
//        "<ul class='second-menu collapse' id='dataId10'><li class='second-menu-item'>" +
//        "<a class='second-menu-content' href='#42'>新建材料申请</a></li><li class='second-menu-item'>" +
//        "<a class='second-menu-content' href='#43'>材料申请查询</a></li>" + "<li class='second-menu-item'>" +
//        "<a class='second-menu-content' href='#44'>材料消耗查询</a></li></ul></li><li class='first-menu-item'><a  href='#46' class='first-menu-name'><span class='icon-main-menu'><img src='../Images/2.png'/></span> <h5>材料考核</h5></a>" +
//        "<ul class='second-menu collapse' id='dataId11'><li class='second-menu-item'>" +
//        "<a class='second-menu-content' href='#47'>材料考核查询</a></li><li class='second-menu-item'>" +
//        "<a class='second-menu-content' href='#48'>材料回收考核</a></li>" + "<li class='second-menu-item'>" +
//        "<a class='second-menu-content' href='#49'>材料考核统计</a></li></ul></li></div>" +
//        "<div><li>统计与查询</li><li class='first-menu-item'><a  href='#50' class='first-menu-name'><span class='icon-main-menu'><img src='../Images/2.png'/></span> <h5>查询</h5></a>" +
//        "<ul class='second-menu collapse' id='dataId12'><li class='second-menu-item'>" +
//        "<a class='second-menu-content' href='#51'>全矿库库存查询</a></li><li class='second-menu-item'>" +
//        "<a class='second-menu-content' href='#52'>全矿资金账户查询</a></li>" + "<li class='second-menu-item'>" +
//        "<a class='second-menu-content' href='#53'>材料计划查询</a></li>" + "<li class='second-menu-item'>" +
//        "<a class='second-menu-content' href='#54'>材料消耗查询</a></li></ul></li>" + "<li class='first-menu-item'><a  href='#dataId14' class='first-menu-name'><span class='icon-main-menu'><img src='../Images/2.png'/></span> <h5>统计</h5></a>" +
//        "<ul class='second-menu collapse' id='dataId13'><li class='second-menu-item'><a class='second-menu-content' href='#55'>全矿材料考核统计</a></li><li class='second-menu-item'>" +
//        "<a class='second-menu-content' href='#56'>全矿材料消耗统计</a></li><li class='second-menu-item'>" +
//        "<a class='second-menu-content' href='#57'>全矿大型材料投入统计</a></li>" + "<li class='second-menu-item'>" +
//        "<a class='second-menu-content' href='#58'>直接队材料消耗统计</a></li><li class='second-menu-item'>" +
//        "<a class='second-menu-content' href='#59'>全矿材料考核算表</a></li></ul></li></div>" +
//        "<div><li>系统管理</li><li class='first-menu-item'><a  href='60' class='first-menu-name'><span class='icon-main-menu'><img src='../Images/2.png'/></span> <h5>用户权限</h5></a>" +
//        "<ul class='second-menu collapse' id='dataId15'><li class='second-menu-item'>" +
//        "<a class='second-menu-content' href='#61'>用户管理</a></li><li class='second-menu-item'>" +
//        "<a class='second-menu-content' href='#62'>角色管理</a></li>" + "<li class='second-menu-item'>" +
//        "<a class='second-menu-content' href='#63'>部门管理</a></li></ul></li>" + "<li class='first-menu-item'><a  href='#64' class='first-menu-name'><span class='icon-main-menu'><img src='../Images/2.png'/></span> <h5>项目管理</h5></a>" +
//        "<ul class='second-menu collapse' id='dataId15'><li class='second-menu-item'>" +
//        "<a class='second-menu-content' href='#65'>井巷工程管理</a></li><li class='second-menu-item'>" +
//        "<a class='second-menu-content' href='#66'>单项工程管理</a></li>" + "<li class='second-menu-item'>" +
//        "<a class='second-menu-content' href='#67'>采面管理</a></li><li class='second-menu-item'>" +
//        "<a class='second-menu-content' href='#68'>单项工程权限配置</a></li><li class='second-menu-item'>" +
//        "<a class='second-menu-content' href='#69'>材料申请项目权限配置</a></li>" +
//        " </ul></li></div>";
//    $("#test0").html(storeManagemenData);

//}
//var requestDataDispose = function (requestData) {
//    //console.log(requestData);
//    var asideData;
//    var contentTxt = requestData.textContent;
    //console.log(contentTxt);(
    //项目管理
    //if (contentTxt == "仓库管理") {
    //    storeManagement();
    //}
    //if (contentTxt == "资金管理") {
    //    asideData = "<div><li>资金管理</li><li class='first-menu-item'><a  href='#8' class='first-menu-name'><span class='icon-main-menu'><img src='../Images/2.png'/></span> <h5>资金管理</h5></a>" +
    //    "<ul class='second-menu' id='dataId1'><li class='second-menu-item'>" +
    //    "<a class='second-menu-content' href='#9'>我的账户</a></li><li class='second-menu-item'>" +
    //    "<a class='second-menu-content' href='#10'>新建资金申请</a></li>" + "<li class='second-menu-item'>" +
    //    "<a class='second-menu-content' href='#11'>资金申请查询</a></li>" + "<li class='second-menu-item'>" +
    //    "<a class='second-menu-content' href='#12'>全矿资金账户查询</a></li>" + "<li class='second-menu-item'>" +
    //    "<a class='second-menu-content' href='#flowSelect'>资金账户流水查询</a></li></ul></li></div>";
    //    $("#test0").html(asideData);
    //};
    //var asideFoot=[
    //	["仓库管理","#1","dataId0","#2"],

    //	]
    //if (contentTxt == "生产与预算") {
    //    asideData = "<div><li>生产与预算</li><li class='first-menu-item'><a  href='#13' class='first-menu-name'><span class='icon-main-menu'><img src='../Images/2.png'/></span><h5>生产记录</h5></a>" +
    //    "<ul class='second-menu' id='dataId2'><li class='second-menu-item'>" +
    //    "<a class='second-menu-content' href='#coalminedailyrecord'>原煤生产记录</a></li><li class='second-menu-item'><a class='second-menu-content' href='#'>开拓掘进记录</a></li></ul></li>" +
    //    "<li class='first-menu-item'><a  href='#15' class='first-menu-name'><span class='icon-main-menu'><img src='../Images/2.png'/></span><h5>月度生产计划</h5></a>" +
    //    "<ul class='second-menu ' id='dataId3'><li class='second-menu-item'><a class='second-menu-content' href='#113'>月度生产经营汇总计划</a></li>" +
    //    "<li class='second-menu-item'><a class='second-menu-content' href='#16'>月度原煤生产经营计划</a></li>" +
    //    "<li class='second-menu-item'><a class='second-menu-content' href='#17'>月度开拓掘进计划</a></li>" +
    //    "<li class='second-menu-item'><a class='second-menu-content' href='#18'>月度支撑钢使用及修旧计划</a></li>" +
    //    "<li class='second-menu-item'><a class='second-menu-content' href='#19'>月度单项工程计划</a></li>" +
    //    "<li class='second-menu-item'><a class='second-menu-content' href='#20'>月度后勤单位工作计划</a></li></ul></li>" +
    //    "<li class='first-menu-item'><a  href='#21' class='first-menu-name'><span class='icon-main-menu'><img src='../Images/2.png'/></span><h5>年生产计划</h5></a>" +
    //    "<ul class='second-menu ' id='dataId4'><li class='second-menu-item'><a class='second-menu-content' href='#22'>采面接替与原煤产量滚动计划</a></li>" +
    //    "<li class='second-menu-item'><a class='second-menu-content' href='#'>年度井巷工程排队计划</a></li></ul></li>" +
    //    "<li class='first-menu-item'><a  href='23' class='first-menu-name'><span class='icon-main-menu'><img src='../Images/2.png'/></span><h5>年度材料预算</h5></a>" +
    //    "<ul class='second-menu ' id='dataId5'><li class='second-menu-item'>" +
    //    "<a class='second-menu-content' href='#24'>年度全矿材料预算</a></li><li class='second-menu-item'>" +
    //    "<a class='second-menu-content' href='#25'>年度大型材料预算</a></li><li class='second-menu-item'>" +
    //    "<a class='second-menu-content' href='#26'>年度原煤生产材料指标</a></li><li class='second-menu-item'>" +
    //    "<a class='second-menu-content' href='#27'>年度开拓掘进材料指标</a></li></ul></li>" +
    //    "<li class='first-menu-item'><a  href='#28' class='first-menu-name'><span class='icon-main-menu'><img src='../Images/2.png'/></span><h5>月度材料计划</h5></a>" +
    //    "<ul class='second-menu collapse' id='dataId6'><li class='second-menu-item'><a class='second-menu-content' href='#'>月度全矿材料预算</a></li>" +
    //    "<li class='second-menu-item'><a class='second-menu-content' href='#29'>月度大型材料预算</a></li>" +
    //    "<li class='second-menu-item'><a class='second-menu-content' href='#30'>月度原煤生产材料指标</a></li>" +
    //    "<li class='second-menu-item'><a class='second-menu-content' href='#31'>月度开拓掘进材料指标</a></li>" +
    //    "<li class='second-menu-item'><a class='second-menu-content' href='#32'>单位材料限额指标</a></li></ul></li></div>"+
    //     "<div><li>计划与验收</li>" +
    //    "<li class='first-menu-item'><a  href='#33' class='first-menu-name'><span class='icon-main-menu'><img src='../Images/2.png'/></span><h5>材料计划</h5></a>" +
    //    "<ul class='second-menu ' id='dataId7'><li class='second-menu-item'><a class='second-menu-content' href='#34'>新建材料计划</a></li>" +
    //    "<li class='second-menu-item'><a class='second-menu-content' href='#35'>材料计划查询</a></li></ul></li><li class='first-menu-item'><a  href='#36' class='first-menu-name'><span class='icon-main-menu'><img src='../Images/2.png'/></span><h5>采购计划</h5></a>" +
    //    "<ul class='second-menu ' id='dataId8'><li class='second-menu-item'><a class='second-menu-content' href='#37'>新建采购计划</a></li><li class='second-menu-item'><a class='second-menu-content' href='#'>采购计划查询</a></li></ul></li>" +
    //    "<li class='first-menu-item'><a  href='#38' class='first-menu-name'><span class='icon-main-menu'><img src='../Images/2.png'/></span><h5>材料验收</h5></a>" +
    //    "<ul class='second-menu ' id='dataId9'><li class='second-menu-item'><a class='second-menu-content' href='#39'>新建验收通知</a></li>" +
    //    "</div>" +
    // "<div><li>批控与考核</li><li class='first-menu-item'><a  href='#41' class='first-menu-name'><span class='icon-main-menu'><img src='../Images/2.png'/></span> <h5> 材料批控</h5></a>" +
    //    "<ul class='second-menu collapse' id='dataId10'><li class='second-menu-item'>" +
    //    "<a class='second-menu-content' href='#42'>新建材料申请</a></li><li class='second-menu-item'>" +
    //    "<a class='second-menu-content' href='#43'>材料申请查询</a></li>" + "<li class='second-menu-item'>" +
    //    "<a class='second-menu-content' href='#44'>材料消耗查询</a></li></ul></li><li class='first-menu-item'><a  href='#46' class='first-menu-name'><span class='icon-main-menu'><img src='../Images/2.png'/></span> <h5>材料考核</h5></a>" +
    //    "<ul class='second-menu collapse' id='dataId11'><li class='second-menu-item'>" +
    //    "<a class='second-menu-content' href='#47'>材料考核查询</a></li><li class='second-menu-item'>" +
    //    "<a class='second-menu-content' href='#48'>材料回收考核</a></li>" + "<li class='second-menu-item'>" +
    //    "<a class='second-menu-content' href='#49'>材料考核统计</a></li></ul></li></div>"+
    //    "<div><li>统计与查询</li><li class='first-menu-item'><a  href='#50' class='first-menu-name'><span class='icon-main-menu'><img src='../Images/2.png'/></span> <h5>查询</h5></a>" +
    //    "<ul class='second-menu collapse' id='dataId12'><li class='second-menu-item'>" +
    //    "<a class='second-menu-content' href='#51'>全矿库库存查询</a></li><li class='second-menu-item'>" +
    //    "<a class='second-menu-content' href='#52'>全矿资金账户查询</a></li>" + "<li class='second-menu-item'>" +
    //    "<a class='second-menu-content' href='#53'>材料计划查询</a></li>" + "<li class='second-menu-item'>" +
    //    "<a class='second-menu-content' href='#54'>材料消耗查询</a></li></ul></li>" + "<li class='first-menu-item'><a  href='#dataId14' class='first-menu-name'><span class='icon-main-menu'><img src='../Images/2.png'/></span> <h5>统计</h5></a>" +
    //    "<ul class='second-menu collapse' id='dataId13'><li class='second-menu-item'><a class='second-menu-content' href='#55'>全矿材料考核统计</a></li><li class='second-menu-item'>" +
    //    "<a class='second-menu-content' href='#56'>全矿材料消耗统计</a></li><li class='second-menu-item'>" +
    //    "<a class='second-menu-content' href='#57'>全矿大型材料投入统计</a></li>" + "<li class='second-menu-item'>" +
    //    "<a class='second-menu-content' href='#58'>直接队材料消耗统计</a></li><li class='second-menu-item'>" +
    //    "<a class='second-menu-content' href='#59'>全矿材料考核算表</a></li></ul></li></div>" +
    //    "<div><li>系统管理</li><li class='first-menu-item'><a  href='60' class='first-menu-name'><span class='icon-main-menu'><img src='../Images/2.png'/></span> <h5>用户权限</h5></a>" +
    //    "<ul class='second-menu collapse' id='dataId15'><li class='second-menu-item'>" +
    //    "<a class='second-menu-content' href='#61'>用户管理</a></li><li class='second-menu-item'>" +
    //    "<a class='second-menu-content' href='#62'>角色管理</a></li>" + "<li class='second-menu-item'>" +
    //    "<a class='second-menu-content' href='#63'>部门管理</a></li></ul></li>" + "<li class='first-menu-item'><a  href='#64' class='first-menu-name'><span class='icon-main-menu'><img src='../Images/2.png'/></span> <h5>项目管理</h5></a>" +
    //    "<ul class='second-menu collapse' id='dataId15'><li class='second-menu-item'>" +
    //    "<a class='second-menu-content' href='#65'>井巷工程管理</a></li><li class='second-menu-item'>" +
    //    "<a class='second-menu-content' href='#66'>单项工程管理</a></li>" + "<li class='second-menu-item'>" +
    //    "<a class='second-menu-content' href='#67'>采面管理</a></li><li class='second-menu-item'>" +
    //    "<a class='second-menu-content' href='#68'>单项工程权限配置</a></li><li class='second-menu-item'>" +
    //    "<a class='second-menu-content' href='#69'>材料申请项目权限配置</a></li>" +
    //    " </ul></li></div>"
    //    $("#test0").html(asideData);
    //}
    //
    //if (contentTxt == "计划与验收") {
    //    asideData = "<div><li>计划与验收</li>" +
    //    "<li class='first-menu-item'><a  href='#33' class='first-menu-name'><span class='icon-main-menu'><img src='../Images/2.png'/></span><h5>材料计划</h5></a>" +
    //    "<ul class='second-menu ' id='dataId7'><li class='second-menu-item'><a class='second-menu-content' href='#34'>新建材料计划</a></li>" +
    //    "<li class='second-menu-item'><a class='second-menu-content' href='#35'>材料计划查询</a></li></ul></li><li class='first-menu-item'><a  href='#36' class='first-menu-name'><span class='icon-main-menu'><img src='../Images/2.png'/></span><h5>采购计划</h5></a>" +
    //    "<ul class='second-menu ' id='dataId8'><li class='second-menu-item'><a class='second-menu-content' href='#37'>新建采购计划</a></li><li class='second-menu-item'><a class='second-menu-content' href='#'>采购计划查询</a></li></ul></li>" +
    //    "<li class='first-menu-item'><a  href='#38' class='first-menu-name'><span class='icon-main-menu'><img src='../Images/2.png'/></span><h5>材料验收</h5></a>" +
    //    "<ul class='second-menu ' id='dataId9'><li class='second-menu-item'><a class='second-menu-content' href='#39'>新建验收通知</a></li>" +
     
    //    $("#test0").html(asideData);
    //}
    //
    //if (contentTxt == "批控与考核") {
    //    asideData = "<div><li>批控与考核</li><li class='first-menu-item'><a  href='#41' class='first-menu-name'><span class='icon-main-menu'><img src='../Images/2.png'/></span> <h5> 材料批控</h5></a>" +
    //    "<ul class='second-menu collapse' id='dataId10'><li class='second-menu-item'>" +
    //    "<a class='second-menu-content' href='#42'>新建材料申请</a></li><li class='second-menu-item'>" +
    //    "<a class='second-menu-content' href='#43'>材料申请查询</a></li>" + "<li class='second-menu-item'>" +
    //    "<a class='second-menu-content' href='#44'>材料消耗查询</a></li></ul></li><li class='first-menu-item'><a  href='#46' class='first-menu-name'><span class='icon-main-menu'><img src='../Images/2.png'/></span> <h5>材料考核</h5></a>" +
    //    "<ul class='second-menu collapse' id='dataId11'><li class='second-menu-item'>" +
    //    "<a class='second-menu-content' href='#47'>材料考核查询</a></li><li class='second-menu-item'>" +
    //    "<a class='second-menu-content' href='#48'>材料回收考核</a></li>" + "<li class='second-menu-item'>" +
    //    "<a class='second-menu-content' href='#49'>材料考核统计</a></li></ul></li></div>" +
        
    //    $("#test0").html(asideData);
    //}
    //
    //if (contentTxt == "统计与查询") {
    //    asideData = "<li>统计与查询</li><li class='first-menu-item'><a  href='#50' class='first-menu-name'><span class='icon-main-menu'><img src='../Images/2.png'/></span> <h5>查询</h5></a>" +
    //    "<ul class='second-menu collapse' id='dataId12'><li class='second-menu-item'>" +
    //    "<a class='second-menu-content' href='#51'>全矿库库存查询</a></li><li class='second-menu-item'>" +
    //    "<a class='second-menu-content' href='#52'>全矿资金账户查询</a></li>" + "<li class='second-menu-item'>" +
    //    "<a class='second-menu-content' href='#53'>材料计划查询</a></li>" + "<li class='second-menu-item'>" +
    //    "<a class='second-menu-content' href='#54'>材料消耗查询</a></li></ul></li>" + "<li class='first-menu-item'><a  href='#dataId14' class='first-menu-name'><span class='icon-main-menu'><img src='../Images/2.png'/></span> <h5>统计</h5></a>" +
    //    "<ul class='second-menu collapse' id='dataId13'><li class='second-menu-item'><a class='second-menu-content' href='#55'>全矿材料考核统计</a></li><li class='second-menu-item'>" +
    //    "<a class='second-menu-content' href='#56'>全矿材料消耗统计</a></li><li class='second-menu-item'>" +
    //    "<a class='second-menu-content' href='#57'>全矿大型材料投入统计</a></li>" + "<li class='second-menu-item'>" +
    //    "<a class='second-menu-content' href='#58'>直接队材料消耗统计</a></li><li class='second-menu-item'>" +
    //    "<a class='second-menu-content' href='#59'>全矿材料考核算表</a></li></ul></li>"+

    //    $("#test0").html(asideData);
    //}
    ////
    //if (contentTxt == "系统管理") {
    //    asideData = "<div><li>系统管理</li><li class='first-menu-item'><a  href='60' class='first-menu-name'><span class='icon-main-menu'><img src='../Images/2.png'/></span> <h5>用户权限</h5></a>" +
    //    "<ul class='second-menu collapse' id='dataId15'><li class='second-menu-item'>" +
    //    "<a class='second-menu-content' href='#61'>用户管理</a></li><li class='second-menu-item'>" +
    //    "<a class='second-menu-content' href='#62'>角色管理</a></li>" + "<li class='second-menu-item'>" +
    //    "<a class='second-menu-content' href='#63'>部门管理</a></li></ul></li>" + "<li class='first-menu-item'><a  href='#64' class='first-menu-name'><span class='icon-main-menu'><img src='../Images/2.png'/></span> <h5>项目管理</h5></a>" +
    //    "<ul class='second-menu collapse' id='dataId15'><li class='second-menu-item'>" +
    //    "<a class='second-menu-content' href='#65'>井巷工程管理</a></li><li class='second-menu-item'>" +
    //    "<a class='second-menu-content' href='#66'>单项工程管理</a></li>" + "<li class='second-menu-item'>" +
    //    "<a class='second-menu-content' href='#67'>采面管理</a></li><li class='second-menu-item'>" +
    //    "<a class='second-menu-content' href='#68'>单项工程权限配置</a></li><li class='second-menu-item'>" +
    //    "<a class='second-menu-content' href='#69'>材料申请项目权限配置</a></li>" +
    //    " </ul></li></div>"
    //    $("#test0").html(asideData);
    //}

//};

//页面加载�?
//点击板块事件
$(".action").on("click", function (e) {
    var target = e.target;
    var targetClassName = $(target).attr("class");
    if (targetClassName == "close") {
        $(target).parent().parent().parent().css("display", "none");
    }
    if (targetClassName == "min") {
        //console.log(($(target).parent().parent().parent()));
        $(target).parent().parent().parent().children(".item-content").css('display', 'none');
        $(target).siblings('.max').css("display", "block");
        $(target).css("display", "none");
    }
    if (targetClassName == "max") {
        //console.log(($(target).parent().parent().parent()));
        $(target).parent().parent().parent().children(".item-content").css('display', 'block');
        $(target).siblings('.min').css("display", "block");
        $(target).css("display", "none");
    }
}
);
//右侧快捷方式
$("#configIcon").on("click", "a", function () {
    //console.log(this);
    addNavList(this);
    locationList(this);
});
//遮罩�?
var navPreview = document.getElementById('navPreview');
var tabPreview = document.getElementById("tabPreview");
var navList = document.getElementById("navWidth");
var blackShade = function (shadeRestore, shadeTabPreview, navList) {
    this.init(shadeRestore, shadeTabPreview, navList);
    //console.log(shadeRestore);

};
blackShade.prototype.init = function (shadeRestore, shadeTabPreview, navList) {
    this.shadeTabPreview = shadeTabPreview;//保留时间�?
    this.navList = navList;//保留导航�?
    shadeRestore.onclick = function () {
        //console.log(shadeTabPreview);
        shadeTabPreview.style.display = "block";
        setThumbnailList();
    };
    this.closeShade();
    this.addActiveGround();
};
function setThumbnailList() {
    var thumList = parseInt(window.innerWidth);
    var $tabHeight = $(window).height();
    $("#slimScroll").slimScroll({
        size: '17px',
        opcity: 0.8,
        allowPageScroll: true,
        color:'#FFF',
        height: $tabHeight
    });
    var thumColNum = parseInt(thumList / 330);
    $("#tabsContainer").css({
        "padding-left": (thumList - 330* thumColNum) / 2,
        "padding-right": (thumList - 330* thumColNum) / 2,
        "padding-top": "65px",
        "padding-bottom": "65px"
    })
}
//点击导航添加背景色
blackShade.prototype.addActiveGround = function () {
    EventUtil.addHandler(this.navList, "click", function (e) {
        var target;
        var $secondMenuActive;
        e = EventUtil.getEvent(e);
        target = EventUtil.getTarget(e);
        if (target.tagName.toUpperCase() === "A"){
            $(target.parentNode).addClass('nav-1 activeBlue');
            $secondMenuActive = $(target).attr("href");
            AddSecondMenuActiveBg($secondMenuActive);
            var activeList = $(target.parentNode).siblings('.activeBlue');
            if(activeList.length > 0){
                for (var i = 0; i < activeList.length; i++) {
                    activeList[i].classList.remove('activeBlue');
                }
             }
        } else if (target.tagName.toUpperCase() === "LI") {
            $(target).addClass('nav-1 activeBlue');
            $secondMenuActive = $(target).find("a").attr("href");
            AddSecondMenuActiveBg($secondMenuActive);
            var activeList = $(target).siblings('.activeBlue');
            if (activeList.length > 0) {
                for (var i = 0; i < activeList.length; i++) {
                    activeList[i].classList.remove('activeBlue');
                }
            }
        }
    })
}
function AddSecondMenuActiveBg(secondMenuAc) {
    $("a").removeClass("activeTxt");
    $("a[href='" + secondMenuAc + "']").addClass("activeTxt");
}
blackShade.prototype.closeShade = function () {
    EventUtil.addHandler(this.shadeTabPreview, "click", function (e) {
        var target;
        e = EventUtil.getEvent(e);
        target = EventUtil.getTarget(e);
      
        if (target.tagName.toUpperCase() === "UL" && target.className.indexOf('tabs-preview-panel') !== -1) {
            this.onCloseShade();
        }
        if (target.tagName.toUpperCase() === "DIV" && target.className.indexOf('nav-closeAll') !== -1) {
            this.onCloseShade();
        }
        if (target.tagName.toUpperCase() === "DIV" && target.className.indexOf('status-box') !== -1) {
            //console.log($(target.parentNode).attr('href'));
            this.jumpWindow(target);
            this.onCloseShade();
            $("#header .header-nav a[href=" + $(target.parentNode).attr('href') + "]").parent().addClass("activeBlue").siblings().removeClass("activeBlue");
        }
        if (target.tagName.toUpperCase() === "I" && target.className.indexOf('fa-lock') !== -1) {;
            $("#portal").html("<iframe src='material.html'></iframe>");
            this.onCloseShade();
        }
        if (target.tagName.toUpperCase() === "I" && target.className.indexOf('fa-times') !== -1) {
            this.deleteNav(target);
        }
        //if (target.tagName.toUpperCase() === "DIV" && target.className.indexOf('nav-title') !== -1) {;
        //    $("#portal").html("<iframe src='material.html'></iframe>");
        //    this.onCloseShade();
        //}
        if (target.tagName.toUpperCase() === "A" && target.className.indexOf('homePage') !== -1) {;
            $("#portal").html("<iframe src='material.html'></iframe>");
            this.onCloseShade();
        }
        if (target.tagName.toUpperCase() === "A" && target.className.indexOf('nav-btn') !== -1) {;
            window.location.href = "homePage.html";
        }
    }.bind(this));
};
    blackShade.prototype.onCloseShade = function () {
        this.shadeTabPreview.style.display = "none";
    };
    //blackShade.prototype.CloseOpenWindow=function(){
    //	$("#tabsContainer li:first-child").siblings().remove();
    //}
    blackShade.prototype.deleteNav = function (target) {
        var navListLiA = $(target.parentNode).children("a").attr('href');
        $(target).parent().remove();
        var deleteLi = this.navList.querySelectorAll("a[href='" + navListLiA + "']")[0].parentNode;
        navClose($(deleteLi).children("i")[0]);
        $(deleteLi).remove();
        this.storeManagement1();
        this.onCloseShade();

    };
    blackShade.prototype.storeManagement1 = function () {
        $("#badgeLabel").empty().html($(this.navList).children('li').length);
    };
    blackShade.prototype.jumpWindow = function (target) {

        //console.log(target.parent);
        var iFrameSrc = $(target.parentNode).parent().children('iframe').attr('src');
        //console.log(iFrameSrc);
        $("#portal").empty();
        $("#portal").html("<iframe src='" + iFrameSrc + "'</iframe>");
        this.onCloseShade();
    };
    var text6 = new blackShade(navPreview, tabPreview, navList);


    //出现遮罩层
    function globalShade() {
        //获取页面的高度和宽度
        document.getElementById('mask_top').classList.add("is-visible");
        document.getElementById('mask_left').classList.add("is-visible");

    };
    //隐藏遮罩层
    function deleteGlobalShade() {
        document.getElementById('mask_top').classList.remove("is-visible");
        document.getElementById('mask_left').classList.remove("is-visible");
    };
    function alertShade() {
        document.getElementById('mask_all').classList.add("transparent");
    };
    function deleteAlertShade() {
        document.getElementById('mask_all').classList.remove("transparent");
    };

//$.ajax({
//    type: "GET",
//    url: "../data.json",
//    dataType: 'json',
//    success: function (msg) {
//        debugger;
//        if (msg.IsSuccess == "true") {
//            alert(msg.Message);
//        }
//        else {
//            alert(msg.Message);
//        }
//    }
//});
