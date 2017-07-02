//部门名称
var inputName = '';
//编辑前部门名称
var oldName = '';
var id = "";
var level = "";
var ThistrContent;
$('.btn_vessel').on('click','li',function(){
    if(this.className.indexOf('btn_newly')!==-1){
        $('#newShade').slideToggle('show');
    }
});

$('#phPopUpClose').on('click',function(){
    $('#newShade').slideToggle('hide');
});
$('#newShade').on('click','div',function(){
    if(this.className=='newShade_lay'){
        $('#newShade').slideToggle('hide');
    }
});
//操作
$("#orgview").on('click', 'a', function () {
    if($('#sectionInterface').find('input').length!==0){
        return;
    }
    if(this.className.indexOf("addChirdren")!==-1){
        var chirdrenList = this.parentNode.parentNode.firstElementChild.className;

        var idlevel = (this.parentNode.parentNode.firstElementChild.firstElementChild.textContent).split(',');
         id = idlevel[0];
        level = Number(idlevel[1]) + 1;
        var NextchirdernList=chirdrenList.slice(0,chirdrenList.length-1)+(chirdrenList[chirdrenList.length-1]*1+1);
     
        var html = '<tr style="background: #ddd;"><td class="' + NextchirdernList + '"><span></span><input id="sectionName" type="text"/></td><td><a onclick="btnSubmit(this,1)"  href="javascript:void(0)" >保存</a>&nbsp;<a href="javascript:void(0)" onclick="newBtnCancel(this)">取消</a></td></tr>';
        $(this.parentNode.parentNode).after(html);
    }else if(this.className.indexOf("amend")!==-1){
        //编辑
        var idlevel = (this.parentNode.parentNode.firstElementChild.firstElementChild.textContent).split(',');
        id = idlevel[0];
        level = Number(idlevel[1]);


        ThistrContent=$(this).parent().parent().html();
        $(this.parentNode.parentNode).css('backgroundColor','#ddd');
        var chirdrenList= this.parentNode.parentNode.firstElementChild.className;
        var NextchirdernList=chirdrenList.slice(0,chirdrenList.length-1)+(chirdrenList[chirdrenList.length-1]*1);//获得当前行的class
     
        var sectionNameCon = (this.parentNode.parentNode.firstElementChild.lastElementChild).textContent;//获得当前行td里i标签里的内容

        var html1='<td class="'+NextchirdernList+'"><input  id="sectionName" value="'+ sectionNameCon+'" type="text"/></td>' +
          '<td><a onclick="btnSubmit(this,2)" href="javascript:void(0)">保存</a>&nbsp;&nbsp;<a href="javascript:void(0)" onclick="editBtnCancel(this)">取消</a></td>';
        $(this.parentNode.parentNode).empty().append(html1);
    }else if(this.className.indexOf("delete")!==-1){
        //删除
        var idlevel = (this.parentNode.parentNode.firstElementChild.firstElementChild.textContent).split(',');
        id = idlevel[0];
        del(this);
    }
});
//保存
function btnSubmit(e, state) {
    $(e.parentNode.parentNode).css('backgroundColor', 'transparent');
    //节点名字
    inputName = $("input#sectionName").val();
    var ThisClassName = e.parentNode.parentNode.firstElementChild.className;
    if (inputName) {
        save(state,e);
    } else {
        alert("内容不能为空")
    }
}
function newBtnCancel(e){
    $(e).parent().parent().remove();
}
function editBtnCancel(e){
    $(e.parentNode.parentNode).css('backgroundColor','transparent');
    $(e).parent().parent().empty().append(ThistrContent);
}

$('#activityTable ul li.btn_return').on('click',function(){
    $('#newShade').slideToggle('hide')
});

