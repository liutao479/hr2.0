'use strict';
page.ctrl('auditPrint', [], function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		apiParams = {
			pageNum: $params.page || 1
		};
	/**
	* 加载抵押办理信息表数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadAuditPrintList = function(params, cb) {
		$.ajax({
			url: $http.apiMap.auditPrint,
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
	render.$console.load(router.template('iframe/audit-print'), function() {
		$scope.def.listTmpl = render.$console.find('#auditPrintListTmpl').html();
		$scope.$el = {
			$tbl: $console.find('#auditPrintTable'),
			$paging: $console.find('#pageToolbar')
		}
		if($params.process) {
			
		}
		loadAuditPrintList(apiParams);
	});

	$scope.paging = function(_page, _size, $el, cb) {
		apiParams.pageNum = _page;
		$params.pageNum = _page;
		router.updateQuery($scope.$path, $params);
		loadAuditPrintList(apiParams);
		cb();
	}
});