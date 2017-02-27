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
	* 编译翻单页栏
	*/
	var setupScroll = function(page, cb) {
		render.compile($scope.$el.$scrollBar, $scope.def.scrollBarTmpl, page, true);
		if(cb && typeof cb == 'function') {
			cb();
		}
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
				taskId: that.data('id'), 
				date: that.data('date'),
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
			$.ajax({
				type: "post",
				url: $http.api('LoanFinancePayment/get'),
				data:{
					orderNo: that.data('orderno')
					// orderNo: 'nfdb2015091812345678'
				},
				dataType:"json",
				success: $http.ok(function(data) {
					console.log(data)
					console.log('获取信息ok!');
					if(confirm('是否点击弹窗内的提交按钮？')) {
						$.ajax({
							type: "post",
							url: $http.api('LoanFinancePayment/update'),
							data:{
								orderNo: that.data('orderno'), //订单号
								loaningDate: new Date('2017-02-17 10:10'), //用款时间
								receiveCompanyAddress: '环球4S店（ldf测试）', //收款账户名称
								paymentMoney: 103620.0000, //垫资金额
								receiveAccount: '0571888805718888', //收款账号
								receiveAccountBank: '刘东风测试工行' //开户行
							},
							dataType:"json",
							success: $http.ok(function(result) {
								console.log(result)
								alert('提交成功！');
							})
						});
					}
				})
			});
			return false;
		});

		// 申请终止订单
		$console.find('#myCustomerTable .applyTerminate').on('click', function() {
			var that = $(this);
			var _orderNo = that.data('orderno');
			console.log(_orderNo)


			// 查询订单申请终止条数，若大于0则弹窗提示已提交终止订单申请，否则正常弹窗申请
			var loanOrderApplyCount = function() {
				$.ajax({
					type: "post",
					url: $http.api('loanOrderApply/count'),
					data:{
						orderNo: _orderNo
					},
					dataType:"json",
					success: $http.ok(function(result) {
						console.log(result);
						if(result.data > 0) {
							alert('该订单已提交终止订单申请！');
						} else {
							loanOrderApply();
						}
					})
				});
			} 
			// 申请终止订单弹窗提交
			var loanOrderApply = function() {
				// 弹窗
				if(confirm('确认申请终止该条订单：\n' + _orderNo + '，\n申请理由为：刘东风测试申请终止，\n审核人为1？')) {
					$.ajax({
						type: "post",
						url: $http.api('loanOrderApply/terminate'),
						data:{
							orderNo: _orderNo,
							applyReason: '刘东风测试申请终止',
							approvalId: 1    //当前登录审核用户的id
						},
						dataType:"json",
						success: $http.ok(function(result) {
							console.log(result)
							alert("申请成功！");
						}),
						error: function() {
							alert("申请失败！");
						}
					});
				}
			}
			loanOrderApplyCount();
			return false;
		});

		// 申请修改贷款信息
		$console.find('#myCustomerTable .applyModify').on('click', function() {
			var that = $(this);

			alert('前往订单号' + that.data('orderno') + '的页面？');
			// router.render(that.data('href'), {
			// 	taskId: that.data('id'), 
			// 	path: 'loanProcess'
			// });
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
		if($params.process) {
			
		}
		loadCustomerList(apiParams, function() {
			setupEvt();
		});
	});

	$scope.paging = function(_pageNum, _size, $el, cb) {
		apiParams.pageNum = _pageNum;
		$params.pageNum = _pageNum;
		// router.updateQuery($scope.$path, $params);
		loadCustomerList(apiParams);
		cb();
	}
});



