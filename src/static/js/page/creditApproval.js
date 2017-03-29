'use strict';
page.ctrl('creditApproval', [], function($scope) {
	var $console = render.$console,
		$params = $scope.$params;
	$scope.tabs = {};
	$scope.idx = 0;
	$scope.apiParams = [];

	/**
	* 设置面包屑
	*/
	var setupLocation = function() {
		if(!$scope.$params.path) return false;
		var $location = $console.find('#location');
		$location.data({
			backspace: $scope.$params.path,
			loanUser: $scope.result.data.loanTask.loanOrder.realName,
			current: '征信预审核',
			orderDate: $scope.result.data.loanTask.createDateStr
		});
		$location.location();
	}

	/**
	* 加载征信预审核数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadOrderInfo = function(idx, cb) {
		$.ajax({
			// url: 'http://127.0.0.1:8083/mock/creditInput',
			type: 'post',
			url: $http.api('creditUser/getCreditInfo', 'jbs'),
			data: {
				taskId: $params.taskId,
				frameCode: 'T0061'
			},
			dataType: 'json',
			success: $http.ok(function(result) {
				console.log(result);
				result.index = idx;
				$scope.result = result;
				$scope.result.editable = 0;
				console.log($scope.result)
				// 编译tab栏
				setupTab($scope.result, function() {
					setupTabEvt();
				});

				// 编译tab项对应内容
				setupCreditPanel(idx, $scope.result);

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
	var setupTab = function(result, cb) {
		result.types = ['借款人', '共同还款人', '反担保人'];
		result.format = {
			'ZJR': 0,
			'GTHKR': 1,
			'FDBR': 2
		};
		render.compile($scope.$el.$tab, $scope.def.tabTmpl, result, true);
		$scope.$el.$tabs = $scope.$el.$tab.find('.tabEvt');

		if(cb && typeof cb == 'function') {
			cb();
		}
	}

	/**
	 * 渲染tab栏对应项内容
	 * @param  {object} result 请求获得的数据
	 */
	var setupCreditPanel = function(idx, result, cb) {
		// 编译对应idx的tab项内容，将目标编译tab项内容页显示，隐藏其他tab项内容
		var _tabTrigger = $scope.$el.$tbls.eq(idx);
		$scope.tabs[idx] = _tabTrigger;
		render.compile(_tabTrigger, $scope.def.listTmpl, result, function() {
			setupEvt(_tabTrigger);
		}, true);
		for(var i = 0, len = $scope.$el.$tbls.length; i < len; i++) {
			if(i == idx) {
				$scope.$el.$tbls.eq(i).show();
			} else {
				$scope.$el.$tbls.eq(i).hide();
			}
		}
		$scope.currentType = idx;
		if( cb && typeof cb == 'function' ) {
			cb();
		}
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
				render.compile(_tabTrigger, $scope.def.listTmpl, $scope.result, function() {
					setupEvt(_tabTrigger);
				}, true);
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
	var setupEvt = function($el) {
		$el.find('.uploadEvt').imgUpload();
	}

	/**
	* 设置底部按钮操作栏
	*/
	var setupSubmitBar = function() {
		var $submitBar = $console.find('#submitBar');
		$submitBar.data({
			taskId: $params.taskId
		});
		$submitBar.submitBar(function($el) {
			evt($el);
			// /**
			//  * 取消订单按钮
			//  */
			// $el.find('#cancelOrder').on('click', function() {
			// 	$.alert({
			// 		title: '取消订单',
			// 		content: tool.alert('确定要取消该笔贷款申请吗？'),
			// 		buttons: {
			// 			close: {
			// 				text: '取消',
			// 				btnClass: 'btn-default btn-cancel'
			// 			},
			// 			ok: {
			// 				text: '确定',
			// 				action: function () {
			// 					var params = {
			// 						orderNo: $params.orderNo
			// 					}
			// 					var reason = $.trim(this.$content.find('#suggestion').val());
			// 					if(reason) params.reason = reason;
			// 					$.ajax({
			// 						type: 'post',
			// 						url: $http.api('loanOrder/cancel', 'zyj'),
			// 						data: params,
			// 						dataType: 'json',
			// 						success: $http.ok(function(result) {
			// 							console.log(result);
			// 							if(cb && typeof cb == 'function') {
			// 								cb();
			// 							}
			// 						})
			// 					})
			// 				}
			// 			}
			// 		}
			// 	})
			// })

			// /**
			//  * 提交按钮
			//  */
			// $el.find('#taskSubmit').on('click', function() {
			// 	saveData(function() {
			// 		process();
			// 	});
			// });
		});
	}

	/**
	* 底部按钮操作栏事件
	*/
	var evt = function($el) {
		/**
		 * 订单退回的条件选项分割
		 */
		var taskJumps = $scope.result.data.loanTask.taskJumps;
		for(var i = 0, len = taskJumps.length; i < len; i++) {
			taskJumps[i].jumpReason = taskJumps[i].jumpReason.split(',');
		}

		/**
		 * 退回订单按钮
		 */
		$el.find('#backOrder').on('click', function() {
			var that = $(this);
			console.log($scope.result.data.loanTask.taskJumps)
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
									$scope.jumpId = $(this).data('id');
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
									
									// router.render('loanProcess');
									// toast.hide();
								})
							})
						}
					}
				}
			})
		});

		/**
		 * 拒绝受理按钮
		 */
		$el.find('#rejectOrder').on('click', function() {
			$.confirm({
				title: '拒绝受理',
				content: dialogTml.wContent.suggestion,
				buttons: {
					'取消': {
			            action: function () {}
			        },
			        '确定': {
			            action: function () {
	            			var _reason = $.trim(this.$content.find('#suggestion').val());
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
							$.ajax({
								type: 'post',
								url: $http.api('loanOrder/terminate', 'zyj'),
								data: {
									orderNo: $params.orderNo,
									reason: _reason
								},
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
			});
		})

		/**
		 * 审核通过按钮
		 */
		$el.find('#approvalPass').on('click', function() {
			process();
		})
	}

	/**
	 * 跳流程
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
							taskIds.push(parseInt($params.tasks[0].id));
						}
						var params = {
							taskIds: taskIds,
							orderNo: $params.orderNo
						}
						var reason = $.trim(this.$content.find('#suggestion').val());
						if(reason) params.reason = reason;
						tasksJump(params, 'approval');
					}
				}
			}
		})
	}

	/**
	 * 取消订单弹窗内事件逻辑处理
	 */
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
				$reason.val('');
				$(that).parent().parent().find('.checkbox-normal').removeClass('checked').attr('checked', false);
				$(that).parent().parent().siblings().find('.checkbox').removeClass('checked').attr('checked', false);
			});
		})
	}



	/***
	* 加载页面模板
	*/
	render.$console.load(router.template('iframe/credit-result-typing'), function() {
		$scope.def = {
			tabTmpl: $console.find('#creditResultTabsTmpl').html(),
			listTmpl: $console.find('#creditResultListTmpl').html()
		}
		$scope.$el = {
			$tbls: $console.find('#creditResultPanel > .tabTrigger'),
			$tab: $console.find('#creditTabs'),
			$paging: $console.find('#pageToolbar')
		}
		loadOrderInfo($scope.idx, function() {
			setupLocation();
			setupSubmitBar();
		});
		
	});

});