
function showToast(msg) {
    // Get the toast-msg DIV
    var x = $("#toast-msg");
	
	if (msg!=="") {
		$(x).html(msg);
	}
    // Add the "show" class to DIV
    $(x).addClass("show");

    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){ $(x).removeClass("show"); }, 3000);
}

function showToastError(msg) {
    // Get the toast-msg DIV
    var x = $("#toast-msg-error");
	
	if (msg!=="") {
		$(x).html(msg);
	}
    // Add the "show" class to DIV
    $(x).addClass("show");

    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){ $(x).removeClass("show"); }, 3000);
}

function fixedOnScroll(element) {
	if(typeof element == 'undefined' || element.length == 0) {
		return;
	}
	if (window.pageYOffset > element.offset().top) {
		if(!element.find('a').hasClass('fix-position')) {
			element.find('a').addClass("fix-position");
		}
	} else {
		element.find('a').removeClass("fix-position");
	}
}





$(function(){
	
	window.onscroll = function(){fixedOnScroll($('.back_button_menu'))};
	
	$(".inline-textbox .placeholder").on("click", function(){
		$(this).hide();
		$(this).parent().find(".hidden-input").show();
		$(this).parent().find(".hidden-input input").focus();
	});
	
	
	$(".box-header .inline-textbox .editable").on("focus", function(){
		$(this).parent().addClass("show");
	});
	
	$(".box-header .inline-textbox .hidden-input .btn").on("click", function(){
		$(this).closest(".box-header").find(".inline-textbox").removeClass("show");
	});
	

	
	$(".hidden-input .btn-default").on("click", function(){
		$(this).closest(".hidden-input").hide();
		$(this).closest(".hidden-input").parent().find(".placeholder").show();
		return false;
	});
	
	$('[data-toggle="tooltip"]').tooltip({
		trigger:"hover"
	});
	
	
	$('[data-toggle="popover"]').popover({
		container: 'body'
	});
	
	$("body").prepend('<div id="toast-msg">Message</div>');
	
	$('body').tooltip({
		selector: '[data-toggle=tooltip]'
	});
	
	
	
});
