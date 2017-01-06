'use strict';
page.ctrl('loanManage', [], function($scope) {
	var loadLoanManageList = function() {
		$.ajax({
			url: $http.api('loan/manage'),
			success: $http.ok(function(data) {
				render.compile(render.$console, router.template('loan-manage'), data, $scope.async);
			})
		})
	}

	$scope.async = function() {
		// 分页器
		$('#pageToolbar').paging();
		// 今日预计利息提示框
		$('.panel-count-number-box').find('.tips').hover(function() {
			$(this).find('.tips-content').toggle();
		});
	}

	$scope.paging = function(page, pageSize, $el, cb) {
		console.log(arguments);
		cb();
	}

	loadLoanManageList();
});