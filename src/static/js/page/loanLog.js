"use strict";
page.ctrl('loanLog', function($scope) {
	var $params = $scope.$params,
		$console = $params.refer ? $($params.refer) : render.$console;
	
	/**
	* 加载订单日志数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadloanLog = function(cb) {
		$.ajax({
			type: 'post',
			url: $http.api('loanLog/getLoanLog', 'jbs'),
			data: {
				orderNo: $params.orderNo
			},
			dataType: 'json',
			success: $http.ok(function(result) {
				console.log(result);
				$scope.result = result;
				render.compile($scope.$el.$modifyPanel, $scope.def.modifyTmpl, $scope.result.data.loanEditLog, true);
				render.compile($scope.$el.$telApproval, $scope.def.telApprovalTmpl, $scope.result.data.telPhoneApprovalLog, true);
				render.compile($scope.$el.$loanLogPanel, $scope.def.logTmpl, $scope.result.data, true);
				if( cb && typeof cb == 'function' ) {
					cb();
				}
			})
		})
	}

	/**
	 * 设置立即处理事件
	 */
	var setupEvt = function() {

		
	}

	/**
	 * 加载页面模板
	 */
	$console.load(router.template('iframe/orders-log'), function() {
		$scope.def = {
			modifyTmpl: $console.find('#modifyTmpl').html(),
			telApprovalTmpl: $console.find('#telApprovalTmpl').html(),
			logTmpl: $console.find('#loanLogTmpl').html()
		}
		$scope.$el = {
			$modifyPanel: $console.find('#modifyPanel'),
			$telApproval: $console.find('#telApproval'),
			$loanLogPanel: $console.find('#loanLogPanel')
		}
		loadloanLog();
	})
});