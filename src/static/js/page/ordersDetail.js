'use strict';
page.ctrl('ordersDetail', function($scope) {
	var $console = render.$console;
	
	/**
	* 加载订单详情数据数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadOrderInfo = function(cb) {
		$.ajax({
			// url: 'http://127.0.0.1:8083/mock/loanMaterialUpload',
			// type: flag,
			type: 'post',
			url: $http.apiMap.loanMaterialsUpload,
			data: {
				// taskId: $scope.$params.taskId
				taskId: 1
			},
			dataType: 'json',
			success: $http.ok(function(result) {
				console.log(result);
				$scope.result = result;
				// 编译面包屑
				var _loanUser = $scope.result.data.loanTask.loanOrder.realName;
				setupLocation(_loanUser);
				// render.compile($scope.$el.$loanPanel, $scope.def.listTmpl, result, true);
				if(cb && typeof cb == 'function') {
					cb();
				}
			})
		})
	}

	/**
	* 设置面包屑
	*/
	var setupLocation = function(loanUser) {
		if(!$scope.$params.path) return false;
		var $location = $console.find('#location');
		var _orderDate = tool.formatDate($scope.$params.date, true);
		$location.data({
			backspace: $scope.$params.path,
			current: '贷款材料上传',
			loanUser: loanUser,
			orderDate: _orderDate
		});
		$location.location();
	}

	// 编译完成后绑定事件
	var setupEvent = function () {

		$console.find('#addCreditUser').on('click', function() {
			$.ajax({
				// url: 'http://127.0.0.1:8083/mock/loanMaterialUpload',
				// type: flag,
				type: 'post',
				url: $http.apiMap.materialUpdate,
				data: {
					// 参数1：id 材料id （必填）
					// 参数2：materialsType 材料类型 0图片1视频
					// 参数3：sceneCode 场景编码 
					// 参数4：userId 材料所属用户
					// 参数5：ownerCode 材料归属类型
					// 参数6：materialsPic 材料地址（必填）
				},
				dataType: 'json',
				success: $http.ok(function(result) {
					console.log(result);
					
				})
			})
		})
	}

	$console.load(router.template('iframe/credit-result'), function() {
		// $scope.def.tabTmpl = $console.find('#creditUploadTabsTmpl').html();
		// $scope.def.listTmpl = $console.find('#loanUploadTmpl').html();
		// console.log($console.find('#creditResultPanel'))
		$scope.$el = {
			// $tab: $console.find('#creditTabs'),
			$loanPanel: $console.find('#loanUploadPanel')
		}
		loadOrderInfo();
	})
});
