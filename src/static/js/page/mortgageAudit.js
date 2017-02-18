'use strict';
page.ctrl('mortgageAudit', [], function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		apiParams = {
			overdue:0,
			operation: 3, 
			page: $params.page || 1,
			pageSize: 20
		};
	/**
	* 加载抵押审核信息表数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadMortgageAuditList = function(params, cb) {
		$.ajax({
			url: $http.apiMap.mortgageTable,
			type: 'post',
			dataType: 'json',
			data: params,
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
			pages: isPage ? _page.pages : (tool.pages(count.pages || 0, _page.pageSize)),
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
				loadMortgageAuditList(apiParams, function() {
					delete apiParams.keyWord;
					delete $params.keyWord;
					that.blur();
				});
				// router.updateQuery($scope.$path, $params);
			}
		});

		// 绑定只显示超期记录
		$console.find('#overdue').on('click', function() {
			var that = $(this);
			if(!$(this).hasClass('checked')) {
				apiParams.overdue = 1;
				$params.overdue = 1;
			} else {
				apiParams.overdue = 0;
				$params.overdue = 0;
			}
			loadMortgageAuditList(apiParams);
		});
		
		//绑定搜索按钮事件
		$console.find('#search').on('click', function() {
			loadMortgageAuditList(apiParams);
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
	render.$console.load(router.template('iframe/mortgage-audit'), function() {
		$scope.def.listTmpl = render.$console.find('#mortgageAuditListTmpl').html();
		$scope.$el = {
			$tbl: $console.find('#mortgageAuditTable'),
			$paging: $console.find('#pageToolbar')
		}
		loadMortgageAuditList(apiParams, function() {
			setupEvt();
		});
	});

	$scope.paging = function(_page, _size, $el, cb) {
		apiParams.page = _page;
		$params.page = _page;
		router.updateQuery($scope.$path, $params);
		loadMortgageAuditList(apiParams);
		cb();
	}
});