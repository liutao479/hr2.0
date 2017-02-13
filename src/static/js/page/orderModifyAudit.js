'use strict';
page.ctrl('orderModifyAudit', [], function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		apiParams = {
			type: 0,
			pageNum: $params.pageNum || 1
		};
	/**
	* 加载订单修改审核数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadOrderModifyList = function(params, cb) {
		$.ajax({
			// url: 'http://127.0.0.1:8083/mock/orderModifyAudit',
			type: 'post',
			url: $http.apiMap.orderModifyAudit,
			data: params,
			dataType: 'json',
			success: $http.ok(function(result) {
				console.log(result);
				render.compile($scope.$el.$tbl, $scope.def.listTmpl, result.data.resultlist, true);
				setupPaging(result.page.pages, true);
				if(cb && typeof cb == 'function') {
					cb();
				}
			})
		})
	}
	/**
	* 构造分页
	*/
	var setupPaging = function(_page, isPage) {
		$scope.$el.$paging.data({
			current: parseInt(apiParams.pageNum),
			pages: isPage ? _page.pages : (tool.pages(count || 0, _page.pageSize)),
			size: _page.pageSize
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
	render.$console.load(router.template('iframe/order-modify-audit'), function() {
		$scope.def.listTmpl = render.$console.find('#orderModifyListTmpl').html();
		$scope.$el = {
			$tbl: $console.find('#orderModifyTable'),
			$paging: $console.find('#pageToolbar')
		}
		if($params.process) {
			
		}
		loadOrderModifyList(apiParams);
	});

	$scope.paging = function(_pageNum, _size, $el, cb) {
		apiParams.pageNum = _pageNum;
		$params.pageNum = _pageNum;
		// router.updateQuery($scope.$path, $params);
		loadOrderModifyList(apiParams);
		cb();
	}
});



