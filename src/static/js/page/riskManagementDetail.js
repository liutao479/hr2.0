'use strict';
page.ctrl('riskManagementDetail', function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		pageBcData={},/*保存点击分页时的查询参数*/
		apiParams = {
			pageNum: $params.pageNum || 1,
			strStartDate: $params.strStartDate,
			strEndDate: $params.strEndDate,
			deptId: $params.deptId,
			bankCode: $params.bankCode,
			apiKey: $params.apiKey,
			apiPrimary: $params.apiPrimary
			/*strStartDate: '2017-01-01',
			strEndDate: '2017-08-01',
			deptId: '62',
			bankCode: 'urcb',
			apiKey: 'bankWater',
			apiPrimary: $params.apiPrimary*/
		};
	/*查询前去除空查询字段*/
	var delNull=function(obj){
		for(var i in obj){
			if(obj[i]==null||(obj[i]==""&&obj[i]!==0)||obj[i]==undefined||obj[i]=="undefined")
				delete obj[i];
		};
		return obj;
	};
	// 查询列表数据
	var search=function(param,callback){
		$.ajax({
			type: 'post',
			dataType:"json",
			url: $http.api('riskStatis/getDetailList','cyj'),
			data: param,
			success: $http.ok(function(res) {
				pageBcData=param;
				render.compile($scope.$el.$searchInfo, $scope.def.searchInfoTmpl, res.data.headerInfo, true);
				render.compile($scope.$el.$table, $scope.def.tableTmpl, res.data.list, true);
				// 构造分页
				setupPaging(res.page, true);
				if(callback && typeof callback == 'function') {
					callback();
				};
			})
		});
	};
	// 构造分页
	var setupPaging = function(_page, isPage) {
		$scope.$el.$paging.data({
			current: parseInt(pageBcData.pageNum),
			pages: isPage ? _page.pages : (tool.pages(_page.pages || 0, _page.pageSize)),
			size: _page.pageSize
		});
		$scope.$el.$paging.paging();
	};
	// 分页回调
	$scope.paging = function(_pageNum, _size, $el, cb) {
		pageBcData.pageNum = _pageNum;
		$params.pageNum = _pageNum;
		search(pageBcData);
		cb();
	};
	// 页面首次载入时绑定事件
 	var evt = function() {
 		$scope.$el.$backspace.click(function() {
			router.render("operationsAnalysis");
		});
 		$scope.$el.$table.off("click",".detailed").on("click",".detailed",function() {
 			//var _uid=$(this).data('userid');
 			var _orderno=$(this).data('orderno');
 			//var _sceneCode=$(this).data('scenecode');
			router.render("myCustomer/orderDetails", {	
				orderNo: _orderno,
				type: 'OrderDetails',
				path: 'operationsAnalysis'
			});
		});
 	};
	// 加载页面模板
	render.$console.load(router.template('iframe/risk-management-detail'), function() {
		$scope.def.searchInfoTmpl = render.$console.find('#searchInfoTmpl').html();/*查询条件*/
		$scope.def.tableTmpl = render.$console.find('#riskManagementDetailTmpl').html();/*表格列表*/
		$scope.$context=$console.find('#data-assistant-detail');
		$scope.$el = {
			$backspace: $scope.$context.find('#backspace'),/*返回列表*/
			$searchInfo: $scope.$context.find('#searchInfo'),/*查询条件*/
			$table: $scope.$context.find('#riskManagementDetailTable'),/*表格列表*/
			$paging: $scope.$context.find('#pageToolbar')/*分页*/
		};
		var info=delNull(apiParams);
		if(info.pageNum&&info.apiKey){
			search(info, function() {
				evt();	
			});
		};
	});
});