"use strict";
page.ctrl('loanLog', function($scope) {
	var $params = $scope.$params,
		$console = $params.refer ? $($params.refer) : render.$console;
	// $params.orderNo = 'nfdb2016102421082285';
	
	/**
	* 加载订单日志数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadloanLog = function(_type, cb) {
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
				setupLocation();
				render.compile($scope.$el.$modifyPanel, $scope.def.modifyTmpl, result.data.loanEditLog, true);
				render.compile($scope.$el.$loanLogPanel, $scope.def.logTmpl, result.data, true);
				if( cb && typeof cb == 'function' ) {
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
			current: '订单日志',
			loanUser: '未知',
			orderDate: '2017-12-12 09:56'
		});
		$location.location();
	}

	/**
	 * 设置立即处理事件
	 */
	var setupEvt = function() {

		
	}


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