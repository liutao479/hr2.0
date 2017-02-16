'use strict';
page.ctrl('loanManage', [], function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		apiParams = {
			page: $params.page || 1
		};
	/**
	* 加载借款管理信息表数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadLoanManageList = function(params, cb) {
		$.ajax({
			url: $http.api($http.apiMap.loanManage),
			data: params,
			success: $http.ok(function(result) {
				console.log(result);
				render.compile($scope.$el.$tbl, $scope.def.listTmpl, result.data, true);
				setupPaging(result.page.pages, true);
				// 鼠标移上提示框
				$('#loan-manage .tips').on('hover', function() {
					$(this).find('.tips-content').toggle();	
				});
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
	
	$(document).on('click', '#loanManegeTable .button', function() {
		var that = $(this);
		router.render(that.data('href'), {orderNo: that.data('id')});
	});

	/***
	* 加载页面模板
	*/
	render.$console.load(router.template('iframe/loan-manage'), function() {
		$scope.def.listTmpl = render.$console.find('#loanManageListTmpl').html();
		$scope.$el = {
			$tbl: $console.find('#loanManageTable'),
			$paging: $console.find('#pageToolbar')
		}
		loadLoanManageList(apiParams);
	});

	$scope.paging = function(_page, _size, $el, cb) {
		apiParams.page = _page;
		$params.page = _page;
		router.updateQuery($scope.$path, $params);
		loadLoanManageList(apiParams);
		cb();
	}
});