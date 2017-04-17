'use strict';
page.ctrl('operationsTab1',['vendor/echarts.min'], function($scope) {
	var $params = $scope.$params,
		$console = $params.refer ? $($params.refer) : render.$console,
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


	/*echarts图表绘制*/
	var setEcharts=function(_name,_list){
		/*饼图start*/
		var myChart = echarts.init(document.getElementById('piechart'));                    
		var option = {
		    title : {
		        text: '服务调用次数比例图',
		        show:false,//隐藏title
		        subtext: '比例',
		        x:'center'
		    },
		    tooltip : {/*鼠标hover时提示组件*/
		        trigger: 'item',
		        //formatter: "{a} <br/>{b} : {c} ({d}%)",
		        formatter: "{b} : {c} ({d}%)",
		        confine:true/*将tooltip框限制在图表的区域内*/
		    },
		    legend: {//图例
		        orient: 'vertical',//图例列表的布局朝向。horizontal/vertical
		        left: 'left',
		        top:'middle',
		        data: _name
		    },
		    //animation:false,/*鼠标经过时不放大图片*/
		    color:['#fed700','#87cefa','#35cb2c','#83a9f0','#ff69b3','#ba56d4','#cd5c5c','#ffa401','#fe6347','#4ecbb4','#00fa99'],
		    series : [
		        {
		            name: '访问来源',
		            type: 'pie',//指定类型为饼图
		            center: ['70%', '55%'],
		            data:_list,
		            itemStyle: {
		                emphasis: {//鼠标经过时样式
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
	/*echarts图表数据整理*/
	var getEchartsData=function(data){
		var nameArr=[],dataList=[];
		for(var i in data){
			var _it=data[i];
			if(_it.serviceName&&nameArr.indexOf(_it.serviceName)!=-1){//已经存在该服务名称
				if(_it.serviceCallNum){
					for(var j=0;j<dataList.length;j++){
						if(dataList[j].name==_it.serviceName){
							dataList[j].value+=_it.serviceCallNum;
							break;
						};
					};
				};
			}else{//数组没有该服务名称
				if(_it.serviceCallNum){
					nameArr.push(_it.serviceName);
					dataList.push({value:_it.serviceCallNum, name:_it.serviceName});
				};
			};
		};
		setEcharts(nameArr,dataList);
	};
	// 查询列表数据
	var searchTotal=function(){
		$.ajax({
			type: 'post',
			dataType:"json",
			url: $http.api('riskStatis/overAll','cyj'),
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
			url: $http.api('riskStatis/queryRisk','cyj'),
			data: param,
			success: $http.ok(function(res) {
				var _data=res.data.list;
				$scope.$el.$searchTimeTitle.text(savedQuery.strStartDate+"至"+savedQuery.strEndDate+"明细");
				render.compile($scope.$el.$table, $scope.def.tableTmpl, _data, true);
				if(!_data||_data.length==0)
					return false;
				/*数据汇总及echarts图表数据整理*/
				var totalSummary={
					historyCalls:0,
					totalServiceAmt:0,
					ableBalance:0
				};
				for(var i in _data){
					var _it=_data[i];
					if(_it.serviceCallNum)
						totalSummary.totalServiceAmt+=_it.serviceCallNum;
					if(_it.serviceAmount)
						totalSummary.ableBalance+=_it.serviceAmount;
				};
				render.compile($scope.$el.$serviceStatic, $scope.def.serviceStaticTemp, totalSummary, true);
				getEchartsData(_data);
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
 	};
	// 加载页面模板
	$console.load(router.template('iframe/operationsTab1'), function() {
		$scope.def.tabTmpl = $console.find('#roleBarTabTmpl').html();//tab模板
		$scope.def.valuationTotalTemp = $console.find('#valuationTotalTemp').html();//数据总览模板
		$scope.def.serviceStaticTemp = $console.find('#serviceStaticTemp').html();//数据总览模板
		$scope.def.tableTmpl = $console.find('#riskManagementTmpl').html();//表格模板
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
			/*strStartDate:$scope.$el.$startTime.val(),
			strEndDate:$scope.$el.$endTime.val(),
			deptId:"",
			bankCode:""*/
			strStartDate:'2017-01-01',
			strEndDate:'2017-08-01'
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
			$.ajax({
				type: 'post',
				url: $http.api('demandBank/selectBank',true),
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
		selValObj.deptId=val.id;
	};
	$scope.bankPicker=function(val){
		selValObj.bankCode=val.id;
	};
});