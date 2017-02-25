'use strict';
page.ctrl('cancleOrderAudit', function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		apiParams = {
			process: $params.process || 0,
			page: $params.page || 1,
			pageSize: 20
		};
	/**
	* 加载车贷办理数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadLoanList = function(params, cb) {
		$.ajax({
			url: $http.api($http.apiMap.cancleOrderAudit),
			data: params,
			success: $http.ok(function(result) {
				render.compile($scope.$el.$tbl, $scope.def.listTmpl, result.data, true);
				if(cb && typeof cb == 'function') {
					cb();
				}
			})
		})
	}
	/***
	* 加载页面模板
	*/
	render.$console.load(router.template('stop-order-check'), function() {
		$scope.def.listTmpl = render.$console.find('#cancelOrderAudittmpl').html();
		$scope.$el = {
			$tbl: $console.find('#cancelOrderAudit'),
		}
		if($params.process) {
			
		}
		loadLoanList(apiParams);
	});
});



