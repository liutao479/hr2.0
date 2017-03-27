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
	var loadLoanList = function(cb) {
		var params = {
			taskId:80871
		}
		$.ajax({
			url: urlStr+'/loanCarAssess/index',
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
	$console.load(router.template('iframe/car-twohand'), function() {
		$scope.def.listTmpl = render.$console.find('#carTwohandtmpl').html();
		$scope.def.selectOpttmpl = $console.find('#selectOpttmpl').html();
		$scope.$el = {
			$tbl: $console.find('#carTwohand')
		}
		loadLoanList();
	});
});



