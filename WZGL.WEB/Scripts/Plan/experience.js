//体验部分
$(".btn-primary").click(function(){
    $("#toast-container").show();
    $(".toast-progress").animate({width:300},"slow");
    $(".toast-progress").animate({width:0},3000,function(){
        $("#toast-container").hide();
        $(".toast-progress").animate({width:300},2);
    });
    $(".toast-error").hover(
        function () {
            //光标悬停时执行
            $(".toast-progress").stop(true);
            $(".toast-progress").hide();
            $(".toast-progress").animate({width:300},2);
        },
       
        function () {
            //光标离开时执行
            $(".toast-progress").show();
            $(".toast-progress").animate({width:300},"slow");
            $(".toast-progress").animate({width:0},3000,function(){
                $("#toast-container").hide();
            });
        }
    );
});
$(".toast-close-button").click(function(){
    $("#toast-container").hide();

});

