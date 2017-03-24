'use strict';
page.ctrl('newBusiness', function($scope) {
	var $params = $scope.$params,
		$console = render.$console;

	/**
	* 加载产品列表数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadOrderInfo = function(cb) {
		$.ajax({
			type: 'post',
			url: $http.api('product/get', 'cyj'),
			dataType: 'json',
			success: $http.ok(function(result) {
				console.log(result);
				render.compile($scope.$el.$loanPanel, $scope.def.listTmpl, result.data, true);
				if(cb && typeof cb == 'function') {
					cb();
				}
			})
		})
	}

	/**
	* 设置面包屑
	*/
	var setupLocation = function() {
		if(!$scope.$params.path) return false;
		var $location = $console.find('#location');
		$location.data({
			backspace: $scope.$params.path,
			current: $scope.result.data.loanTask.sceneName,
			loanUser: $scope.result.data.loanTask.loanOrder.realName,
			orderDate: tool.formatDate($scope.result.data.loanTask.createDate, true)
		});
		$location.location();
	}

	/**
	 * 页面首次加载立即处理事件
	 */
	var evt = function () {
		// 提交订单按钮 
		$console.find('#submitOrders').on('click', function() {
			var that = $(this);
		});
	}

	$console.load(router.template('iframe/newBusiness'), function() {
		$scope.def = {
			listTmpl: $console.find('#surviceTypetmpl').html()
		}
		$scope.$el = {
			$loanPanel: $console.find('#surviceTypeTable')
		}
		loadOrderInfo();
	});
});
