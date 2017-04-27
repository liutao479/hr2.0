'use strict';
page.ctrl('expireInfoDetail', [], function($scope) {
	var $params = $scope.$params,
		$console = $params.refer ? $($params.refer) : render.$console,
		internel = {},
		apiParams = {
			page: 1,
			importId: $params.importId,
			status: 0
		};

	internel.setup = {
		setupLocation: function() {
			if($params.path == 'expireInfoInput') {
				$console.find('#location').location({
					backspace: [
						{
							title: '逾期信息导入',
							href: 'expireInfoInput'
						},
						{
							title: '历史导入记录',
							href: 'expire/importHistory',
							params: {
								path: "expireInfoInput"
							}
						}
					],
					current: '批量导入详情'
				})
			}
		},
		tabChange: function() {
			$scope.$el.$tab.on('click', function() {
				var $that = $(this);
				$scope.$el.$tab.filter('.tab-item-active').removeClass('tab-item-active');
				$that.addClass('tab-item-active');
				var status = $that.data('status');
				apiParams.status = status;
				apiParams.page = 1;
				loadExpireProcessList(apiParams);
			})
		}
	}

	internel.init = function() {
		internel.setup.setupLocation();
		internel.setup.tabChange();
	}

	/**
	 *逾期导入查看详情 
	* 加载逾期管理数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadExpireProcessList = function(params, cb) {
		$.ajax({
			url: $http.api('loanOverdueImport/queryImportDetails', true),
			data: params,
			type: 'post',
			dataType: 'json',
			success: $http.ok(function(result) {
				render.compile($scope.$el.$tbl, $scope.def.listTmpl, result, true);
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
			pages: isPage ? _page.pages : (tool.pages(_page.pages || 0, _page.pageSize)),
			size: _page.pageSize
		});
		$scope.$el.$paging.paging();
	}
	/***
	* 加载页面模板
	*/
	$console.load(router.template('iframe/expire-info-detail'), function() {
		$scope.def.listTmpl = render.$console.find('#expireInfoPrevTmpl').html();
		$scope.def.orderDetailTmpl = render.$console.find('#chooseOrderTmpl').html();
		$scope.$el = {
			$tbl: $console.find('#expireInfoPrevTable'),
			$paging: $console.find('#pageToolbar'),
			$tab: $console.find('#currentPageTab .tabEvt')
		}
		internel.init();
		loadExpireProcessList(apiParams);
	});

	$scope.paging = function(_pageNum, _size, $el, cb) {
		apiParams.page = _pageNum;
		loadExpireProcessList(apiParams);
		cb();
	}
});



