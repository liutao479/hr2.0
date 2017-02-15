'use strict';
page.ctrl('loanMaterialsUpload', function($scope) {
	var $console = render.$console;
	
	/**
	* 加载贷款材料上传数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadOrderInfo = function(cb) {
		$.ajax({
			// url: 'http://127.0.0.1:8083/mock/creditUpload',
			// type: flag,
			type: 'post',
			url: $http.apiMap.loanMaterialsUpload,
			data: {
				taskId: $scope.$params.taskId
			},
			dataType: 'json',
			success: $http.ok(function(result) {
				console.log(result);
				$scope.result = result;
				// 编译面包屑
				var _loanUser = $scope.result.data.loanTask.loanOrder.realName;
				setupLocation(_loanUser);
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
		// tab栏点击事件
		// $scope.$el.$tab.find('.tabEvt').on('click', function () {
		// 	var $this = $(this);
		// 	if($this.hasClass('role-item-active')) return;
		// 	var _type = $this.data('type');
		// 	if(!$scope.tabs[_type]) {
		// 		$scope.$el.$creditPanel.html('');
		// 		render.compile($scope.$el.$creditPanel, $scope.def.listTmpl, $scope.result.data.creditUsers[_type], true);
		// 		var _tabTrigger = $console.find('#creditUploadPanel').html();
		// 		$scope.tabs[_type] = _tabTrigger;
		// 		// $scope.result.index = _type;
		// 	}
		// 	$scope.$el.$tabs.eq($scope.currentType).removeClass('role-item-active');
		// 	$this.addClass('role-item-active');
		// 	$scope.currentType = _type;
		// 	$scope.$el.$creditPanel.html($scope.tabs[$scope.currentType]);
		// })
	}

	$console.load(router.template('iframe/loan-material-upload'), function() {
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
