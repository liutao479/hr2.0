'use strict';
page.ctrl('myCustomer', [], function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		endDate = tool.formatDate(new Date().getTime()),
		startDate = tool.getPreMonth(endDate),
		apiParams = {
			startDate: new Date(startDate),       //查询结束日期
			endDate: new Date(endDate),         //查询结束日期
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
				apiParams[that.data('type')] = new Date(that.val());
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
	* 放款预约弹窗信息取得
	*/
	var makeLoan = function(that) {
		$.ajax({
			type: "post",
			url: $http.api('financePayment/get', 'cyj'),
			data:{
				orderNo: that.data('orderNo')
				// orderNo: 'nfdb2015091812345678'
			},
			dataType:"json",
			success: $http.ok(function(result) {
				console.log(result);
				console.log('获取信息ok!');
				var _paymentId = result.paymentId;
				that.openWindow({
					title: '放款预约',
					content: dialogTml.wContent.makeLoan,
					commit: dialogTml.wCommit.cancelSure,
					data: result.data
				}, function($dialog) {
					$dialog.find('.w-sure').on('click', function() {
						var isTrue = true;
						var _orderNo = that.data('orderNo');
						var _loaningDate = $dialog.find('#loaningDate').val();
						var _paymentMoney = $dialog.find('#paymentMoney').val();
						var _receiveCompanyAddress = $dialog.find('#receiveCompanyAddress').val();
						var _receiveAccount = $dialog.find('#receiveAccount').val();
						var _receiveAccountBank = $dialog.find('#receiveAccountBank').val();
						$dialog.find('.required').each(function() {
							var value = $(this).val();
							console.log(value)
							if(!value){
								$(this).parent().addClass("error-input");
								$(this).after('<i class="error-input-tip">请完善该必填项</i>');
								console.log($(this).index());
								isTrue = false;
								return false;
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
							makeloanSubmit(_params, $dialog);
						}
					})
				})
			})
		})
	}

	/**
	 * 放款预约提交
	 */
	var makeloanSubmit = function(params, $dialog) {
		$.ajax({
			type: "post",
			url: $http.api('financePayment/update', 'cyj'),
			data: params,
			dataType: "json",
			success: $http.ok(function(result) {
				console.log(result)
				$dialog.remove();
			})
		});
	}


	/**
	 * 绑定立即处理事件
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
				startDate: new Date(startDate),       //查询结束日期
				endDate: new Date(endDate),         //查询结束日期
				pageNum: 1
			};
		});
	}

	/**
	 * 绑定立即处理事件
	 */
	var setupEvt = function() {		
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

		// 去往订单详情页面
		$console.find('#myCustomerTable .orders-detail').on('click', function() {
			var that = $(this);
			router.render(that.data('href'), {
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
			var that = $(this);
			console.log(that.data('orderNo'))
			makeLoan(that);
			return false;
		});

		// 申请终止订单
		$console.find('#myCustomerTable .applyTerminate').on('click', function() {
			var that = $(this);
			var _orderNo = that.data('orderNo');
			console.log(_orderNo)


			// 查询订单申请终止条数，若大于0则弹窗提示已提交终止订单申请，否则正常弹窗申请
			var loanOrderApplyCount = function(that) {
				$.ajax({
					type: "post",
					url: $http.api('loanOrderApply/count', 'cyj'),
					data:{
						orderNo: _orderNo
					},
					dataType:"json",
					success: $http.ok(function(result) {
						console.log(result);
						if(result.data > 0) {
							that.openWindow({
								title: '提示',
								content: '<div>该订单已提交订单申请！</div>'
							});
						} else {
							loanOrderApply(that);
						}
					})
				});
			} 
			// 申请终止订单弹窗提交
			var loanOrderApply = function(that) {

				that.openWindow({
					title: '申请终止订单',
					content: dialogTml.wContent.loanOrderApply,
					commit: dialogTml.wCommit.cancelSure
				}, function($dialog) {

					// 用于获取审核人下拉框数据源
					$.ajax({
						type: "post",
						url: $http.api('pmsUser/get', 'cyj'),
						data:{
							orgId: 99,
							operation: 1 //1表示申请终止订单
						},
						dataType:"json",
						success: $http.ok(function(result) {
							console.log(result)
						})
					});
					$dialog.find('.w-sure').on('click', function() {
						$dialog.remove();
						$.ajax({
							type: "post",
							url: $http.api('loanOrderApply/terminate', 'cyj'),
							data:{
								orderNo: _orderNo,
								applyReason: $dialog.find('#suggestion').val(),
								approvalId: 30000    //当前登录审核用户的id
							},
							dataType:"json",
							success: $http.ok(function(result) {
								console.log(result)
								that.openWindow({
									title: '申请结果',
									content: '<div>申请终止订单成功！</div>'
								})
							})
						});
						
					})
				})
			}
			loanOrderApplyCount(that);
			return false;
		});

		// 申请修改贷款信息
		$console.find('#myCustomerTable .applyModify').on('click', function() {
			var that = $(this);
			router.render(that.data('href'), {
				path: 'loanProcess'
			});
			return false;
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
				$params.pageNum = _pageNum - 1;
			} else if(that.hasClass('scroll-next')) {
				apiParams.pageNum = _pageNum + 1;
				$params.pageNum = _pageNum + 1;
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
		// if(picked.id == '全部') {
		// 	delete apiParams.carMode;
		// 	return false;
		// }
		apiParams.carMode = picked.name;
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
			delete apiParams.bankId;
			return false;
		}
		apiParams.bankId = picked.id;
	}
	//进度id
	$scope.categoryPicker = function(picked) {
		if(picked.id == '全部') {
			delete apiParams.category;
			return false;
		}
		apiParams.category = picked.id;
	}

	var car = {
		brand: function(cb) {
			$.ajax({
				type: 'post',
				url: $http.api('car/carBrandList', 'jbs'),
				dataType: 'json',
				success: function(xhr) {
					var sourceData = {
						items: xhr.data,
						id: 'brandId',
						name: 'carBrandName'
					}
					cb(sourceData);
				}
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
				success: function(xhr) {
					var sourceData = {
						items: xhr.data,
						id: 'id',
						name: 'serieName'
					}
					cb(sourceData);
				}
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
				success: function(xhr) {
					var sourceData = {
						items: xhr.data,
						id: 'carSerieId',
						name: 'specName'
					};
					cb(sourceData);
				}
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
						bankId: '全部',
						bankName: '全部'
					});
					var sourceData = {
						items: xhr.data,
						id: 'bankId',
						name: 'bankName'
					};
					cb(sourceData);
				})
			})
		},
		category: function(t, p, cb) {
			var data = [
				{
					id: '全部',
					name: '全部'
				},
				{
					id: 'creditMaterialsUpload',
					name: '征信材料上传'
				},
				{
					id: 'creditInput',
					name: '征信结果录入'
				},
				{
					id: 'creditApproval',
					name: '征信预审核'
				},
				{
					id: 'cardInfoInput',
					name: '贷款信息录入'
				},
				{
					id: 'usedCarInfoInput',
					name: '二手车信息录入'
				},
				{
					id: 'loanMaterialsChoose',
					name: '贷款材料选择'
				},
				{
					id: 'busiModeChoose',
					name: '业务模式选择'
				},
				{
					id: 'homeMaterialsUpload',
					name: '上门材料上传'
				},
				{
					id: 'signMaterialsUpload',
					name: '签约材料上传'
				},
				{
					id: 'loanMaterialsUpload',
					name: '贷款材料上传'
				},
				{
					id: 'advanceMaterialsUpload',
					name: '垫资材料上传'
				},
				{
					id: 'loanTelApproval',
					name: '电审'
				},
				{
					id: 'loanApproval',
					name: '贷款审核'
				},
				{
					id: 'makeLoanApproval',
					name: '放款审核'
				},
				{
					id: 'pickMaterialsUpload',
					name: '提车材料上传'
				},
				{
					id: 'pickMaterialsApproval',
					name: '提车审核'
				},
			];
			var sourceData = {
				items: data,
				id: 'id',
				name: 'name'
			};
			cb(sourceData);
		}
	}
});



