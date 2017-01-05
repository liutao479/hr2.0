'use strict';
page.ctrl('mortgageStatis', [], function($scope) {
	var loadMortgageStatisList = function() {
		$.ajax({
			url: $http.api('mortgage/statis'),
			success: $http.ok(function(data) {
				render.compile(render.$console, router.template('mortgage-statis'), data, $scope.async);
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

	loadMortgageStatisList();
});