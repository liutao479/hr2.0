'use strict';
page.ctrl('historyInspect', function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		apiParams = {
			pageNum: $params.pageNum || 1,
			type:3,
		};
	// 查询列表数据
	var search=function(param,callback){
		$.ajax({
			type: 'get',
			dataType:"json",
			url: $http.api('historyInspect'),
			data: param,
			success: $http.ok(function(result) {
				render.compile($scope.$el.$tbl, $scope.def.listTmpl, result.data, true);
				// 构造分页
				setupPaging(result.page, true);
				if(callback && typeof callback == 'function') {
					callback();
				};
			})
		});
	};
	// 构造分页
	var setupPaging = function(_page, isPage) {
		$scope.$el.$paging.data({
			current: parseInt(apiParams.pageNum),
			pages: isPage ? _page.pages : (tool.pages(_page.pages || 0, _page.pageSize)),
			size: _page.pageSize
		});
		$scope.$el.$paging.paging();
	};
	// 分页回调
	$scope.paging = function(_pageNum, _size, $el, cb) {
		apiParams.pageNum = _pageNum;
		$params.pageNum = _pageNum;
		search(apiParams);
		cb();
	}
	// 页面首次载入时绑定事件
 	var evt = function() {
		// tab切换成查询条件
		$console.find(".role-bar-ul .role-bar-li").click(function() {
			$(this).siblings("li.role-bar-li").find("a").removeClass("role-item-active");
			$(this).find("a").addClass("role-item-active");
			apiParams.type=$(this).data("type");
			search();
		});
		// 查看详情
		$console.off("click",".godetail").on("click",".godetail", function() {
			var datahref = $(this).data('href');
			router.render(datahref, {
				type: apiParams.type
			});
		});
 	};
 	
	// 加载页面模板
	render.$console.load(router.template('iframe/history-inspect'), function() {
		$scope.def.listTmpl = render.$console.find('#historyInspectTmpl').html();
		$scope.$el = {
			$tbl: $console.find('#tableContext'),
			$paging: $console.find('#pageToolbar')
		};
		search(apiParams, function() {
			evt();
		});
		// 启用下拉功能
		$console.find('.select').dropdown();
		// 日期控件
		$console.find('.dateBtn').datepicker();
		$console.find('.dateBtn').val(tool.formatDate(new Date().getTime()));
	});

	// 下拉功能数据
	$scope.dropdownTrigger = {
		TypeSel: function(t, p, cb) {
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
		},
		statusSel: function(t, p, cb) {
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
		},
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
		},
		dealerSel: function(t, p, cb) {
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
		},
	};
	// 下拉回调
	$scope.TypePicker=function(val){
		console.log(val)
	};
	$scope.statusPicker=function(val){
		console.log(val)
	};
	$scope.bankPicker=function(val){
		console.log(val)
	};
	$scope.dealerPicker=function(val){
		console.log(val)
	};
});



