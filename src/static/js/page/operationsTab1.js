'use strict';
page.ctrl('operationsTab1',['vendor/echarts.min'], function($scope) {
	var $params = $scope.$params,
		$console = $params.refer ? $($params.refer) : render.$console,
		endDate = tool.formatDate(new Date().getTime()),
		startDate = tool.getPreMonth(endDate),
		apiParams={
			strStartDate:startDate,
			strEndDate:endDate,
			/*strStartDate:'2017-01-01',
			strEndDate:'2017-08-01'*/
			deptId:null,
			bankCode:null,
		},
		pageBcData={},/*保存点击跳转详情时的查询参数*/
		textNameObj={
			companyName:null,
			bankName:null
		};

	/*查询前去除空查询字段*/
	var delNull=function(obj){
		for(var i in obj){
			if(obj[i]==null||(obj[i]==""&&obj[i]!==0)||obj[i]==undefined||obj[i]=='undefined')
				delete obj[i];
		};
		return obj;
	};
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
		        left: 'right',
		        top:'middle',
		        data: _name
		    },
		    //animation:false,/*鼠标经过时不放大图片*/
		    color:['#fed700','#87cefa','#35cb2c','#83a9f0','#ff69b3','#ba56d4','#cd5c5c','#ffa401','#fe6347','#4ecbb4','#00fa99'],
		    series : [
		        {
		            name: '访问来源',
		            type: 'pie',//指定类型为饼图
		            center: ['40%', '50%'],
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
		var nameArr=[],dataList=[],otherTotal=0;
		for(var i=0;i<data.length;i++){
			var _it=data[i];
			if(i<6){
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
			}else{
				if(_it.serviceCallNum){
					otherTotal+=Number(_it.serviceCallNum);
				};
				if(i==data.length-1){
					nameArr.push("其他");
					dataList.push({value:otherTotal, name:"其他"});					
				};
			};
		};
		setEcharts(nameArr,dataList);
	};
	// 查询数据总览
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
	/*排序后的数据整理及echarts图表显示*/
	var sortCallback=function(type,upOrDown){/*upOrDown(true:up,false:down)*/
		var sortData=[],one=-1,two=1;
		if(upOrDown){/*升序*/
			one=1;
			two=-1;
		};
		if(type&&$scope.result&&$scope.result.length>0){
			if(type=="srvNum"){
				sortData=$scope.result.sort(function (a, b) {
					    return a.serviceCallNum > b.serviceCallNum ? one : two;
					});/*根据serviceCallNum字段进行降序-降序排序*/
			}else if(type=="srvMoney"){
				sortData=$scope.result.sort(function (a, b) {
					    return a.serviceFee > b.serviceFee ? one : two;
					});/*根据serviceFee字段进行降序-降序排序*/
			}else if(type=="hisNum"){
				sortData=$scope.result.sort(function (a, b) {
					    return a.verifyNum > b.verifyNum ? one : two;
					});/*根据verifyNum字段进行降序-降序排序*/
			}else if(type=="totalMoney"){
				sortData=$scope.result.sort(function (a, b) {
					    return a.serviceAmount > b.serviceAmount ? one : two;
					});/*根据serviceAmount字段进行降序-降序排序*/
			};

		};
		render.compile($scope.$el.$table, $scope.def.tableTmpl, sortData, true);
		/*数据汇总及echarts图表数据整理*/
		getEchartsData(sortData);
	};
	// 查询列表数据
	var searchlist=function(param,callback){
		$.ajax({
			type: 'post',
			dataType:"json",
			url: $http.api('riskStatis/queryRisk','cyj'),
			data: param,
			success: $http.ok(function(res) {
				pageBcData=param;
				pageBcData.companyName=textNameObj.companyName;
				pageBcData.bankName=textNameObj.bankName;
				$scope.result=res.data.list;
				$scope.$el.$searchTimeTitle.text(apiParams.strStartDate+"至"+apiParams.strEndDate+"明细");				
				/*数据汇总数据整理*/
				var totalSummary={
					historyCalls:0,
					totalServiceAmt:0,
					ableBalance:0
				};
				if(res.data.totalVerifyOrderNum)
					totalSummary.historyCalls=Number(res.data.totalVerifyOrderNum);
				for(var i in $scope.result){
					var _it=$scope.result[i];
					if(_it.serviceCallNum)
						totalSummary.totalServiceAmt+=Number(_it.serviceCallNum);
					if(_it.serviceAmount)
						totalSummary.ableBalance+=Number(_it.serviceAmount);
				};
				render.compile($scope.$el.$serviceStatic, $scope.def.serviceStaticTemp, totalSummary, true);
				/*排序后的数据整理及echarts图表显示*/
				sortCallback('srvNum',false);
				if(callback && typeof callback == 'function') {
					callback();
				};
			})
		});
	};
	// 页面首次载入时绑定事件
 	var evt = function() {
		$scope.$el.$searchBtn.click(function(){
			apiParams.strStartDate=$scope.$el.$startTime.val();
			apiParams.strEndDate=$scope.$el.$endTime.val();
			searchlist(delNull(apiParams));
		});
		$scope.$el.$table.off("click",".detailed").on("click",".detailed",function() {
			var _apiKey=$(this).data("apikey");/*必填*/
			var _apiPrimary=$(this).data("apiprimary");/*非必填*/
			if(_apiKey)
				router.render("riskManagementDetail", {				
					pageNum: 1,
					strStartDate: pageBcData.strStartDate,
					strEndDate: pageBcData.strEndDate,
					deptId: pageBcData.deptId,
					bankCode: pageBcData.bankCode,
					apiKey: _apiKey,
					apiPrimary: _apiPrimary,
					companyName:pageBcData.companyName,
					bankName:pageBcData.bankName
				});
		});
		$scope.$el.$titleIcon.hover(function() {
			$(this).find(".hid-tip").toggle();
		});
		$scope.$el.$sortTr.off("click",".time-sort").on("click",".time-sort",function() {
			var _type=$(this).data('type');
			$(this).parent("td").siblings("td").find(".time-sort").removeClass("time-sort-up").addClass("time-sort-down");
			var _bool=true;
			if($(this).hasClass('time-sort-up')){/*升变降*/
				_bool=false;
			}else if($(this).hasClass('time-sort-down')){/*降变升*/
				_bool=true;
			};
			sortCallback(_type,_bool);
		});
 	};
	// 加载页面模板
	$console.load(router.template('iframe/operationsTab1'), function() {
		$scope.def.valuationTotalTemp = $console.find('#valuationTotalTemp').html();//数据总览模板
		$scope.def.serviceStaticTemp = $console.find('#serviceStaticTemp').html();//服务使用情况统计
		$scope.def.tableTmpl = $console.find('#riskManagementTmpl').html();//表格模板
		$scope.$context=$console.find("#risk-management");
		$scope.$el = {
			$titleIcon:$scope.$context.find('#radius-icon'),
			$valuationTotal:$scope.$context.find('#valuation-total'),
			$serviceStatic:$scope.$context.find('#serviceStatic'),
			$table: $scope.$context.find('#riskManagementTable'),
			$sortTr: $scope.$context.find('#sort-tr'),
			$searchBtn: $scope.$context.find('#search'),
			$startTime: $scope.$context.find('#dateStart'),
			$endTime: $scope.$context.find('#dateEnd'),
			$searchTimeTitle: $scope.$context.find('#searchTimeTitle'),
		};
		// 启用下拉功能
		$console.find('.select').dropdown();
		// 日期控件
		$console.find('.dateBtn').datepicker();
		$scope.$el.$startTime.val(startDate);
		$scope.$el.$endTime.val(endDate);
		searchTotal();/*查询数据总览*/
		searchlist(delNull(apiParams), function() {
			evt();	
		});/*查询服务使用情况统计*/
	});
	// 下拉功能数据
	$scope.dropdownTrigger = {
		TypeSel: function(t, p, cb) {
			$.ajax({
				type: 'post',
				url: $http.api('riskStatis/getDeptList',true),
				dataType: 'json',
				success: $http.ok(function(xhr) {
					xhr.data.unshift({
						id: null,
						name: '全部'
					});
					var sourceData = {
						items: xhr.data,
						id: 'id',
						name: 'name'
					};
					cb(sourceData);
				})
			})
		},
		bankSel: function(t, p, cb) {
			$.ajax({
				type: 'post',
				url: $http.api('demandBank/selectBank',true),
				dataType: 'json',
				success: $http.ok(function(xhr) {
					xhr.data.unshift({
						bankCode: null,
						bankName: '全部'
					});
					var sourceData = {
						items: xhr.data,
						id: 'bankCode',
						name: 'bankName'
					};
					cb(sourceData);
				})
			})
		},
	};
	// 下拉回调
	$scope.TypePicker=function(val){
		apiParams.deptId=val.id;
		textNameObj.companyName=val.name;
	};
	$scope.bankPicker=function(val){
		apiParams.bankCode=val.id;
		textNameObj.bankName=val.name;
	};
});