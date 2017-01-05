'use strict';
(function(g) {
	var $scope = {};
	var page = pageCtrl['operationsAnalysis'] = {};
	var _ = g.render;
	page.template = g.router.template('operations-analysis');
	$scope.loadBusinessList = function() {
		$.ajax({
			url: $http.api('operationsAnalysis'),
			success: $http.ok(function(data) {
				_.compile(_.$console, page.template, data, $scope.async);
			})
		})
	}	
	$scope.async = function() {
		$('#pageToolbar').paging();
	}
	$scope.start = function() {
		$scope.loadBusinessList();
	}
	
	page.paging = function(page, pageSize, $el, cb) {
		console.log(arguments);
		cb();
	}

	$scope.start();
})(window)