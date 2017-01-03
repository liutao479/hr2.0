'use strict';
(function(g) {
	var $scope = {};
	var page = pageCtrl['loan'] = {};
	var _ = g.render;
	page.template = g.router.template('main');
	$scope.loadLoanList = function() {
		$.ajax({
			url: $http.api('loan/list'),
			success: $http.ok(function(data) {
				_.compile(_.$console, page.template, data, $scope.async);
			})
		})
	}	
	$scope.async = function() {
		$('#pageToolbar').paging();
	}
	$scope.start = function() {
		$scope.loadLoanList();
	}
	
	page.paging = function(page, pageSize, $el, cb) {
		console.log(arguments);
		cb();
	}

	$scope.start();
})(window)



