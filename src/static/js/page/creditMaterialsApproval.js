"use strict";
page.ctrl('creditMaterialsApproval', function($scope) {
	var $params = $scope.$params,
		$console = render.$console;
	// $params.taskId = 80877;
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
			url: $http.api('creditMaterialsApproval/info', 'zyj'),
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
				$scope.currentType = _type;
				$scope.result.data.currentType = _type;

				//检测是否是首次加载页面，若是则加载返回结果中第一个用户，而不是加载idx个用户
				if($scope.firstLoad) {
					var creditUsers = $scope.result.data.creditUsers, userType;
					for(var i in creditUsers) {
						userType = i;
						break;
					}
					if(userType != 0) {
						$scope.currentType = userType;
						$scope.result.data.currentType = userType;
					}
				}

				// 编译tab
				setupTab($scope.result.data || {}, function() {
					setupTabEvt();
				});

				// 编译tab项对应内容
				setupCreditPanel($scope.currentType, $scope.result.data, function() {
					setupEvt($scope.$el.$tbls.eq($scope.currentType), $scope.currentType);
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
			current: $scope.result.data.loanTask.taskName,
			loanUser: $scope.result.data.loanTask.loanOrder.realName,
			orderDate: $scope.result.data.loanTask.loanOrder.createDateStr
		});
		$location.location();
	}

	/**
	 * 图片必传校验
	 */
	var checkData = function(cb) {
		$.ajax({
			type: 'post',
			url: $http.api('creditApproval/submit/' + $params.taskId, 'zyj'),
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
		 * 审核通过
		 */
		$sub.on('approvalPass', function() {
			checkData(function() {
				process();
			});
		})

		/**
		 * 退回订单
		 */
		$sub.on('backOrder', function() {
			
			$.alert({
				title: '退回订单',
				content: doT.template(dialogTml.wContent.back)($scope.result.data.loanTask.taskJumps),
				onContentReady: function() {
					dialogEvt(this.$content);
				},
				buttons: {
					close: {
						text: '取消',
						btnClass: 'btn-default btn-cancel'
					},
					ok: {
						text: '确定',
						action: function () {
							var _reason = $.trim(this.$content.find('#suggestion').val());
							this.$content.find('.checkbox-radio').each(function() {
								if($(this).hasClass('checked')) {
									var flag = 0;
									$(this).parent().parent().find('.checkbox-normal').each(function() {
										if($(this).hasClass('checked')) {
											flag++;
										}
									})
									if(flag > 0) {
										$scope.jumpId = $(this).data('id');
									}
								}
							})
							if(!_reason) {
								$.alert({
									title: '提示',
									content: tool.alert('请填写处理意见！'),
									buttons: {
										ok: {
											text: '确定',
											action: function() {
											}
										}
									}
								});
								return false;
							} 
							console.log($scope.jumpId)
							if(!$scope.jumpId) {
								$.alert({
									title: '提示',
									content: tool.alert('请至少选择一项原因！'),
									buttons: {
										ok: {
											text: '确定',
											action: function() {
											}
										}
									}
								});
								return false;
							}
							var _params = {
								taskId: $params.taskId,
								jumpId: $scope.jumpId,
								reason: _reason
							}
							console.log(_params)
							$.ajax({
								type: 'post',
								url: $http.api('task/jump', 'zyj'),
								data: _params,
								dataType: 'json',
								success: $http.ok(function(result) {
									console.log(result);
									router.render('loanProcess');
									// toast.hide();
								})
							})
						}
					}
				}
			})
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
		 * 订单退回的条件选项分割
		 */
		var taskJumps = $scope.result.data.loanTask.taskJumps;
		for(var i = 0, len = taskJumps.length; i < len; i++) {
			taskJumps[i].jumpReason = taskJumps[i].jumpReason.split(',');
		}
	}

	var dialogEvt = function($dialog) {
		var $reason = $dialog.find('#suggestion');
		$scope.$checks = $dialog.find('.checkbox').checking();
		// 复选框
		$scope.$checks.filter('.checkbox-normal').each(function() {
			var that = this;
			that.$checking.onChange(function() {
				//用于监听意见有一个选中，则标题项选中
				var flag = 0;
				var str = '';
				$(that).parent().parent().find('.checkbox-normal').each(function() {
					if($(this).attr('checked')) {
						str += $(this).data('value') + ',';
						flag++;
					}
				})
				str = '#' + str.substring(0, str.length - 1) + '#';				
				$reason.val(str);
				if(flag > 0) {
					$(that).parent().parent().find('.checkbox-radio').removeClass('checked').addClass('checked').attr('checked', true);
				} else {
					$reason.val('');
					$(that).parent().parent().find('.checkbox-radio').removeClass('checked').attr('checked', false);
				}
				$(that).parent().parent().siblings().find('.checkbox').removeClass('checked').attr('checked', false);

				// if()
			});
		})

		// 单选框
		$scope.$checks.filter('.checkbox-radio').each(function() {
			var that = this;
			that.$checking.onChange(function() {
				var value = $reason.val();
				$reason.val(value.substring(value.lastIndexOf('#', '')));
				$(that).parent().parent().find('.checkbox-normal').removeClass('checked').attr('checked', false);
				$(that).parent().parent().siblings().find('.checkbox').removeClass('checked').attr('checked', false);
			});
		})
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
					setupEvt(_tabTrigger, _type);
				}, true);
			}
			$scope.$el.$tabs.removeClass('role-item-active');
			$this.addClass('role-item-active');
			$scope.$el.$tbls.eq($scope.currentType).hide();
			$scope.$el.$tbls.eq(_type).show();
			$scope.currentType = _type;
		})
	}

	var setupEvt = function($self, _type) {

		/**
		 * 启动图片控件
		 */
		var imgsBars = $self.find('.credit-imgs-bar');
		imgsBars.each(function(index) {
			var $imgs = $(this).find('.uploadEvt.imgs'),
				$noimgs = $(this).find('.uploadEvt.noimgs');
			$imgs.imgUpload({
				viewable: true,
				markable: true,
				getimg: function(cb) {
					cb($scope.result.data.creditUsers[_type][index].loanUserCredit.creditMaterials)
				},
				marker: function (img, mark, cb) {
					console.log(img);
					console.log(mark);
					var params = {
						id: img.id,
						auditResult: mark
					}
					if(mark == 0) {
						params.auditOpinion = '';
					}
					$.ajax({
						type: 'post',
						url: $http.api('creditMaterials/material/mark', 'zyj'),
						global: false,
						data: params,
						dataType: 'json',
						success: $http.ok(function(result) {
							console.log(result);
							cb();
						})
					})
				},
				onclose: function(imgs) {
					console.log(imgs)
					$imgs.each(function(idx) {
						$(this).find('.imgs-error').remove();
						$(this).find('.imgs-item-upload').append(tool.imgs[imgs[idx].auditResult]);
					});
				}
			});

			$noimgs.imgUpload();
		});
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
		

		//首次载入
		$scope.firstLoad = true;
		loadOrderInfo($scope.currentType, function() {
			evt();
			setupSubmitBar();
			setupLocation();
			$scope.firstLoad = false;
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
