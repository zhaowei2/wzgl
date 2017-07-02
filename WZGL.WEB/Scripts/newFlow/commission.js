/**
 * Created by Hoswing on 2016/12/21.
 */
var tabIndex = -1;
var liIndex = -1;
var PageLoad = [false];
var LiLoad = [false];
$(function () {
    $.ajax({
        type: "POST",
        url: '../../Controllers/Flow/Flow.ashx?action=getTypeList',
        dataType: 'json',
        success: function (msg) {
            var html = '', html2='';
            var msg = eval(msg);
            PageLoad = new Array([msg.length]);
            for (var i = 0; i < msg.length; i++) {
                PageLoad[i] = false;
                html += ' <li class="user" atrcode="' + msg[i].type.TYPE_CODE + '"><a href="#">' + msg[i].type.TYPE_NAME + '</a><span  id="span_' + i + '">' + msg[i].Count + '</span></li>';
                html2 += '	<div id="div_' + i + '" class="tab_content" ><ul class="header_btn" id="header_btn'+i+'"><li class="allList" typecode="' + msg[i].type.TYPE_CODE + '" atrcode=""><a class="on_active" href="#">全部</a></li>';
                for (var k = 0; k < msg[i].datalist.length; k++)
                {
                    html2 += ' <li class="card " typecode="' + msg[i].type.TYPE_CODE + '" atrcode="' + msg[i].datalist[k].Code + '"><a href="#">' + msg[i].datalist[k].Name + '</a><span id="span_c' +i+ (k+1) + '">' + msg[i].datalist[k].Count + '</span></li>';
                }

                html2 += '</ul><div> <div id="allList_' + i + '" class="allList"><ul class="all" id="all_' + i + '"></ul> <div id="Pagination_' + i + '" class="pagination" style="float: right;"><div id="hiddenresult_' + i + '" style="display: none;" /></div></div></div></div></div>';
            }
            // alert(html);
            $('.header_nav').html(html);
            $('#div_list').html(html2);
            


            $('.header_btn').on('click', 'li', function () {
               
                var btnSecondThis = this;
                $(btnSecondThis).siblings('li').children('a').removeClass('on_active');
                $(btnSecondThis).children('a').addClass('on_active');
                //$("#" + btnSecondThis.className).css('display', 'block').siblings('div').css('display', 'none');
                var index = $("#header_btn"+tabIndex+" li").index($(this)[0]);
             
                if (liIndex != index || index==0) {
                    liIndex = index;
                    //alert($(this).attr("atrcode"));
                  //  alert(tabIndex + "-" + $(this).attr("typecode") + "-" + $(this).attr("atrcode"))
                    initGrid(tabIndex, $(this).attr("typecode"), $(this).attr("atrcode"));
                }


            });
            $(".header_nav li:eq(0)").click();
        },
        error: function (msg) {
           alert( msg.Message);
        }
    });
});

$('#headerNav .header_nav').on('click', 'li', function () {
    var index = $(".header_nav li").index($(this)[0]);

    
    var clickFirstThis = this;
    $(clickFirstThis).siblings('li').children('a').removeClass('on_active');
    $(clickFirstThis).children('a').addClass('on_active');

    var len=$(".header_nav li").length ;
    if (tabIndex != index) {
        tabIndex = index;
        for (var i = 0; i < len; i++)
        {
            $("#div_"+i).hide();
        }
        $("#div_" + index).show();
        if (PageLoad[index]) {
            return;
        }
        $("#header_btn" + tabIndex + " li:eq(0)").click();
       // $(".header_btn li").index($(this)[0]);
        //alert($(this).attr("atrcode"));
       // initGrid(index, $(this).attr("atrcode"));
    }
  

    //var clickFirstThis=this;
    //$(clickFirstThis).siblings('li').children('a').removeClass('on_active');
    //$(clickFirstThis).children('a').addClass('on_active');
    //if(clickFirstThis.tagName.toUpperCase()==="LI"&&clickFirstThis.className.indexOf('stration')!==-1){;
    //    $('#administrativeTabContent').css('display','block');
    //    $('#manageTabContent').css('display','none');
    //}
    //if(clickFirstThis.tagName.toUpperCase()==="LI"&&clickFirstThis.className.indexOf('user')!==-1){
    //    $('#administrativeTabContent').css('display','none');
    //    $('#manageTabContent').css('display','block');
    //}
});

