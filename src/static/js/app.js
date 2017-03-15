//$('#menu > a').on('click', function() {
//	var tar = $(this).data('href');
//	window.location.href = window.location.href + '#' + tar;
//	
//})
//$('#pageToolbar').Paging({pagesize:10,count:85,toolbar:true});	

$(function() {
	var $menu;
	$.ajax({
		url: $http.apiMap.menu,
		success: $http.ok(function(result) {
			$menu = new menu('#menu', result.data, router.render);
			router.init(function(menuId) {
				if(!menuId) { return $menu.setup('loanProcess'); }
				$menu.setup(menuId, true);
			})
		})
	});
	setTimeout(function() {
		new Todo($('#remind'));	
	}, 1000)

	/**
	 * 弹窗默认设置
	 */
	jconfirm.defaults = {
		closeIcon: true,
		useBootstrap: false,
		boxWidth: '500px',
		theme: 'light',
		type: 'purple'
		// defaultButtons: {
		// 	close: {
	 //        	text: '取消',
	 //            action: function () {
	 //            }
	 //        },
	 //        ok: {
	 //        	text: '确定',
	 //            action: function () {
	 //            }
	 //        }
	        
	 //    }
	}
});
