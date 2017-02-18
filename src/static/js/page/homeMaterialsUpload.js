'use strict';
page.ctrl('homeMaterialsUpload', function($scope) {
	var $console = render.$console;
	
	/**
	* 加载上门材料上传数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadOrderInfo = function(cb) {
		$.ajax({
			// url: 'http://127.0.0.1:8083/mock/loanMaterialUpload',
			// type: flag,
			type: 'post',
			url: $http.apiMap.homeMaterialsUpload,
			data: {
				// taskId: $scope.$params.taskId
				taskId: 2
			},
			dataType: 'json',
			success: $http.ok(function(result) {
				console.log(result);
				$scope.result = result;
				// 编译面包屑
				setupLocation();
				// 设置退回原因
				setupBackReason();
				render.compile($scope.$el.$loanPanel, $scope.def.listTmpl, result, true);
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
			current: '贷款材料上传',
			loanUser: $scope.result.data.loanTask.loanOrder.realName,
			orderDate: tool.formatDate($scope.result.data.loanTask.createDate, true)
		});
		$location.location();
	}

	/**
	* 设置退回原因
	*/
	var setupBackReason = function() {
		var $backReason = $console.find('#backReason');
		console.log($backReason)
		var _backReason;
		if($scope.result.data.loanTask.backReason) {
			_backReason = $scope.result.data.loanTask.backReason;
		} else {
			_backReason = false;
		}
		$backReason.data({
			backReason: _backReason,
			// backUser: $scope.result.data.loanTask.assign,
			// backUserPhone: $scope.result.data.loanTask.backUserPhone,
			// orderDate: $scope.result.data.loanTask.createDate（后台开发好，使用这个）
			backUser: '刘东风',
			backUserPhone: '13002601637',
			backDate: '2017-2-18  12:12'
		});
		$backReason.backReason();
	}

	/**
	 * 编译完成后绑定事件
	 */
	var setupEvent = function () {

		// 增加征信人员
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

	$console.load(router.template('iframe/material-upload'), function() {
		// $scope.def.tabTmpl = $console.find('#creditUploadTabsTmpl').html();
		$scope.def.listTmpl = $console.find('#loanUploadTmpl').html();
		// console.log($console.find('#creditResultPanel'))
		$scope.$el = {
			// $tab: $console.find('#creditTabs'),
			$loanPanel: $console.find('#loanUploadPanel')
		}
		loadOrderInfo();
	})
});
