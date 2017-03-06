'use strict';
page.ctrl('marginManage',function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		apiParams = {
			deptId: 39,
			pageNum: 1,
			pageSize: 10,
			callBankQuery: 0 //是否调用银行接口，首次进入页面不查询，点击参数变为1调用银行接口查询
		};
	/**
	* 加载保证金查询信息表数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadMarginManageList = function(params, cb) {
		$.ajax({
			// url: $http.api('marginManage'),
			url: $http.api('loanDeposit/getList', 'cyj'),
			type: 'get',
			dataType: 'json',
			data: params,
			success: function(result) {
				if(!result.code) {
					console.log(result);
					render.compile($scope.$el.$tbl, $scope.def.listTmpl, result.data.resultlist, true);
					setupPaging(result.page);
				} else if(result.code == 6001) {
					$console.find('#queryDeposit').openWindow({
						title: '提示',
						content: '<div>超过每日最大查询次数，请明天再查询！</div>'
					})
				}
				if(cb && typeof cb == 'function') {
					cb();
				}
			}
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
	* 绑定立即处理事件
	*/
	var setupEvt = function() {
		$console.find('#queryDeposit').on('click', function() {
			apiParams.callBankQuery = 1;
			loadMarginManageList(apiParams, function() {
				apiParams.callBankQuery = 0;
			})
		})
	}

	/***
	* 加载页面模板
	*/
	render.$console.load(router.template('iframe/deposit-query'), function() {
		$scope.def.listTmpl = render.$console.find('#marginManageListTmpl').html();
		$scope.$el = {
			$tbl: $console.find('#marginManageTable'),
			$paging: $console.find('#pageToolbar')
		}
		loadMarginManageList(apiParams, function() {
			setupEvt();
		});
	});

	$scope.paging = function(_pageNum, _size, $el, cb) {
		apiParams.pageNum = _pageNum;
		$params.pageNum = _pageNum;
		loadCustomerList(apiParams);
		cb();
	}

});