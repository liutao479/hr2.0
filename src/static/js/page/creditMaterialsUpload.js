"use strict";
page.ctrl('creditMaterialsUpload', function($scope) {
	var $console = render.$console,
		$params = $scope.$params;
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
	$scope.apiParams = {};

	
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
				// 编译tab栏事件
				setupTabEvt();
				// 编译立即处理事件
				setupEvt();
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
	var setupCreditPanel = function(result, _type) {
		var _tabTrigger = $scope.$el.$tbls.eq(_type);
		_tabTrigger.html('');
		$scope.tabs.push(_tabTrigger);
		$scope.result.data.currentType = _type;
		render.compile(_tabTrigger, $scope.def.listTmpl, result, true);
	}

	/**
	 * 首次加载页面时绑定的事件（增加共同还款人和反担保人，以及底部提交按钮）
	 */
	var evt = function() {
		/**
		 * 增加共同还款人
		 */
		$console.find('#btnNewLoanPartner').on('click', function() {
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
		$console.find('#btnNewGuarantor').on('click', function() {
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
		$console.find('#creditQuery').on('click', function() {
			var that = $(this);
			that.openWindow({
				title: "征信查询",
				content: dialogTml.wContent.creditQuery,
				commit: dialogTml.wCommit.cancelNext,
			}, function($dialog) {
				$dialog.delegate('.w-next', 'click', function() {
					$scope.apiParams.bankId = 12;
					$scope.apiParams.busiAreaCode = 110000;
					$scope.apiParams.reason = '原因在哪里都不知道';
					var saveHtml = $dialog.find('.w-content').html();
					var tml = '<div>确定所有被查人的征信材料已上传无误，并提交征信查询吗？</div>\
								<div class="w-commit-area">\
								<div class="button w-sure">确定</div>\
								<div class="button button-empty w-back">上一步</div>\
							</div>'
					$dialog.find('.w-content').html(tml);
					$dialog.find('.w-back').on('click', function() {
						$dialog.find('.w-content').html(saveHtml);
					})
					$dialog.find('.w-sure').on('click', function() {
						console.log($scope.apiParams)
						$dialog.remove();
						// toast.show();
						$.ajax({
							type: 'post',
							// url: $http.api('creditMaterials/submit/' + $params.taskId, 'zyj'),
							url: $http.api('creditMaterials/submit/80885', 'zyj'),
							data: JSON.stringify($scope.apiParams),
							dataType: 'json',
							contentType: 'application/json;charset=utf-8',
							success: $http.ok(function(result) {
								console.log(result);
								// toast.hide();
							})
						})
					})
				})
			})
		});

		/**
		 * 取消订单按钮
		 */
		$console.find('#cancelOrders').on('click', function() {
			var that = $(this);
			that.openWindow({
				title: "取消订单",
				content: "<div>确定要取消该笔贷款申请吗？</div>",
				commit: dialogTml.wCommit.cancelSure
			}, function($dialog) {
				$dialog.find('.w-sure').on('click', function() {
					alert('删除该订单接口！');
					$dialog.remove();
				})
			})
		});
	}

	/**
	 * tab栏点击事件
	 */
	var setupTabEvt = function() {
		// $(document).on('click', '.tabEvt', function() {
		$console.find('#creditTabs .tabEvt').on('click', function() {
			var $this = $(this);
			if($this.hasClass('role-item-active')) return;
			// console.log($console.find('#creditUploadPanel').html())
			var _type = $this.data('type');
			if(!$scope.tabs[_type]) {
				var _tabTrigger = $scope.$el.$tbls.eq(_type);
				$scope.tabs[_type] = _tabTrigger;
				$scope.result.data.currentType = _type;
				render.compile(_tabTrigger, $scope.def.listTmpl, $scope.result.data, true);
			}
			$scope.$el.$tabs.eq($scope.currentType).removeClass('role-item-active');
			$this.addClass('role-item-active');
			$scope.$el.$tbls.eq($scope.currentType).hide();
			$scope.$el.$tbls.eq(_type).show();
			$scope.currentType = _type;
			setupEvt();
		})
	}

	var setupEvt = function() {
		/**
		 * 删除一个共同还款人或者反担保人
		 */
		$console.find('#creditUploadPanel .delete-credit-item').on('click', function() {
			var that = $(this);
			var _userId = that.data('id');
			switch ($scope.currentType) {
				case 1:
					var flag = '共同还款人';
					break;
				case 2:
					var flag = '反担保人';
					break;
			}
			console.log(flag + ',' +_userId);
			that.openWindow({
				title: "提示",
				content: "<div>确定要删除该用户吗？</div>",
				commit: dialogTml.wCommit.cancelSure
			}, function($dialog) {
				$dialog.find('.w-sure').on('click', function() {
					$dialog.remove();
					console.log(_userId)
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
				})
			})
		});

		/**
		 * 表单输入失去焦点保存信息
		 */
		$console.find('.input-text input').on('blur', function() {
			var that = $(this),
			    value = that.val(),
				type = that.data('type'),
				$parent = that.parent();
			if(!value) {
				$parent.removeClass('error-input').addClass('error-input');
				$parent.find('.input-err').remove();
				$parent.append('<span class=\"input-err\">该项不能为空！</span>');
				return flase;
			} else if(!regMap[type].test(value)) {
				$parent.removeClass('error-input').addClass('error-input');
				$parent.find('.input-err').remove();
				$parent.append('<span class=\"input-err\">输入不符合规则！</span>');
				return flase;
			} else {
				$parent.removeClass('error-input');
				$parent.find('.input-err').remove();
			}
			for(var i = 0, len = $scope.apiParams.loanUsers.length; i < len; i++) {
				var item = $scope.apiParams.loanUsers[i];
				if(that.data('userId') == item.userId) {
					item[that.data('type')] = that.val();
				}
			}
			console.log($scope.apiParams);
		})

		/**
		 * 启动上传图片控件
		 */
		$scope.$el.$creditPanel.find('.uploadEvt').imgUpload();
	}

	var initApiParams = function() {
		$scope.apiParams = {
			// taskId: parseInt($params.taskId),
			taskId: 80885,
			orderNo: $scope.orderNo,
			loanUsers:[]
		};
		for(var i in $scope.result.data.creditUsers) {
			for(var j = 0, len2 = $scope.result.data.creditUsers[i].length; j < len2; j++) {
				var row = $scope.result.data.creditUsers[i][j],
					item = {};
				item.userId = row.userId;
				item.userName = row.userName || '';
				item.idCard = row.idCard || '';
				item.userType = row.userType || '';
				item.userRelationship = row.userRelationship;
				item.userType = row.userType;
				$scope.apiParams.loanUsers.push(item);
			}
		}
		console.log($scope.apiParams);
	}

	// 加载页面模板
	$.when($.ajax('iframe/credit-material-upload.html'), $.ajax('defs/creditPanel.html')).done(function(t1, t2) {
		$console.append(t1[0] + t2[0]);
		$scope.def = {
			tabTmpl: $console.find('#creditUploadTabsTmpl').html(),
			listTmpl: $console.find('#creditUploadListTmpl').html()
		}
		$scope.$el = {
			$tbls: $console.find('#creditUploadPanel > .tabTrigger'),
			$tab: $console.find('#creditTabs'),
			$creditPanel: $console.find('#creditUploadPanel')
		}
		
		loadOrderInfo($scope.currentType, function() {
			initApiParams();
			evt();
		});
	});
});
