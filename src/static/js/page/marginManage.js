'use strict';
page.ctrl('marginManage', [], function($scope) {
	var loadMarginManageList = function() {
		$.ajax({
			url: $http.api('marginManage'),
			success: $http.ok(function(data) {
				render.compile(render.$console, router.template('deposit-query'), data, $scope.async);
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

	loadMarginManageList();
});