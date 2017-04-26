'use strict';
page.ctrl('orderDetails', function($scope) {
	var $params = $scope.$params,
		$console = $params.refer ? $($params.refer) : render.$console;
	
	/**
	* 加载订单详情左侧列表项配置
	* @params {function} cb 回调函数
	*/
	var loadTabList = function(cb) {
		$.ajax({
			type: 'post',
			url: $http.api('orderDetail/info', 'jbs'),
			data: {
				orderNo: $params.orderNo,
				type: $params.type
			},
			dataType: 'json',
			success: $http.ok(function(xhr) {
				$scope.result = xhr;
				setupLocation();
				loadGuide(xhr.cfgData);
				if($params.type == 'OrderDetails') {
					render.compile($scope.$el.$buttonsPanel, $scope.def.buttonsTmpl, $params.btnStatus, true);
				}
				setupEvent();
				leftArrow();
				if(cb && typeof cb == 'function') {
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
			loanUser: $scope.result.data.loanTask.loanOrder.realName,
			current: $scope.result.data.loanTask.taskName,
			orderDate: $scope.result.data.loanTask.loanOrder.createDateStr,
			pmsDept: $scope.result.data.loanTask.loanOrder.pmsDept.name
		});
		$location.location();
	}

	/**
	* 加载左侧导航菜单
	* @params {object} cfg 配置对象
	*/
	function loadGuide(cfg) {
		render.compile($scope.$el.$tab, $scope.def.tabTmpl, cfg, true);
		if(cfg.frames.length == 1) {
			$scope.$el.$tab.remove();
			$console.find('#innerPanel').removeClass('panel-detail');
			$console.find('#commitPanel').removeClass('ml162');
		}
		var code = cfg.frames[0].code;
		var pageCode = subRouterMap[code];
		var params = {
			code: code,
			orderNo: $params.orderNo,
			type: $params.type
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
				type: $params.type
			}
			router.innerRender('#innerPanel', 'loanProcess/' + pageCode, params);
		})
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
	* 底部操作按钮区域
	*/	
	var loadCommitBar = function(cb) {
		var buttons = {};
		switch($params.type) {
			case 'ApplyModify':
				buttons = {
					submit: '提交申请'
				};
				break;
			case 'ApplyModifyApproval':
				buttons = {
					approvalPass: '审核通过',
					rejectModify: '拒绝修改'
				};
				break;
			case 'TerminationOrderApproval':
				buttons = {
					terminateOrder: '终止订单',
					keepOrder: '保留订单'
				};
				break;
		}
		
		var $commitBar = $console.find('#commitPanel');
		$commitBar.data({
			keepOrder: buttons.keepOrder,
			terminateOrder: buttons.terminateOrder,
			rejectModify: buttons.rejectModify,
			approvalPass: buttons.approvalPass,
			back: buttons.back,
			verify: buttons.verify,
			cancel: buttons.cancel,
			submit: buttons.submit
		});
		$commitBar.commitBar();

		//申请修改贷款信息（提交申请）
		$console.find('#submit').on('click', function() {
			$.confirm({
				title: '提交申请',
				content: dialogTml.wContent.applyModify.format('orderDetails'),
				onContentReady: function() {
					this.$content.find('.select').dropdown();
				},
				buttons: {
					close: {
						text: '取消',
						btnClass: 'btn-default btn-cancel'
					},
					ok: {
						text: '确定',
						action: function() {
							var that = this.$content;
							if(!$scope.approvalId) {
								$.alert({
									title: '提示',
									content: tool.alert('请选择审核人！'),
									buttons: {
										ok: {
											text: '确定'
										}
									}
								});
								return false;
							}
							modifySubmit(0, 0);
						}
					}
				}
			});
			delete $scope.approvalId;
		})

		//信息修改审核（拒绝修改）
		$console.find('#rejectModify').on('click', function() {
			$.confirm({
				title: '拒绝修改',
				content: dialogTml.wContent.rejectModify,
				buttons: {
					close: {
						text: '取消',
						btnClass: 'btn-default btn-cancel'
					},
					ok: {
						text: '确定',
						action: function() {
							var reason = $.trim(this.$content.find('#suggestion').val());
							if(!reason) {
								$.alert({
									title: '提示',
									content: tool.alert('审批意见不能为空！'),
									buttons: {
										ok: {
											text: '确定'
										}
									}
								});
								return false;
							}
							applySubmit(2, reason);
						}
					}
				}
			});
		})

		//信息修改审核（审核通过）
		$console.find('#approvalPass').on('click', function() {
			$.confirm({
				title: '审核通过',
				content: dialogTml.wContent.approvalPass,
				buttons: {
					close: {
						text: '取消',
						btnClass: 'btn-default btn-cancel'
					},
					ok: {
						text: '确定',
						action: function() {
							var reason = $.trim(this.$content.find('#suggestion').val());
							applySubmit(1, reason);
						}
					}
				}
			});
		})

		//终止订单审核（保留订单）
		$console.find('#keepOrder').on('click', function() {
			$.confirm({
				title: '保留订单',
				content: dialogTml.wContent.suggestion,
				onContentReady: function() {
					this.$content.find('#suggestion').attr('placeholder', '#建议保留此笔订单！#');
				},
				buttons: {
					close: {
						text: '取消',
						btnClass: 'btn-default btn-cancel'
					},
					ok: {
						text: '确定',
						action: function() {
							var reason = $.trim(this.$content.find('#suggestion').val());
							teminateSubmit(2, reason);
						}
					}
				}
			});
		})


		//终止订单审核（终止订单）
		$console.find('#terminateOrder').on('click', function() {
			$.confirm({
				title: '终止订单',
				content: dialogTml.wContent.suggestion,
				onContentReady: function() {
					this.$content.find('#suggestion').attr('placeholder', '请在此填写终止原因！');
				},
				buttons: {
					close: {
						text: '取消',
						btnClass: 'btn-default btn-cancel'
					},
					ok: {
						text: '确定',
						action: function() {
							var reason = $.trim(this.$content.find('#suggestion').val());
							if(!reason) {
								$.alert({
									title: '提示',
									content: tool.alert('终止原因不能为空！'),
									buttons: {
										ok: {
											text: '确定'
										}
									}
								});
								return false;
							}
							teminateSubmit(1, reason);
						}
					}
				}
			});
		})
	}

	/**
	 * 申请贷款信息修改，底部提交ajax
	 * @param  {number} type           //0 贷款信息修改申请  1 终止订单申请
	 * @param  {number} approvalStatus // 申请待审核 1同意申请 2拒绝申请
	 */
	function modifySubmit(type, approvalStatus, reason) {
		$.ajax({
			type: "post",
			url: $http.api('loanOrderApply/modify', 'cyj'),
			data: {
				orderNo: $params.orderNo,
				type: type,  //0 贷款信息修改申请  1 终止订单申请
				approvalStatus: approvalStatus, // 申请待审核 1同意申请 2拒绝申请
				approvalId: $scope.approvalId    //下拉审核用户的id
			},
			dataType:"json",
			success: $http.ok(function(result) {
				console.log(result)
				$.alert({
					title: '申请结果',
					content: tool.alert('申请' + (type == 0 ? '修改贷款信息' : '终止订单') + '成功！'),
					buttons: {
						ok: {
							text: '确定',
							action: function() {
								router.render($params.path);
							}
						}
					}
				});
			})
		});
	}

	/**
	 * 信息修改审核，底部提交ajax
	 * @param  {[type]} approvalStatus // 0申请待审核 1同意申请 2拒绝申请
	 */
	function applySubmit(approvalStatus, reason) {
		var params = {
			orderNo: $params.orderNo,
			approvalStatus: approvalStatus, // 申请待审核 1同意终止订单 2保留终止订单
		};
		if(!reason) {
			params.reason = reason;
		}
		$.ajax({
			type: "post",
			url: $http.api('loanOrderApply/approval', 'cyj'),
			data: params,
			dataType:"json",
			success: $http.ok(function(result) {
				console.log(result)
				//toast('贷款信息已更新！')
				if(approvalStatus == 1) {
					$.toast('贷款信息已更新！', function() {
						router.render($params.path);
					})
				} else {
					$.toast('已拒绝此次申请！', function() {
						router.render($params.path);
					})
				}
			})
		});
	}

	/**
	 * 终止订单审核底部提交ajax
	 * @param  {[type]} approvalStatus // 1同意终止订单 2保留终止订单
	 */
	function teminateSubmit(approvalStatus, reason) {
		var params = {
			orderNo: $params.orderNo,
			approvalStatus: approvalStatus, // 申请待审核 1同意终止订单 2保留终止订单
		};
		if(!reason) {
			params.reason = reason;
		}
		$.ajax({
			type: "post",
			url: $http.api('loanOrderApply/passOrCancelTeminate', 'cyj'),
			data: params,
			dataType:"json",
			success: $http.ok(function(result) {
				console.log(result)
				//toast('贷款信息已更新！')
				if(approvalStatus == 1) {
					$.toast('该订单已被终止！', function() {
						router.render($params.path);
					})
				} else {
					$.toast('处理成功！', function() {
						router.render($params.path);
					})
				}
			})
		});
	}

	/**
	 * 弹窗前获取信息
	 */
	function getFinancePayment(orderNo, cb) {
		$.ajax({
			type: 'post',
			url: $http.api('financePayment/info', true),
			dataType: 'json',
			data: {
				orderNo: orderNo
			},
			success: $http.ok(function(xhr) {
				console.log(xhr)
				if(cb && typeof cb == 'function') {
					cb(xhr.data);
				}
			})
		});
	}

	/**
	* 放款预约弹窗信息取得
	* isSure 是否是放款预约
	*/
	var makeLoan = function(orderNo, isSure) {
		getFinancePayment(orderNo, function(data) {
			$.confirm({
				title: '放款预约',
				content: isSure ? doT.template(dialogTml.wContent.makeLoanSure)(data) : doT.template(dialogTml.wContent.makeLoan)(data),
				onContentReady: function() {
					if(isSure) {
						this.$content.find('.uploadEvt').imgUpload();
					}
					//启动用款时间日历控件
					this.$content.find('.dateBtn').datepicker({
						dateFmt: 'yyyy-MM-dd HH:mm',
						onpicked: function() {
						},
						oncleared: function() {
						}
					});
					if(data.advanceCertificate) {
						$scope.imgUrl = data.advanceCertificate;
					}
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
									orderNo: orderNo
								},
								$inputs = that.$content.find('.input-text input');
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
							if(isSure) {
								if(!$scope.imgUrl) {
									that.$content.find('.uploadEvt .imgs-item-upload').removeClass('error-input').addClass('error-input');
									flag = false;
								} else {
									that.$content.find('.uploadEvt .imgs-item-upload').removeClass('error-input');
									_params.advanceCertificate = $scope.imgUrl;
								}
							}
							if(flag) {
								console.log(_params)
								if(isSure) {
									_params.paymentStatus = 1;
									makeloanSureSubmit(_params);
								} else {
									makeloanSubmit(_params);
								}
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
			});
		});
	}


	/**
	 * 加载立即处理事件
	 */
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

		// 放款预约
		$console.find('#makeLoan').on('click', function() {
			var that = $(this),
				orderNo = $params.orderNo;
			makeLoan(orderNo);
		});

		// 放款确认
		$console.find('#makeLoanSure').on('click', function() {
			var that = $(this),
				orderNo = $params.orderNo;
			makeLoan(orderNo, true);
		});

		// 申请终止订单
		$console.find('#applyTerminate').on('click', function() {
			var that = $(this),
				orderNo = $params.orderNo;
			loanOrderApplyCount(orderNo, 1, function() {
				applyTerminate(orderNo);
			});
		});

		// 申请修改贷款信息
		$console.find('#applyModify').on('click', function() {
			var that = $(this),
				orderNo = $params.orderNo;
			loanOrderApplyCount(orderNo, 0, function() {
				applyModify(orderNo, that);
			});
		});
	}

	/**
	 * 查询(申请终止订单、申请修改贷款信息)点击次数，若次数等于0则正常弹窗，否则弹窗提示（已提交申请！）
	 * @param  {string}   orderNo 订单号
	 * @param  {number}   type    0表示申请修改贷款信息，1表示申请终止订单
	 */
	function loanOrderApplyCount(orderNo, type, cb) {
		$.ajax({
			type: "post",
			url: $http.api('loanOrderApply/count', 'cyj'),
			data:{
				orderNo: orderNo,
				type: type
			},
			dataType:"json",
			success: $http.ok(function(result) {
				console.log(result);
				if(result.data > 0) {
					$.alert({
						title: '提示',
						content: tool.alert(result.msg + '！'),
						buttons: {
							ok: {
								text: '确定'
							}
						}
					});
				} else {
					if(cb && typeof cb == 'function') {
						cb();
					}
				}
			})
		});
	}

	/**
	 * 申请终止订单弹窗提交
	 * @param  {string} orderNo 订单号
	 */
	function applyTerminate(orderNo) {
		$.confirm({
			title: '申请终止订单',
			content: dialogTml.wContent.loanOrderApply.format('orderDetails'),
			onContentReady: function() {
				this.$content.find('.select').dropdown();
			},
			buttons: {
				close: {
					text: '取消',
					btnClass: 'btn-default btn-cancel'
				},
				ok: {
					text: '确定',
					action: function() {
						var flag = true,
							that = this.$content,
							applyReason = $.trim(this.$content.find('#suggestion').val());
						if(!applyReason) {
							flag = false;
							$.alert({
								title: '提示',
								content: tool.alert('请填写处理意见！'),
								buttons: {
									ok: {
										text: '确定'
									}
								}
							});
							return false;
						}
						if(!$scope.approvalId) {
							flag = false;
							$.alert({
								title: '提示',
								content: tool.alert('请选择审核人！'),
								buttons: {
									ok: {
										text: '确定'
									}
								}
							});
							return false;
						}
						if(flag) {
							var params = {
								orderNo: orderNo,
								applyReason: applyReason,
								approvalId: $scope.approvalId    //当前审核用户的id
							}
							console.log(params)
							$.ajax({
								type: "post",
								url: $http.api('loanOrderApply/terminate', 'cyj'),
								data: params,
								dataType:"json",
								success: $http.ok(function(result) {
									console.log(result)
									$.alert({
										title: '申请结果',
										content: tool.alert('申请终止订单成功！'),
										buttons: {
											ok: {
												text: '确定'
											}
										}
									});
								})
							});
						}
					}
				}
			}
		});
		delete $scope.approvalId;
	}


	/**
	 * 申请修改贷款信息跳转
	 */
	function applyModify(orderNo, that) {
		router.render(that.data('href'), {
			orderNo: orderNo,
			type: 'ApplyModify',
			path: 'myCustomer'
		});
	}

	/***
	* 加载页面模板
	*/
	$console.load(router.template('iframe/orderDetails'), function() {
		$scope.def = {
			tabTmpl: $console.find('#checkResultTabsTmpl').html(),
			buttonsTmpl: $console.find('#buttonsTmpl').html()
		}
		$scope.$el = {
			$tab: $console.find('#checkTabs'),
			$buttonsPanel: $console.find('#buttonsPanel')
		}
		loadTabList();
		loadCommitBar();
	})


	/**
	 * 下拉框点击回调
	 */
	$scope.approvalUserPicker = function(picked) {
		console.log(picked);
		$scope.approvalId = picked.id;
	}


	/**
	 * 下拉框请求数据
	 */
	$scope.dropdownTrigger = {
		approvalUser: function(t, p, cb) {
			// 用于获取审核人下拉框数据源
			$.ajax({
				type: 'post',
				url: $http.api('pmsUser/get', 'zyj'),
				dataType: 'json',
				data:{
					operation: 1 //1表示申请终止订单
				},
				success: $http.ok(function(xhr) {
					var sourceData = {
						items: xhr.data,
						id: 'id',
						name: 'name'
					};
					cb(sourceData);
				})
			})
		}
	}
});