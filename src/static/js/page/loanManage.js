'use strict';
(function(g) {
	var $scope = {};
	var page = pageCtrl['loanManage'] = {};
	var _ = g.render;
	page.template = g.router.template('loanManage');
	$scope.loadLoanManageList = function() {
		$.ajax({
			url: $http.api('loan/manage'),
			success: $http.ok(function(data) {
				_.compile(_.$console, page.template, data, $scope.async);
			})
		})
	}	
	$scope.async = function() {
		$('#pageToolbar').paging();
	}
	$scope.start = function() {
		$scope.loadLoanManageList();
	}
	
	page.paging = function(page, pageSize, $el, cb) {
		console.log(arguments);
		cb();
	}

	$scope.start();
})(window)