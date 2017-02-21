'use strict';
page.ctrl('licenceAudit', [], function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		apiParams = {
			overdue: 0,
			operation: 3, //上牌审核接口
			pageNum: $params.pageNum || 1,
			pageSize: $params.pageSize || 20
		};
	/**
	* 加载上牌审核信息表数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadLicenceAuditList = function(params, cb) {
		$.ajax({
			type: 'post',
			url: $http.apiMap.licenceTable,
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
				loadLicenceAuditList(apiParams, function() {
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
			loadLicenceAuditList(apiParams);
		});

		//绑定搜索按钮事件
		$console.find('#search').on('click', function() {
			loadLicenceAuditList(apiParams);
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
	render.$console.load(router.template('iframe/licence-audit'), function() {
		$scope.def.listTmpl = render.$console.find('#licenceAuditListTmpl').html();
		$scope.$el = {
			$tbl: $console.find('#licenceAuditTable'),
			$paging: $console.find('#pageToolbar')
		}
		loadLicenceAuditList(apiParams, function() {
			setupEvt();
		});
	});

	$scope.paging = function(_pageNum, _size, $el, cb) {
		apiParams.pageNum = _pageNum;
		$params.pageNum = _pageNum;
		// router.updateQuery($scope.$path, $params);
		loadLicenceAuditList(apiParams);
		cb();
	}
});