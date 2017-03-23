'use strict';
page.ctrl('organizationManage', [], function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		apiParams = {
			// organId: 99,  //机构id(登录用户)
			pageNum: 1
		};
	$scope.tabs = ['合作银行管理', '合作车商管理'];
	$scope.idx = 0;
	$scope.btn = [
		{
			'organizationManage/newBank': '新建合作银行'
		},
		{
			'organizationManage/newCar': '新建合作车商'
		}
	];

	/**
	* 加载合作银行数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadBankList = function(params, cb) {
		$.ajax({
			url: $http.api('demandBank/getList', 'cyj'),
			type: 'post',
			data: params,
			dataType: 'json',
			success: $http.ok(function(result) {
				console.log(result);
				render.compile($scope.$el.$tbl, $scope.def.bankListTmpl, result.data.resultlist, true);
				setupPaging(result.page, true);
				setupBankEvt();
				if(cb && typeof cb == 'function') {
					cb();
				}
			})
		})
	}

	/**
	* 加载合作车商数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadCarList = function(params, cb) {
		console.log(params)
		$.ajax({
			url: $http.api('demandCarShop/get', 'cyj'),
			type: 'post',
			data: params,
			dataType: 'json',
			success: $http.ok(function(result) {
				result.data.shopTypeName = $scope.shopTypeName  || '';
				result.data.shopName = $scope.shopName || '';
				console.log(result);
				render.compile($scope.$el.$tbl, $scope.def.carListTmpl, result.data, true);
				setupPaging(result.page, true);
				setupCarEvt();
				if(cb && typeof cb == 'function') {
					cb();
				}
			})
		})
	}

	/**
	* dropdown控件
	*/
	function setupDropDown() {
		$console.find('.select').dropdown();
	}

	/**
	 * 删除合作银行
	 */
	 var deleteBank = function(params, cb) {
	 	$.ajax({
			url: $http.api('demandBank/del', 'cyj'),
			type: 'post',
			data: params,
			dataType: 'json',
			success: $http.ok(function(result) {
				console.log(result);
				if(cb && typeof cb == 'function') {
					cb();
				}
			})
		})
	 }

	 /**
	 * 删除合作车商
	 */
	 var deleteCar = function(params, cb) {
	 	$.ajax({
			url: $http.api('demandCarShop/del', 'cyj'),
			type: 'post',
			data: params,
			dataType: 'json',
			success: $http.ok(function(result) {
				console.log(result);
				if(cb && typeof cb == 'function') {
					cb();
				}
			})
		})
	 }

	/**
	* 构造分页
	*/
	var setupPaging = function(count, isPage) {
		$scope.$el.$paging.data({
			current: parseInt(count.pageNum),
			pages: isPage ? count.pages : (tool.pages(count.pages || 0, count.pageSize)),
			size: apiParams.pageSize
		});
		$('#pageToolbar').paging();
	}

	/**
	 * 渲染tab栏
	 */
	var setupTab = function() {
		render.compile($scope.$el.$tab, $scope.def.tabsTmpl, $scope.tabs, true);
		$scope.$el.$tabs = $console.find('#tabsPanel .tabEvt');
	}

	/**
	 * 渲染tab栏对应栏
	 */
	var setupTablePanel = function(type, cb) {
		switch (type) {
			case 0:
				loadBankList(apiParams);
				break;
			case 1:
				loadCarList(apiParams);
				break;
		}
		if(cb && typeof cb == 'function') {
			cb();
		}
	}

	/**
	 * 渲染新建按钮
	 */
	var setupBtnPanel = function(type, cb) {
		render.compile($scope.$el.$btn, $scope.def.btnNewTmpl, $scope.btn[type], true);

		$console.find('#btnPanel .button').on('click', function() {
			var that = $(this);
			router.render(that.data('href'), {
				path: 'organizationManage'
			});
		})
		if(cb && typeof cb == 'function') {
			cb();
		}
	}

	/**
	* 绑定tab栏事件
	*/
	var setupTabEvt = function() {
		$console.find('.tabEvt').on('click', function() {
			apiParams.pageNum = 1;
			var that = $(this);
			if(that.hasClass('role-item-active')) return;
			var _type = that.data('type');
			setupTablePanel(_type);
			setupBtnPanel(_type);
			$scope.$el.$tabs.eq($scope.idx).removeClass('role-item-active');
			that.addClass('role-item-active')
			$scope.idx = _type;
		})
	}

	/**
	* 绑定银行立即处理事件
	*/
	var setupBankEvt = function() {
		// 模糊搜索
		$console.find('#searchBankName input').on('keydown', function(evt) {
			if(evt.which == 13) {
				var that = $(this),
					searchText = $.trim(that.val());
				if(!searchText) {
					return false;
				}
				apiParams = {
					bankName: searchText,
					pageNum: 1
				}
				loadBankList(apiParams, function() {
					delete apiParams.bankName;
				});
			}
		});

		// 文本框失去焦点记录文本框的值
		$console.find('#searchBankName input').on('blur', function(evt) {
			var that = $(this),
				searchText = $.trim(that.val());
			if(!searchText) {
				delete apiParams.bankName;
				return false;
			} else {
				apiParams.bankName = searchText;
			}
		});

		$console.find('#searchBankName .iconfont').on('click', function() {
			apiParams.pageNum = 1;
			if(!apiParams.bankName) {
				$console.find('#searchBankName input').focus();
				return false;
			}
			loadBankList(apiParams, function() {
				delete apiParams.bankName;
			});
		});
		
		//  任务类型点击显示/隐藏
		$console.find('#organizationManageTable .arrow').on('click', function() {
			var that = $(this);
			var $tr = that.parent().parent().parent().find('.loantask-item');
			if(!that.data('isShow')) {
				$tr.show();
				that.data('isShow', true);
				that.removeClass('arrow-bottom').addClass('arrow-top');
			} else {
				$tr.hide();
				that.data('isShow', false);
				that.removeClass('arrow-top').addClass('arrow-bottom');
				$tr.eq(0).show();
				$tr.eq(1).show();
			}
		})

		// 编辑合作银行按钮
		$console.find('#organizationManageTable .toNewBank').on('click', function() {
			var that = $(this);
			router.render(that.data('href'), {
				bankId: parseInt(that.data('bankId')),
				demandBankId: parseInt(that.data('demandBankId')),
				path: 'organizationManage'
			});
		})

		// 删除合作银行
		$console.find('#organizationManageTable .deleteBank').on('click', function() {
			var that = $(this);
			var _params = {
				id: that.data('id')
			}
			$.confirm({
				title: '删除合作银行',
				content: tool.alert('确定删除所选合作银行吗？'),
				buttons: {
					close: {
						text: '取消',
						btnClass: 'btn-default btn-cancel'
					},
					ok: {
						text: '确定',
						action: function () {
							deleteBank(_params, function() {
								apiParams = {
									pageNum: 1
								};
								loadBankList(apiParams);
							});
						}
					}
				}
			});
		})

		// 查看费率
		$console.find('#organizationManageTable .view-fee').on('click', function() {
			var that = $(this);

			alert('查看费率');
		})
	}

	/**
	* 绑定车商立即处理事件
	*/
	var setupCarEvt = function() {
		//  任务类型点击显示/隐藏
		$console.find('#organizationManageTable .arrow').on('click', function() {
			var that = $(this);
			var $tr = that.parent().parent().parent().find('.loantask-item');
			if(!that.data('isShow')) {
				$tr.show();
				that.data('isShow', true);
				that.removeClass('arrow-bottom').addClass('arrow-top');
			} else {
				$tr.hide();
				that.data('isShow', false);
				that.removeClass('arrow-top').addClass('arrow-bottom');
				$tr.eq(0).show();
				$tr.eq(1).show();
			}
		})

		// 编辑合作车商按钮
		$console.find('#organizationManageTable .toNewCar').on('click', function() {
			var that = $(this);
			router.render(that.data('href'), {
				shopId: parseInt(that.data('shopId')),
				carShopId: parseInt(that.data('carShopId')),
				path: 'organizationManage'
			});
		})

		// 删除合作车商
		$console.find('#organizationManageTable .deleteCar').on('click', function() {
			var that = $(this);
			var _params = {
				id: that.data('id')
			}
			$.confirm({
				title: '删除合作车商',
				content: tool.alert('确定删除所选合作车商吗？'),
				buttons: {
					close: {
						text: '取消',
						btnClass: 'btn-default btn-cancel'
					},
					ok: {
						text: '确定',
						action: function () {
							deleteCar(_params, function() {
								apiParams = {
									pageNum: 1
								};
								loadCarList(apiParams);
							});
						}
					}
				}
			});
		})

		//搜索按钮
		$console.find('#carListSearch').on('click', function() {
			loadCarList(apiParams);
		})

		//绑定重置按钮事件
		$console.find('#search-reset').on('click', function() {
			// 下拉框数据以及输入框数据重置
			$console.find('.select input').val('');
			$scope.shopTypeName = '';
			$scope.shopName = '';
			apiParams = {
		    	pageNum: 1       //当前页码
			};
		});

		setupDropDown();
	}

	/***
	* 加载页面模板
	*/
	render.$console.load(router.template('iframe/cooperative-bank'), function() {
		$scope.def.bankListTmpl = render.$console.find('#bankListTmpl').html();
		$scope.def.carListTmpl = render.$console.find('#carListTmpl').html();
		$scope.def.tabsTmpl = render.$console.find('#tabsTmpl').html();
		$scope.def.btnNewTmpl = render.$console.find('#btnNewTmpl').html();
		$scope.$el = {
			$tab: $console.find('#tabsPanel'),
			$btn: $console.find('#btnPanel'),
			$tbl: $console.find('#tablePanel'),
			$paging: $console.find('#pageToolbar')
		}
		setupBtnPanel(0);
		setupTablePanel(0, function() {
			$scope.idx = 0;
			setupTab();
			setupTabEvt();
		});
	});

	/**
	 * 分页请求数据回调
	 */
	$scope.paging = function(_pageNum, _size, $el, cb) {
		apiParams.pageNum = _pageNum;
		setupTablePanel($scope.idx);
		cb();
	}

	/**
	 * 下拉框请求数据回调
	 */
	$scope.dropdownTrigger = {
		shopType: function(t, p, cb) {
			var data = [
				{
					id: '全部',
					name: '全部'
				},
				{
					id: 0,
					name: '4s'
				},
				{
					id: 1,
					name: '二级经销商'
				}
			];
			var sourceData = {
				items: data,
				id: 'id',
				name: 'name'
			};
			cb(sourceData);
		},
		shopName: function(t, p, cb) {
			$.ajax({
				type: 'post',
				url: $http.api('demandCarShop/getList', 'cyj'),
				data: {
					shopType: apiParams.shopType//车商类型   0:4s  1:二级经销商
				}, 	
				dataType: 'json',
				success: $http.ok(function(xhr) {
					xhr.data.unshift({
						shopId: '全部',
						shopName: '全部'
					});
					var sourceData = {
						items: xhr.data,
						id: 'shopId',
						name: 'shopName'
					};
					cb(sourceData);
				})
			})
		}
	}

	$scope.shopTypePicker = function(picked) {
		if(picked.id == '全部') {
			delete apiParams.shopType;
			return false;
		}
		apiParams.shopType = picked.id;
		$scope.shopTypeName = picked.name;
	}

	$scope.shopNamePicker = function(picked) {
		if(picked.shopName == '全部') {
			delete apiParams.shopName;
			return false;
		}
		apiParams.shopName = picked.name;
		$scope.shopName = picked.name;
	}

});