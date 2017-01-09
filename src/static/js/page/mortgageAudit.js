'use strict';
page.ctrl('mortgageAudit', [], function($scope) {
	var loadMortgageAuditList = function() {
		$.ajax({
			url: $http.api('mortgage/audit'),
			success: $http.ok(function(data) {
				render.compile(render.$console, router.template('mortgage-audit'), data, $scope.async);
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

	loadMortgageAuditList();
});