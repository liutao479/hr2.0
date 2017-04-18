'use strict';
page.ctrl('historyInspect', function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		endDate = tool.formatDate(new Date().getTime()),
		startDate = tool.getPreMonth(endDate),
		apiParams = {
			pageNum: $params.pageNum || 1,
			taskId:1,//核查项目种类,法院，购车等等
			minSelectDate:new Date(startDate),
			maxSelectDate:new Date(endDate),
			isReturn:null,/*查询状态*/
			bankId:null,/*经办网点*/
			methodWay:null,/*主动核查标记--查询方式*/
			keyWord:null
		},
		pageBcData={},/*保存点击分页时的查询参数*/
		tabList=[
			{type:1,text:"法院记录"},
			{type:2,text:"购车发票信息"},
			{type:3,text:"登记证状态"},
			{type:4,text:"网贷记录"},
			{type:5,text:"公安信息"},
			{type:6,text:"抵押记录"},
		];
	/*查询前去除空查询字段*/
	var delNull=function(obj){
		for(var i in obj){
			if(obj[i]==null||(obj[i]==""&&obj[i]!==0)||obj[i]==undefined||obj[i]=='undefined')
				delete obj[i];
		};
		return obj;
	};
	/*重置查询表单*/
	var resetForm=function(){
		$scope.$el.$dateStart.val(startDate);
		$scope.$el.$dateEnd.val(endDate);
		$scope.$context.find('.select input').val('');
		$scope.$el.$searchInput.val('');
		apiParams = {
			pageNum: 1,
			taskId:pageBcData.taskId,//核查项目种类,法院，购车等等
			minSelectDate:new Date(startDate),
			maxSelectDate:new Date(endDate),
			isReturn:null,/*查询状态*/
			bankId:null,/*经办网点*/
			methodWay:null,/*主动核查标记--查询方式*/
			keyWord:null
		};
	};
	/*获取表单数据*/
	var getFormMsg=function(){
		apiParams.pageNum=1;
		apiParams.minSelectDate=new Date($scope.$el.$dateStart.val());
		apiParams.maxSelectDate=new Date($scope.$el.$dateEnd.val());
		apiParams.taskId=pageBcData.taskId;
		apiParams.keyWord=$.trim($scope.$el.$searchInput.val());
		return apiParams;
	};
	// 查询列表数据
	var search=function(param,callback){
		$.ajax({
			type: 'post',
			dataType:"json",
			url: $http.api('bankLoanAfterHistory/getList',true),
			data: param,
			success: $http.ok(function(result) {
				pageBcData=param;
				render.compile($scope.$el.$tbl, $scope.def.listTmpl, result.data.resultlist, true);
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
			current: parseInt(pageBcData.pageNum),
			pages: isPage ? _page.pages : (tool.pages(_page.pages || 0, _page.pageSize)),
			size: _page.pageSize
		});
		$scope.$el.$paging.paging();
	};
	// 分页回调
	$scope.paging = function(_pageNum, _size, $el, cb) {
		pageBcData.pageNum = _pageNum;
		$params.pageNum = _pageNum;
		search(pageBcData);
		cb();
	}
	// 页面首次载入时绑定事件
 	var evt = function() {
		// 重置表单
		$scope.$el.$resetBtn.click(function() {
			resetForm();
		});
		// 点击查询按钮
		$scope.$el.$searchBtn.click(function() {
			var _searchMsg=getFormMsg();
			search(delNull(_searchMsg));
		});
		/*关键字文本框enter事件*/
		$scope.$el.$searchInput.on('keydown', function(e) {
			if(e.which == 13) {
				var _searchMsg=getFormMsg();
				search(delNull(_searchMsg));
			};
		});
		// tab切换成查询条件
		$scope.$el.$tabDiv.off("click",".role-bar-li").on("click",".role-bar-li",function() {
			$(this).siblings("li.role-bar-li").find("a").removeClass("role-item-active");
			$(this).find("a").addClass("role-item-active");
			pageBcData.pageNum=1;
			pageBcData.taskId=$(this).data("type");
			search(pageBcData);
		});
		// 查看详情
		$scope.$el.$tbl.off("click",".godetail").on("click",".godetail", function() {
			var _thisOrderNo=$(this).data('orderno');
			var _thisId=$(this).data('id');
			var datahref = $(this).data('href');
			router.render('historyInspectDetail', {
				taskId: apiParams.taskId,
				orderNo:_thisOrderNo,
				Id:_thisId
			});
		});
 	};
 	
	// 加载页面模板
	render.$console.load(router.template('iframe/history-inspect'), function() {
		/*模板*/
		$scope.def.tabTmpl = render.$console.find('#tabTmpl').html();
		$scope.def.listTmpl = render.$console.find('#historyInspectTmpl').html();
		/*节点*/
		$scope.$context=$console.find('#history-inspect');
		$scope.$el = {
			$tabDiv: $scope.$context.find('#tabDiv'),
			$tbl: $scope.$context.find('#tableContext'),
			$paging: $scope.$context.find('#pageToolbar'),
			$resetBtn: $scope.$context.find('#search-reset'),
			$searchBtn: $scope.$context.find('#search'),
			$dateStart: $scope.$context.find('#dateStart'),
			$dateEnd: $scope.$context.find('#dateEnd'),
			$searchInput: $scope.$context.find('#searchInput')
		};
		/*绑定tab*/
		render.compile($scope.$el.$tabDiv, $scope.def.tabTmpl, tabList, true);
		/*默认查询列表*/
		search(delNull(apiParams), function() {
			evt();
		});
		// 启用下拉功能
		$scope.$context.find('.select').dropdown();
		// 日期控件
		$scope.$context.find('.dateBtn').datepicker();
		$scope.$el.$dateStart.val(startDate);
		$scope.$el.$dateEnd.val(endDate);
	});

	// 下拉功能数据
	$scope.dropdownTrigger = {
		TypeSel: function(t, p, cb) {
			var sourceData = {
				items: [
					{value:null,text:"全部"},
					{value:'0',text:"手动"},
					{value:'1',text:"系统"}
				],
				id: 'value',
				name: 'text'
			};
			cb(sourceData);
		},
		statusSel: function(t, p, cb) {			
			var sourceData = {
				items: [
					{value:null,text:"全部"},
					{value:'0',text:"查询中"},
					{value:'1',text:"已返回"}
				],
				id: 'value',
				name: 'text'
			};
			cb(sourceData);
		},
		demandBank: function(t, p, cb) {
			$.ajax({
				type: 'post',
				url: $http.api('demandBank/selectBank', 'zyj'),
				dataType: 'json',
				success: $http.ok(function(xhr) {
					xhr.data.unshift({
						id: null,
						bankName: '全部'
					});
					var sourceData = {
						items: xhr.data,
						id: 'id',
						name: 'bankName'
					};
					cb(sourceData);
				})
			})
		},
	};
	// 下拉回调
	$scope.TypePicker=function(val){
		apiParams.methodWay=val.id;
	};
	$scope.statusPicker=function(val){
		apiParams.isReturn=val.id;
	};
	$scope.bankPicker=function(val){
		apiParams.bankId=val.id;
	};
});



