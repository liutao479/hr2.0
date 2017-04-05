"use strict";
page.ctrl('creditMaterialsUpload', function($scope) {
	var $params = $scope.$params,
		$console = render.$console;
	// $params.taskId = 81035;
	// $params.taskId = 81200;
	$scope.userMap = {
		0: '借款人',
		1: '共同还款人',
		2: '反担保人'
	};
	$scope.tabs = {};
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
			url: $http.api('creditMaterials/index', 'zjy'),
			data: {
				taskId: $params.taskId
			},
			dataType: 'json',
			success: $http.ok(function(result) {
				console.log(result);
				$scope.result = result;
				$scope.result.data.cfgMaterials = result.cfgData;
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
 				$scope.demandBankId = result.data.loanTask.loanOrder.demandBankId || '';
 				$scope.bankName = result.data.loanTask.loanOrder.demandBankName || '';
 				$scope.busiAreaCode = result.data.loanTask.loanOrder.area ? result.data.loanTask.loanOrder.area.areaId : '';
 				$scope.areaName = result.data.loanTask.loanOrder.area ? result.data.loanTask.loanOrder.area.wholeName : '';
				$scope.result.data.currentType = _type;

				// 编译tab
				setupTab($scope.result.data || {}, function() {
					setupTabEvt();
				});

				// 编译tab项对应内容
				setupCreditPanel(_type, $scope.result.data, function() {
					setupEvt($scope.$el.$tbls.eq(_type));
				});

				//初始化要传参数
				initApiParams();

				if( cb && typeof cb == 'function' ) {
					cb();
				}
			})
		})
	}

	/**
	* 设置修改征信查询银行区域
	*/
	var setupCreditBank = function() {
		$scope.currentType = 0;
		if(!$scope.demandBankId) {
			setupWindow();
		} else {
			loadOrderInfo($scope.currentType, function() {
				render.compile($scope.$el.$modifyBankPanel, $scope.def.modifyBankTmpl, $scope.result.data.loanTask.loanOrder, function() {
					$scope.$el.$modifyBankPanel.find('.modifyBankEvt').on('click', function() {
						setupWindow(true);
					})
				}, true);
			});
		}
	}

	/**
	 * 征信银行更新
	 */
	 var updBank = function(cb) {
	 	var params = {
			orderNo: $scope.orderNo,
			demandBankId: $scope.demandBankId,
			busiAreaCode: $scope.busiAreaCode
		}
		console.log(params)
	 	$.ajax({
			type: 'post',
			url: $http.api('creditMaterials/order/update', 'zyj'),
			data: params,
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
	 * 启动征信查询银行弹窗
	 */
	var setupWindow = function(t) {
		var buttons = {};	
		if(t) {
			buttons['close'] = {
	        	text: '取消',
				btnClass: 'btn-default btn-cancel',
	            action: function () {

	            }
	        };
		}
		buttons['ok']  = {
        	text: '确定',
            action: function () {
            	var $demandBank = $('#demandBank input').val();
            	var $areaSource = $('#areaSource input').val();
            	if(!$demandBank || !$areaSource) {
            		$.alert({
            			title: '提示',
            			content: '<div class="w-content"><div class="w-text">请选择经办银行和业务发生地！</div></div>',
						ok: {
							text: '确定'
						}
            		});
            		return false;
            	}
            	updBank(function() {
            		setupCreditBank();
            	});
            }
		}
		var opt = {
			title: '查询机构选择',
			content: dialogTml.wContent.creditQuery.format('creditMaterialsUpload', 'creditMaterialsUpload', $scope.bankName, $scope.areaName),
			onContentReady: function(data, status, xhr){
				$('.jconfirm').find('.select').dropdown();
		    },
		    onClose: function () {
		    	if(!$scope.demandBankId) {
            		router.render('loanProcess');
            	}
		    }
		}
		opt['buttons'] = buttons;
		$.confirm(opt);
	}

	/**
	* 设置面包屑
	*/
	var setupLocation = function() {
		if(!$scope.$params.path) return false;
		var $location = $console.find('#location');
		$location.data({
			backspace: $scope.$params.path,
			current: $scope.result.data.loanTask.taskName,
			loanUser: $scope.result.data.loanTask.loanOrder.realName,
			orderDate: $scope.result.data.loanTask.loanOrder.createDateStr
		});
		$location.location();
	}

	/**
	* 设置退回原因
	*/
	var setupBackReason = function(data) {
		var $backReason = $console.find('#backReason');
		if(!data) {
			$backReason.remove();
			return false;
		} else {
			$backReason.data({
				backReason: data.reason,
				backUser: data.userName,
				backUserPhone: data.phone,
				backDate: tool.formatDate(data.transDate, true)
			});
			$backReason.backReason();
		}
	}

	/**
	* 设置底部按钮操作栏
	*/
	var setupSubmitBar = function() {
		var $submitBar = $console.find('#submitBar');
		$submitBar.data({
			taskId: $params.taskId
		});
		$submitBar.submitBar();
		var $sub = $submitBar[0].$submitBar;

		/**
		 * 取消订单
		 */
		$sub.on('cancelOrder', function() {
			$.alert({
				title: '取消订单',
				content: tool.alert('确定要取消该笔贷款申请吗？'),
				buttons: {
					close: {
						text: '取消',
						btnClass: 'btn-default btn-cancel'
					},
					ok: {
						text: '确定',
						action: function () {
							var params = {
								taskId: $params.taskId
							}
							var reason = $.trim(this.$content.find('#suggestion').val());
							if(reason) params.reason = reason;
							$.ajax({
								type: 'post',
								url: $http.api('loanOrder/cancel', 'zyj'),
								data: params,
								dataType: 'json',
								success: $http.ok(function(result) {
									console.log(result);
									router.render('loanProcess');
								})
							})
						}
					}
				}
			})
		})

		/**
		 * 征信查询
		 */
		$sub.on('creditQuery', function() {
			saveData(function() {
				process();
			});
		})
	}


	/**
	 * 任务提交跳转
	 */
	function process() {
		$.confirm({
			title: '提交订单',
			content: dialogTml.wContent.suggestion,
			buttons: {
				close: {
					text: '取消',
					btnClass: 'btn-default btn-cancel',
					action: function() {}
				},
				ok: {
					text: '确定',
					action: function () {
						var taskIds = [];
						for(var i = 0, len = $params.tasks.length; i < len; i++) {
							taskIds.push(parseInt($params.tasks[i].id));
						}
						var params = {
							taskId: $params.taskId,
							taskIds: taskIds,
							orderNo: $params.orderNo
						}
						var reason = $.trim(this.$content.find('#suggestion').val());
						if(reason) params.reason = reason;
						flow.tasksJump(params, 'complete');
					}
				}
			}
		})
	}

	/**
	 * 征信人信息数据保存
	 */
	function saveData(cb) {
		var _alert = '';
		for(var i = 0, len = $scope.apiParams.length; i < len; i++) {
			var item = $scope.apiParams[i];
			for(var j in item) {
				if(j == 'idCard' && !item[j]) {
					_alert += '请填写' + $scope.userMap[item.userType] + '的身份证号！<br/>';
				}
				if(j == 'userName' && !item[j]) {
					_alert += '请填写' + $scope.userMap[item.userType] + '的姓名！<br/>';
				}
				if(j == 'userRelationship' && item[j] != 0 && !item[j] && item.userType != 0) {
					_alert += '请选择' + $scope.userMap[item.userType] + '与借款人的关系！<br/>';
				}
			}
		}
		if(!_alert) {
			$.ajax({
				type: 'post',
				url: $http.api('creditMaterials/submit/' + $params.taskId, 'zyj'),
				data: JSON.stringify($scope.apiParams),
				dataType: 'json',
				contentType: 'application/json;charset=utf-8',
				success: $http.ok(function(result) {
					console.log(result);
					if(cb && typeof cb == 'function') {
						cb();
					}
				})
			})
			
		} else {
			$.alert({
				title: '提示',
				content: tool.alert(_alert),
				buttons: {
					ok: {
						text: '确定',
						action: function () {
							console.log($scope.apiParams);
						}
					}
				}
			})
			return false;
		}
		
	} 

	/**
	 * 渲染tab按钮（增加共同还款人和反担保人）
	 */
	 var setupAddUsers = function() {
	 	$scope.$el.$tab.after($scope.def.addCreditUsersTmpl.format());
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
	 * dropdown
	 */
	function setupDropDown() {
		$console.find('.select').dropdown();
	}

	/**
	 * 首次加载页面时绑定的事件（增加共同还款人和反担保人）
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
					orderNo: $params.orderNo,
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
					orderNo: $params.orderNo,
					userType: 2
				},
				dataType: 'json',
				success: $http.ok(function(result) {
					console.log(result);
					loadOrderInfo(2);
				})
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
		 * 删除一个共同还款人或者反担保人
		 */
		$self.find('.delete-credit-item').on('click', function() {
			var that = $(this);
			console.log(that)
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
			$.alert({
				title: '提示',
				content: tool.alert('确定要删除该用户吗？'),
				buttons: {
					close: {
						text: '取消',
						btnClass: 'btn-default btn-cancel'
					},
					ok: {
						text: '确定',
						action: function () {
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
					}
				}
			})
		});

		/**
		 * 表单输入失去焦点保存信息
		 */
		$self.find('.input-text input').on('blur', function() {
			var that = $(this),
			    value = that.val(),
				type = that.data('type'),
				$parent = that.parent();
			if(!value) {
				$parent.removeClass('error-input').addClass('error-input');
				$parent.find('.input-err').remove();
				$parent.append('<span class=\"input-err\">该项不能为空！</span>');
				// return false;
			} else if(!regMap[type].test(value)) {
				$parent.removeClass('error-input').addClass('error-input');
				$parent.find('.input-err').remove();
				that.val('').focus();
				$parent.append('<span class=\"input-err\">输入不符合规则！</span>');
				// return false;
			} else {
				$parent.removeClass('error-input');
				$parent.find('.input-err').remove();
			}
			for(var i = 0, len = $scope.apiParams.length; i < len; i++) {
				var item = $scope.apiParams[i];
				if(that.data('userId') == item.userId) {
					item[that.data('type')] = that.val();
				}
			}
			console.log($scope.apiParams);
		})

		/**
		 * 启动上传图片控件
		 */
		$self.find('.uploadEvt').imgUpload();

		/**
		 * 下拉框启动
		 */
		$self.find('.select').dropdown();
	}

	var initApiParams = function() {
		$scope.apiParams = [];
		for(var i in $scope.result.data.creditUsers) {
			for(var j = 0, len2 = $scope.result.data.creditUsers[i].length; j < len2; j++) {
				var row = $scope.result.data.creditUsers[i][j],
					item = {};
				item.userId = row.userId;
				item.userName = row.userName || '';
				item.idCard = row.idCard || '';
				item.userType = row.userType || '';
				item.userRelationship = row.userRelationship;
				if(i == 0) {
					item.userRelationship = 0;
				}
				item.userType = row.userType;
				$scope.apiParams.push(item);
			}
		}
	}

	// 加载页面模板
	$.when($.ajax('iframe/credit-material-upload.html'), $.ajax('defs/creditPanel.html')).done(function(t1, t2) {
		$console.append(t1[0] + t2[0]);
		$scope.def = {
			tabTmpl: $console.find('#creditUploadTabsTmpl').html(),
			listTmpl: $console.find('#creditUploadListTmpl').html(),
			modifyBankTmpl: $console.find('#modifyBankTmpl').html(),
			addCreditUsersTmpl: $console.find('#addCreditUsersTmpl').html()
		}
		$scope.$el = {
			$tbls: $console.find('#creditUploadPanel > .tabTrigger'),
			$tab: $console.find('#creditTabs'),
			$creditPanel: $console.find('#creditUploadPanel'),
			$modifyBankPanel: $console.find('#modifyBankPanel')
		}
		
		loadOrderInfo($scope.currentType, function() {
			setupBackReason($scope.result.data.loanTask.backApprovalInfo)
			setupCreditBank();
			setupLocation();
			setupSubmitBar();
			setupAddUsers();
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
				setupCreditBank();
				setupLocation();
				evt();
			});
		}
		
	}

	/**
	 * 下拉框点击回调
	 */
	$scope.demandBankPicker = function(picked) {
		console.log(picked);
		$scope.demandBankId = picked.id;
		$scope.bankName = picked.name;
	}

	$scope.areaSourcePicker = function(picked) {
		console.log(picked);
		$scope.busiAreaCode = picked['市'].id;
		$scope.areaName = picked['市'].name;
	}

	$scope.relationShipPicker = function(picked) {
		console.log(picked);
		var that = this.$el;
		for(var i = 0, len = $scope.apiParams.length; i < len; i++) {
			var item = $scope.apiParams[i];
			if(that.data('userId') == item.userId) {
				item[that.data('type')] = picked.id;
			}
		}
		console.log($scope.apiParams);
	}

	/**
	 * 下拉框数据请求回调
	 */
	var area = {
		province: function(cb) {
			$.ajax({
				type: 'post',
				url: $http.api('area/get', 'zyj'),
				dataType: 'json',
				success: function(xhr) {
					var sourceData = {
						items: xhr.data,
						id: 'areaId',
						name: 'wholeName'
					}
					cb(sourceData);
				}
			})
		},
		city: function(parentId, cb) {
			$.ajax({
				type: 'post',
				url: $http.api('area/get', 'zyj'),
				dataType: 'json',
				data: {parentId: parentId},
				success: function(xhr) {
					console.log(xhr);
					var sourceData = {
						items: xhr.data,
						id: 'areaId',
						name: 'wholeName'
					}
					cb(sourceData);
				}
			})
		},
		county: function(parentId, cb) {
			$.ajax({
				type: 'post',
				url: $http.api('area/get', 'zyj'),
				dataType: 'json',
				data: {parentId: parentId},
				success: function(xhr) {
					console.log(xhr);
					var sourceData = {
						items: xhr.data,
						id: 'areaId',
						name: 'wholeName'
					}
					cb(sourceData);
				}
			})
		}
	}

	/**
	 * 希腊狂请求数据回调
	 */
	$scope.dropdownTrigger = {
		areaSource: function(tab, parentId, cb) {
			if(!cb && typeof cb != 'function') {
				cb = $.noop;
			}
			if(!tab) return cb();
			switch (tab) {
				case '省':
					area.province(cb);
					break;
				case "市":
					area.city(parentId, cb);
					break;
				default:
					break;
			}
		},
		demandBank: function(t, p, cb) {
			$.ajax({
				type: 'post',
				url: $http.api('demandBank/selectBank', 'zyj'),
				dataType: 'json',
				success: $http.ok(function(xhr) {
					var sourceData = {
						items: xhr.data,
						id: 'id',
						name: 'bankName'
					};
					cb(sourceData);
				})
			})
		},
		relationShip: function(t, p, cb) {
			var data = [
				{
					id: 1,
					name: '配偶'
				},
				{
					id: 2,
					name: '父母'
				},
				{
					id: 3,
					name: '子女'
				},
				{
					id: -1,
					name: '其他'
				}
			];
			var sourceData = {
				items: data,
				id: 'id',
				name: 'name'
			};
			cb(sourceData);
		},
	}
});
