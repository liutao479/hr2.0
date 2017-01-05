//$('#menu > a').on('click', function() {
//	var tar = $(this).data('href');
//	window.location.href = window.location.href + '#' + tar;
//	
//})
//$('#pageToolbar').Paging({pagesize:10,count:85,toolbar:true});	

$(function() {
	$.ajax({
		url: $http.api('menu'),
		success: $http.ok(function(data) {
			var $menu = new menu('#menu', data, router.render);
			router.init(function(menuId) {
				if(!menuId) { return $menu.setup('loanProcess'); }
				$menu.setup(menuId, true);
			})
		})
	})
});