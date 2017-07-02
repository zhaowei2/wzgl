/**
 * Created by Hoswing on 2016/12/9.
 */
//点击切换流程
$(function(){
	storeManagement();
    addNav();//添加导航
    createNav();
    addDAta();
	a();
    
});
function addBadageLabel(){
   $("#badgeLabel").empty().html($("#navWidth li").length);
}
$('.transaction').on("click",function(e){
    var target= e.target;
    console.log($(target).attr("class"));
    if($(target).attr("class").indexOf("clickSwitcher")!==-1&&target.id=="handle"){
        $(target).removeClass("clickSwitcher").siblings().addClass('clickSwitcher');
        console.log(target);
        $(target).css("border","1px solid #ddd").css("borderBottom","transparent");
        $("#commission").css("border","1px solid transparent").css("borderBottomColor","#ddd");
        $("#handleContent").css("display","block");
        $("#commissionContent").css("display","none");
    }
    if($(target).attr("class").indexOf("clickSwitcher")!==-1&&target.id=="commission"){
        $(target).removeClass("clickSwitcher").siblings().addClass('clickSwitcher');
        $(target).css("border","1px solid #ddd").css("borderBottom","transparent");
        $("#handle").css("border","1px solid transparent").css("borderBottomColor","#ddd");
        $("#handleContent").css("display","none");
        $("#commissionContent").css("display","block");
    }

});
// header 用户头像
$('#header .header-userInfor .userPhoto').on('mouseover',function(){
    $('#header .header-userInfor .user-control').addClass("expansionShow").removeClass("expansionHide");
    $('#header .header-userInfor .userPhoto').css("backgroundColor","#2197DD");
});
$('#header .header-userInfor .userPhoto').on('mouseout',function(){
    $('#header .header-userInfor .user-control').removeClass("expansionShow").addClass("expansionHide");
    $('#header .header-userInfor .userPhoto').css("backgroundColor","#0C85BF");
    //$('#header .header-userInfor .userPhoto').css("backgroundColor","#0C86C0");
    //$('#header .header-userInfor .user-control').css("display","none");
});
//732
//686
//788
//742
function setNavWidth(){
    var navMaxWidth=parseInt($("#navMaxWidth").css('width'));
    console.log(navMaxWidth);

    var navWidth=parseFloat($("#navWidth").css('width'));
    console.log(navWidth);
    if(navWidth > (navMaxWidth-46)){
        //$("#header .header-nav li").css("width",(headerWidth-350)/($("#header .header-nav li").length+1));
        //$("#header .header-nav").css('overflow','hidden');
        $("#navWidth").parent().css("width",(navMaxWidth-46)+"px");
        $("#navWidth").css("position","absolute");
        $("#navWidth").css("left",navWidth-navMaxWidth+"px")
    }
}
//点击经办流程添加导航
function addNavList(thisNav){
    console.log(thisNav);
    var thisClassName=($(thisNav).attr('class'));
    //console.log(thisClassName);
    if(thisNav.className.indexOf("open2")===-1){
        var navText=thisNav.innerText;
        var navSrc=$(thisNav).attr('href');
        $(thisNav).addClass("open2");
        //$("#header .header-nav").removeClass('.active');
        $("#header .header-nav").append("<li class='nav-1 '><a onclick='locationList(this)'  href='"+navSrc+"'>" +
        ""+navText+"</a><i onclick='navClose(this)' class='fa fa-times'></i></li>");
    }
    setNavWidth();
    addBadageLabel();
    //添加label标签
    addThumbnail(thisNav);

}
//添加label标签addThumbnail（）
function addThumbnail(thisNav){
    console.log(thisNav);
	console.log(thisNav.getAttribute('href'))
	var tsNavHref=thisNav.getAttribute('href');
    var label=thisNav.innerText;
    console.log(label);
    var labelListContent=$("#portal").html();
    console.log(labelListContent);
    $("#tabsContainer").append('<li><a href="'+tsNavHref+'"><div class="status-box"><span class="status">当前页面</span></div>' +
    '<div class="nav-title">'+label+'</div></a>'+labelListContent+'<i class="fa fa-times"></i></li>')
}
//添加
function addNav() {
    var menuList = $('#leftAside #accordion1>li>ul>li>a');
    //console.log(menuList);
    for (var i = 0; i < menuList.length; i++) {
        menuList[i].onclick = function () {

            console.log(this);
            locationList(this);
            addNavList(this);
        }
    }
}

