'use strict';
page.ctrl('expireProcessDetail', [], function($scope) {
	var $params = $scope.$params,
		$console = render.$console,
		apiParams = {
			pageNum: $params.pageNum || 1,
			pageSize: 20
		};

	var internel = $scope.internel = {};
	internel.tabs = [
		{
			code: 'O001',
			name: '逾期记录',
			path: 'overdue'
		},
		{
			code: 'O002',
			name: '逾期处理意见',
			path: 'overdue'
		}
	];
	//选择催收类型
	internel.pickedType = function(picked) {
		$scope.overdueType = picked.id;
	}
	//展开催收类型
	internel.openType = function(t, p, cb) {
		cb({
			items: [
				{
					id: 0,
					name: '电话催收'
				},
				{
					id: 1,
					name: '线下催收'
				},
				{
					id: 2,
					name: '法务催收'
				}
			],
			id: 'id',
			name: 'name'
		})
	}

	internel.pickedUser = function(picked) {
		$scope.overdueUser = picked.id;
	}

	internel.openUser = function(t, p, cb) {
		if($scope.overdueType == undefined) return;
		if($scope.overdueUsers && $scope.overdueUsers[$scope.overdueType]) {
			return cb({
				items: $scope.overdueUsers[$scope.overdueType],
				id: 'id',
				name: 'name'
			})
		}
		$.ajax({
			url: $http.api('loanOverdueOrder/queryCollectionUsers', true),
			data: {
				auditState: $scope.overdueType + 1
			},
			global: false,
			dataType: 'json',
			success: $http.ok(function(response) {
				if(!$scope.overdueUsers) $scope.overdueUsers = {};
				$scope.overdueUsers[$scope.overdueType] = response.data;
				cb({
					items: response.data,
					id: 'id',
					name: 'name'
				})
			})
		})
	}
	/**
	* 执行派发
	*/
	internel.dispatch = function($diag) {
		var $err = $diag.$content.find('.color-red');
		if(!$scope.overdueType || !$scope.overdueUser) {
			$err.html('请选择催收处理人员').show();
			return false;
		}
		if(!$scope.overdueType || !$scope.overdueUser) {
			return false;
		}
		$.ajax({
			url: $http.api('loanOverdueOrder/orderHanded', true),
			data: {
				orderNo: $params.orderNo,
				auditState: $scope.overdueType + 1,
				handleUserId: $scope.overdueUser,
				auditIdea: $diag.$content.find('textarea').val().trim()
			},
			global: false,
			dataType: 'json',
			success: $http.ok(function() {
				$.alert({
					title: '成功',
					content: '<div class="w-content">逾期处理任务派发成功</div>',
					autoClose: 'ok|3000',
					buttons: {ok:{text:'确定'}}
				})
				$diag.close();
			}),
			error: function() {
				$diag.close();
				$.alert({
					title: '错误',
					content: '派发失败，请重试',
					autoClose: 'ok|3000',
					buttons: { ok: {text: '确定'}}
				})
			}
		})
		return false;
	}

	/**
	* 加载订单详情左侧列表项配置
	* @params {function} cb 回调函数
	*/
	var loadTabList = function(cb) {
		$.ajax({
			type: 'post',
			url: $http.api('orderDetail/info', true),
			data: {
				orderNo: $params.orderNo,
				type: $params.type
			},
			dataType: 'json',
			success: $http.ok(function(xhr) {
				$scope.result = xhr;
				setupLocation();
				var cfg = xhr.cfgData;
				cfg.frames = internel.tabs.concat(cfg.frames);
				loadGuide(cfg);
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
		var loanTask = $scope.result.data.loanTask;
		$location.data({
			backspace: $scope.$params.path,
			loanUser: loanTask && loanTask.loanOrder.realName,
			current: loanTask && loanTask.taskName || '逾期处理详情',
			orderDate: loanTask && loanTask.loanOrder.createDateStr,
			// pmsDept: $scope.result.data.loanTask.loanOrder.pmsDept.name
		});
		$location.location();
	}

	/**
	* 加载左侧导航菜单
	* @params {object} cfg 配置对象
	*/
	function loadGuide(cfg) {
		$scope.cfg = cfg;
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
		setActiveItem(0);
		if(cfg.frames[0].path) {
			router.innerRender('#innerPanel', 'expireProcess/' + pageCode, params);
		} else {
			router.innerRender('#innerPanel', 'loanProcess/' + pageCode, params);
		}
		return listenGuide();
	}

	function listenGuide() {
		$console.find('.tabLeftEvt').on('click', function() {
			var $that = $(this);
			var code = $that.data('type'),
				idx = $that.data('idx');
			var frm = $scope.cfg.frames[idx];
			var pageCode = subRouterMap[code];
			if(!pageCode) return false;
			var params = {
				code: code,
				orderNo: $params.orderNo,
				type: $params.type
			}
			setActiveItem(idx);
			if(frm && frm['path']) {
				return router.innerRender('#innerPanel', 'expireProcess/' + pageCode, params);
			}
			router.innerRender('#innerPanel', 'loanProcess/' + pageCode, params);
		})
	}

	function setActiveItem(idx) {
		var css = 'panel-menu-item-active';
		$console.find('.tabLeftEvt').filter('.'+css).removeClass(css).find('.arrow').hide();
		$console.find('.tabLeftEvt').eq(idx).addClass(css).find('.arrow').show();
	}


	/**
	 *逾期处理意见 
	* 加载逾期管理数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadExpireProcessList = function(paging) {
		$.ajax({
			url: $http.api('loanOverdueOrder/overdueOrderList', true),
			data: apiParams,
			success: $http.ok(function(result) {
				render.compile($scope.$el.$tbl, $scope.def.listTmpl, result.data, true);
				if(paging && result.page && result.page.pages){
					setupPaging(result.page.pages, true);
				}
			})
		})
	}
	/**
	* 构造分页
	*/
	var setupPaging = function(count, isPage) {
		$scope.$el.$paging.data({
			current: apiParams.pageNum,
			pages: isPage ? count : (tool.pages(count || 0, apiParams.pageSize)),
			size: apiParams.pageSize
		});
		$('#pageToolbar').paging();
	}
 	/**
	* 绑定搜索事件
	**/
	var setupEvent = function($el) {
		//详情页面跳转
		$console.find('#sendExp').on('click', function() {
			$scope.overdueType = undefined;
			$scope.overdueUser = undefined;
			$.confirm({
				title: '派发逾期处理',
				content: 'url:./defs/overdue.send.html',
				onContentReady: function() {
					console.log(this.$content)
					this.$content.find('.select').dropdown()
				},
				buttons: {
					ok: {
						text: '确定',
						action: function() {
							return internel.dispatch(this);
						}
					},
					cancel: {
						text: '取消',
						btnClass: 'btn-default btn-cancel'
					}
				}
			})
		});
	}

	/***
	* 加载页面模板
	*/
	$console.load(router.template('iframe/expire-process-detail'), function() {
		$scope.def.listTmpl = render.$console.find('#expireProcessDetailTmpl').html();
		$scope.def.tabTmpl = render.$console.find('#checkResultTabsTmpl').html();
		$scope.$el = {
			$tbl: $console.find('#expireProcessDetailTable'),
			$paging: $console.find('#pageToolbar'),
			$tab: $console.find('#checkTabs'),
		}
		loadExpireProcessList(true);
		loadTabList();
		setupEvent();
	});

	$scope.paging = function(_page, _size, $el, cb) {
		apiParams.page = _page;
		$params.page = _page;
		loadExpireProcessList();
		cb();
	}
});



