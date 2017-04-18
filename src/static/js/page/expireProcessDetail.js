'use strict';
page.ctrl('expireProcessDetail', [], function($scope) {
	var $params = $scope.$params,
		$console = $params.refer ? $($params.refer) : render.$console,
		apiParams = {
			pageNum: $params.pageNum || 1,
			pageSize: 20
		};

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
				loadGuide(xhr.cfgData);
				if($params.type == 'OrderDetails') {
					render.compile($scope.$el.$buttonsPanel, $scope.def.buttonsTmpl, xhr.data.BTNSTATUS, true);
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
				setupEvent();
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
		//详情页面确定取消按钮
		$console.find('#expManage').on('click', function() {
			router.render('expireProcess');
		});
		//详情页面跳转
		$console.find('#sendExp').on('click', function() {
			$.confirm({
				title: '选择提交对象',
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
							var that = this;
							var taskIds = [];
							for(var i = 0, len = $params.tasks.length; i < len; i++) {
								taskIds.push(parseInt($params.tasks[i].id));
							}
							var params = {
								taskId: $params.taskId,
								taskIds: taskIds,
								orderNo: $params.orderNo
							}
							var reason = $.trim(that.$content.find('#suggestion').val());
							if(reason) params.reason = reason;
							flow.tasksJump(params, 'complete');
						}
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
		$scope.$el = {
			$tbl: $console.find('#expireProcessDetailTable'),
			$paging: $console.find('#pageToolbar'),
			$tab: $console.find('#checkTabs'),
		}
		loadExpireProcessList(true);
		loadTabList();
	});

	$scope.paging = function(_page, _size, $el, cb) {
		apiParams.page = _page;
		$params.page = _page;
		loadExpireProcessList();
		cb();
	}
});



