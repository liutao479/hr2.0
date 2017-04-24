'use strict';
$(function() {
	/**
	* 构造菜单栏
	*/
	function setupMenu() {
		var $menu;
		$.ajax({
			type: 'post',
			url: $http.api('menu/tree', true),
			dataType: 'json',
			success: $http.ok(function(result) {
				$menu = new menu('#menu', result.data, router.render);
				router.init(function(menuId) {
					if(!menuId) { return $menu.setup('loanProcess'); }
					$menu.setup(menuId, true);
				})
			})
		});	
	}
	

	function addListener() {
		setTimeout(function() {
			if(!Todo) return;
			new Todo($('#remind'));	
		}, 1000)
	}
	
	function setDefault() {
		/**
		 * 弹窗默认设置
		 */
		jconfirm.defaults = {
			closeIcon: true,
			useBootstrap: false,
			boxWidth: '500px',
			theme: 'light',
			type: 'purple'
		}	
	}
	
	function init() {
		setupMenu();
		addListener();
		setDefault();
	}

	init();
});
