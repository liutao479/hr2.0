"use strict";
page.ctrl('creditMaterialsApproval', function($scope) {
	var $console = render.$console,
		$params = $scope.$params;
	$params.taskId = 80877;
	$scope.userMap = {
		0: '借款人',
		1: '共同还款人',
		2: '反担保人'
	};
	$scope.tabs = {};
	$scope.currentType = $scope.$params.type || 0;
	$scope.$el = {};

	
	/**
	* 加载征信材料审核数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadOrderInfo = function(_type, cb) {
		$.ajax({
			type: 'post',
			url: $http.api('creditMaterials/index', 'zyj'),
			data: {
				taskId: $params.taskId
			},
			dataType: 'json',
			success: $http.ok(function(result) {
				console.log(result);
				$scope.result = result;
				$scope.result.data.cfgMaterials = eval(result.cfgData);
				$scope.result.data.uplUrl = $http.api('creditMaterials/material/addOrUpdate', 'zyj');
				$scope.result.data.delUrl = $http.api('creditMaterials/material/del', 'zyj');
				$scope.result.data.userRalaMap = {
					'0': '本人',
					'1': '配偶',
					'2': '父母',
					'3': '子女',
					'-1': '其他'
				};
 				$scope.orderNo = result.data.loanTask.orderNo;
				$scope.result.data.currentType = _type;

				// 编译tab
				setupTab($scope.result.data || {}, function() {
					setupTabEvt();
				});

				// 编译tab项对应内容
				setupCreditPanel(_type, $scope.result.data, function() {
					setupEvt($scope.$el.$tbls.eq(_type));
				});

				if( cb && typeof cb == 'function' ) {
					cb();
				}
			})
		})
	}


	/**
	 * 提交按钮区域
	 */
	var setupButton = function() {
		$.ajax({
			type: 'post',
			url: $http.api('func/scene', 'zyj'),
			data: {
				taskId: $params.taskId
			},
			dataType: 'json',
			success: $http.ok(function(result) {
				console.log(result);
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
			current: '征信材料审核',
			loanUser: $scope.result.data.loanTask.loanOrder.realName,
			orderDate: tool.formatDate($scope.result.data.loanTask.createDate, true)
		});
		$location.location();
	}

	/**
	 * 渲染tab栏
	 * @param  {object} data tab栏操作的数据
	 */
	var setupTab = function(data, cb) {
		data.types = ['借款人', '共同还款人', '反担保人'];
		render.compile($scope.$el.$tab, $scope.def.tabTmpl, data, true);
		$scope.$el.$tabs = $scope.$el.$tab.find('.tabEvt');
		if( cb && typeof cb == 'function' ) {
			cb();
		}
	}

	/**
	 * 渲染tab栏对应项内容
	 * @param  {object} result 请求获得的数据
	 */
	var setupCreditPanel = function(_type, data, cb) {
		// 编译对应_type的tab项内容，将目标编译tab项内容页显示，隐藏其他tab项内容
		var _tabTrigger = $scope.$el.$tbls.eq(_type);
		$scope.tabs[_type] = _tabTrigger;
		render.compile(_tabTrigger, $scope.def.listTmpl, data, true);
		for(var i = 0, len = $scope.$el.$tbls.length; i < len; i++) {
			if(i == _type) {
				$scope.$el.$tbls.eq(i).show();
			} else {
				$scope.$el.$tbls.eq(i).hide();
			}
		}
		$scope.currentType = _type;

		if( cb && typeof cb == 'function' ) {
			cb();
		}
	}

	/**
	 * 首次加载页面时绑定的事件（底部提交按钮）
	 */
	var evt = function() {
		/**
		 * 征信查询按钮
		 */
		$console.find('#creditQuery').on('click', function() {
			
		});

		

		/**
		 * 退回订单按钮
		 */
		$console.find('#cancelOrders').on('click', function() {
			var that = $(this);
			$.alert({
				title: '取消订单',
				content: '<div class="w-content"><div class="w-text">确定要取消该笔贷款申请吗？</div></div>',
				buttons: {
					close: {
						text: '取消',
						btnClass: 'btn-default btn-cancel'
					},
					ok: {
						text: '确定',
						action: function () {
							
						}
					}
				}
			})
		});
	}

	/**
	 * tab栏点击事件
	 */
	var setupTabEvt = function() {
		$console.find('#creditTabs .tabEvt').on('click', function() {
			var $this = $(this);
			if($this.hasClass('role-item-active')) return;
			var _type = $this.data('type');
			if(!$scope.tabs[_type]) {
				var _tabTrigger = $scope.$el.$tbls.eq(_type);
				$scope.tabs[_type] = _tabTrigger;
				$scope.result.data.currentType = _type;
				render.compile(_tabTrigger, $scope.def.listTmpl, $scope.result.data, function() {
					setupEvt(_tabTrigger);
				}, true);
			}
			$scope.$el.$tabs.eq($scope.currentType).removeClass('role-item-active');
			$this.addClass('role-item-active');
			$scope.$el.$tbls.eq($scope.currentType).hide();
			$scope.$el.$tbls.eq(_type).show();
			$scope.currentType = _type;
		})
	}

	var setupEvt = function($self) {

		/**
		 * 启动图片控件
		 */
		$self.find('.uploadEvt').imgUpload();
	}

	// 加载页面模板
	$.when($.ajax('iframe/credit-material-upload.html'), $.ajax('defs/creditPanel.html')).done(function(t1, t2) {
		$console.append(t1[0] + t2[0]);
		$scope.def = {
			tabTmpl: $console.find('#creditUploadTabsTmpl').html(),
			listTmpl: $console.find('#creditUploadListTmpl').html(),
			modifyBankTmpl: $console.find('#modifyBankTmpl').html()
		}
		$scope.$el = {
			$tbls: $console.find('#creditUploadPanel > .tabTrigger'),
			$tab: $console.find('#creditTabs'),
			$creditPanel: $console.find('#creditUploadPanel'),
			$modifyBankPanel: $console.find('#modifyBankPanel')
		}
		
		loadOrderInfo($scope.currentType, function() {
			setupLocation();
			evt();
		});
	});

	/**
	 * 上传图片数据回调
	 */
	$scope.uploadcb = $scope.deletecb = function(self, xhr) {
		if(xhr.data.refresh) {
			$scope.currentType = 0;
			loadOrderInfo($scope.currentType, function() {
				setupLocation();
				evt();
			});
		}
		
	}
});
