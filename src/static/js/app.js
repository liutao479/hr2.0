//$('#menu > a').on('click', function() {
//	var tar = $(this).data('href');
//	window.location.href = window.location.href + '#' + tar;
//	
//})
//$('#pageToolbar').Paging({pagesize:10,count:85,toolbar:true});	

$(function() {
	var $menu;
	$.ajax({
		url: $http.api('menu'),
		success: $http.ok(function(result) {
			$menu = new menu('#menu', result.data, router.render);
			router.init(function(menuId) {
				if(!menuId) { return $menu.setup('loanProcess'); }
				$menu.setup(menuId, true);
			})
		})*/
	})
});
