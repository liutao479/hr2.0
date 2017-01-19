'use strict';
page.ctrl('cancelOrderAudit', function($scope) {
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
	* @params {function} cb 回调函数
	*/
	var loadLoanList = function(params, cb) {
		$.ajax({
			url: 'http://127.0.0.1:8083/mock/creditResult',
			data: params,
			success: $http.ok(function(result) {
				console.log(result);
				render.compile($scope.$el.$tbl, $scope.def.listTmpl, result, true);
				setupPaging(result.page.pages, true);
				if(cb && typeof cb == 'function') {
					cb();
				}
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
 	/**
	* 绑定搜索事件
	**/
	$(document).on('keydown', '#search', function(evt) {
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
	$(document).on('click', '#loanTable .button', function() {
		var that = $(this);
		router.render(that.data('href'), {orderNo: that.data('id'), path: 'loanProcess'});
	});

	/***
	* 加载页面模板
	*/
	render.$console.load(router.template('credit-result-typing'), function() {
		$scope.def.listTmpl = render.$console.find('#creditResultListTmpl').html();
		$scope.$el = {
			$tbl: $console.find('#creditResultPanel'),
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



