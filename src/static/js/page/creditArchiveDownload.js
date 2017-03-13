'use strict';
page.ctrl('creditArchiveDownload', [], function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		apiParams = {
			queryType: 1,  //征信资料下载
			pageNum: $params.pageNum || 1
		};
	/**
	* 加载征信资料数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadCreaditList = function(params, cb) {
		$.ajax({
			url: $http.api('creditUser/getCreditMaterials'),
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
	* 启动dropdown控件
	*/
	function setupDropDown() {
		$console.find('.select').dropdown();
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
				loadCreaditList(apiParams, function() {
					delete apiParams.keyWord;
					delete $params.keyWord;
					that.blur();
				});
				// router.updateQuery($scope.$path, $params);
			}
		});

		// 绑定全选按钮
		$console.find('#allCheck').on('click', function() {
			var that = $(this);
			if(!$(this).hasClass('checked')) {
				// 去做全选操作
				// $console.find('#creditArchiveDownloadTable .checkbox')
			} else {
				// 去做全选取消操作
			}
		});

		// 绑定pdf下载按钮
		$console.find('.pdf-d').on('click', function() {
			var that = $(this);
			// http://192.168.0.172:8080/materialsDownLoad/downLoadCreditMaterials?userIds=100001&downLoadType=2
		});

		// 绑定word下载按钮
		$console.find('.word-d').on('click', function() {
			var that = $(this);
		});

		// 绑定zip下载按钮
		$console.find('.zip-d').on('click', function() {
			var that = $(this);
		});

		//绑定搜索按钮事件
		$console.find('#search').on('click', function() {
			apiParams.pageNum = 1;
			$params.pageNum = 1;
			loadCreaditList(apiParams);
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
	render.$console.load(router.template('iframe/credit-archive-download'), function() {
		$scope.def.listTmpl = render.$console.find('#creditArchiveDownloadListTmpl').html();
		$scope.$el = {
			$tbl: $console.find('#creditArchiveDownloadTable'),
			$paging: $console.find('#pageToolbar')
		}
		setupDropDown();
		loadCreaditList(apiParams, function() {
			setupEvt();
		});
	});

	/**
	 * 分页请求数据回调
	 */
	$scope.paging = function(_pageNum, _size, $el, cb) {
		apiParams.pageNum = _pageNum;
		$params.pageNum = _pageNum;
		// router.updateQuery($scope.$path, $params);
		loadCreaditList(apiParams);
		cb();
	}

	/**
	 * 下拉框请求数据回调
	 */
	$scope.dropdownTrigger = {
		demandBank: function(t, p, cb) {
			$.ajax({
				type: 'post',
				url: $http.api('demandBank/selectBank', 'zyj'),
				dataType: 'json',
				success: $http.ok(function(xhr) {
					var sourceData = {
						items: xhr.data,
						id: 'bankId',
						name: 'bankName'
					};
					cb(sourceData);
				})
			})
		}
	}
});



