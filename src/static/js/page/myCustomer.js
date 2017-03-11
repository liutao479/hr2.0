'use strict';
page.ctrl('myCustomer', [], function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		// apiParams = {
		// 	loanOrderQuery: {
		// 		startDate:'',       //查询结束日期
		// 		endDate:'',         //查询结束日期
		// 	    busiSourceId:'',    //业务来源方ID
		// 	    carMode:'',         //车辆品牌
		// 	    deptId:'',          //分公司ID
		// 	    bankId:'',          //经办行ID
		// 	    orderStatus:'',     //进度
		// 	    orderNo:''   
		// 	},
		// 	page: {
		// 		pageNum: $params.pageNum || 2
		// 	}
		// };
		apiParams = {
			// category: 'creditMaterialsUpload',
			pageNum: $params.pageNum || 1
		};
	/**
	* 加载我的客户数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadCustomerList = function(params, cb) {
		$.ajax({
			url: $http.api('loanOrder/getMyCustomer', 'cyj'),
			type: 'post',
			data: params,
			dataType: 'json',
			success: $http.ok(function(result) {
				console.log(result);
				$scope.result = result;
				render.compile($scope.$el.$tbl, $scope.def.listTmpl, result.data.resultlist, true);
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
		$('.dateBtn').datepicker();
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
				orderNo: that.data('orderno')
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
						var _orderNo = that.data('orderno');
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
	var setupEvt = function() {


		// 绑定搜索框模糊查询事件
		$console.find('#searchInput').on('keydown', function(evt) {
			if(evt.which == 13) {
				var that = $(this),
					searchText = $.trim(that.val());
				if(!searchText) {
					return false;
				}
				apiParams.keyWord = searchText;
				$params.keyWord = searchText;
				apiParams.pageNum = 1;
				$params.pageNum = 1;
				loadCustomerList(apiParams, function() {
					delete apiParams.keyWord;
					delete $params.keyWord;
					that.blur();
				});
				// router.updateQuery($scope.$path, $params);
			}
		});
		//绑定搜索按钮事件
		$console.find('#search').on('click', function() {
			apiParams.pageNum = 1;
			$params.pageNum = 1;
			loadCustomerList(apiParams);
			// router.updateQuery($scope.$path, $params);
			
		});

		//绑定重置按钮事件
		$console.find('#search-reset').on('click', function() {
			// 下拉框数据以及输入框数据重置
			// router.updateQuery($scope.$path, $params);
			
		});


		
		// 订单列表的排序
		$console.find('#time-sort').on('click', function() {
			var that = $(this);
			if(!that.data('sort')) {
				apiParams.createTimeSort = 1;
				$params.createTimeSort = 1;
				loadCustomerList(apiParams, function() {
					that.data('sort', true);
					that.removeClass('time-sort-up').addClass('time-sort-down');
				});

			} else {
				delete apiParams.createTimeSort;
				delete $params.createTimeSort;
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
			console.log(that.data('orderno'))
			makeLoan(that);
			return false;
		});

		// 申请终止订单
		$console.find('#myCustomerTable .applyTerminate').on('click', function() {
			var that = $(this);
			var _orderNo = that.data('orderno');
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
			setupEvt();
		});
		setupDropDown();
		setupDatepicker();
	});

	$scope.paging = function(_pageNum, _size, $el, cb) {
		apiParams.pageNum = _pageNum;
		$params.pageNum = _pageNum;
		// router.updateQuery($scope.$path, $params);
		loadCustomerList(apiParams);
		cb();
	}

	/**dropdown 测试*/
	function setupDropDown() {
		$console.find('.select').dropdown();
	}

	var car = {
		brand: function(cb) {
			$.ajax({
				url: 'http://localhost:8083/mock/carBrandlist',
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
				url: 'http://localhost:8083/mock/carSeries',
				data: {brandId: brandId},
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
				url: 'http://localhost:8083/mock/carSpecs',
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
				// url: 'http://localhost:8083/mock/carSpecs',
				dataType: 'json',
				success: $http.ok(function(xhr) {
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
				data: {
					parentId: 99
				},
				dataType: 'json',
				success: $http.ok(function(xhr) {
					console.log(xhr)
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
					var sourceData = {
						items: xhr.data,
						id: 'bankId',
						name: 'bankName'
					};
					cb(sourceData);
				})
			})
		}
	}
});



