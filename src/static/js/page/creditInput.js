'use strict';
page.ctrl('creditInput', [], function($scope) {
	var $console = render.$console,
		$params = $scope.$params;
	$scope.tabs = [];
	$scope.idx = 0;

	/**
	* 设置面包屑
	*/
	var setupLocation = function(loanUser) {
		if(!$scope.$params.path) return false;
		var $location = $console.find('#location');
		var _orderDate = tool.formatDate($scope.$params.date, true);
		$location.data({
			backspace: $scope.$params.path,
			loanUser: loanUser,
			current: '征信结果录入',
			orderDate: _orderDate
		});
		$location.location();
	}

	/**
	* 加载征信结果录入数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadOrderInfo = function() {
		$.ajax({
			url: 'http://127.0.0.1:8083/mock/creditInput',
			// type: 'post',
			// url: $http.api(''),
			// data: {
			// 	taskId : 80871
			// },
			// dataType: 'json',
			success: $http.ok(function(result) {
				console.log(result);
				$scope.result = result;
				// 启动面包屑
				var _loanUser = $scope.result.data[0].loanUserCredits[0].userName;
				setupLocation(_loanUser);
				// 编译tab
				setupTab($scope.result);
				// 编译tab项对应内容
				setupCreditPanel($scope.result);
				// 启动绑定事件
				setupEvent();
			})
		})
	}

	/**
	 * 渲染tab栏
	 * @param  {object} result 请求获得的数据
	 */
	var setupTab = function(result) {
		render.compile($scope.$el.$tab, $scope.def.tabTmpl, result.data, true);
		$scope.$el.$tabs = $scope.$el.$tab.find('.tabEvt');
	}

	/**
	 * 渲染tab栏对应项内容
	 * @param  {object} result 请求获得的数据
	 */
	var setupCreditPanel = function(result) {
		var _tabTrigger = $scope.$el.$tbls.eq(0);
		$scope.tabs.push(_tabTrigger);
		$scope.result.index = 0;
		render.compile(_tabTrigger, $scope.def.listTmpl, result, true);
	}

	

	var setupEvent = function () {
		$scope.$el.$tab.find('.tabEvt').on('click', function () {
			var $this = $(this);
			if($this.hasClass('role-item-active')) return;
			var _type = $this.data('type');
			if(!$scope.tabs[_type]) {
				var _tabTrigger = $scope.$el.$tbls.eq(_type);
				$scope.tabs[_type] = _tabTrigger;
				$scope.result.index = _type;
				render.compile(_tabTrigger, $scope.def.listTmpl, $scope.result, true);
			}
			$scope.$el.$tabs.eq($scope.idx).removeClass('role-item-active');
			$this.addClass('role-item-active');
			$scope.$el.$tbls.eq($scope.idx).hide();
			$scope.$el.$tbls.eq(_type).show();
			$scope.idx = _type;
		})
	}
	/**
	* 绑定立即处理事件
	*/
	$(document).on('click', '#submitOrders', function() {
		var that = $(this);
		that.openWindow({
			title: "提交",
			content: dialogTml.wContent.suggestion,
			commit: dialogTml.wCommit.cancelSure
		}, function($dialog) {
			$dialog.find('.w-sure').on('click', function() {
				var _suggestion = $dialog.find('#suggestion').val();
				alert(_suggestion);
				$dialog.remove();
			})
		})
	});

	/***
	* 加载页面模板
	*/
	render.$console.load(router.template('iframe/credit-result-typing'), function() {
		$scope.def.tabTmpl = $console.find('#creditResultTabsTmpl').html();
		$scope.def.listTmpl = $console.find('#creditResultListTmpl').html();
		// console.log($console.find('#creditResultPanel'))
		$scope.$el = {
			$tbls: $console.find('#creditResultPanel > .tabTrigger'),
			$tab: $console.find('#creditTabs'),
			$paging: $console.find('#pageToolbar')
		}
		loadOrderInfo();
	});
});