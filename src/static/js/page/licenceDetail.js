'use strict';
page.ctrl('licenceDetail', [], function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		apiParams = {

		};
	/**
	* 加载上牌办理详情数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadLicenceProcessList = function(params, cb) {
		$.ajax({
			url: $http.apiMap.licenceTable,
			type: 'post',
			data: params,
			dataType: 'json',
			success: $http.ok(function(result) {
				console.log(result);
				if(cb && typeof cb == 'function') {
					cb();
				}
			})
		})
	}
});