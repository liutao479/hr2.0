'use strict';
page.ctrl('orderModifyAudit', [], function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		apiParams = {
			applyType: 0,
			pageNum: $params.pageNum || 1
		};
	/**
	* 加载订单修改审核数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadOrderModifyList = function(params, cb) {
		$.ajax({
			type: 'post',
			url: $http.api('loanOrderApply/get', 'cyj'),
			data: params,
			dataType: 'json',
			success: $http.ok(function(result) {
				console.log(result);
				render.compile($scope.$el.$tbl, $scope.def.listTmpl, result.data.resultlist, true);
				setupPaging(result.page.pages, true);
				setupScroll(result.page, function() {
					pageChangeEvt();
				});
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
	* 启动dropdown控件
	*/
	function setupDropDown() {
		$console.find('.select').dropdown();
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

	/**
	 * 绑定立即处理事件
	 */
	var setupEvt = function() {
		// 绑定搜索框模糊查询事件
		$console.find('#searchInput').on('keydown', function() {
			if(evt.which == 13) {
				var that = $(this),
					searchText = $.trim(that.val());
				if(!searchText) {
					return false;
				}
				apiParams.keyWord = searchText;
				$params.keyWord = searchText;
				apiParams.pageNum = 1;
				$params.pageNum = 1;
				console.log(apiParams)
				loadOrderModifyList(apiParams, function() {
					delete apiParams.keyWord;
					delete $params.keyWord;
					that.blur();
				});
				// router.updateQuery($scope.$path, $params);
			}
		});

		//绑定搜索按钮事件
		$console.find('#search').on('click', function() {
			loadOrderModifyList(apiParams);
			// router.updateQuery($scope.$path, $params);
			
		});

		//绑定重置按钮事件
		$console.find('#search-reset').on('click', function() {
			// 下拉框数据以及输入框数据重置
			// router.updateQuery($scope.$path, $params);
			
		});

		
		
		// 订单列表的排序
		$console.find('#time-sort').on('click', function() {
			var that = $(this);
			if(!that.data('sort')) {
				apiParams.createTimeSort = 1;
				$params.createTimeSort = 1;
				loadOrderModifyList(apiParams, function() {
					that.data('sort', true);
					that.removeClass('time-sort-up').addClass('time-sort-down');
				});

			} else {
				delete apiParams.createTimeSort;
				delete $params.createTimeSort;
				loadOrderModifyList(apiParams, function() {
					that.data('sort', false);
					that.removeClass('time-sort-down').addClass('time-sort-up');
				});
			}
		});
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
			loadOrderModifyList(apiParams);
		});
	}
	/***
	* 加载页面模板
	*/
	render.$console.load(router.template('iframe/order-modify-audit'), function() {
		$scope.def.listTmpl = render.$console.find('#orderModifyListTmpl').html();
		$scope.def.scrollBarTmpl = render.$console.find('#scrollBarTmpl').html();
		$scope.$el = {
			$tbl: $console.find('#orderModifyTable'),
			$paging: $console.find('#pageToolbar'),
			$scrollBar: $console.find('#scrollBar')
		}
		setupDropDown();
		loadOrderModifyList(apiParams, function() {
			setupEvt();
		});
	});

	$scope.paging = function(_pageNum, _size, $el, cb) {
		apiParams.pageNum = _pageNum;
		$params.pageNum = _pageNum;
		// router.updateQuery($scope.$path, $params);
		loadOrderModifyList(apiParams);
		
		cb();
	}

	$scope.dropdownTrigger = {
		category: function(t, p, cb) {
			var data = [
				{
					id: 'creditMaterialsUpload',
					name: '征信材料上传'
				},
				{
					id: 'creditInput',
					name: '征信结果录入'
				},
				{
					id: 'creditApproval',
					name: '征信预审核'
				},
				{
					id: 'cardInfoInput',
					name: '贷款信息录入'
				},
				{
					id: 'usedCarInfoInput',
					name: '二手车信息录入'
				},
				{
					id: 'loanMaterialsChoose',
					name: '贷款材料选择'
				},
				{
					id: 'busiModeChoose',
					name: '业务模式选择'
				},
				{
					id: 'homeMaterialsUpload',
					name: '上门材料上传'
				},
				{
					id: 'signMaterialsUpload',
					name: '签约材料上传'
				},
				{
					id: 'loanMaterialsUpload',
					name: '贷款材料上传'
				},
				{
					id: 'advanceMaterialsUpload',
					name: '垫资材料上传'
				},
				{
					id: 'loanTelApproval',
					name: '电审'
				},
				{
					id: 'loanApproval',
					name: '贷款审核'
				},
				{
					id: 'makeLoanApproval',
					name: '放款审核'
				},
				{
					id: 'pickMaterialsUpload',
					name: '提车材料上传'
				},
				{
					id: 'pickMaterialsApproval',
					name: '提车审核'
				},
			];
			var sourceData = {
				items: data,
				id: 'id',
				name: 'name'
			};
			cb(sourceData);
		}
	}
});



