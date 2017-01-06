'use strict';
page.ctrl('customer', [], function($scope) {
	var loadCustomerList = function() {
		$.ajax({
			url: $http.api($http.apiMap.myCustomer),
			success: $http.ok(function(data) {
				render.compile(render.$console, router.template('my-customer'), data, async);
			})
		})
	}
	var async = function() {
		$('#pageToolbar').paging();
	}
	$scope.paging = function(page, pageSize, $el, cb) {
		console.log('customer paging');
		cb();
	}
	loadCustomerList();
});