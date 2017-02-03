'use strict';
page.ctrl('creditArchiveDownload', [], function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		apiParams = {
			pageNum: $params.pageNum || 1
		};
	/**
	* 加载征信资料数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadCreaditList = function(params, cb) {
		$.ajax({
			url: $http.apiMap.creditArchiveDownload,
			type: 'post',
			data: params,
			dataType: 'json',
			success: $http.ok(function(result) {
				console.log(result);
				render.compile($scope.$el.$tbl, $scope.def.listTmpl, result.data.resultlist, true);
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
	var setupPaging = function(_page, isPage) {
		$scope.$el.$paging.data({
			current: parseInt(apiParams.pageNum),
			pages: isPage ? _page.pages : (tool.pages(count || 0, _page.pageSize)),
			size: _page.pageSize
		});
		$('#pageToolbar').paging();
	}
	/**
	* 绑定立即处理事件
	*/
	// $(document).on('click', '#myCustomerTable .button', function() {
	// 	var that = $(this);
	// 	router.render(that.data('href'));
	// });

	/***
	* 加载页面模板
	*/
	render.$console.load(router.template('credit-archive-download'), function() {
		$scope.def.listTmpl = render.$console.find('#creditArchiveDownloadListTmpl').html();
		$scope.$el = {
			$tbl: $console.find('#creditArchiveDownloadTable'),
			$paging: $console.find('#pageToolbar')
		}
		if($params.process) {
			
		}
		loadCreaditList(apiParams);
	});

	$scope.paging = function(_pageNum, _size, $el, cb) {
		apiParams.pageNum = _pageNum;
		$params.pageNum = _pageNum;
		// router.updateQuery($scope.$path, $params);
		loadCreaditList(apiParams);
		cb();
	}
});