function initGrid(index,type_code,definecode)
{
   
    var html = '';
    //获取总页数
    var ss = "";
    $.ajax({
        type: "POST",
        url: "../../Controllers/Flow/Flow.ashx?action=getMyTaskByParentCode&TYPE_CODE=" + type_code + "&type=getCount&DEFINE_CODE=" + definecode,
        dataType: 'json',
        success: function (msg) {
            if (msg != '') {
                if (msg.IsSuccess == "true") {
                  
                   $('#span_c' +tabIndex +liIndex).html(msg.Count);
                  //  var initPagination = function () {
                        // 创建分页
                        $("#Pagination_"+index).pagination(parseInt(msg.Count), {
                            num_edge_entries: 1, //边缘页数
                            num_display_entries: 10, //主体页数
                            callback: pageselectCallback,
                            items_per_page:15, //每页显示1项
                            prev_text: "上一页",
                            next_text: "下一页"
                        });
                  //  };

                    function pageselectCallback(page_index, jq) {
                      //  alert("调用");
                        var pageindex = page_index + 1;
                        $.ajax(
                        {
                            url: "../../Controllers/Flow/Flow.ashx?action=getMyTaskByParentCode&TYPE_CODE=" + type_code + "&DEFINE_CODE=" + definecode,
                            type: "post",
                            data: {
                                "page": pageindex,
                                "rows": 15,
                            },
                            success: function (data) {
                                $('#all_' + index).empty();
                              
                                var row = "";
                                $.each(data.rows, function (key, val) {
                                    //alert(val.TASK_ID);
                                    row += ' <li class="tab_list">';
                                    row += '<div class="tabLiFace">';
                                    row += '  <div class="noAvatar">流程</div>';
                                    row += '  <span class="isread"></span>';
                                    row += ' </div>';
                                    row += '  <div class="tabLiCon">';
                                    row += '   <div class="tabLiConBox">';
                                    row += '  <div class="tabLiConA text-left">';
                                    row += '  <span class="tabLiCon-text"><a href="' + val.URL + '?TASK_CODE=' + val.TASK_CODE + '&SEQ=' + val.SEQ + '&looktype=commission">[' + val.DEFINE_NAME + ']' + val.TASK_TILTE + ' </a> </span>';
                                    row += '    </div>';
                                    row += '          <div class="tabLiConB">';
                                    row += '              <div class="tabLiTagLeft">';
                                    row += '                  <span class="tabLiCon-auditornames">发起单位：' + val.SEND_ORGNAME + '&nbsp;</span>';
                                    row += '                  <span class="tabLiCon-auditornames">发起人：' + val.SEND_EMPNAME + '</span>&nbsp;';
                                    row += '                  <span class="tabLiCon-lastprocesstime timeago" title=" ">发起时间：' + val.ADD_TIME.replace('T', ' ') + ' </span>';
                                    row += '             </div>';
                                    row += '              <div class="tabLiTagRight text-right">';
                                    row += '                 <span class="tabLiCon-status" title="审核"><a href="' + val.URL + '?TASK_CODE=' + val.TASK_CODE + '&SEQ=' + val.SEQ + '&looktype=commission">'+'[待' + val.STEP_NAME + ']</a></span>';
    
                                    row += '              </div>';
                                    row += '          </div>';
                                    row += '        </div>';
                                    row += '   </div> ';
                                    row += ' </li>';
                                });
                                $('#all_' + index).append(row);
                                PageLoad[index] = true;
                            }
                        })
                        return false;
                    }
                    //ajax加载
                //    alert("呵呵");
                    //$("#hiddenresult_"+index).load("load.html", null, initPagination);

                }
            }
        }
    });
  
}

addUserLabel();
addAdministrativeLabel();
addAllLabel();
adduserAllLabel();
function addAdministrativeLabel(){
    $("#headerNav .header_nav .stration span").html($("#allList .all").children().length);
    $("#administrativeTab_label  span.allNumber").html($("#allList .all").children().length);
}
function addUserLabel(){
    $("#headerNav .header_nav .user span").html($("#userList .all").children().length);
    $("#manageTab_label  span.allNumber").html($("#userList .all").children().length);
}

function addAllLabel(){;
    var labelList=$("#administrativeTabContent .header_btn li span");
    for(var i=0;i<labelList.length;i++){
        $(labelList[i]).html($("#"+labelList[i].parentNode.className+" ul").children().length)
    }
}
function adduserAllLabel(){
    var labelList=$("#manageTabContent .header_btn li span");
    for(var i=0;i<labelList.length;i++){
        $(labelList[i]).html($("#"+labelList[i].parentNode.className+" ul").children().length)
    }
}


//---------------------审核方法
function Audit(index, type_code, TASK_CODE, SEQ,definecode )
{
    PageLoad[index] = false;
 
    $.ajax({
        type: "POST",
        url: '../../Controllers/Flow/Flow.ashx?action=Audit',
        data: { "TASK_CODE": TASK_CODE, "SEQ": SEQ },
        dataType: 'json',
        success: function (msg) {
            if (msg.IsSuccess == "true") {
                 alert(msg.Message);
                 PageLoad[index]=false;
                 initGrid(index, type_code, definecode);
            }
            else {
                alert(msg.Message);
            }
        },
        error: function (msg) {
            alert(msg.Message);
        }
    });
}

//---------------------打回方法
function Back(index, type_code, TASK_CODE, SEQ, definecode) {
    PageLoad[index] = false;

    $.ajax({
        type: "POST",
        url: '../../Controllers/Flow/Flow.ashx?action=Back',
        data: { "TASK_CODE": TASK_CODE, "SEQ": SEQ },
        dataType: 'json',
        success: function (msg) {
            if (msg.IsSuccess == "true") {
                alert(msg.Message);
                PageLoad[index] = false;
                initGrid(index, type_code, definecode);
            }
            else {
                alert(msg.Message);
            }
        },
        error: function (msg) {
            alert(msg.Message);
        }
    });
}