//点击导航关闭删除导航
function navClose(e){
	console.log($(e).parent());
    //console.log($(e).parent()[0].nextSibling);
    var liPrev=($(e).parent()[0].previousSibling).childNodes;
    console.log($(e).parent()[0].nextSibling)
		var deleteShadeList=$(e).parent("li").children("a")[0].getAttribute("href");
		$("#tabsContainer li a[href='"+deleteShadeList+"']").parent().remove();
    if($(e).parent()[0].nextSibling){
         var liNextSib=($(e).parent()[0].nextSibling).childNodes;
            locationList(liNextSib[0])
    }else{
        //console.log(liPrev.length);

        if(liPrev.length>1){
            locationList(liPrev[0]);
        }
        else{
            location.href="homePage.html";
        }
    }
    var eGrandFather= $(e).parent();
     eGrandFather.remove();
     //获得i父元素a的href属性
     //根据属性找到左边栏的啊a,并且移除class=“open1”
    var leftNav;
     if( leftNav=$($("#leftAside li a[href="+$(e).parent().children("a")[0].hash+"]"))){
    //console.log(leftNav);
    $(leftNav).removeClass("open2");}
    addBadageLabel();
}

//项目管理点击生成导航
function createNav(){
    var menuSecondList=$("#test0 li ul.second-menu li.second-menu-item a");
    //console.log(menuSecondList);
    for(var i=0;i< i.length;i++){
        menuSecondList[i].onclick=function(){
            //console.log(this)
        }
    }
}

    var EventUtil = {
    /* ��Ԫ������¼�������� */
    addHandler : function(element,type,handler){
        if(element.addEventListener){
            element.addEventListener(type,handler,false);
        }else if(element.attachEvent){
            element.attachEvent('on'+type,handler);
        }else{
            element['on'+type] = handler;
        }
    },
    /*��ȡevent���󷽷�*/
    getEvent : function(event){
        return event?event:window.event;
    },
    /*��ȡ�¼�ԴDOMԪ�ط�������Ϊʹ�����¼�ð������Ҫ�ҵ��¼���ԴͷDOM���ж��Ƿ���һ���˵��������¼�*/
    getTarget : function(event){
        return event.target || event.srcElement;
    }
};

var menu0 =document.getElementById('test0');
console.log(menu0);

