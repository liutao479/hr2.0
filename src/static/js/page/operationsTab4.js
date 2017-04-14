'use strict';
page.ctrl('operationsTab4', ['vendor/echarts.min'], function($scope) {
	var $params = $scope.$params,
		$console = $params.refer ? $($params.refer) : render.$console,
		apiParams = {
			pageNum: 1
		};
	/**
	* 加载运营分析信息表数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadLoanList = function(params, cb) {
		$.ajax({
			url: $http.api($http.apiMap.operationsAnalysis, true),
			data: params,
			success: $http.ok(function(result) {
				console.log(result);
				render.compile($scope.$el.$tbl, $scope.def.listTmpl, result.data, true);
				setupPaging(result.page.pages, true);
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

	/***
	* 加载页面模板
	*/
	$console.load(router.template('iframe/operationsTab4'), function() {
		$scope.def = {
			listTmpl : $console.find('#operateAnatmpl').html()
		}
		$scope.$el = {
			$tbl: $console.find('#operateAna'),
			$paging: $console.find('#pageToolbar')
		}

		// loadLoanList(apiParams);
	});

	/**
	 * 分页
	 */
	$scope.paging = function(_page, _size, $el, cb) {
		apiParams.page = _page;
		loadLoanList(apiParams);
		cb();
	}
});