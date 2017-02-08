'use strict';
page.ctrl('carTwohand', function($scope) {
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
			url: $http.api($http.apiMap.carTwohand),
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
	render.$console.load(router.template('car-twohand'), function() {
		$scope.def.listTmpl = render.$console.find('#carTwohandtmpl').html();
		$scope.$el = {
			$tbl: $console.find('#carTwohand'),
		}
		if($params.process) {
			
		}
		loadLoanList(apiParams);
	});
});



