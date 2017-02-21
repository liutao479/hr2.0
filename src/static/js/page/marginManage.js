'use strict';
page.ctrl('marginManage', [], function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		apiParams = {

		};
	/**
	* 加载保证金查询信息表数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadMarginManageList = function(params, cb) {
		$.ajax({
			url: $http.api('marginManage'),
			data: params,
			success: $http.ok(function(result) {
				console.log(result);
				render.compile($scope.$el.$tbl, $scope.def.listTmpl, result.data, true);
				if(cb && typeof cb == 'function') {
					cb();
				}
			})
		})
	}
	/**
	* 绑定立即处理事件
	*/
	// $(document).on('click', '#myCustomerTable .button', function() {
	// 	var that = $(this);
	// 	router.render(that.data('href'));
	// });

	/***
	* 加载页面模板
	*/
	render.$console.load(router.template('iframe/deposit-query'), function() {
		$scope.def.listTmpl = render.$console.find('#marginManageListTmpl').html();
		$scope.$el = {
			$tbl: $console.find('#marginManageTable'),
			$paging: $console.find('#pageToolbar')
		}
		if($params.process) {
			
		}
		loadMarginManageList(apiParams);
	});

});