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
			url: $http.api('demandBank/getDemandBankList', 'cyj'),
			type: 'post',
			data: params,
			dataType: 'json',
			success: $http.ok(function(result) {
				console.log(result);
				render.compile($scope.$el.$tbl, $scope.def.bankListTmpl, result.data.resultlist, true);
				setupPaging(result.page, true);
				setupEvt();
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
			url: $http.api('demandCarShop/getDemandCarShop', 'cyj'),
			type: 'post',
			data: params,
			dataType: 'json',
			success: $http.ok(function(result) {
				console.log(result);
				render.compile($scope.$el.$tbl, $scope.def.carListTmpl, result.data.resultlist, true);
				setupPaging(result.page, true);
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
				bankId: that.data('id'), 
				path: 'organizationManage'
			});
		})
		if(cb && typeof cb == 'function') {
			cb();
		}
	}


	/**
	* 绑定立即处理事件
	*/
	$(document).on('click', '#myCustomerTable .button', function() {
		var that = $(this);
		router.render(that.data('href'));
	});



	/**
	* 绑定tab栏事件
	*/
	var setupTabEvt = function() {
		$console.find('.tabEvt').on('click', function() {
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
	* 绑定tab栏事件
	*/
	var setupEvt = function() {
		$console.find('#searchBankName').on('keydown', function(evt) {
			if(evt.which == 13) {
				alert("查询");
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