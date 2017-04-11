'use strict';
page.ctrl('expireProcessDetail', [], function($scope) {
	var $params = $scope.$params,
		$console = $params.refer ? $($params.refer) : render.$console,
		apiParams = {
			pageNum: $params.pageNum || 1,
			process: $params.process || ''
		};
	/**
	 *逾期处理意见 
	* 加载逾期管理数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadExpireProcessList = function(params, cb) {
		$.ajax({
			url: urlStr + '/loanOverdueOrder/overdueOrderList',
//			url: $http.api('loanOverdueOrder/overdueOrderList','jbs'),
			data: params,
			success: $http.ok(function(result) {
				render.compile($scope.$el.$tbl, $scope.def.listTmpl, result.data, true);
				setupEvent();
				if(result.page && result.page.pages){
					setupPaging(result.page.pages, true);
				}
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
			current: parseInt(apiParams.page),
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
			router.render('expireProcess'});
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
							console.log(params);
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
			$paging: $console.find('#pageToolbar')
		}
		if($params.process) {
			
		}
		loadExpireProcessList(apiParams);
	});

	$scope.paging = function(_page, _size, $el, cb) {
		apiParams.page = _page;
		$params.page = _page;
		// router.updateQuery($scope.$path, $params);
		loadExpireProcessList(apiParams);
		cb();
	}
});