var CollapsibleMenu = function(firstMenu){
    this.init(firstMenu);
};
CollapsibleMenu.prototype.init = function(firstMenu){
	console.log(firstMenu);
    this.firstMenu = firstMenu;   // ����һ���˵������ul
	console.log(firstMenu.querySelectorAll('.second-menu'))
    //this.secondMenus = firstMenu.querySelectorAll('.second-menu');   // ��������˵����ul
	this.secondMenus = firstMenu.querySelectorAll('li ul.second-menu'); 
    console.log(this.secondMenus);
    this.firstMenusName=firstMenu.querySelectorAll('.first-menu-name');
	console.log(this.firstMenusName);
    this.activeIndex = -1; // ��ʼactiveIndex
    this.setOnClick();
};
CollapsibleMenu.prototype.setOnClick = function(){
    EventUtil.addHandler(this.firstMenu,'click',function(e){
        var target;
        e = EventUtil.getEvent(e);
        target = EventUtil.getTarget(e);
        console.log(target);
        if(target.tagName.toUpperCase() === 'A' && target.className.indexOf('first-menu-name') !== -1){
            this.onFirstMenuNameClick(target);
        }
        if(target.parentNode.tagName.toUpperCase()==='A'&& target.parentNode.className.indexOf('first-menu-name') !== -1){
            this.onFirstMenuNameClick(target.parentNode)
        }
        if(target.parentNode.parentNode.tagName.toUpperCase()==='A'&& target.parentNode.parentNode.className.indexOf('first-menu-name') !== -1){
            this.onFirstMenuNameClick(target.parentNode.parentNode)
        }
        if(target.tagName.toUpperCase()==="A"&&target.className.indexOf('second-menu-content') !== -1){
            console.log("1");
            locationList(target);
            addNavList(target);
            setNavWidth();
        }
    }.bind(this));
};
CollapsibleMenu.prototype.onFirstMenuNameClick = function(event){
    console.log(event);
   console.log(event.classList);

    var secondMenu = event.nextElementSibling;//
    console.log(secondMenu);
    var secondMenuBro=event;
    var index = this.getSecondMenuIndex(secondMenu);
    console.log(index);
    console.log(this.activeIndex);
    if(this.activeIndex === -1){
        $(secondMenu).slideDown();
		//$(secondMenu).css('display','none');
        secondMenuBro.classList.add("open1");
        secondMenuBro.classList.add("active");
        console.log(secondMenuBro);
        this.activeIndex = index;
    }else{
        console.log(index);
        if(this.activeIndex === index){
            $(secondMenu).slideUp();
			//$(secondMenu).css('display','block');
            //console.log(secondMenu);
            secondMenuBro.classList.remove('open1');
            secondMenuBro.classList.remove("active");
            this.activeIndex = -1;
        }else{
            //$(this.secondMenus[this.activeIndex]).slideUp();
			$(this.secondMenus[this.activeIndex]).css('display','none');
            this.firstMenusName[this.activeIndex].classList.remove('open1');
            this.firstMenusName[this.activeIndex].classList.remove('active')
            //$(secondMenu).slideDown();
			  $(secondMenu).css('display','block');
            secondMenuBro.classList.add('open1');
            secondMenuBro.classList.add('active');

            this.activeIndex = index;
        }
    }
};
CollapsibleMenu.prototype.getSecondMenuIndex = function(secondMenu){
    var secondMenus = this.secondMenus;
    console.log(secondMenus);
    var i,len;
    for(i=0,len=secondMenus.length;i<len;i++){
        if(secondMenus[i] === secondMenu){
            return i;
        }
    }
    return -2;
};
function a(){var test0 = new CollapsibleMenu(menu0);}

