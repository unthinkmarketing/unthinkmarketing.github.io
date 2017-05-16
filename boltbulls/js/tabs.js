$(document).ready(function(){
	
	$('.tab-link').click(function(){
		var tab_id = $(this).attr('data-tab');

		$('.tab-link').removeClass('current');
        $('.tab-link').removeClass('no-border');
		$('.tab-content').removeClass('current');
        $('.triangle').removeClass('current');
        

		$(this).addClass('current');
        $(this).addClass('no-border');
		$("#tab-"+tab_id).addClass('current');
        $("#tri-"+tab_id).addClass('current');
	})

})