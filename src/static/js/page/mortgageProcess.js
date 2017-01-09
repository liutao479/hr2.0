'use strict';
page.ctrl('mortgageProcess', [], function($scope) {
	var loadMortgageProcessList = function() {
		$.ajax({
			url: $http.api('mortgage/process'),
			success: $http.ok(function(data) {
				render.compile(render.$console, router.template('mortgage-process'), data, $scope.async);
			})
		})
	}

	$scope.async = function() {
		// 分页器
		$('#pageToolbar').paging();
	}

	$scope.paging = function(page, pageSize, $el, cb) {
		console.log(arguments);
		cb();
	}

	loadMortgageProcessList();
});