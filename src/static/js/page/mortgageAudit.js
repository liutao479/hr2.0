'use strict';
page.ctrl('mortgageAudit', [], function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		apiParams = {
			process: $params.process || 0,
			page: $params.page || 1,
			pageSize: 20
		};
	/**
	* 加载抵押审核信息表数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadMortgageAuditList = function(params, cb) {
		$.ajax({
			url: $http.apiMap.mortgageAudit,
			data: params,
			success: $http.ok(function(result) {
				console.log(result);
				render.compile($scope.$el.$tbl, $scope.def.listTmpl, result.data, true);
				setupPaging(result.page, true);
				if(cb && typeof cb == 'function') {
					cb();
				}
			})
		})
	}
	/**
	* 构造分页
	*/
	var setupPaging = function(count, isPage) {
		$scope.$el.$paging.data({
			current: parseInt(apiParams.page),
			pages: isPage ? count : (tool.pages(count || 0, apiParams.pageSize)),
			size: apiParams.pageSize
		});
		$('#pageToolbar').paging();
	}
	/**
	* 绑定立即处理事件
	*/
	// $(document).on('click', '#myCustomerTable .button', function() {
	// 	var that = $(this);
	// 	router.render(that.data('href'));
	// });

	/***
	* 加载页面模板
	*/
	render.$console.load(router.template('iframe/mortgage-audit'), function() {
		$scope.def.listTmpl = render.$console.find('#mortgageAuditListTmpl').html();
		$scope.$el = {
			$tbl: $console.find('#mortgageAuditTable'),
			$paging: $console.find('#pageToolbar')
		}
		if($params.process) {
			
		}
		loadMortgageAuditList(apiParams);
	});

	$scope.paging = function(_page, _size, $el, cb) {
		apiParams.page = _page;
		$params.page = _page;
		router.updateQuery($scope.$path, $params);
		loadMortgageAuditList(apiParams);
		cb();
	}
});