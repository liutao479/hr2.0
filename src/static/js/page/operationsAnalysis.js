// 'use strict';
// page.ctrl('operationsAnalysis', [], function($scope) {
// 	var $console = render.$console,
// 		$params = $scope.$params,
// 		apiParams = {
// 			process: $params.process || 0,
// 			page: $params.page || 1,
// 			pageSize: 20
// 		};
// 	/**
// 	* 加载运营分析信息表数据
// 	* @params {object} params 请求参数
// 	* @params {function} cb 回调函数
// 	*/
// 	var loadOperationsAnalysisList = function(params, cb) {
// 		$.ajax({
// 			url: $http.api('operationsAnalysis'),
// 			data: params,
// 			success: $http.ok(function(result) {
// 				console.log(result);
// 				render.compile($scope.$el.$tbl, $scope.def.listTmpl, result.data, true);
// 				setupPaging(result.page.pages, true);
// 				if(cb && typeof cb == 'function') {
// 					cb();
// 				}
// 			})
// 		});
// 	}

// 	/**
// 	* 构造分页
// 	*/
// 	var setupPaging = function(count, isPage) {
// 		$scope.$el.$paging.data({
// 			current: parseInt(apiParams.page),
// 			pages: isPage ? count : (tool.pages(count || 0, apiParams.pageSize)),
// 			size: apiParams.pageSize
// 		});
// 		$('#pageToolbar').paging();
// 	}

// 	/***
// 	* 加载页面模板
// 	*/
// 	render.$console.load(router.template('iframe/operations-tab1'), function() {
// 		$scope.def.listTmpl = render.$console.find('#operationsAnalysisListTmpl').html();
// 		$scope.$el = {
// 			$tbl: $console.find('#operationsAnalysisTable'),
// 			$paging: $console.find('#pageToolbar')
// 		}
// 		loadOperationsAnalysisList(apiParams);
// 	});

// 	/**
// 	 * 分页回调
// 	 */
// 	$scope.paging = function(_page, _size, $el, cb) {
// 		apiParams.page = _page;
// 		loadOperationsAnalysisList(apiParams);
// 		cb();
// 	}
// });

'use strict';
page.ctrl('operationsAnalysis', [], function($scope) {
	var $params = $scope.$params,
		$console = $params.refer ? $($params.refer) : render.$console;

	/**
	* 加载运营分析数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	

	var setupEvt = function() {
		$console.find('.tabEvt').on('click', function() {
			var $that = $(this);
			$(".tabEvt").each(function(){
				$(this).removeClass('role-item-active');
			})
			$that.addClass('role-item-active');
			var href = $that.data('href');
			var params = {
				code: $that.data('type')
			}
			console.log(href)
			router.innerRender('#innerPanel', href, params);
		})		
	}	
    
	function listenGuide() {
		var params = {
			
		}
		router.innerRender('#innerPanel', 'operations/operationsTab1', params);
	}

    /***
	* 加载页面模板
	*/
	$console.load(router.template('iframe/operationsAnalysis'), function() {
		$scope.def = {
			listTmpl : $console.find('#tabTmpl').html()
		};	
		$scope.$el = {
			$tbl: $console.find('#tabBar')
		}
		var data = [
			{
				idx: 0,
				href: 'operations/operationsTab1',
				name: '业务量日统计'
			},
			{
				idx: 1,
				href: 'operations/operationsTab2',
				name: '业务量区间统计'
			},
			{
				idx: 2,
				href: 'operations/operationsTab3',
				name: '放款调度统计'
			},
			{
				idx: 3,
				href: 'operations/operationsTab4',
				name: '逾期情况统计'
			},
			{
				idx: 4,
				href: 'operations/operationsTab5',
				name: '统计报表'
			}
		];
		render.compile($scope.$el.$tbl, $scope.def.listTmpl, data, true);
		listenGuide();
		setupEvt();
	});
});



