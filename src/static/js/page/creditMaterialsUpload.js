"use strict";
page.ctrl('creditMaterialsUpload', function($scope) {
	var $console = render.$console;
	$scope.userMap = [
		{
			userType: 0,
			trigger: 'loanMain',
			userTypeName: '借款人'
		},
		{
			userType: 1,
			trigger: 'loanPartner',
			userTypeName: '共同还款人'
		},
		{
			userType: 2,
			trigger: 'loanGrarantor',
			userTypeName: '反担保人'
		}
	];
	$scope.tabs = [];
	$scope.currentType = $scope.$params.type || 0;
	$scope.$el = {};

	
	/**
	* 加载征信材料上传数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadOrderInfo = function(_type, cb) {
		$.ajax({
			type: 'post',
			url: $http.api('creditMaterials/index', 'zyj'),
			data: {
				// taskId: $scope.$params.taskId
				taskId: 80885
			},
			dataType: 'json',
			success: $http.ok(function(result) {
				console.log(result);
				$scope.result = result;
				$scope.orderNo = result.data.loanTask.orderNo;
				$scope.result.data.currentType = _type;
				$scope.currentType = _type;
				// 编译面包屑
				setupLocation();
				// 编译tab
				setupTab($scope.result.data || {});
				// 编译tab项对应内容
				setupCreditPanel($scope.result.data, _type);
				// 编译立即处理事件
				setupTabEvt();
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
			current: '征信材料上传',
			loanUser: $scope.result.data.loanTask.loanOrder.realName,
			orderDate: tool.formatDate($scope.result.data.loanTask.createDate, true)
		});
		$location.location();
	}

	/**
	 * 渲染tab栏
	 * @param  {object} data tab栏操作的数据
	 */
	var setupTab = function(data) {
		data.types = ['借款人', '共同还款人', '反担保人'];
		render.compile($scope.$el.$tab, $scope.def.tabTmpl, data, true);
		$scope.$el.$tabs = $scope.$el.$tab.find('.tabEvt');
	}

	/**
	 * 渲染tab栏对应项内容
	 * @param  {object} result 请求获得的数据
	 */
	var setupCreditPanel = function(data, _type) {
		data.currentType = _type;
		render.compile($scope.$el.$creditPanel, $scope.def.listTmpl, data, true);
		$scope.tabs[_type] = $console.find('#creditUploadPanel').html();
		setupEvt();
	}
	
	// 编译完成后绑定事件
	var setupEvent = function () {
		// tab栏点击事件
		$scope.$el.$tab.find('.tabEvt').on('click', function () {
			var $this = $(this);
			if($this.hasClass('role-item-active')) return;
			var _type = $this.data('type');
			if(!$scope.tabs[_type]) {
				$scope.$el.$creditPanel.html('');
				render.compile($scope.$el.$creditPanel, $scope.def.listTmpl, $scope.result.data.creditUsers[_type], true);
				var _tabTrigger = $console.find('#creditUploadPanel').html();
				$scope.tabs[_type] = _tabTrigger;
				// $scope.result.index = _type;
			}
			$scope.$el.$tabs.eq($scope.currentType).removeClass('role-item-active');
			$this.addClass('role-item-active');
			$scope.currentType = _type;
			$scope.$el.$creditPanel.html($scope.tabs[$scope.currentType]);
		})
		$scope.$el.$creditPanel.find('.uploadEvt').imgUpload();
	}


	/**
	 * 增加共同还款人
	 */
	$(document).on('click', '#btnNewLoanPartner', function() {
		// 后台接口修改完成时使用
		$.ajax({
			type: 'post',
			url: $http.api('creditUser/add', 'zyj'),
			data: {
				orderNo: $scope.orderNo,
				userType: 1
			},
			dataType: 'json',
			success: $http.ok(function(result) {
				console.log(result);
				loadOrderInfo(1);
			})
		}) 
	})

	/**
	 * 增加反担保人
	 */
	$(document).on('click', '#btnNewGuarantor', function() {
		// 后台接口修改完成时使用
		$.ajax({
			type: 'post',
			url: $http.api('creditUser/add', 'zyj'),
			data: {
				orderNo: $scope.orderNo,
				userType: 2
			},
			dataType: 'json',
			success: $http.ok(function(result) {
				console.log(result);
				loadOrderInfo(2);
			})
		}) 		
	});

	/**
	 * 征信查询按钮
	 */
	$(document).on('click', '#creditQuery', function() {
		var that = $(this);
		that.openWindow({
			title: "征信查询",
			content: wContent.creditQuery,
			commit: wCommit.cancelNext
		}, function() {
			$('.w-next').on('click', function() {
				alert('下一步');
			})
		})
	});

	/**
	 * 取消订单按钮
	 */
	$(document).on('click', '#cancelOrders', function() {
		var that = $(this);
		that.openWindow({
			title: "取消订单",
			content: "<div>确定要取消该笔贷款申请吗？</div>",
			commit: dialogTml.wCommit.cancelSure
		}, function() {
			$('.w-sure').on('click', function() {
				alert('确定');
			})
		})
	});



	/**
	 * tab栏点击事件
	 */
	var setupTabEvt = function() {
		// $(document).on('click', '.tabEvt', function() {
		$console.find('#creditTabs .tabEvt').on('click', function() {
			var $this = $(this);
			if($this.hasClass('role-item-active')) return;
			// 如果当前tab对应页面html发生了变化，例如上传了图片，则将页面再次存入$scope.tabs里面
			$scope.tabs[$scope.currentType] = $console.find('#creditUploadPanel').html();
			var _type = $this.data('type');
			if(!$scope.tabs[_type]) {
				$scope.$el.$creditPanel.html('');
				setupCreditPanel($scope.result.data, _type);
			}
			$scope.$el.$tabs.eq($scope.currentType).removeClass('role-item-active');
			$this.addClass('role-item-active');
			$scope.currentType = _type;
			$scope.$el.$creditPanel.html($scope.tabs[$scope.currentType]);
			setupEvt();
		})
	}

	var setupEvt = function() {
		/**
		 * 删除一个共同还款人或者反担保人
		 */
		$console.find('#creditUploadPanel .delete-credit-item').on('click', function() {
			var _userId = $(this).data('id');
			switch ($scope.currentType) {
				case 1:
					var flag = '共同还款人';
					break;
				case 2:
					var flag = '反担保人';
					break;
			}
			console.log(flag + ',' +_userId);
			if(confirm('确认删除一个为' + _userId + '的' + flag + '?')) {
				// 后台接口修改完成时使用
				$.ajax({
					type: 'post',
					url: $http.api('creditUser/del', 'zyj'),
					data: {
						userId: _userId
					},
					dataType: 'json',
					success: $http.ok(function(result) {
						console.log(result);
						if($scope.result.data.creditUsers[$scope.currentType].length == 1) {
							loadOrderInfo(0);	
						} else {
							loadOrderInfo($scope.currentType);	
						}
					})
				}) 
			}
		});

		/**
		 * 启动上传图片控件
		 */
		$scope.$el.$creditPanel.find('.uploadEvt').imgUpload();
	}

	// 加载页面模板
	$.when($.ajax('iframe/credit-material-upload.html'), $.ajax('defs/creditPanel.html')).done(function(t1, t2) {
		$console.append(t1[0] + t2[0]);
		$scope.def.tabTmpl = $console.find('#creditUploadTabsTmpl').html();
		$scope.def.listTmpl = $console.find('#creditUploadListTmpl').html();
		$scope.$el.$tab = $console.find('#creditTabs');
		$scope.$el.$creditPanel = $console.find('#creditUploadPanel');
		loadOrderInfo($scope.currentType);
	});
});
