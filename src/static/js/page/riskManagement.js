'use strict';
page.ctrl('riskManagement', function($scope) {
	var $console = render.$console,
		selValObj={},
		savedQuery={},/*全局保存查询的条件*/
		tabList=[
			{text:"风控服务统计"},
			{text:"业务量日统计"},
			{text:"业务量区间统计"},
			{text:"放款调度统计"},
			{text:"逾期情况统计"},
			{text:"报表下载"},
		];
	// 查询列表数据
	var searchTotal=function(){
		$.ajax({
			type: 'post',
			dataType:"json",
			url: $http.api('riskStatis/overAll'),
			data: {},
			success: $http.ok(function(res) {
				render.compile($scope.$el.$valuationTotal, $scope.def.valuationTotalTemp, res.data, true);
			})
		});
	};
	// 查询列表数据
	var searchlist=function(param,callback){
		$.ajax({
			type: 'post',
			dataType:"json",
			url: $http.api('riskStatis/queryRisk'),
			data: param,
			success: $http.ok(function(result) {
				$scope.$el.$searchTimeTitle.text(savedQuery.strStartDate+"至"+savedQuery.strEndDate+"明细");
				render.compile($scope.$el.$serviceStatic, $scope.def.serviceStaticTemp, result.data.statistic, true);
				render.compile($scope.$el.$table, $scope.def.tableTmpl, result.list, true);
				if(callback && typeof callback == 'function') {
					callback();
				};
			})
		});
	};
	// 页面首次载入时绑定事件
 	var evt = function() {
		$scope.$el.$tab.off("click","li.role-bar-li").on("click","li.role-bar-li",function() {
			if($(this).siblings("li").length>0){
				$(this).siblings("li").find("a").removeClass("role-item-active");
				$(this).find("a").addClass("role-item-active");
				//search();
			};
		});
		$scope.$el.$searchBtn.click(function(){
			savedQuery={
				strStartDate:$scope.$el.$startTime.val(),
				strEndDate:$scope.$el.$endTime.val(),
				deptId:selValObj.deptId,
				bankCode:selValObj.bankCode
			};
			searchlist();
		});
		$scope.$el.$table.off("click",".detailed").on("click",".detailed",function() {
			var _apiKey=$(this).data("apiKey");
			var _apiPrimary=$(this).data("apiPrimary");
			router.render("riskManagementDetail", {				
				pageNum: 1,
				strStartDate: savedQuery.strStartDate,
				strEndDate: savedQuery.strEndDate,
				deptId: savedQuery.deptId,
				bankCode: savedQuery.bankCode,
				apiKey: _apiKey,
				apiPrimary: _apiPrimary,
			});
		});
		/*饼图start*/
		var myChart = echarts.init(document.getElementById('piechart'));
		var option = {
		    title : {
		        text: '某站点用户访问来源',
		        subtext: '纯属虚构',
		        x:'center'
		    },
		    tooltip : {
		        trigger: 'item',
		        formatter: "{a} <br/>{b} : {c} ({d}%)"
		    },
		    legend: {
		        orient: 'vertical',
		        left: 'left',
		        data: ['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
		    },
		    series : [
		        {
		            name: '访问来源',
		            type: 'pie',
		            radius : '55%',
		            center: ['50%', '60%'],
		            data:[
		                {value:335, name:'直接访问'},
		                {value:310, name:'邮件营销'},
		                {value:234, name:'联盟广告'},
		                {value:135, name:'视频广告'},
		                {value:1548, name:'搜索引擎'}
		            ],
		            itemStyle: {
		                emphasis: {
		                    shadowBlur: 10,
		                    shadowOffsetX: 0,
		                    shadowColor: 'rgba(0, 0, 0, 0.5)'
		                }
		            }
		        }
		    ]
		};
		myChart.setOption(option);
		/*饼图end*/
 	};
	// 加载页面模板
	render.$console.load(router.template('iframe/risk-management'), function() {
		$scope.def.tabTmpl = render.$console.find('#roleBarTabTmpl').html();//tab模板
		$scope.def.valuationTotalTemp = render.$console.find('#valuationTotalTemp').html();//数据总览模板
		$scope.def.serviceStaticTemp = render.$console.find('#serviceStaticTemp').html();//数据总览模板
		$scope.def.tableTmpl = render.$console.find('#riskManagementTmpl').html();//表格模板
		$scope.$context=$console.find("#risk-management");
		$scope.$el = {
			$tab: $scope.$context.find('#roleBarTab'),
			$valuationTotal:$scope.$context.find('#valuation-total'),
			$serviceStatic:$scope.$context.find('#serviceStatic'),
			$table: $scope.$context.find('#riskManagementTable'),
			$searchBtn: $scope.$context.find('#search'),
			$startTime: $scope.$context.find('#dateStart'),
			$endTime: $scope.$context.find('#dateEnd'),
			$searchTimeTitle: $scope.$context.find('#searchTimeTitle'),
		};
		render.compile($scope.$el.$tab, $scope.def.tabTmpl, tabList, true);
		// 启用下拉功能
		$console.find('.select').dropdown();
		// 日期控件
		$console.find('.dateBtn').datepicker();
		$console.find('.dateBtn').val(tool.formatDate(new Date().getTime()));
		searchTotal();/*查询数据总览*/
		savedQuery={
			strStartDate:$scope.$el.$startTime.val(),
			strEndDate:$scope.$el.$endTime.val(),
			deptId:"",
			bankCode:""
		};
		searchlist(savedQuery, function() {
			evt();	
		});/*查询服务使用情况统计*/
	});
	// 下拉功能数据
	$scope.dropdownTrigger = {
		TypeSel: function(t, p, cb) {
			var sourceData = {
				items: [
					{bankId:"001",bankName:"杭州总部"},
					{bankId:"002",bankName:"成都分部"}
				],
				id: 'bankId',
				name: 'bankName'
			};
			cb(sourceData);
			/*$.ajax({
				type: 'post',
				url: $http.api('demandBank/selectBank'),
				dataType: 'json',
				success: $http.ok(function(xhr) {
					debugger
					var sourceData = {
						items: xhr.data,
						id: 'bankId',
						name: 'bankName'
					};
					cb(sourceData);
				})
			})*/
		},
		bankSel: function(t, p, cb) {
			var sourceData = {
				items: [
					{bankId:"001",bankName:"中国银行"},
					{bankId:"002",bankName:"杭州银行"}
				],
				id: 'bankId',
				name: 'bankName'
			};
			cb(sourceData);
			/*$.ajax({
				type: 'post',
				url: $http.api('demandBank/selectBank'),
				dataType: 'json',
				success: $http.ok(function(xhr) {
					var sourceData = {
						items: xhr.data,
						id: 'bankId',
						name: 'bankName'
					};
					cb(sourceData);
				})
			})*/
		},
	};
	// 下拉回调
	$scope.TypePicker=function(val){
		selValObj.deptId=val.id;
	};
	$scope.bankPicker=function(val){
		selValObj.bankCode=val.id;
	};
});