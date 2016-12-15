$('#menu > a').on('click', function() {
	var tar = $(this).data('href');
	window.location.href = window.location.href + '#' + tar;
	
})