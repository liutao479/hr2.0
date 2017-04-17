'use strict';
page.ctrl('operations', [], function($scope) {
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
			router.innerRender('#innerPanel', href, params);
		})		
	}	
    
	function listenGuide() {
		var params = {
			code: 0
		}
		router.innerRender('#innerPanel', 'operations/operationsTab1', params);
	}

    /***
	* 加载页面模板
	*/
	$console.load(router.template('iframe/operationsAnalysis'), function() {
		$scope.def = {
			listTmpl : render.$console.find('#tabTmpl').html()
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



