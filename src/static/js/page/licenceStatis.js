'use strict';
page.ctrl('licenceStatis', [], function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		apiParams = {
			loanRegistrationQuery: {
				status:'',                   //上牌进度
				acceptCompany:'',           //分公司名称
				bankName:'',                //经办银行名称
				orderNo:''                  //订单号，借款人姓名，身份证号 
			},
			page: {
				pageNum: $params.pageNum || 1
			}
		};
	/**
	* 加载上牌进度统计信息表数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadLicenceStatisList = function(params, cb) {
		$.ajax({
			// url: $http.api($http.apiMap.licenceStatis),
			url: $http.apiMap.licenceStatis,
			data: params,
			dataType: 'json',
			success: $http.ok(function(result) {
				console.log(result);
				render.compile($scope.$el.$tbl, $scope.def.listTmpl, result.data.resultlist, true);
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
	var setupPaging = function(_page, isPage) {
		$scope.$el.$paging.data({
			current: parseInt(apiParams.page.pageNum),
			pages: isPage ? _page.pages : (tool.pages(count || 0, _page.pageSize)),
			size: _page.pageSize
		});
		$('#pageToolbar').paging();
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
	render.$console.load(router.template('licence-statis'), function() {
		$scope.def.listTmpl = render.$console.find('#licenceStatisListTmpl').html();
		$scope.$el = {
			$tbl: $console.find('#licenceStatisTable'),
			$paging: $console.find('#pageToolbar')
		}
		if($params.process) {
			
		}
		loadLicenceStatisList(apiParams);
	});

	$scope.paging = function(_page, _size, $el, cb) {
		apiParams.page.pageNum = _page;
		$params.page = _page;
		// router.updateQuery($scope.$path, $params);
		loadLicenceStatisList(apiParams);
		cb();
	}
});