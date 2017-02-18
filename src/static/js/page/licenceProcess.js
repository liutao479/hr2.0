'use strict';
page.ctrl('licenceProcess', [], function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		apiParams = {
			overdue: 0,
			operation: 2, 					//上牌办理接口
	    	pageNum: $params.pageNum || 1,       //当前页码
			pageSize: 20
		};
	/**
	* 加载上牌办理信息表数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadLicenceProcessList = function(params, cb) {
		$.ajax({
			url: $http.apiMap.licenceTable,
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
			pages: isPage ? _page.pages : (tool.pages(_page.pages || 0, _page.pageSize)),
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
				loadLicenceProcessList(apiParams, function() {
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
			loadLicenceProcessList(apiParams);
		});

		//绑定搜索按钮事件
		$console.find('#search').on('click', function() {
			loadLicenceProcessList(apiParams);
			// router.updateQuery($scope.$path, $params);
			
		});

		//绑定重置按钮事件
		$console.find('#search-reset').on('click', function() {
			// 下拉框数据以及输入框数据重置
			// router.updateQuery($scope.$path, $params);
			
		});

		//绑定搜索按钮事件
		$console.find('#search').on('click', function() {
			loadLicenceProcessList(apiParams);
			// router.updateQuery($scope.$path, $params);
			
		});

		// 进入详情页
		$console.find('#licenceProcessTable .button').on('click', function() {
			var that = $(this);
			router.render(that.data('href'), {
				// taskId: that.data('id'), 
				// date: that.data('date'),
				path: 'licenceProcess'
			});
		});
	}

	/***
	* 加载页面模板
	*/
	render.$console.load(router.template('iframe/licence-process'), function() {
		$scope.def.listTmpl = render.$console.find('#licenceProcessListTmpl').html();
		$scope.$el = {
			$tbl: $console.find('#licenceProcessTable'),
			$paging: $console.find('#pageToolbar')
		}
		loadLicenceProcessList(apiParams, function() {
			setupEvt();
		});
	});

	$scope.paging = function(_page, _size, $el, cb) {
		apiParams.page = _page;
		$params.page = _page;
		// router.updateQuery($scope.$path, $params);
		loadLicenceProcessList(apiParams);
		cb();
	}
});