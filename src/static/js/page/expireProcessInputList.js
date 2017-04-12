'use strict';
page.ctrl('expireProcessInputList', [], function($scope) {
	var $params = $scope.$params,
		$console = $params.refer ? $($params.refer) : render.$console,
		apiParams = {
			pageNum: $params.pageNum || 1
		};
	/**
	 *逾期处理意见 
	* 加载逾期管理数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadExpireProcessList = function(params, cb) {
		debugger
		$.ajax({
			url: urlStr + '/loanOverdueOrder/overdueOrderList',
//			url: $http.api('loanOverdueOrder/overdueOrderList','jbs'),
//			data: params,
			dataType: 'json',
			type: 'post',
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
	var setupPaging = function($el) {
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
	var setupEvent = function(count, isPage) {
		//详情页面确定取消按钮
		$console.find('#search').on('keydown', function() {
			console.log('搜索')
		});
		//详情页面跳转
		$console.find('#expireProcessTable .button').on('click', function() {
			router.render('expireProcess/expireProcessDetail'});
		});
	}

	/***
	* 加载页面模板
	*/
	$console.load(router.template('iframe/expire-process-input-list'), function() {
		$scope.def.listTmpl = render.$console.find('#expireProcessInputListTmpl').html();
		$scope.$el = {
			$tbl: $console.find('#expireProcessInputListTable'),
			$paging: $console.find('#pageToolbar')
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



