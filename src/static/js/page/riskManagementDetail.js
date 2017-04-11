'use strict';
page.ctrl('riskManagementDetail', function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		apiParams = {
			pageNum: $params.pageNum || 1,
			strStartDate: $params.strStartDate,
			strEndDate: $params.strEndDate,
			deptId: $params.deptId,
			bankCode: $params.bankCode,
			apiKey: $params.apiKey,
			apiPrimary: $params.apiPrimary,
		};
	// 查询列表数据
	var search=function(param){
		$.ajax({
			type: 'post',
			dataType:"json",
			url: $http.api('riskStatis/getDetailList'),
			data: param,
			success: $http.ok(function(res) {
				render.compile($scope.$el.$searchInfo, $scope.def.searchInfoTmpl, res.data.headerInfo, true);
				render.compile($scope.$el.$table, $scope.def.tableTmpl, res.list, true);
				// 构造分页
				setupPaging(res.page, true);
			})
		});
	};
	// 构造分页
	var setupPaging = function(_page, isPage) {
		$scope.$el.$paging.data({
			current: parseInt(apiParams.pageNum),
			pages: isPage ? _page.pages : (tool.pages(_page.pages || 0, _page.pageSize)),
			size: _page.pageSize
		});
		$scope.$el.$paging.paging();
	};
	// 分页回调
	$scope.paging = function(_pageNum, _size, $el, cb) {
		apiParams.pageNum = _pageNum;
		$params.pageNum = _pageNum;
		search(apiParams);
		cb();
	}
	// 加载页面模板
	render.$console.load(router.template('iframe/risk-management-detail'), function() {
		$scope.def.searchInfoTmpl = render.$console.find('#searchInfoTmpl').html();/*查询条件*/
		$scope.def.tableTmpl = render.$console.find('#riskManagementDetailTmpl').html();/*表格列表*/
		$scope.$el = {
			$searchInfo: $console.find('#searchInfo'),/*查询条件*/
			$table: $console.find('#riskManagementDetailTable'),/*表格列表*/
			$paging: $console.find('#pageToolbar')/*分页*/
		};
		search(apiParams);
	});
});