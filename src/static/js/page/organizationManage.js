'use strict';
page.ctrl('organizationManage', [], function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		apiParams = {
			organId: 99,  //机构id(登录用户)
			pageNum: $params.pageNum || 1
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
		$.ajax({
			url: $http.api('demandCarShop/get', 'cyj'),
			type: 'post',
			data: params,
			dataType: 'json',
			success: $http.ok(function(result) {
				console.log(result);
				render.compile($scope.$el.$tbl, $scope.def.carListTmpl, result.data.resultlist, true);
				setupPaging(result.page, true);
				setupCarEvt();
				if(cb && typeof cb == 'function') {
					cb();
				}
			})
		})
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
			}),
			error: function() {
				alert('删除失败！');
			}
		})
	 }

	/**
	* 构造分页
	*/
	var setupPaging = function(count, isPage) {
		$scope.$el.$paging.data({
			current: parseInt(apiParams.pageNum),
			pages: isPage ? count.pages : (tool.pages(count.pages || 0, apiParams.pageSize)),
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
			$params.pageNum = 1;
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
		$console.find('#searchBankName').on('keydown', function(evt) {
			if(evt.which == 13) {
				var that = $(this),
					searchText = $.trim(that.val());
				if(!searchText) {
					return false;
				}
				apiParams.bankName = searchText;
				$params.bankName = searchText;
				apiParams.pageNum = 1;
				$params.pageNum = 1;
				loadBankList(apiParams, function() {
					delete apiParams.bankName;
					delete $params.bankName;
					that.blur();
				});
				// router.updateQuery($scope.$path, $params);
			}
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
				bankId: that.data('bankid'),
				path: 'organizationManage'
			});
		})

		// 删除合作银行
		$console.find('#organizationManageTable .deleteBank').on('click', function() {
			var that = $(this);
			var _params = {
				id: that.data('id')
			}
			that.openWindow({
				title: '删除合作银行',
				content: '<div>确定删除所选合作银行吗？</div>',
				commit: dialogTml.wCommit.cancelSure
			}, function($dialog) {
				// 窗口确定按钮
				$dialog.find('.w-sure').on('click', function() {
					$dialog.remove();
					deleteBank(_params, function() {
						apiParams.pageNum = 1;
						$params.pageNum = 1;
						loadBankList(apiParams);
					});
					
				})
			})
		})

		// 查看费率
		$console.find('#organizationManageTable .view-fee').on('click', function() {
			var that = $(this);

			that.openWindow({
				title: '查看费率',
				content: '<div>确定删除所选合作银行吗？</div>',
				commit: dialogTml.wCommit.cancelSure
			}, function($dialog) {
				// 窗口确定按钮
				$dialog.find('.w-sure').on('click', function() {
					$dialog.remove();
				})
			})
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

	$scope.paging = function(_pageNum, _size, $el, cb) {
		apiParams.pageNum = _pageNum;
		$params.pageNum = _pageNum;
		// router.updateQuery($scope.$path, $params);
		setupTablePanel($scope.idx);
		cb();
	}
});