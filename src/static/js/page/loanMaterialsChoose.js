"use strict";
page.ctrl('loanMaterialsChoose', function($scope) {
	var $console = render.$console;

	
	/**
	* 加载贷款材料选择数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadMaterialsChoose = function(_type, cb) {
		$.ajax({
			type: 'post',
			url: $http.api('materialsChoose/index', 'zyj'),
			data: {
				// taskId: $scope.$params.taskId
				taskId: 80871
			},
			dataType: 'json',
			success: $http.ok(function(result) {
				console.log(result);
				if( cb && typeof cb == 'function' ) {
					cb();
				}
			})
		})
	}


	$console.load(router.template('iframe/loan-material-select'), function() {
		// $scope.def.tabTmpl = $console.find('#creditUploadTabsTmpl').html();
		$scope.def.listTmpl = $console.find('#loanUploadTmpl').html();
		// console.log($console.find('#creditResultPanel'))
		$scope.$el = {
			// $tab: $console.find('#creditTabs'),
			$loanPanel: $console.find('#loanUploadPanel')
		}
		loadMaterialsChoose();
	})
});