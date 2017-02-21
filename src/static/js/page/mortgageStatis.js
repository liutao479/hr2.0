'use strict';
page.ctrl('mortgageStatis', [], function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		apiParams = {
			// loanPledgeQuery: {
			//     status: '',                   //上牌进度
			//     acceptCompany: '',           //分公司名称
			//     bankName: '',                //经办银行名称
			//     orderNo: ''                  //订单号，借款人姓名，身份证号
			// }
			operation: 1, //抵押进度接口
	    	pageNum: $params.pageNum || 1       //当前页码
		};
	/**
	* 加载抵押进度统计信息表数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadMortgageStatisList = function(params, cb) {
		$.ajax({
			url: $http.api('loanPledge/getLoanPledgeList', 'cyj'),
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
			pages: isPage ? _page.pages : (tool.pages(_page.pageNum || 0, _page.pageSize)),
			size: _page.pageSize
		});
		$('#pageToolbar').paging();
	}
	/**
	 * 绑定立即处理事件
	 */
	var setupEvt = function() {
		// 绑定搜索框模糊查询事件
		$console.find('#searchInput').on('keydown', function(evt) {
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
				loadMortgageStatisList(apiParams, function() {
					delete apiParams.keyWord;
					delete $params.keyWord;
					that.blur();
				});
				// router.updateQuery($scope.$path, $params);
			}
		});

		//绑定搜索按钮事件
		$console.find('#search').on('click', function() {
			loadMortgageStatisList(apiParams);
			// router.updateQuery($scope.$path, $params);
			
		});

		//绑定重置按钮事件
		$console.find('#search-reset').on('click', function() {
			// 下拉框数据以及输入框数据重置
			// router.updateQuery($scope.$path, $params);
			
		});
	}

	/***
	* 加载页面模板
	*/
	render.$console.load(router.template('iframe/mortgage-statis'), function() {
		$scope.def.listTmpl = render.$console.find('#mortgageStatisListTmpl').html();
		$scope.$el = {
			$tbl: $console.find('#mortgageStatisTable'),
			$paging: $console.find('#pageToolbar')
		}
		loadMortgageStatisList(apiParams, function() {
			setupEvt();
		});
	});

	$scope.paging = function(_pageNum, _size, $el, cb) {
		apiParams.pageNum = _pageNum;
		$params.pageNum = _pageNum;
		// router.updateQuery($scope.$path, $params);
		loadMortgageStatisList(apiParams);
		cb();
	}
});