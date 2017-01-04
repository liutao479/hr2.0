'use strict';
(function(g) {
	var $scope = {};
	var page = pageCtrl['customer'] = {};
	var _ = g.render;
	page.template = g.router.template('my-customer');
	$scope.loadCustomerList = function() {
		$.ajax({
			url: $http.api($http.apiMap.myCustomer),
			success: $http.ok(function(data) {
				_.compile(_.$console, page.template, data, $scope.async);
			})
		})
	}	
	$scope.async = function() {
		$('#pageToolbar').paging();
	}
	$scope.start = function() {
		$scope.loadCustomerList();
	}
	
	page.paging = function(page, pageSize, $el, cb) {
		console.log(arguments);
		cb();
	}

	$scope.start();
})(window)