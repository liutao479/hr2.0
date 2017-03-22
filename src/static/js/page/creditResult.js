'use strict';
page.ctrl('creditResult', function($scope) {
	var $params = $scope.$params,
		$console = $params.refer ? $($params.refer) : render.$console;
	/**
	* 加载征信预审核数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadOrderInfo = function(cb) {
		var params = {
			taskId: $params.taskId
		}
		if($params.refer) {
			params.frameCode = $params.code;
		}
		$.ajax({
			type: 'post',
			url: $http.api('creditUser/getCreditInfo', 'jbs'),
			data: params,
			dataType: 'json',
			success: $http.ok(function(result) {
				console.log(result);
				$scope.result = result;
				$scope.result.types = ['申请人', '共同还款人', '反担保人'];
				$scope.result.format = {
					'ZJR': 0,
					'GTHKR': 1,
					'FDBR': 2
				};
				$scope.result.editable = 0;
				console.log($scope.result)

				// 编译征信结果
				render.compile($scope.$el.$resultPanel, $scope.def.resultTmpl, $scope.result, function() {
					setupEvt();
				}, true);

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
			loanUser: $scope.result.data.loanTask.loanOrder.realName,
			current: '征信结果',
			orderDate: $scope.result.data.loanTask.createDateStr
		});
		$location.location();
	}



	/**
	* 绑定立即处理事件
	*/
	var setupEvt = function($el) {
		$console.find('.uploadEvt').imgUpload();
	}

	/**
	* 页面首次加载绑定立即处理事件
	*/
	var evt = function() {
		
	}



	/***
	* 加载页面模板
	*/
	$console.load(router.template('iframe/credit-result'), function() {
		$scope.def = {
			resultTmpl: $console.find('#resultTmpl').html()
		}
		$scope.$el = {
			$resultPanel: $console.find('#resultPanel')
		}
		console.log($console)
		loadOrderInfo();
		evt();
	});

	
});