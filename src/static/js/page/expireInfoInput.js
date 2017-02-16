'use strict';
page.ctrl('expireInfoInput', [], function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		apiParams = {
			process: $params.process || 0,
			page: $params.page || 1,
			pageSize: 20
		};
	/**
	* 加载逾期信息录入数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadExpireProcessList = function(params, cb) {
		$.ajax({
			url: $http.api($http.apiMap.expireProcess),
			data: params,
			success: $http.ok(function(result) {
				render.compile($scope.$el.$tbl, $scope.def.listTmpl, result.data, true);
				// setupPaging(result.page.pages, true);
				if(cb && typeof cb == 'function') {
					cb();
				}
			})
		})
	}
 	/**
	* 绑定搜索事件
	**/
	// $(document).on('keydown', '#search', function(evt) {
	// 	if(evt.which == 13) {
	// 		alert("查询");
	// 		var that = $(this),
	// 			searchText = $.trim(that.val());
	// 		if(!searchText) {
	// 			return false;
	// 		}
	// 		apiParams.search = searchText;
	// 		$params.search = searchText;
	// 		apiParams.page = 1;
	// 		$params.page = 1;
	// 		loadExpireProcessList(apiParams);
	// 		// router.updateQuery($scope.$path, $params);
	// 	}
	// });
	/**
	* 绑定立即处理事件
	*/
	// $(document).on('click', '#expireProcessTable .button', function() {
	// 	var that = $(this);
	// 	router.render(that.data('href'), {orderNo: that.data('id')});
	// });

	/***
	* 加载页面模板
	*/
	render.$console.load(router.template('iframe/expire-info-input'), function() {
		$scope.def.listTmpl = render.$console.find('#expireInputTmpl').html();
		$scope.$el = {
			$tbl: $console.find('#expireInputPanel')
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



