'use strict';
page.ctrl('loan', ['page/test'], function($scope) {
	var $console = render.$console,
		$params = $scope.$params;
	var pageSize = 20;
	/**
	* 加载车贷办理数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadLoanList = function(params, cb) {
		$.ajax({
			url: $http.api($http.apiMap.loanList),
			data: params,
			success: $http.ok(function(result) {
				render.compile($scope.$el.$tbl, $scope.def.listTmpl, result.data, true);
				if(cb && typeof cb == 'function') {
					cb(result.total);
				}
			})
		})
	}
	/***
	* 加载页码模板
	*/
	render.$console.load(router.template('main'), function() {
		$scope.def.listTmpl = render.$console.find('#loanlisttmpl').html();
		$scope.$el = {
			$tbl: $console.find('#loanTable'),
			$paging: $console.find('#pageToolbar')
		}
		if($scope.$params.position) {
			
		}
		var params = {
			page: $params.page || 1,
			type: $params.processType || 0,
			pageSize: pageSize
		}
		loadLoanList(params, function(total) {
			$scope.$el.$paging.data({
				'pages': tool.pages(total || 0, pageSize),
				'size': pageSize
			});
			$('#pageToolbar').paging();
		});
	});

	$scope.paging = function(_page, _size, $el, cb) {
		loadLoanList({
			page: _page,
			pageSize: _size,
			type: $params.processType || 0
		}, cb)
	}
});



