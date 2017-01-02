'use strict';
(function(g) {
	var $scope = pageCtrl['loan'] = {};
	var _ = g.render;
	$scope.loadLoanList = function() {
		$.ajax({
			url: $http.api('loan/list'),
			success: $http.ok(function(data) {
				_.compile(_.$console, g.router.template('main'), data, $scope.async);
			})
		})
	}	
	$scope.async = function() {
		console.log(1);
		$('#pageToolbar').paging();
	}
	$scope.start = function() {
		$scope.loadLoanList();
	}

	$scope.start();
})(window)



