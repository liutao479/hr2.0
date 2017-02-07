'use strict';
page.ctrl('creditInput', [], function($scope) {
	var $console = render.$console,
		$params = $scope.$params;
	$scope.tabs = [];
	$scope.idx = 0;

	/**
	* 设置面包屑
	*/
	var setupLocation = function(loanUser, orderDate) {
		if(!$scope.$params.path) return false;
		var $location = $console.find('#location');
		$location.data({
			backspace: $scope.$params.path,
			loanUser: loanUser,
			current: '征信结果录入',
			orderDate: orderDate
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
			url: $http.apiMap.creditInput,
			data: {orderNo: $scope.$params.orderNo},
			success: $http.ok(function(result) {
				console.log(result);
				$scope.result = result;
				render.compile($scope.$el.$tab, $scope.def.tabTmpl, $scope.result.data, true);
				$scope.$el.$tabs = $scope.$el.$tab.find('.tabEvt');
				var _tabTrigger = $scope.$el.$tbls.eq(0);
				$scope.tabs.push(_tabTrigger);
				render.compile(_tabTrigger, $scope.def.listTmpl, $scope.result, true);
				setupEvent();
				var _loanUser = $scope.result.data[0].loanUserCredits[0].userName;
				var _orderDate = tool.formatDate($scope.result.data[0].loanUserCredits[0].submitDate, true);
				setupLocation(_loanUser, _orderDate);
			})
		})
	}

	var setupEvent = function () {
		$scope.$el.$tab.find('.tabEvt').on('click', function () {
			var $this = $(this);
			if($this.hasClass('role-item-active')) return;
			var _type = $this.data('type');
			if(!$scope.tabs[_type]) {
				var _tabTrigger = $scope.$el.$tbls.eq(_type)
				$scope.tabs[_type] = _tabTrigger;
				render.compile(_tabTrigger, $scope.def.listTmpl, $scope.result.data[_type], true);
			}
			console.log($scope.$el.$tabs.eq($scope.idx));
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
	$(document).on('click', '#loanManegeTable .button', function() {
		var that = $(this);
		router.render(that.data('href'), {orderNo: that.data('id')});
	});

	/***
	* 加载页面模板
	*/
	render.$console.load(router.template('credit-result-typing'), function() {
		$scope.def.tabTmpl = $console.find('#creditResultTabsTmpl').html();
		$scope.def.listTmpl = $console.find('#creditResultListTmpl').html();
		// console.log($console.find('#creditResultPanel'))
		$scope.$el = {
			$tbls: $console.find('#creditResultPanel > .tabTrigger'),
			$tab: $console.find('#userTabs'),
			$paging: $console.find('#pageToolbar')
		}
		loadOrderInfo();
	});
});