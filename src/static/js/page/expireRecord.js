'use strict';
page.ctrl('expireRecord', [], function($scope) {
	var $params = $scope.$params,
		$console = $params.refer ? $($params.refer) : render.$console,
		apiParams = {
			page: $params.page || 1,
			pageSize: 20,
			orderNo: $params.orderNo
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
			dataType: 'json',
			success: $http.ok(function(result) {
				if(result.data.length > 0) {
					render.compile($scope.$el.$tbl, $scope.def.listTmpl, result.data, true);
					setupPaging(result.page.pages, true);	
				} else {
					var empty = '<div class="blank-box">\
									<img src="/hr2.0/dist/static/css/img/orders_blank.png">\
									<p>暂无逾期处理记录！</p>\
								</div>';
					$scope.$el.$tbl.html(empty);
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
		$scope.$el.$paging.paging();
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
		loadExpireProcessList(apiParams);
		cb();
	}
});



