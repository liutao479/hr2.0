'use strict';
page.ctrl('myCustomer', [], function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		// apiParams = {
		// 	loanOrderQuery: {
		// 		startDate:'',       //查询结束日期
		// 		endDate:'',         //查询结束日期
		// 	    busiSourceId:'',    //业务来源方ID
		// 	    carMode:'',         //车辆品牌
		// 	    deptId:'',          //分公司ID
		// 	    bankId:'',          //经办行ID
		// 	    orderStatus:'',     //进度
		// 	    orderNo:''   
		// 	},
		// 	page: {
		// 		pageNum: $params.pageNum || 2
		// 	}
		// };
		apiParams = {
			pageNum: $params.pageNum || 1
		};
	/**
	* 加载我的客户数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadCustomerList = function(params, cb) {
		$.ajax({
			url: $http.apiMap.myCustomer,
			type: 'post',
			data: params,
			dataType: 'json',
			success: $http.ok(function(result) {
				console.log(result);
				render.compile($scope.$el.$tbl, $scope.def.listTmpl, result.data.resultlist, true);
				setupPaging(result.page, true);
				setupScroll(result.page);
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
	* 翻单页栏
	*/
	var setupScroll = function(page) {
		render.compile($scope.$el.$scrollBar, $scope.def.scrollBarTmpl, page, true);
	}

	/**
	* 绑定立即处理事件
	*/

	// 排序翻页栏（上下页）
	$(document).on('click', '.page-change', function() {
		var that = $(this);
		var _pageNum = parseInt($scope.$el.$scrollBar.find('#page-num').text());
		if(that.hasClass('disabled')) return;
		if(that.hasClass('scroll-prev')) {
			apiParams.pageNum = _pageNum - 1;
			$params.pageNum = _pageNum - 1;
		} else if(that.hasClass('scroll-next')) {
			apiParams.pageNum = _pageNum + 1;
			$params.pageNum = _pageNum + 1;
		}
		loadCustomerList(apiParams);
	});
	// 订单列表的排序
	$(document).on('click', '#time-sort', function() {
		var that = $(this);
		if(!that.data('sort')) {
			apiParams.createTimeSort = 1;
			$params.createTimeSort = 1;
			loadCustomerList(apiParams, function() {
				that.data('sort', true);
				that.removeClass('time-sort-up').addClass('time-sort-down');
			});

		} else {
			delete apiParams.createTimeSort;
			delete $params.createTimeSort;
			loadCustomerList(apiParams, function() {
				that.data('sort', false);
				that.removeClass('time-sort-down').addClass('time-sort-up');
			});
		}
	});

	/***
	* 加载页面模板
	*/
	render.$console.load(router.template('iframe/my-customer'), function() {
		$scope.def.listTmpl = render.$console.find('#myCustomerListTmpl').html();
		$scope.def.scrollBarTmpl = render.$console.find('#scrollBarTmpl').html();
		$scope.$el = {
			$tbl: $console.find('#myCustomerTable'),
			$paging: $console.find('#pageToolbar'),
			$scrollBar: $console.find('#scrollBar')
		}
		if($params.process) {
			
		}
		loadCustomerList(apiParams);
	});

	$scope.paging = function(_pageNum, _size, $el, cb) {
		apiParams.pageNum = _pageNum;
		$params.pageNum = _pageNum;
		// router.updateQuery($scope.$path, $params);
		loadCustomerList(apiParams);
		cb();
	}
});



