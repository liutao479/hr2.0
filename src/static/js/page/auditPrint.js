'use strict';
page.ctrl('auditPrint', [], function($scope) {
	var loadAuditPrintList = function() {
		$.ajax({
			url: $http.api('auditPrint'),
			success: $http.ok(function(data) {
				render.compile(render.$console, router.template('audit-print'), data, $scope.async);
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

	loadAuditPrintList();
});