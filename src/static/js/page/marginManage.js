'use strict';
(function(g) {
	var $scope = {};
	var page = pageCtrl['marginManage'] = {};
	var _ = g.render;
	page.template = g.router.template('deposit-query');
	$scope.loadMarginManageList = function() {
		$.ajax({
			url: $http.api('marginManage'),
			success: $http.ok(function(data) {
				_.compile(_.$console, page.template, data, $scope.async);
			})
		})
	}	
	$scope.async = function() {
		$('#pageToolbar').paging();
	}
	$scope.start = function() {
		$scope.loadMarginManageList();
	}
	
	page.paging = function(page, pageSize, $el, cb) {
		console.log(arguments);
		cb();
	}

	$scope.start();
})(window)