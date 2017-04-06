'use strict';
page.ctrl('moneyBusinessAuditPrint', [], function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		apiParams = {
			pageNum: $params.page || 1
		};
	/**
	* 加载财务业务审批表数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadMoneyPrintList = function(params, cb) {
		$.ajax({
			url: $http.api('loanUserStage/getFinancialData', 'cyj'),
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
		});
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
	* 日历控件
	*/
	var setupDatepicker = function() {
		$console.find('.dateBtn').datepicker();
	}

	/**
	* dropdown控件
	*/
	function setupDropDown() {
		$console.find('.select').dropdown();
	}

	/**
	* 绑定立即处理事件
	*/
	// $(document).on('click', '#myCustomerTable .button', function() {
	// 	var that = $(this);
	// 	router.render(that.data('href'));
	// });

	/***
	* 加载页面模板
	*/
	render.$console.load(router.template('iframe/money-business-audit-print'), function() {
		$scope.def.listTmpl = render.$console.find('#moneyAuditPrintListTmpl').html();
		$scope.$el = {
			$tbl: $console.find('#moneyAuditPrintTable'),
			$paging: $console.find('#pageToolbar')
		}
		setupDropDown();
		setupDatepicker();
		loadMoneyPrintList(apiParams);
	});

	/**
	 * 分页请求数据回调
	 */
	$scope.paging = function(_page, _size, $el, cb) {
		apiParams.pageNum = _page;
		$params.pageNum = _page;
		// router.updateQuery($scope.$path, $params);
		loadMoneyPrintList(apiParams);
		cb();
	}

	/**
	 * 下拉框请求数据回调
	 */
	$scope.dropdownTrigger = {
		deptCompany: function(t, p, cb) {
			$.ajax({
				type: 'get',
				url: $http.api('pmsDept/getPmsDeptList', 'zyj'),
				data: {
					parentId: 99
				},
				dataType: 'json',
				success: $http.ok(function(xhr) {
					console.log(xhr)
					var sourceData = {
						items: xhr.data,
						id: 'id',
						name: 'name'
					};
					cb(sourceData);
				})
			})
		}
	}
});