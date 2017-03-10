'use strict';
page.ctrl('moneyBusinessAuditPrint', [], function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		apiParams = {
			pageNum: $params.page || 1
		};
	/**
	* 加载财务业务审批表数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadMoneyPrintList = function(params, cb) {
		$.ajax({
			url: $http.api('loanUserStage/getFinancialData'),
			type: 'post',
			data: params,
			dataType: 'json',
			success: $http.ok(function(result) {
				console.log(result);
				render.compile($scope.$el.$tbl, $scope.def.listTmpl, result.data.resultlist, true);
				setupPaging(result.page, true);
				if(cb && typeof cb == 'function') {
					cb();
				}
			})
		});
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
	render.$console.load(router.template('iframe/money-business-audit-print'), function() {
		$scope.def.listTmpl = render.$console.find('#moneyAuditPrintListTmpl').html();
		$scope.$el = {
			$tbl: $console.find('#moneyAuditPrintTable'),
			$paging: $console.find('#pageToolbar')
		}
		if($params.process) {
			
		}
		loadMoneyPrintList(apiParams);
	});

	$scope.paging = function(_page, _size, $el, cb) {
		apiParams.pageNum = _page;
		$params.pageNum = _page;
		// router.updateQuery($scope.$path, $params);
		loadMoneyPrintList(apiParams);
		cb();
	}
});