'use strict';
page.ctrl('licenceProcess', [], function($scope) {
	var loadLicenceProcessList = function() {
		$.ajax({
			url: $http.api('licence/process'),
			success: $http.ok(function(data) {
				render.compile(render.$console, router.template('licence-process'), data, $scope.async);
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

	loadLicenceProcessList();
});