'use strict';
page.ctrl('creditInput', [], function($scope) {
	var $console = render.$console,
		$params = $scope.$params;
	$scope.tabs = [];
	$scope.idx = 0;

	/**
	* 设置面包屑
	*/
	var setupLocation = function() {
		if(!$scope.$params.path) return false;
		var $location = $console.find('#location');
		$location.data({
			backspace: $scope.$params.path,
			loanUser: $scope.result.data[0].loanUserCredits[0].userName,
			current: '征信结果录入',
			orderDate: '2017-12-12 12:12'
		});
		$location.location();
	}

	/**
	* 加载征信结果录入数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadOrderInfo = function(idx, cb) {
		$.ajax({
			// url: 'http://127.0.0.1:8083/mock/creditInput',
			type: 'post',
			url: $http.api('creditUser/getCreditInfo', 'zyj'),
			data: {
				taskId : 80871
			},
			dataType: 'json',
			success: $http.ok(function(result) {
				console.log(result);
				result.index = idx;
				$scope.result = result;
				
				// 编译tab项对应内容
				setupCreditPanel(idx, $scope.result);
				// 启动绑定事件
				setupTabEvt();
				setupEvt();
				if(cb && typeof cb == 'function') {
					cb();
				}
			})
		})
	}

	/**
	 * 渲染tab栏
	 * @param  {object} result 请求获得的数据
	 */
	var setupTab = function(result) {
		render.compile($scope.$el.$tab, $scope.def.tabTmpl, result, true);
		$scope.$el.$tabs = $scope.$el.$tab.find('.tabEvt');
	}

	/**
	 * 渲染tab栏对应项内容
	 * @param  {object} result 请求获得的数据
	 */
	var setupCreditPanel = function(idx, result) {
		var _tabTrigger = $scope.$el.$tbls.eq(idx);
		$scope.tabs.push(_tabTrigger);
		$scope.result.index = idx;
		render.compile(_tabTrigger, $scope.def.listTmpl, result, true);
	}

	
	/**
	* 绑定tab栏立即处理事件
	*/
	var setupTabEvt = function () {
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
			$console.find('.uploadEvt').imgUpload();
		})
	}

	/**
	* 绑定立即处理事件
	*/
	var setupEvt = function() {
		$console.find('.uploadEvt').imgUpload();
	}


	var commitData = function() {
		
	}

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
		loadOrderInfo($scope.idx, function() {
			setupLocation();
			setupTab($scope.result);
		});
	});

	/***
	* 删除图片后的回调函数
	*/
	$scope.deletecb = function() {
		loadOrderInfo($scope.idx);
	}

	/***
	* 上传图片成功后的回调函数
	*/
	$scope.uploadcb = function(self) {
		console.log(self.$el);
		self.$el.find('.imgs-item-p').html('征信报告' + self.$el.data('count'));
		self.$el.after(self.outerHTML);
		self.$el.next().imgUpload();
	}
});