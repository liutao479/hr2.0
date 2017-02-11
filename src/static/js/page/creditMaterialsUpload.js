'use strict';
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
	$scope.currentType = 0;

	/**
	* 加载征信材料上传数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadOrderInfo = function() {
		$.ajax({
			url: 'http://127.0.0.1:8083/mock/creditUpload',
			// type: 'post',
			// url: 'http://192.168.0.144:8080/creditMaterials/index',
			// data: {
			// 	taskId: $scope.$params.taskId
			// },
			// dataType: 'json',
			success: $http.ok(function(result) {
				console.log(result);
				$scope.result = result;
				var _loanUser = $scope.result.data.loanTask.loanOrder.realName;
				setupLocation(_loanUser);
				// 编译tab
				setupTab($scope.result.data);
				// 编译tab项对应内容
				setupCreditPanel($scope.result.data);
				setupEvent();
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
			current: '征信材料上传',
			loanUser: loanUser,
			orderDate: _orderDate
		});
		$location.location();
	}

	/**
	 * 渲染tab栏
	 * @param  {object} data tab栏操作的数据
	 */
	var setupTab = function(data) {
		render.compile($scope.$el.$tab, $scope.def.tabTmpl, data.creditUsers, true);
		$scope.$el.$tabs = $scope.$el.$tab.find('.tabEvt');
		// console.log($scope.$el.$tabs);
	}

	/**
	 * 渲染tab栏对应项内容
	 * @param  {object} result 请求获得的数据
	 */
	var setupCreditPanel = function(data) {
		render.compile($scope.$el.$creditPanel, $scope.def.listTmpl, data.creditUsers[0], true);
		var _tabTrigger = $console.find('#creditUploadPanel').html();
		$scope.tabs.push(_tabTrigger);
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
		/**
		 * 增加共同还款人
		 */
		$console.find('#btnNewLoanPartner').on('click', function() {
			// 后台接口修改完成时使用
			// $.ajax({
			// 	url: 'http://127.0.0.1:8083/mock/creditUpload',
			// 	data: {
			// 		orderNo: $scope.$params.orderNo,
			// 		userType: $scope.currentType
			// 	},
			// 	success: $http.ok(function(result) {
			// 		console.log(result);
			// 	})
			// }) 

		})
		/**
		 * 增加反担保人
		 */
		$console.find('#btnNewGuarantor').on('click', function() {
			// 后台接口修改完成时使用
			// $.ajax({
			// 	url: 'http://127.0.0.1:8083/mock/creditUpload',
			// 	data: {
			// 		orderNo: $scope.$params.orderNo,
			// 		userType: $scope.currentType
			// 	},
			// 	success: $http.ok(function(result) {
			// 		console.log(result);
			// 	})
			// }) 
			
		})
	}



	$(document).on('click', '#btnNewLoanPartner', function() {

	})



	$console.load(router.template('iframe/credit-material-upload'), function() {
		$console.find('#creditUploadPanel').load(router.template('defs/creditPanel'), function() {
			$scope.def.tabTmpl = $console.find('#creditUploadTabsTmpl').html();
			$scope.def.listTmpl = $console.find('#creditUploadListTmpl').html();
			// console.log($console.find('#creditResultPanel'))
			$scope.$el = {
				$tab: $console.find('#creditTabs'),
				$creditPanel: $console.find('#creditUploadPanel')
			}
			loadOrderInfo();
		})
	})
});
