$(document).ready(function(){
    $(".toggle").click(function () {
        $(".tree>li>ul.treemenu").css("display","block");
        $(".tree").slideToggle("slow");
        
    });
    //initTree();
});

 function initTree(){
     $.fn.openActive = function (activeSel) {
         activeSel = activeSel || ".active";
         var c = this.attr("class");
        this.find(activeSel).each(function(){
            var el = $(this).parent();
            while (el.attr("class") !== c) {
                if(el.prop("tagName") === 'UL') {
                    el.show();
                } else if (el.prop("tagName") === 'LI') {
                    el.removeClass('tree-closed');
                    el.addClass("tree-opened");
                }

                el = el.parent();
            }
        });

        return this;
    }

    $.fn.treemenu = function(options) {
        options = options || {};
        options.delay = options.delay || 0;
        options.openActive = options.openActive || false;
        options.activeSelector = options.activeSelector || "";
		options.padding = options.padding || 20;
		
        this.addClass("treemenu");
        this.find("> li").each(function() {
            e = $(this);
          
            var subtree = e.find('> ul');
            var button = e.find('span').eq(0);
			var aTag = e.find("a").eq(0);
			aTag.css("padding-left",options.padding);
		   
            if( button.length == 0) {
                var button = $('<span>');
                button.addClass('toggler');
				button.css("padding-left",options.padding-15);
                e.prepend(button);
            } else {
                button.addClass('toggler');
				button.css("padding-left",options.padding-15);
            }

            if(subtree.length > 0) {
                subtree.hide();

                e.addClass('tree-closed');

                e.find(button).click(function() {
                    var li = $(this).parent('li');
                    li.find('> ul').slideToggle(options.delay);
                    li.toggleClass('tree-opened');
                    li.toggleClass('tree-closed');
                    li.toggleClass(options.activeSelector);

                });
				options.padding+=20;
                $(this).find('> ul').treemenu(options);
				options.padding-=20;
            } else {
                $(this).addClass('tree-empty');
            }
        });

        if (options.openActive) {
            this.openActive(options.activeSelector);
        }
        return this;
    }
    treeFunction();
};
function treeFunction(){

    var cards = $(".card-drop"),
        toggler = cards.find(".toggle"),
        links = cards.find("ul>li>a"),
        li = links.parent('li'),
        count = links.length,
        width = links.outerWidth();

    //
    //links.parent("li").each(function(i){
    //    $(this).css("z-index" , count - i); //invert the index values
    //});


    function setClosed(){
    //    li.each(function(index){
    //        $(this).css("top" , index *2)
    //            .css("width" , width - index *2)
    //            .css("margin-left" , (index*2)/2);
    //    });
        li.addClass('closed');
        toggler.removeClass("active");
    }
     setClosed();
    //
    toggler.on("click" , function(){
        var $this = $(this); //cache $(this)
        //if the menu is active:
        if($this.is(".active")){
            setClosed();         
        }else{
            //if the menu is un-active:
            $this.addClass("active");
            li.removeClass('closed');
            //set top margins
            //li.each(function(index){
            //    $(this).css("top" , 50 * (index + 1))
            //        .css("width" , "100%")
            //        .css("margin-left" , "0px");
            //});
      }
    });


    links.on("click" , function(e){
        var $this = $(this),
            label = $this.data("label");
        $(".toggle").addClass("active");
        li.removeClass('active');
        if($this.parent("li").is("active")){
            $this.parent('li').removeClass("active");
        }else{
            $this.parent("li").addClass("active");
        }

        //toggler.children("span").text(label);
        $(".tree").slideToggle("hide");
        
        e.preventDefault;
    });

}
//第二次调用
$(document).ready(function () {
    $(".toggle1").click(function () {
        $(".tree1").slideToggle("slow");
        $(".card-drop1").addClass("outline")
    });
    //initTree();
});

function initTree1() {
    $.fn.openActive1 = function (activeSel) {
        activeSel = activeSel || ".active";
        var c = this.attr("class");
        this.find(activeSel).each(function () {
            var el = $(this).parent();
            while (el.attr("class") !== c) {
                if (el.prop("tagName") === 'UL') {
                    el.show();
                } else if (el.prop("tagName") === 'LI') {
                    el.removeClass('tree-closed');
                    el.addClass("tree-opened");
                }

                el = el.parent();
            }
        });

        return this;
    }

    $.fn.treemenu1 = function (options) {
        options = options || {};
        options.delay = options.delay || 0;
        options.openActive = options.openActive || false;
        options.activeSelector = options.activeSelector || "";
        options.padding = options.padding || 20;

        this.addClass("treemenu");
        this.find("> li").each(function () {
            e = $(this);
     
            var subtree = e.find('> ul');
            var button = e.find('span').eq(0);
            var aTag = e.find("a").eq(0);
            aTag.css("padding-left", options.padding);

            if (button.length == 0) {
                var button = $('<span>');
                button.addClass('toggler1');
                button.css("padding-left", options.padding - 15);
                e.prepend(button);
            } else {
                button.addClass('toggler1');
                button.css("padding-left", options.padding - 15);
            }

            if (subtree.length > 0) {
                subtree.hide();

                e.addClass('tree-closed');

                e.find(button).click(function () {
                    var li = $(this).parent('li');
                    li.find('> ul').slideToggle(options.delay);
                    li.toggleClass('tree-opened');
                    li.toggleClass('tree-closed');
                    li.toggleClass(options.activeSelector);

                });
                options.padding += 20;
                $(this).find('> ul').treemenu1(options);
                options.padding -= 20;
            } else {
                $(this).addClass('tree-empty');
            }
        });

        if (options.openActive) {
            this.openActive1(options.activeSelector);
        }
        return this;
    }

    treeFunction1();

};
function treeFunction1() {

    var cards = $(".card-drop1"),
        toggler = cards.find(".toggle1"),
        links = cards.find("ul>li>a"),
        li = links.parent('li'),
        count = links.length,
        width = links.outerWidth();

    //
    //links.parent("li").each(function(i){
    //    $(this).css("z-index" , count - i); //invert the index values
    //});


    function setClosed() {
        //    li.each(function(index){
        //        $(this).css("top" , index *2)
        //            .css("width" , width - index *2)
        //            .css("margin-left" , (index*2)/2);
        //    });
        li.addClass('closed');
        toggler.removeClass("active");
    }
    setClosed();
    //
    toggler.on("click", function () {
        var $this = $(this); //cache $(this)
        //if the menu is active:
        if ($this.is(".active")) {
            setClosed();
            $(".card-drop1").removeClass("outline");
        } else {
            //if the menu is un-active:
            $this.addClass("active");
            li.removeClass('closed');
            //set top margins
            //li.each(function(index){
            //    $(this).css("top" , 50 * (index + 1))
            //        .css("width" , "100%")
            //        .css("margin-left" , "0px");
            //});
        }
    });
    links.on("click", function (e){
        var $this = $(this),
            label = $this.data("label");
        $(".toggle1").addClass("active");
        li.removeClass('active');
        if ($this.parent("li").is("active")) {
            $this.parent('li').removeClass("active");
        } else {
            $this.parent("li").addClass("active");
        }

        //toggler.children("span").text(label);
        $(".tree1").slideToggle("hide");
        $(".card-drop1").removeClass("outline")
        e.preventDefault;
    });
}

