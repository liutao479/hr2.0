'use strict';
page.ctrl('loan', function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		apiParams = {
			process: $params.process || 0,
			page: $params.page || 1,
			pageSize: 20
		};
	/**
	* 加载车贷办理数据
	* @params {object} params 请求参数
	*/
	var loadLoanList = function(params) {
		$.ajax({
			url: $http.api($http.apiMap.loanList),
			data: params,
			success: $http.ok(function(result) {
				render.compile($scope.$el.$tbl, $scope.def.listTmpl, result.data, true);
				setupPaging(result.page.pages, true);
				setupEvent();
			})
		})
	}
	/**
	* 构造分页
	*/
	var setupPaging = function(count, isPage) {
		$scope.$el.$paging.data({
			current: parseInt(apiParams.page),
			pages: isPage ? count : (tool.pages(count || 0, apiParams.pageSize)),
			size: apiParams.pageSize
		});
		$('#pageToolbar').paging();
	}

	var setupEvent = function() {
		/**
		* 绑定搜索事件
		**/
		$console.find('#search').on('keydown', function(evt) {
			if(evt.which == 13) {
				alert("查询");
				var that = $(this),
					searchText = $.trim(that.val());
				if(!searchText) {
					return false;
				}
				apiParams.search = searchText;
				$params.search = searchText;
				apiParams.page = 1;
				$params.page = 1;
				loadLoanList(apiParams);
				// router.updateQuery($scope.$path, $params);
			}
		});
		/**
		* 绑定立即处理事件
		*/
		$console.find('#loanTable .button').on('click', function() {
			var that = $(this);
			router.render(that.data('href'), {orderNo: that.data('id'), path: 'loanProcess'});
		});
	}
 	
	/***
	* 加载页面模板
	*/
	render.$console.load(router.template('main'), function() {
		$scope.def.listTmpl = render.$console.find('#loanlisttmpl').html();
		$scope.$el = {
			$tbl: $console.find('#loanTable'),
			$paging: $console.find('#pageToolbar')
		}
		if($params.process) {
			
		}
		loadLoanList(apiParams);
	});

	$scope.paging = function(_page, _size, $el, cb) {
		apiParams.page = _page;
		$params.page = _page;
		// router.updateQuery($scope.$path, $params);
		loadLoanList(apiParams);
		cb();
	}
});



