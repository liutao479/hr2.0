'use strict';
page.ctrl('licenceAudit', [], function($scope) {
	var loadLicenceAuditList = function() {
		$.ajax({
			url: $http.api('licence/audit'),
			success: $http.ok(function(data) {
				render.compile(render.$console, router.template('licence-audit'), data, $scope.async);
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

	loadLicenceAuditList();
});