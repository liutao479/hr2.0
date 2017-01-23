'use strict';
page.ctrl('creditInput', [], function($scope) {
	var $console = render.$console,
		$params = $scope.$params
	/**
	* 加载征信结果录入数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadOrderInfo = function() {
		$.ajax({
			url: $http.apiMap.creditInput,
			data: {orderNo: $scope.$params.orderNo},
			success: $http.ok(function(result) {
				console.log(result);
				render.compile($scope.$el.$tbl, $scope.def.listTmpl, result, true);
			})
		})
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
	render.$console.load(router.template('credit-result-typing'), function() {
		$scope.def.listTmpl = render.$console.find('#creditResultListTmpl').html();
		// console.log($console.find('#creditResultPanel'))
		$scope.$el = {
			$tbl: $console.find('#creditResultPanel'),
			$paging: $console.find('#pageToolbar')
		}
		if($params.process) {
			
		}
		loadOrderInfo();
	});
});