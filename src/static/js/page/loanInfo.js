'use strict';
page.ctrl('loanInfo', ['page/test'], function($scope) {
	var loadloanInfo = function() {
		$.ajax({
			url: $http.api($http.apiMap.loanInfo),
			success: $http.ok(function(data) {
				render.compile(render.$console, router.template('loan-info'), data, $scope.async);
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

	loadloanInfo();
});