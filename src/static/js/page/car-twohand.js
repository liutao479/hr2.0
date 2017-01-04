'use strict';
(function(g) {
	var $scope = {};
	var page = pageCtrl['carTwoHand'] = {};
	var _ = g.render;
	page.template = g.router.template('car-twohand');
	$scope.loadLoanList = function() {
		$.ajax({
			url: $http.api('car/twohand'),
			success: $http.ok(function(data) {
				_.compile(_.$console, page.template, data, $scope.async);
			})
		})
	}	
	$scope.listen = function() {
		_.$console.find('table .button').on('click', function() {
			var key = $(this).data('href');
			g.router.render(key);
		})
	}
	$scope.async = function() {
		$('#pageToolbar').paging();
		$scope.listen();
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



