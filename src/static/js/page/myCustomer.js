'use strict';
page.ctrl('myCustomer', [], function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		endDate = tool.formatDate(new Date().getTime()),
		startDate = tool.getPreMonth(endDate),
		apiParams = {
			startDate: startDate,       //查询结束日期
			endDate: endDate,         //查询结束日期
			pageNum: 1
		};

	/**
	* 加载我的客户数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadCustomerList = function(params, cb) {
		console.log(params);
		$.ajax({
			url: $http.api('loanOrder/getMyCustomer', 'cyj'),
			type: 'post',
			data: params,
			dataType: 'json',
			success: $http.ok(function(result) {
				console.log(result);
				$scope.result = result;
				render.compile($scope.$el.$tbl, $scope.def.listTmpl, result.data.resultlist, function() {
					setupEvt();
				}, true);
				setupPaging(result.page, true);
				setupScroll(result.page, function() {
					pageChangeEvt();
				});
				if(cb && typeof cb == 'function') {
					cb();
				}
			})
		})
	}
	/**
	* 构造分页
	*/
	var setupPaging = function(_page, isPage) {
		$scope.$el.$paging.data({
			current: parseInt(apiParams.pageNum),
			pages: isPage ? _page.pages : (tool.pages(_page.pages || 0, _page.pageSize)),
			size: _page.pageSize
		});
		$('#pageToolbar').paging();
	}

	/**
	* 日历控件
	*/
	var setupDatepicker = function() {
		$console.find('.dateBtn').datepicker({
			onpicked: function() {
				var that = $(this);
				apiParams[that.data('type')] = that.val();
			},
			oncleared: function() {
				delete apiParams[$(this).data('type')];
			}
		});
		$console.find('#dateStart').val(startDate);
		$console.find('#dateEnd').val(endDate);
	}

	/**
	* dropdown控件
	*/
	function setupDropDown() {
		$console.find('.select').dropdown();
	}

	/**
	* 编译翻单页栏
	*/
	var setupScroll = function(page, cb) {
		render.compile($scope.$el.$scrollBar, $scope.def.scrollBarTmpl, page, true);
		if(cb && typeof cb == 'function') {
			cb();
		}
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
	*/
	var makeLoan = function(orderNo) {
		$.ajax({
			type: "post",
			url: $http.api('financePayment/info', 'cyj'),
			data:{
				orderNo: orderNo
			},
			dataType:"json",
			success: $http.ok(function(result) {
				console.log(result);
				console.log('获取信息ok!');
				// var _paymentId = result.data.paymentId;
				$.confirm({
					title: '放款预约',
					content: doT.template(dialogTml.wContent.makeLoan)(result.data),
					onContentReady: function() {
						//启动用款时间日历控件
						this.$content.find('.dateBtn').datepicker({
							dateFmt: 'yyyy-MM-dd HH:mm',
							onpicked: function() {
							},
							oncleared: function() {
							}
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
										orderNo: orderNo
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
								if(flag) {
									process(_params, reason);
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


							////////////////////////////
								var isTrue = true,
									_orderNo = orderNo,
									that = this.$content;
								
								var _loaningDate = $.trim(that.find('#loaningDate').val());
								var _paymentMoney = $.trim(that.find('#paymentMoney').val());
								var _receiveCompanyAddress = $.trim(that.find('#receiveCompanyAddress').val());
								var _receiveAccount = $.trim(that.find('#receiveAccount').val());
								var _receiveAccountBank = $.trim(that.find('#receiveAccountBank').val());

								console.log(that.find('.required'))
								that.find('.required').each(function() {
									var value = $.trim($(this).val()),
										$parent = $(this).parent();
									console.log(value)
									if(!value){
										$parent.removeClass("error-input").addClass("error-input");
										$parent.append('<span class=\"input-err\">请完善该必填项！</span>');
										console.log($(this).index());
										isTrue = false;
									} else {

									}
								})
								if(isTrue) {
									var _params = {
										orderNo: _orderNo, //订单号
										paymentId: _paymentId,
										loaningDate: new Date(_loaningDate), //用款时间
										paymentMoney: _paymentMoney, //垫资金额
										receiveCompanyAddress: _receiveCompanyAddress, //收款账户名称
										receiveAccount: _receiveAccount, //收款账号
										receiveAccountBank: _receiveAccountBank //开户行
									}
									console.log(_params)
									// makeloanSubmit(_params);
								}
								return false;
							}
						}
					}
				});
			})
		})
	}

	/**
	 * 放款预约提交
	 */
	var makeloanSubmit = function(params) {
		$.ajax({
			type: "post",
			url: $http.api('financePayment/update', 'cyj'),
			data: params,
			dataType: "json",
			success: $http.ok(function(result) {
				console.log(result)
			})
		});
	}


	/**
	 * 首次加载页面绑定立即处理事件
	 */
	var evt = function() {
		// 绑定搜索框模糊查询事件
		$console.find('#searchInput').on('keydown', function(evt) {
			if(evt.which == 13) {
				var that = $(this),
					searchText = $.trim(that.val());
				if(!searchText) {
					return false;
				}
				apiParams.keyWord = searchText;
				apiParams.pageNum = 1;
				loadCustomerList(apiParams, function() {
					that.blur();
				});
			}
		});

		// 文本框失去焦点记录文本框的值
		$console.find('#searchInput').on('blur', function(evt) {
			var that = $(this),
				searchText = $.trim(that.val());
			if(!searchText) {
				delete apiParams.keyWord;
				return false;
			} else {
				apiParams.keyWord = searchText;
			}
		});

		//绑定搜索按钮事件
		$console.find('#search').on('click', function() {
			apiParams.pageNum = 1;
			loadCustomerList(apiParams);
		});

		//绑定重置按钮事件
		$console.find('#search-reset').on('click', function() {
			// 下拉框数据以及输入框数据重置
			$console.find('.select input').val('');
			$console.find('#searchInput').val('');
			$console.find('#dateStart').val(startDate);
			$console.find('#dateEnd').val(endDate);
			apiParams = {
				startDate: startDate,       //查询结束日期
				endDate: endDate,         //查询结束日期
				pageNum: 1
			};
		});

		// 订单列表的排序
		$console.find('#time-sort').on('click', function() {
			var that = $(this);
			if(!that.data('sort')) {
				apiParams.createTimeSort = 1;
				loadCustomerList(apiParams, function() {
					that.data('sort', true);
					that.removeClass('time-sort-up').addClass('time-sort-down');
				});

			} else {
				delete apiParams.createTimeSort;
				loadCustomerList(apiParams, function() {
					that.data('sort', false);
					that.removeClass('time-sort-down').addClass('time-sort-up');
				});
			}
		});
	}

	/**
	 * 绑定立即处理事件
	 */
	var setupEvt = function() {		

		// 去往订单详情页面
		$console.find('#myCustomerTable .orders-detail').on('click', function() {
			var that = $(this);
			router.render(that.data('href'), {
				orderNo: that.data('orderNo'),
				type: 'OrderDetails',
				path: 'myCustomer'
			});
		});

		// 订单当前进度的展开与隐藏
		$console.find('#myCustomerTable .spread-tips').on('click', function() {
			var that = $(this);
			var $status = that.parent().find('.status-value');
			var $iconfont = that.find('.iconfont');
			if(!that.data('trigger')) {
				$status.show();
				$iconfont.html('&#xe601;');
				that.data('trigger', true);
			} else {
				$status.hide().eq(0).show();
				$iconfont.html('&#xe670;');
				that.data('trigger', false);
			}
			return false;
		})


		// 放款预约
		$console.find('#myCustomerTable .makeLoan').on('click', function() {
			var that = $(this),
				orderNo = that.data('orderNo');
			makeLoan(orderNo);
			return false;
		});

		// 申请终止订单
		$console.find('#myCustomerTable .applyTerminate').on('click', function() {
			var that = $(this),
				orderNo = that.data('orderNo');
			loanOrderApplyCount(orderNo, 1, function() {
				applyTerminate(orderNo);
			});
			return false;
		});

		// 申请修改贷款信息
		$console.find('#myCustomerTable .applyModify').on('click', function() {
			var that = $(this),
				orderNo = that.data('orderNo');
			loanOrderApplyCount(orderNo, 0, function() {
				applyModify(orderNo, that);
			});
			return false;
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
			content: dialogTml.wContent.loanOrderApply.format('myCustomer'),
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
								approvalId: $scope.approvalId    //下拉审核用户的id
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
		return false;
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

	// 绑定翻页栏（上下页）按钮事件
	var pageChangeEvt = function() {
		$console.find('.page-change').on('click', function() {
			var that = $(this);
			var _pageNum = parseInt($scope.$el.$scrollBar.find('#page-num').text());
			if(that.hasClass('disabled')) return;
			if(that.hasClass('scroll-prev')) {
				apiParams.pageNum = _pageNum - 1;
			} else if(that.hasClass('scroll-next')) {
				apiParams.pageNum = _pageNum + 1;
			}
			loadCustomerList(apiParams);
		});
	}

	/***
	* 加载页面模板
	*/
	render.$console.load(router.template('iframe/my-customer'), function() {
		$scope.def.listTmpl = render.$console.find('#myCustomerListTmpl').html();
		$scope.def.scrollBarTmpl = render.$console.find('#scrollBarTmpl').html();
		$scope.$el = {
			$tbl: $console.find('#myCustomerTable'),
			$paging: $console.find('#pageToolbar'),
			$scrollBar: $console.find('#scrollBar')
		}
		
		loadCustomerList(apiParams, function() {
			evt();
		});
		setupDropDown();
		setupDatepicker();
	});

	/**
	 * 分页请求数据回调
	 */
	$scope.paging = function(_pageNum, _size, $el, cb) {
		apiParams.pageNum = _pageNum;
		loadCustomerList(apiParams);
		cb();
	}

	/**
	 * 下拉框点击回调
	 */
	//业务来源方
	$scope.busiSourcePicker = function(picked) {
		if(picked.id == '全部') {
			delete apiParams.busiSourceId;
			return false;
		}
		apiParams.busiSourceId = picked.id;
	}
	//车辆品牌
	$scope.carPicker = function(picked) {
		console.log(picked)
		if(picked.id == '全部') {
			delete apiParams.carName;
			return false;
		}
		apiParams.carName = picked['品牌'].name + '-' + picked['车系'].name + '-' + picked['车型'].name;
		console.log(apiParams.carName)
	}
	//分公司ID
	$scope.deptCompanyPicker = function(picked) {
		if(picked.id == '全部') {
			delete apiParams.deptId;
			return false;
		}
		apiParams.deptId = picked.id;
	}
	//经办行ID
	$scope.demandBankPicker = function(picked) {
		if(picked.id == '全部') {
			delete apiParams.demandBankId;
			return false;
		}
		apiParams.demandBankId = picked.id;
	}
	//进度id
	$scope.categoryPicker = function(picked) {
		if(picked.id == '全部') {
			delete apiParams.category;
			return false;
		}
		apiParams.category = picked.id;
	}

	//审核人
	$scope.approvalUserPicker = function(picked) {
		console.log(picked);
		$scope.approvalId = picked.id;
	}

	var car = {
		brand: function(cb) {
			$.ajax({
				type: 'post',
				url: $http.api('car/carBrandList', 'jbs'),
				dataType: 'json',
				success: $http.ok(function(xhr) {
					var sourceData = {
						items: xhr.data,
						id: 'brandId',
						name: 'carBrandName'
					}
					cb(sourceData);
				})
			})
		},
		series: function(brandId, cb) {
			$.ajax({
				type: 'post',
				url: $http.api('car/carSeries', 'jbs'),
				dataType: 'json',
				data: {
					brandId: brandId
				},
				success: $http.ok(function(xhr) {
					var sourceData = {
						items: xhr.data,
						id: 'id',
						name: 'serieName'
					}
					cb(sourceData);
				})
			})
		},
		specs: function(seriesId, cb) {
			$.ajax({
				type: 'post',
				url: $http.api('car/carSpecs', 'jbs'),
				dataType: 'json',
				data: {
					serieId: seriesId
				},
				success: $http.ok(function(xhr) {
					var sourceData = {
						items: xhr.data,
						id: 'carSerieId',
						name: 'specName'
					};
					cb(sourceData);
				})
			})
		}
	}

	$scope.dropdownTrigger = {
		car: function(tab, parentId, cb) {
			if(!cb && typeof cb != 'function') {
				cb = $.noop;
			}
			if(!tab) return cb();
			switch (tab) {
				case '品牌':
					car.brand(cb);
					break;
				case "车系":
					car.series(parentId, cb);
					break;
				case "车型":
					car.specs(parentId, cb);
					break;
				default:
					break;
			}
		},
		busiSource: function(t, p, cb) {
			$.ajax({
				type: 'post',
				url: $http.api('carshop/list', 'zyj'),
				dataType: 'json',
				success: $http.ok(function(xhr) {
					xhr.data.unshift({
						value: '全部',
						name: '全部'
					});
					var sourceData = {
						items: xhr.data,
						id: 'value',
						name: 'name'
					};
					cb(sourceData);
				})
			})
		},
		deptCompany: function(t, p, cb) {
			$.ajax({
				type: 'get',
				url: $http.api('pmsDept/getPmsDeptList', 'zyj'),
				dataType: 'json',
				success: $http.ok(function(xhr) {
					xhr.data.unshift({
						id: '全部',
						name: '全部'
					});
					var sourceData = {
						items: xhr.data,
						id: 'id',
						name: 'name'
					};
					cb(sourceData);
				})
			})
		},
		demandBank: function(t, p, cb) {
			$.ajax({
				type: 'post',
				url: $http.api('demandBank/selectBank', 'zyj'),
				dataType: 'json',
				success: $http.ok(function(xhr) {
					xhr.data.unshift({
						id: '全部',
						bankName: '全部'
					});
					var sourceData = {
						items: xhr.data,
						id: 'id',
						name: 'bankName'
					};
					cb(sourceData);
				})
			})
		},
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
		},
		category: function(t, p, cb) {
			$.ajax({
				type: 'post',
				url: $http.api('product/taskNameCode', 'zyj'),
				dataType: 'json',
				success: $http.ok(function(xhr) {
					xhr.data.unshift({
						taskNameCode: '全部',
						taskName: '全部'
					});
					var sourceData = {
						items: xhr.data,
						id: 'taskNameCode',
						name: 'taskName'
					};
					cb(sourceData);
				})
			})
		}
	}
});



