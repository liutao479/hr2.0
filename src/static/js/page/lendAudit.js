'use strict';
page.ctrl('lendAudit', function($scope) {
	var $params = $scope.$params,
		$console = $params.refer ? $($params.refer) : render.$console;

	/**
	* 设置面包屑
	*/
	var setupLocation = function() {
		if(!$scope.$params.path) return false;
		var $location = $console.find('#location');
		$location.data({
			backspace: $scope.$params.path,
			loanUser: $scope.result.data.loanTask.loanOrder.realName,
			current: $scope.result.data.loanTask.taskName,
			orderDate: $scope.result.data.loanTask.createDateStr
		});
		$location.location();
	}
	
	/**
	* 加载车贷办理数据
	* @params {object} params 请求参数 
	* @params {function} cb 回调函数
	*/
	var loadTabList = function(cb) {
		var params = {
			taskId: $params.taskId
		};
		$.ajax({
			type: 'post',
			url: $http.api('makeLoanApproval/index', 'jbs'),
			data: params,
			dataType: 'json',
			success: $http.ok(function(xhr) {
				$scope.result = xhr;
				setupLocation();
				loadGuide(xhr.cfgData)
				setupEvent();
				leftArrow();
				if(cb && typeof cb == 'function') {
					cb();
				}
			})
		})
	}

	/**
	 * 材料必填，必传检验(提交批量验证接口)
	 */
	function checkData(cb) {
		var data = {
			taskIds: []
		};
		data.taskIds.push($params.taskId);
		$.ajax({
			type: 'post',
			url: $http.api('tasks/validate', 'zyj'),
			dataType: 'json',
			data: JSON.stringify(data),
			contentType: 'application/json;charset=utf-8',
			success: $http.ok(function(result) {
				console.log(result);
				if(cb && typeof cb == 'function') {
					cb();
				}
			})
		})
	}
	
	/**
	* 加载左侧导航菜单
	* @params {object} cfg 配置对象
	*/
	function loadGuide(cfg) {
		render.compile($scope.$el.$tab, $scope.def.tabTmpl, cfg, true);
		var code = cfg.frames[0].code;
		var pageCode = subRouterMap[code];
		console.log(pageCode);
		var params = {
			code: code,
			orderNo: $params.orderNo,
			taskId: $params.taskId
		}
		router.innerRender('#innerPanel', 'loanProcess/' + pageCode, params);
		return listenGuide();
	}

	function listenGuide() {
		$console.find('.tabLeftEvt').on('click', function() {
			var $that = $(this);
			var code = $that.data('type');
			var pageCode = subRouterMap[code];
			if(!pageCode) return false;
			var params = {
				code: code,
				orderNo: $params.orderNo,
				taskId: $params.taskId
			}
			router.innerRender('#innerPanel', 'loanProcess/' + pageCode, params);
		})
	}

	var setupEvent = function() {
		$console.find('#checkTabs a').on('click', function() {
			$('.panel-menu-item').each(function(){
				$(this).removeClass('panel-menu-item-active');
			})
			var that = $(this);
			var idx = that.data('idx');
			that.addClass('panel-menu-item-active');
			leftArrow();
		});
	}
	var leftArrow = function(){
		$('.panel-menu-item').each(function(){
			$(this).find('.arrow').hide();
			if($(this).hasClass('panel-menu-item-active')){
				$(this).find('.arrow').show();
			}
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

		// /**
		//  * 申请平台垫资按钮
		//  */
		// $sub.on('applyAdvance', function() {
			
		// })

		// /**
		//  * 自行垫资按钮
		//  */
		// $sub.on('selfAdvance', function() {
			
		// })

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
									$.toast('处理成功！', function() {
										router.render('loanProcess');
									});
								})
							})
						}
					}
				}
			})
		})

		/**
		 * 审核通过
		 */
		$sub.on('approvalPass', function() {
			var $checked = $submitBar.find('.checkItem.checked');
			var advancedWay;
			
			if(!$checked) {
				return checkData(function() {
							process({});
						});
			}
			advancedWay = $checked.data('type');
			checkData(function() {
				switch (advancedWay) {
					case 0:
						noAdvance();
						break;
					case 1:
						selfAdvance();
						break;
					case 2:
						applyAdvance();
						break;
					default:
						break;
				};
			})
		})

	}

	/**
	 * 不垫资
	 */
	function noAdvance() {
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
						var that = this,
							reason = $.trim(that.$content.find('#suggestion').val());
						var _params = {
							orderNo: $params.orderNo,
							advancedWay: 0
						}
						process(_params, reason);
					}
				}
			}
		})
	}

	/**
	 * 自行垫资
	 */
	function selfAdvance() {
		getFinancePayment(function(data) {
			$.alert({
				title: '自行垫资',
				content: doT.template(dialogTml.wContent.selfAdvance)(data),
				onContentReady: function() {
					// this.$content.find('.uploadEvt').imgUpload();
					//启动用款时间日历控件
					this.$content.find('.dateBtn').datepicker({
						dateFmt: 'yyyy-MM-dd HH:mm',
						onpicked: function() {
						},
						oncleared: function() {
						}
					});
					// this.$content.find('.input-text input').on('focus', function() {
					// 	$(this).parent().find('.input-err').remove();
					// })

				},
				buttons: {
					close: {
						text: '取消',
						btnClass: 'btn-default btn-cancel'
					},
					ok: {
						text: '确定',
						action: function() {
							var that = this,
								flag = true,
								imgFlag = true,
								_params = {
									orderNo: $params.orderNo,
									advancedWay: 1
								},
								$inputs = that.$content.find('.input-text input'),
								reason = $.trim(that.$content.find('#suggestion').val());
							$inputs.each(function() {
								var value = $.trim($(this).val()),
									$parent = $(this).parent();
								if(!value) {
									$parent.removeClass('error-input').addClass('error-input');
									$parent.find('.input-err').remove();
									$parent.append('<span class="input-err">该项不能为空！</span>');
									flag = false;
								} else if(!regMap[$(this).data('type')].test(value)) {
									$parent.removeClass('error-input').addClass('error-input');
									$parent.find('.input-err').remove();
									// if($(this).data('type') == 'accountNumber') {
									// 	$parent.append('<span class="input-err">该项不符合输入规则！（16位或者19位卡号）</span>')
									// } else {
									// 	$parent.append('<span class="input-err">该项不符合输入规则！（10位汉字）</span>')
									// }
									$parent.append('<span class="input-err">该项不符合输入规则！</span>');
									flag = false;
								} else {
									$parent.removeClass('error-input');
									$parent.find('.input-err').remove();
									_params[$(this).data('key')] = value;
								}
							});
							// if(!$scope.imgUrl) {
							// 	that.$content.find('.uploadEvt').removeClass('error-input').addClass('error-input');
							// 	flag = false;
							// } else {
							// 	that.$content.find('.uploadEvt').removeClass('error-input');
							// 	_params.advanceCertificate = $scope.imgUrl;
							// }
							if(flag) {
								process(_params, reason);
								// $.ajax({
								// 	type: 'post',
								// 	url: $http.api('makeLoanApproval/submit/' + $params.taskId, 'zyj'),
								// 	data: params,
								// 	dataType: 'json',
								// 	success: $http.ok(function(result) {
								// 		console.log(result);
								// 		process(reason);
								// 	})
								// })
							} else {
								$.alert({
									title: '提示',
									content: tool.alert('请完善各项信息！'),
									buttons: {
										close: {
											text: '取消',
											btnClass: 'btn-default btn-cancel'
										},
										ok: {
											text: '确定',
											action: function() {

											}
										}
									}
								});
								return false;
							}
						}
					}
				}
			})
		})
	}

	/**
	 * 申请平台垫资
	 */
	function applyAdvance() {
		getFinancePayment(function(data) {
			$.alert({
				title: '申请平台垫资',
				content: doT.template(dialogTml.wContent.applyAdvance)(data),
				onContentReady: function() {
					//启动用款时间日历控件
					this.$content.find('.dateBtn').datepicker({
						dateFmt: 'yyyy-MM-dd HH:mm',
						onpicked: function() {
						},
						oncleared: function() {
						}
					});

					//单选框
					this.$content.find('.checkbox').checking();

					//查看文签
					this.$content.find('.view-sign').on('click', function() {
						$.ajax({
							type: 'post',
							url: $http.api('contract/view', true),
							dataType: 'json',
							data: {
								orderNo: $params.orderNo
							},
							success: $http.ok(function(xhr) {
								$.dialog({
									title: '代还款承诺函',
									content: doT.template(dialogTml.wContent.contract)(xhr.data)
								});
							})
						});
						
					});
				},
				buttons: {
					close: {
						text: '取消',
						btnClass: 'btn-default btn-cancel'
					},
					ok: {
						text: '确定',
						action: function() {
							var that = this,
								flag = true,
								imgFlag = true,
								_params = {
									orderNo: $params.orderNo,
									advancedWay: 2
								},
								$inputs = that.$content.find('.input-text input'),
								reason = $.trim(that.$content.find('#suggestion').val());
							$inputs.each(function() {
								var value = $.trim($(this).val()),
									$parent = $(this).parent();
								if(!value) {
									$parent.removeClass('error-input').addClass('error-input');
									$parent.find('.input-err').remove();
									$parent.append('<span class="input-err">该项不能为空！</span>');
									flag = false;
								} else if(!regMap[$(this).data('type')].test(value)) {
									$parent.removeClass('error-input').addClass('error-input');
									$parent.find('.input-err').remove();
									$parent.append('<span class="input-err">该项不符合输入规则！</span>');
									flag = false;
								} else {
									$parent.removeClass('error-input');
									$parent.find('.input-err').remove();
									_params[$(this).data('key')] = value;
								}
							});
							var isCheck = true;
							if(!that.$content.find('.checkbox').attr('checked')) {
								flag = false;
								isCheck = false;
							}
							// if(!$scope.imgUrl) {
							// 	that.$content.find('.uploadEvt').removeClass('error-input').addClass('error-input');
							// 	flag = false;
							// } else {
							// 	that.$content.find('.uploadEvt').removeClass('error-input');
							// 	_params.advanceCertificate = $scope.imgUrl;
							// }
							if(flag) {
								console.log(_params);
								if(!isCheck) {
									$.alert({
										title: '提示',
										content: tool.alert('请勾选《代还款承诺函》！'),
										buttons: {
											close: {
												text: '取消',
												btnClass: 'btn-default btn-cancel'
											},
											ok: {
												text: '确定',
												action: function() {

												}
											}
										}
									});
									return false;
								}
								process(_params, reason);
							} else {
								var content = '';
								if(!isCheck) {
									content = '请完善各项信息，并勾选《代还款承诺函》！';
								} else {
									content = '请完善各项信息！';
								}
								$.alert({
									title: '提示',
									content: tool.alert(content),
									buttons: {
										close: {
											text: '取消',
											btnClass: 'btn-default btn-cancel'
										},
										ok: {
											text: '确定',
											action: function() {

											}
										}
									}
								});
								return false;
							}
						}
					}
				}
			})
		});
		
	}

	/**
	 * 弹窗前获取信息
	 */
	function getFinancePayment(cb) {
		$.ajax({
			type: 'post',
			url: $http.api('financePayment/info', true),
			dataType: 'json',
			data: {
				orderNo: $params.orderNo
			},
			success: $http.ok(function(xhr) {
				console.log(xhr)
				if(cb && typeof cb == 'function') {
					cb(xhr.data);
				}
			})
		});
	}

	/***
	* 上传图片成功后的回调函数
	*/
	$scope.uploadcb = function(self) {
		self.$el.removeClass('error-input');
		$scope.imgUrl = $('.jconfirm .imgs-view').attr('src');
	}
	
	$scope.deletecb = function(self) {
		delete $scope.imgUrl;
	}

	/**
	* 退回原因选项分割
	*/
	var evt = function() {
		/**
		 * 订单退回的条件选项分割
		 */
		var taskJumps = $scope.result.data.loanTask.taskJumps;
		if(!taskJumps) return;
		for(var i = 0, len = taskJumps.length; i < len; i++) {
			taskJumps[i].jumpReason = taskJumps[i].jumpReason.split(',');
		}
	}

	/**
	 * 任务提交跳转
	 */
	function process(_params, reason) {
		console.log(_params);
		if(reason) {
			_params.reason = reason;
		}
		_params.frameCode = $scope.result.cfgData.frames[0].code;
		$.ajax({
			type: 'post',
			url: $http.api('makeLoanApproval/submit/' + $params.taskId, true),
			dataType: 'json',
			data: _params,
			success: $http.ok(function(xhr) {
				var taskIds = [];
				for(var i = 0, len = $params.tasks.length; i < len; i++) {
					taskIds.push($params.tasks[i].id);
				}
				var params = {
					taskId: $params.taskId,
					taskIds: taskIds,
					orderNo: $params.orderNo
				}
				if(reason) params.reason = reason;
				flow.tasksJump(params, 'approval');
			})
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
				var flag = 0,
					str = '',
					value = $reason.val(),
					reg = /[^#][^#]*[^#]/;
				$(that).parent().parent().find('.checkbox-normal').each(function() {
					if($(this).attr('checked')) {
						str += $(this).data('value') + ',';
						flag++;
					}
				})
				str = str.substring(0, str.length - 1);
				
				if(flag > 0) {
					$(that).parent().parent().find('.checkbox-radio').removeClass('checked').addClass('checked').attr('checked', true);
				} else {
					$(that).parent().parent().find('.checkbox-radio').removeClass('checked').attr('checked', false);
				}
				$(that).parent().parent().siblings().find('.checkbox').removeClass('checked').attr('checked', false);

				if(value && value.match(reg)) {
					$reason.val(value.replace(reg, str));
				} else {
					$reason.val('#' + str + '#' + $reason.val());
				}
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
	$console.load(router.template('iframe/phoneCheck'), function() {
		$scope.def.tabTmpl = $console.find('#checkResultTabsTmpl').html();
		$scope.$el = {
			$tab: $console.find('#checkTabs')
		}
		loadTabList(function() {
			evt();
			setupSubmitBar();
		});
	})
});



