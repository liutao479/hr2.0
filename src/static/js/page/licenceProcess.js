'use strict';
page.ctrl('licenceProcess', ['page/test'], function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		apiParams = {
			pageNum: $params.pageNum || 1
		};
	/**
	* 加载上牌办理信息表数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadLicenceProcessList = function(params, cb) {
		$.ajax({
			url: $http.apiMap.licenceProcess,
			data: params,
			dateType: 'json',
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
			pages: isPage ? count : (tool.pages(count  || 0, apiParams.pageSize)),
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
	render.$console.load(router.template('licence-process'), function() {
		$scope.def.listTmpl = render.$console.find('#licenceProcessListTmpl').html();
		$scope.$el = {
			$tbl: $console.find('#licenceProcessTable'),
			$paging: $console.find('#pageToolbar')
		}
		if($params.process) {
			
		}
		loadLicenceProcessList(apiParams);
	});

	$scope.paging = function(_pageNum, _size, $el, cb) {
		apiParams.pageNum = _pageNum;
		$params.pageNum = _pageNum;
		router.updateQuery($scope.$path, $params);
		loadLicenceProcessList(apiParams);
		cb();
	}
});