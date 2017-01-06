'use strict';
page.ctrl('licenceStatis', [], function($scope) {
	var loadLicenceStatisList = function() {
		$.ajax({
			url: $http.api('licence/statis'),
			success: $http.ok(function(data) {
				render.compile(render.$console, router.template('licence-statis'), data, $scope.async);
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

	loadLicenceStatisList();
});