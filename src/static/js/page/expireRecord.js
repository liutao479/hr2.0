'use strict';
page.ctrl('expireRecord', [], function($scope) {
	var $params = $scope.$params,
		$console = $params.refer ? $($params.refer) : render.$console,
		apiParams = {
			page: $params.page || 1,
			pageSize: 20
		};
	/**
	 *逾期处理意见 
	* 加载逾期管理数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadExpireProcessList = function(params, cb) {
		$.ajax({
			url: $http.api('loanOverdueRecord/queryRecordList', true),
			data: params,
			success: $http.ok(function(result) {
				render.compile($scope.$el.$tbl, $scope.def.listTmpl, result.data, true);
				setupPaging(result.page.pages, true);
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
	$(document).on('keydown', '#search', function(evt) {
		if(evt.which == 13) {
			alert("查询");
			var that = $(this),
				searchText = $.trim(that.val());
			if(!searchText) {
				return false;
			}
			apiParams.search = searchText;
			$params.search = searchText;
			apiParams.page = 1;
			$params.page = 1;
			loadExpireProcessList(apiParams);
			// router.updateQuery($scope.$path, $params);
		}
	});
	/**
	* 绑定立即处理事件
	*/
	$(document).on('click', '#expireProcessTable .button', function() {
		var that = $(this);
		router.render(that.data('href'), {orderNo: that.data('id')});
	});

	/***
	* 加载页面模板
	*/
	$console.load(router.template('iframe/expire-record'), function() {
		$scope.def.listTmpl = $console.find('#expireRecordTmpl').html();
		$scope.$el = {
			$tbl: $console.find('#expireRecordTable'),
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



