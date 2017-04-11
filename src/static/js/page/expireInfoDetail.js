'use strict';
page.ctrl('expireInfoDetail', [], function($scope) {
	var $params = $scope.$params,
		$console = $params.refer ? $($params.refer) : render.$console,
		apiParams = {
			pageNum: $params.pageNum || 1,
			process: $params.process || ''
		};
	/**
	 *逾期导入查看详情 
	* 加载逾期管理数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var pageData={};
		pageData['importId']=$params.importId;
		pageData['status']=0;
	$scope.iptId = $params.importId;

	var loadExpireProcessList = function(params, cb) {
		$.ajax({
			url: urlStr + '/loanOverdueImport/queryImportDetails',
//			url: $http.api('loanOverdueImport/queryImportDetails','jbs'),
			data: pageData,
			type: 'post',
			dataType: 'json',
			success: $http.ok(function(result) {
				render.compile($scope.$el.$tbl, $scope.def.listTmpl, result, true);
				setupPaging(result.page, true);
				setupScroll(result.page, function() {
					pageChangeEvt();
				});
				tabChangeEvt();
				$("#chooseOrderDetail").hide();
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
			pages: isPage ? _page.pages : (tool.pages(_page.pages || 0, _page.pageSize)),
			size: _page.pageSize
		});
		$('#pageToolbar').paging();
	}

	/**
	* 编译翻单页栏
	*/
	var setupScroll = function(page, cb) {
		render.compile($scope.$el.$scrollBar, $scope.def.scrollBarTmpl, page, true);
		if(cb && typeof cb == 'function') {
			cb();
		}
	}
	// 绑定翻页栏（上下页）按钮事件
	var pageChangeEvt = function() {
		$console.find('.page-change').on('click', function() {
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
	}
 	/**
	* 页面启动
	**/
	var tabChangeEvt = function() {
		$console.find('#expInIpt').on('click', function() {
			router.render('expireInfoInput');
		});
		$console.find('#expInIptHis').on('click', function() {
			router.render('expire/importHistory');
		});
		//当页tab切换
		$console.find('#currentPageTab a').on('click', function() {
			$('#currentPageTab a').each(function (){
				$(this).removeClass('tab-item-active');
			})
			$(this).addClass('tab-item-active');
			var status = $(this).data('status');
			pageData['status']=status;
			$.ajax({
				url: urlStr + '/loanOverdueImport/queryImportDetails',
				data: pageData,
				type: 'post',
				dataType: 'json',
				success: $http.ok(function(result) {
					render.compile($scope.$el.$tbl, $scope.def.listTmpl, result, true);
					setupPaging(result.page, true);
					setupScroll(result.page, function() {
						pageChangeEvt();
					});
					$("#chooseOrderDetail").hide();
				})
			})
		});
		//点击查看详情
		$console.find('.selOrderDetail').on('click', function() {
			$("#chooseOrderDetail").show();
			var that =$("#chooseOrderTable");
			var detailData = {};
				detailData['detailId']=$(this).data('detail');
			$.ajax({
				url: $http.api('loanOverdueImport/checkOverdueOrderList','wl'),
				data: detailData,
				type: 'post',
				dataType: 'json',
				success: $http.ok(function(xhr) {
					render.compile(that, $scope.def.orderDetailTmpl, xhr.data, true);
				})
			})
		});
	}

	/***
	* 加载页面模板
	*/
	$console.load(router.template('iframe/expire-info-detail'), function() {
		$scope.def.listTmpl = render.$console.find('#expireInfoPrevTmpl').html();
		$scope.def.orderDetailTmpl = render.$console.find('#chooseOrderTmpl').html();
		$scope.def.scrollBarTmpl = render.$console.find('#scrollBarTmpl').html();
		$scope.$el = {
			$tbl: $console.find('#expireInfoPrevTable'),
			$paging: $console.find('#pageToolbar'),
			$scrollBar: $console.find('#scrollBar')
		}
		loadExpireProcessList();
	});

	$scope.paging = function(_pageNum, _size, $el, cb) {
		apiParams.pageNum = _pageNum;
		$params.pageNum = _pageNum;
		loadExpireProcessList(apiParams);
		cb();
	}
});