//功能菜单
function locationList(target){
    console.log(target);
    var Ahref=$(target).attr("href");
    var aText=$(target).html();
    console.log(aText);
    $("#portal").empty();
    if(Ahref=="#1"){
        $("#portal").html("<iframe src='../Warehouse/mywarehouse.html'></iframe>");
    }
    if(Ahref=="#2"){
        $("#portal").html("<iframe src='../productionRecords/productionRecordes.html'></iframe>");
    }
    if(Ahref=="#3"){
        $("#portal").html("<iframe src='newConstruction.html'></iframe>");
    }
    if(Ahref=="#4"){
        $("#portal").html("<iframe src='../Warehouse/mywarehouse.html'></iframe>");
    }
    if(Ahref=="#11"){
        $("#portal").html("<iframe src='newConstruction.html'></iframe>");
    }
}
function addDAta(){
    var managemen=$("#asideFooter .functionManagemen li a");
    //console.log(managemen);
    for(var i=0;i<managemen.length;i++){
        managemen[i].onclick=function(){
            var $this = $(this);
            //console.log($this);
//                var title = $this.attr("title");
//                var id = $this.data("id");
//                var type = $this.data("type");
//                var num = $this.data("num");
            var textDetail=$this[0].textContent;
            //console.log(textDetail);
            $this.parent().siblings().removeClass("function-active1");
            $this.parent().addClass("function-active1");
            $("#test0").empty();
            requestDataDispose(this);
            var menu2=document.getElementById("test0");
            //console.log(menu2);
            var test1=new CollapsibleMenu(menu2);
            //test0(menu2);
            //addNav();
        }
    }

}
function storeManagement(){
    var storeManagemenData="<li>仓库管理</li><li class='first-menu-item'><a  href='#1' class='first-menu-name'><span class='icon-main-menu'><img src='../Images/2.png'/></span><h5>仓库管理</h5></a>" +
        "<ul class='second-menu' id='dataId0'><li class='second-menu-item'>" +
        "<a class='second-menu-content' href='#2'>我的仓库</a></li><li class='second-menu-item'><a class='second-menu-content' href='#111'>材料编码库管理</a></li>"+
        "<li class='second-menu-item'><a class='second-menu-content' href='#4'>材料回收管理</a></li>"+"<li class='second-menu-item'>" +
        "<a class='second-menu-content' href='#6'>周转性材料管理</a></li>"+"<li class='second-menu-item'>" +
        "<a class='second-menu-content' href='#7'>全矿库存查询</a></li></ul>";
    $("#test0").html( storeManagemenData);
}
var requestDataDispose=function(requestData){
    //console.log(requestData);
    var asideData;
    var contentTxt=requestData.textContent;
    //console.log(contentTxt);(
    //项目管理
    if(contentTxt=="仓库管理"){
        storeManagement();
    }
    if(contentTxt=="资金管理"){
            asideData="<li>资金管理</li><li class='first-menu-item'><a  href='#8' class='first-menu-name'><span class='icon-main-menu'><img src='../Images/2.png'/></span> <h5>资金管理</h5></a>" +
            "<ul class='second-menu' id='dataId1'><li class='second-menu-item'>" +
            "<a class='second-menu-content' href='#9'>我的账户</a></li><li class='second-menu-item'>" +
            "<a class='second-menu-content' href='#10'>新建资金申请</a></li>"+"<li class='second-menu-item'>" +
            "<a class='second-menu-content' href='#11'>资金申请查询</a></li>"+"<li class='second-menu-item'>" +
            "<a class='second-menu-content' href='#12'>全矿资金账户查询</a></li>"+"<li class='second-menu-item'>" +
            "<a class='second-menu-content' href='#70'>账户流水统计</a></li></ul></li>";
        $("#test0").html(asideData);
    };
	//var asideFoot=[
	//	["仓库管理","#1","dataId0","#2"],
		
//	]
    if(contentTxt=="生产与预算"){
        asideData="<li>生产与预算</li><li class='first-menu-item'><a  href='#13' class='first-menu-name'><span class='icon-main-menu'><img src='../Images/2.png'/></span><h5>生产记录</h5></a>" +
        "<ul class='second-menu' id='dataId2'><li class='second-menu-item'>" +
        "<a class='second-menu-content' href='#14'>原煤生产记录</a></li><li class='second-menu-item'><a class='second-menu-content' href='#'>开拓掘进记录</a></li></ul></li>"+
        "<li class='first-menu-item'><a  href='#15' class='first-menu-name'><span class='icon-main-menu'><img src='../Images/2.png'/></span><h5>月度生产计划</h5></a>" +
        "<ul class='second-menu ' id='dataId3'><li class='second-menu-item'><a class='second-menu-content' href='#113'>月度生产经营汇总计划</a></li>" +
        "<li class='second-menu-item'><a class='second-menu-content' href='#16'>月度原煤生产经营计划</a></li>" +
        "<li class='second-menu-item'><a class='second-menu-content' href='#17'>月度开拓掘进计划</a></li>" +
        "<li class='second-menu-item'><a class='second-menu-content' href='#18'>月度支撑钢使用及修旧计划</a></li>" +
        "<li class='second-menu-item'><a class='second-menu-content' href='#19'>月度单项工程计划</a></li>" +
        "<li class='second-menu-item'><a class='second-menu-content' href='#20'>月度后勤单位工作计划</a></li></ul></li>"+
        "<li class='first-menu-item'><a  href='#21' class='first-menu-name'><span class='icon-main-menu'><img src='../Images/2.png'/></span><h5>年生产计划</h5></a>" +
        "<ul class='second-menu ' id='dataId4'><li class='second-menu-item'><a class='second-menu-content' href='#22'>采面接替与原煤产量滚动计划</a></li>" +
        "<li class='second-menu-item'><a class='second-menu-content' href='#'>年度井巷工程排队计划</a></li></ul></li>" +
        "<li class='first-menu-item'><a  href='23' class='first-menu-name'><span class='icon-main-menu'><img src='../Images/2.png'/></span><h5>年度材料预算</h5></a>" +
        "<ul class='second-menu ' id='dataId5'><li class='second-menu-item'>" +
        "<a class='second-menu-content' href='#24'>年度全矿材料预算</a></li><li class='second-menu-item'>" +
        "<a class='second-menu-content' href='#25'>年度大型材料预算</a></li><li class='second-menu-item'>" +
        "<a class='second-menu-content' href='#26'>年度原煤生产材料指标</a></li><li class='second-menu-item'>" +
        "<a class='second-menu-content' href='#27'>年度开拓掘进材料指标</a></li></ul></li>"+
        "<li class='first-menu-item'><a  href='#28' class='first-menu-name'><span class='icon-main-menu'><img src='../Images/2.png'/></span><h5>月度材料计划</h5></a>" +
        "<ul class='second-menu collapse' id='dataId6'><li class='second-menu-item'><a class='second-menu-content' href='#'>月度全矿材料预算</a></li>" +
        "<li class='second-menu-item'><a class='second-menu-content' href='#29'>月度大型材料预算</a></li>" +
        "<li class='second-menu-item'><a class='second-menu-content' href='#30'>月度原煤生产材料指标</a></li>" +
        "<li class='second-menu-item'><a class='second-menu-content' href='#31'>月度开拓掘进材料指标</a></li>" +
        "<li class='second-menu-item'><a class='second-menu-content' href='#32'>单位材料限额指标</a></li></ul></li>";
        $("#test0").html(asideData);
        }
    //
    if(contentTxt=="计划与验收"){
        asideData="<li>计划与验收</li>" +
        "<li class='first-menu-item'><a  href='#33' class='first-menu-name'><span class='icon-main-menu'><img src='../Images/2.png'/></span><h5>材料计划</h5></a>" +
        "<ul class='second-menu ' id='dataId7'><li class='second-menu-item'><a class='second-menu-content' href='#34'>新建材料计划</a></li>" +
        "<li class='second-menu-item'><a class='second-menu-content' href='#35'>材料计划查询</a></li></ul></li><li class='first-menu-item'><a  href='#36' class='first-menu-name'><span class='icon-main-menu'><img src='../Images/2.png'/></span><h5>采购计划</h5></a>" +
        "<ul class='second-menu ' id='dataId8'><li class='second-menu-item'><a class='second-menu-content' href='#37'>新建采购计划</a></li><li class='second-menu-item'><a class='second-menu-content' href='#'>采购计划查询</a></li></ul></li>"+
        "<li class='first-menu-item'><a  href='#38' class='first-menu-name'><span class='icon-main-menu'><img src='../Images/2.png'/></span><h5>材料验收</h5></a>" +
        "<ul class='second-menu ' id='dataId9'><li class='second-menu-item'><a class='second-menu-content' href='#39'>新建验收通知</a></li>" +
        "<li class='second-menu-item'><a class='second-menu-content' href='#40'>材料验收查询</a></li>" ;
        $("#test0").html(asideData);
    }
    //
    if(contentTxt=="批控与考核"){
        asideData="<li>批控与考核</li><li class='first-menu-item'><a  href='#41' class='first-menu-name'><span class='icon-main-menu'><img src='../Images/2.png'/></span><h5>材料与批控</h5></a>" +
        "<ul class='second-menu collapse' id='dataId10'><li class='second-menu-item'>" +
        "<a class='second-menu-content' href='#42'>新建材料申请</a></li><li class='second-menu-item'>" +
        "<a class='second-menu-content' href='#43'>材料申请查询</a></li>"+"<li class='second-menu-item'>" +
        "<a class='second-menu-content' href='#44'>材料消耗查询</a></li></ul></li><li class='first-menu-item'><a  href='#46' class='first-menu-name'><span class='icon-main-menu'><img src='../Images/2.png'/></span> <h5>材料考核</h5></a>" +
        "<ul class='second-menu collapse' id='dataId11'><li class='second-menu-item'>" +
        "<a class='second-menu-content' href='#47'>材料考核查询</a></li><li class='second-menu-item'>" +
        "<a class='second-menu-content' href='#48'>材料回收考核</a></li>"+"<li class='second-menu-item'>" +
        "<a class='second-menu-content' href='#49'>材料考核统计</a></li></ul></li>";
        $("#test0").html(asideData);
    }
    //
    if(contentTxt=="统计与查询"){
        asideData="<li>统计与查询</li><li class='first-menu-item'><a  href='#50' class='first-menu-name'><span class='icon-main-menu'><img src='../Images/2.png'/></span> <h5>查询</h5></a>" +
        "<ul class='second-menu collapse' id='dataId12'><li class='second-menu-item'>" +
        "<a class='second-menu-content' href='#51'>全矿库库存查询</a></li><li class='second-menu-item'>" +
        "<a class='second-menu-content' href='#52'>全矿资金账户查询</a></li>"+"<li class='second-menu-item'>" +
        "<a class='second-menu-content' href='#53'>材料计划查询</a></li>"+"<li class='second-menu-item'>" +
        "<a class='second-menu-content' href='#54'>材料消耗查询</a></li></ul></li>"+"<li class='first-menu-item'><a  href='#dataId14' class='first-menu-name'><span class='icon-main-menu'><img src='../Images/2.png'/></span> <h5>统计</h5></a>" +
        "<ul class='second-menu collapse' id='dataId13'><li class='second-menu-item'><a class='second-menu-content' href='#55'>全矿材料考核统计</a></li><li class='second-menu-item'>" +
        "<a class='second-menu-content' href='#56'>全矿材料消耗统计</a></li><li class='second-menu-item'>" +
        "<a class='second-menu-content' href='#57'>全矿大型材料投入统计</a></li>"+"<li class='second-menu-item'>" +
        "<a class='second-menu-content' href='#58'>直接队材料消耗统计</a></li><li class='second-menu-item'>" +
        "<a class='second-menu-content' href='#59'>全矿材料考核算表</a></li></ul></li>"
        $("#test0").html(asideData);
    }
    //
    if(contentTxt=="系统管理"){
        asideData="<li>系统管理</li><li class='first-menu-item'><a  href='60' class='first-menu-name'><span class='icon-main-menu'><img src='../Images/2.png'/></span> <h5>用户权限</h5></a>" +
        "<ul class='second-menu collapse' id='dataId15'><li class='second-menu-item'>" +
        "<a class='second-menu-content' href='#61'>用户管理</a></li><li class='second-menu-item'>" +
        "<a class='second-menu-content' href='#62'>角色管理</a></li>"+"<li class='second-menu-item'>" +
        "<a class='second-menu-content' href='#63'>部门管理</a></li></ul></li>"+"<li class='first-menu-item'><a  href='#64' class='first-menu-name'><span class='icon-main-menu'><img src='../Images/2.png'/></span> <h5>项目管理</h5></a>" +
        "<ul class='second-menu collapse' id='dataId15'><li class='second-menu-item'>" +
        "<a class='second-menu-content' href='#65'>采掘工程管理</a></li><li class='second-menu-item'>" +
        "<a class='second-menu-content' href='#66'>单项工程管理</a></li>"+"<li class='second-menu-item'>" +
        "<a class='second-menu-content' href='#67'>采面管理</a></li></ul></li>"
        $("#test0").html(asideData);
    }

};
//页面加载时
//点击板块事件
$(".action").on("click",function(e){
   var target= e.target;
   var targetClassName= $(target).attr("class");
   if(targetClassName=="close"){
       $(target).parent().parent().parent().css("display","none");
   }
    if(targetClassName=="min"){
        console.log(($(target).parent().parent().parent()));
     $(target).parent().parent().parent().children(".item-content").css('display','none');
        $(target).siblings('.max').css("display","block");
        $(target).css("display","none");
    }
    if(targetClassName=="max"){
        console.log(($(target).parent().parent().parent()));
        $(target).parent().parent().parent().children(".item-content").css('display','block');
        $(target).siblings('.min').css("display","block");
        $(target).css("display","none");
    }
}
);
//右侧快捷方式
$("#configIcon").on("click","a",function(){
    console.log(this);
    addNavList(this);
    locationList(this);
});
//遮罩层
var navPreview=document.getElementById('navPreview');
var tabPreview=document.getElementById("tabPreview");
var navList=document.getElementById("navWidth");
var blackShade=function(shadeRestore,shadeTabPreview,navList){
    this.init(shadeRestore,shadeTabPreview,navList);
    //console.log(shadeRestore);

};
blackShade.prototype.init=function(shadeRestore,shadeTabPreview,navList){
    this.shadeTabPreview=shadeTabPreview;//保留时间源
    this.navList=navList;//保留导航条
    shadeRestore.onclick=function(){
        console.log(shadeTabPreview);
        shadeTabPreview.style.display="block";
    };
    this.closeShade();
};
blackShade.prototype.closeShade=function(){
    EventUtil.addHandler(this.shadeTabPreview,"click",function(e){
        var target;
        e = EventUtil.getEvent(e);
        target = EventUtil.getTarget(e);
        console.log(target);
        if(target.tagName.toUpperCase()==="DIV"&&target.className.indexOf('slimScrollDiv')!==-1){
            this.onCloseShade();
        }
        if(target.tagName.toUpperCase()==="DIV"&&target.className.indexOf('nav-closeAll')!==-1){
            this.onCloseShade();
        }
        if(target.tagName.toUpperCase()==="DIV"&&target.className.indexOf('status-box')!==-1){
            console.log(target.parentNode);
			//this.jumpWindow(target);
			 this.onCloseShade();
        }
        if(target.tagName.toUpperCase()==="A"&&target.className.indexOf('nav-btn')!==-1){;
            this.onCloseShade();
        }
        if(target.tagName.toUpperCase()==="I"&&target.className.indexOf('fa-times')!==-1){
            this.deleteNav(target);
        }
    }.bind(this));
};
blackShade.prototype.onCloseShade=function(){
    this.shadeTabPreview.style.display="none";
};
//blackShade.prototype.CloseOpenWindow=function(){
//	$("#tabsContainer li:first-child").siblings().remove();
//}
blackShade.prototype.deleteNav=function(target){
	 //console.log(target);
    var navListLiA=$(target.parentNode).children("a").attr('href');
    //console.log($(target).parent());
    $(target).parent().remove();
    //console.log($(target).parent()[0].childNodes[0])
    //console.log($(target.parentNode).children("a").attr('href'));
   //console.log($(this.navList).children('li').length); 
    var deleteLi=this.navList.querySelectorAll("a[href='"+navListLiA+"']")[0].parentNode;
	navClose($(deleteLi).children("i")[0]);
    //console.log(deleteLi);
	//console.log($(deleteLi).children("i")[0])
    $(deleteLi).remove();
	this.storeManagement1();
	this.onCloseShade();
	
};
blackShade.prototype.storeManagement1=function(){
	$("#badgeLabel").empty().html($(this.navList).children('li').length);
}
blackShade.prototype.jumpWindow=function(target){
	var iFrameSrc=$(target.parentNode).parent().children('iframe').attr('src');
	console.log(iFrameSrc);
	$("#portal").empty();
	$("#portal").html("<iframe src='"+iFrameSrc+"'</iframe>")
		this.onCloseShade();
}
var text6=new blackShade( navPreview,tabPreview,navList);
//关闭遮罩层


