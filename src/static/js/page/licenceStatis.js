'use strict';
page.ctrl('licenceStatis', [], function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		apiParams = {
			// status:'',                   //上牌进度
			// acceptCompany:'',           //分公司名称
			// bankName:'',                //经办银行名称
			// orderNo:''                  //订单号，借款人姓名，身份证号 
			operation: 1, //上牌进度接口
			pageNum: $params.pageNum || 1
		};
	/**
	* 加载上牌进度统计信息表数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadLicenceStatisList = function(params, cb) {
		$.ajax({
			// url: $http.api($http.apiMap.licenceStatis),
			url: $http.api('loanRegistration/List', 'cyj'),
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
				loadLicenceStatisList(apiParams, function() {
					delete apiParams.keyWord;
					delete $params.keyWord;
					that.blur();
				});
				// router.updateQuery($scope.$path, $params);
			}
		});

		//绑定搜索按钮事件
		$console.find('#search').on('click', function() {
			loadLicenceStatisList(apiParams);
			// router.updateQuery($scope.$path, $params);
			
		});

		//绑定重置按钮事件
		$console.find('#search-reset').on('click', function() {
			// 下拉框数据以及输入框数据重置
			// router.updateQuery($scope.$path, $params);
			
		});

		// 进入详情页
		$console.find('#licenceStatisTable .button').on('click', function() {
			var that = $(this);
			router.render(that.data('href'), {
				// taskId: that.data('id'), 
				// date: that.data('date'),
				orderNo: that.data('id'),
				path: 'licenceStatis'
			});
		});
	}
	/***
	* 加载页面模板
	*/
	render.$console.load(router.template('iframe/licence-statis'), function() {
		$scope.def.listTmpl = render.$console.find('#licenceStatisListTmpl').html();
		$scope.$el = {
			$tbl: $console.find('#licenceStatisTable'),
			$paging: $console.find('#pageToolbar')
		}
		loadLicenceStatisList(apiParams, function() {
			setupEvt();
		});
	});

	$scope.paging = function(_pageNum, _size, $el, cb) {
		apiParams.pageNum = _pageNum;
		$params.pageNum = _pageNum;
		// router.updateQuery($scope.$path, $params);
		loadLicenceStatisList(apiParams);
		cb();
	}
});