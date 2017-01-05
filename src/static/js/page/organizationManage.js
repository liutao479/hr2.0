'use strict';
(function(g) {
	var $scope = {};
	var page = pageCtrl['organizationManage'] = {};
	var _ = g.render;
	page.template = g.router.template('cooperative-bank');
	$scope.loadOrganizationBankList = function() {
		$.ajax({
			url: $http.api('organizationManage'),
			success: $http.ok(function(data) {
				_.compile(_.$console, page.template, data, $scope.async);
			})
		})
	}	
	$scope.async = function() {
		$('#pageToolbar').paging();
	}
	$scope.start = function() {
		$scope.loadOrganizationBankList();
	}
	
	page.paging = function(page, pageSize, $el, cb) {
		console.log(arguments);
		cb();
	}

	$scope.start();
})(window)