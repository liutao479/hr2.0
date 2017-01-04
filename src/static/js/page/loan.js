'use strict';
page.ctrl('loan', function($scope) {
	var _ = render;
	var loadLoanList = function() {
		$.ajax({
			url: $http.api('loan/list'),
			success: $http.ok(function(data) {
				_.compile(_.$console, router.template('main'), data, $scope.async);
			})
		})
	}

	$scope.async = function() {
		$('#pageToolbar').paging();
	}

	$scope.paging = function(page, pageSize, $el, cb) {
		console.log(arguments);
		cb();
	}

	loadLoanList();
});
/*
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
*/



