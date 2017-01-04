'use strict';
(function(g) {
	var $scope = {};
	var page = pageCtrl['car-twohand'] = {};
	var _ = g.render;
	page.template = g.router.template('main');
	$scope.loadCarTwohandList = function() {
		$.ajax({
			url: 'http://192.168.0.113:8080/loanApproval/usedCarAssess',
			success: function(data) {
				_.compile(_.$console, page.template, data);
			}
		})
	}	
//	$scope.listen = function() {
//		_.$console.find('table .button').on('click', function() {
//			var key = $(this).data('href');
//			g.router.render(key);
//		})
//	}
	$scope.async = function() {
		$('#pageToolbar').paging();
//		$scope.listen();
	}
	$scope.start = function() {
		$scope.loadCarTwohandList();
	}
	
	page.paging = function(page, pageSize, $el, cb) {
		console.log(arguments);
		cb();
	}

	$scope.start();
})(window)



