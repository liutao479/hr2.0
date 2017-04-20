'use strict';
page.ctrl('operationsTab3', ['vendor/echarts.min'], function($scope) {
	var $params = $scope.$params,
		$console = $params.refer ? $($params.refer) : render.$console,
		tabNum=0,/*订单量0，贷款金额1*/
		dimension=0,/*维度,默认0当前进度*/
		apiParams = {},
		srcItemList={
			order:[
				{index:0,src:"queryByProgress"},/*当前进度*/
				{index:1,src:"queryStatisticsByCarBrandId"},/*车辆品牌*/
				{index:2,src:"queryStatisticsByLicenseCateGory"},/*牌照类型*/
				{index:3,src:"queryStatisticsByCarType"},/*是否进口*/
				{index:4,src:"queryStatisticsByIsSecondCar"},/*是否二手车*/
				{index:5,src:"queryStatisticsByDemandBank"},/*经办银行*/
				{index:6,src:"queryStatisticsByBusinessModel"},/*业务模式*/
				{index:7,src:"queryStatisticsByIsAdvanced"},/*是否垫资*/
				{index:8,src:"queryStatisticsByIsDiscount"},/*是否贴息*/
				{index:9,src:"queryStatisticsByRenewalMode"}/*续保方式*/
			],
			money:[
				{index:0,src:"queryByProgress"},/*当前进度*/
				{index:1,src:"queryStatisticsByCarBrandIdAndMoney"},/*车辆品牌*/
				{index:2,src:"queryStatisticsByLicenseCateGoryMoney"},/*牌照类型*/
				{index:3,src:"queryStatisticsByCarType"},/*是否进口*/
				{index:4,src:"queryStatisticsByIsSecondCar"},/*是否二手车*/
				{index:5,src:"queryStatisticsByDemandBank"},/*经办银行*/
				{index:6,src:"queryStatisticsByBusinessModel"},/*业务模式*/
				{index:7,src:"queryStatisticsByIsAdvanced"},/*是否垫资*/
				{index:8,src:"queryStatisticsByIsDiscount"},/*是否贴息*/
				{index:9,src:"queryStatisticsByRenewalMode"}/*续保方式*/
			]
		};

	/**
	 * 取得登录用户deptId
	 */
	var getDeptId = function(cb) {
		$.ajax({
			type: 'post',
			url: $http.api('pmsDept/getDept', 'zyj'),
			dataType: 'json',
			success: $http.ok(function(xhr) {
				apiParams.deptId = xhr.data.id;
				if(cb && typeof cb == 'function') {
					cb();
				}
			})
		})
	}

	/**
	* 日历控件
	*/
	var setupDatepicker = function() {
		$console.find('.dateBtn').datepicker({
			onpicked: function() {
				var that = $(this);
				apiParams[that.data('type')] = that.val();
			},
			oncleared: function() {
				delete apiParams[$(this).data('type')];
			}
		});
	}
	/**
	* dropdown控件
	*/
	function setupDropDown() {
		$console.find('.select').dropdown();
	}
	/*echarts图表绘制*/
	var setEcharts=function(_name,_list){
		/*折线图start*/
		var myChart = echarts.init(document.getElementById('piechart'));                    
		var option = {
			    title : {
			        text: "",
			        subtext: '',
			        x:'center'
			    },
			    tooltip : {
			        trigger: 'item',
			        formatter: "{a} <br/>{b} : {c} ({d}%)"
			    },
			    legend: {
			        orient : 'vertical',
			        x : 'left',
			        data:_name
			    },
			    toolbox: {
			        show : true,
			        feature : {
			            dataView : {show: true, readOnly: false},
			            magicType : {
			                show: true, 
			                type: ['pie']
			            },
			            restore : {show: true},
			            saveAsImage : {show: true}
			        }
			    },
			    calculable : true,
			    series : [
			        {
			            name:'',
			            type:'pie',
			            radius : '55%',
			            center: ['50%', '60%'],
			            data:_list
			        }
			    ]
			};
		myChart.setOption(option);
		/*饼图end*/
	};

	// 查询列表数据
	var searchlist=function(apiParams,cb){
		console.log($http.api('statisticsPic/queryStatisticsByDayTime.html', 'operations'));
		$.ajax({
			type: 'post',
			url: $http.api('statisticsPic/queryStatisticsByDayTime.html', 'operations'),
			data: apiParams,
			dataType:"json",	
			headers: '',
			success: $http.ok(function(res) {
				console.log(res);
				var _listName = res.data.listName;
				var _seriesList = res.data.seriesList;
				var _xAxisList = res.data.xAxisList;
				setEcharts(_listName,_seriesList,_xAxisList);
			})
		});
		if(cb && typeof cb == 'function') {
			cb();
		}
	};
	var searchEcharts=function(params, _url){
		var _src = $http.api('statisticsPic/' + _url + '.html', 'operations');
		$.ajax({
			type: 'post',
			url: _src,
			data: params,
			dataType:"json",	
			headers: '',
			success: $http.ok(function(res) {
				setEcharts(res.data.listName,res.data.listData);
			})
		});
	};
	var evt=function(){
		$scope.$el.$searchEl.click(function(){
			var urlObj=[];
			var _query={
				deptId:apiParams.deptId,
				startDate:$console.find('#dateStart').val(),
				endDate:$console.find('#dateEnd').val(),
				deptIds:apiParams.deptIds
			};
			if(tabNum == 0){
				urlObj=srcItemList.order.filter(it=>it.index==dimension);
			}else if(tabNum == 1){
				urlObj=srcItemList.money.filter(it=>it.index==dimension);	
				_query.isByMoney =1;
			};
			if(urlObj&&urlObj.length==1){
				searchEcharts(_query,urlObj[0].src);
			};			
		});
		$scope.$el.$changeTab.off("click","li:not(.role-item-active)").on("click","li:not(.role-item-active)",function(){
			var _index=$(this).index();
			tabNum=_index;
			$(this).find("a").addClass("role-item-active");
			$(this).siblings("li").find("a").removeClass("role-item-active");
			var urlObj=[];
			var _query={
				deptId:apiParams.deptId,
				startDate:$console.find('#dateStart').val(),
				endDate:$console.find('#dateEnd').val(),
				deptIds:apiParams.deptIds
			};
			if(_index == 0){
				urlObj=srcItemList.order.filter(it=>it.index==dimension);
			}else if(_index == 1){
				urlObj=srcItemList.money.filter(it=>it.index==dimension);	
				_query.isByMoney =1;
			};
			if(urlObj&&urlObj.length==1){
				searchEcharts(_query,urlObj[0].src);
			};
		});
	};
	/***
	* 加载页面模板
	*/
	$console.load(router.template('iframe/operationsTab3'), function() {
		$scope.def = {
			listTmpl : $console.find('#operateAnatmpl').html()
		}
		$scope.$el={
			$searchEl:$console.find("#search"),
			$changeTab:$console.find("#changeTab")
		}
		setupDatepicker();
		setupDropDown();
		evt();
		getDeptId(function() {
			var _defaultSrc=srcItemList.order[0].src;
			searchEcharts({
				deptId:apiParams.deptId
			},_defaultSrc);/*默认查询订单量图表*/
		})
	});

	//分公司ID
	$scope.deptCompanyPicker = function(picked) {
		if(picked.id == '全部') {
			delete apiParams.deptIds;
			return false;
		}
		apiParams.deptIds = picked.id;
	}
	
	$scope.wdPicker = function(picked) {
		dimension=picked.id;
		var urlObj=[];
		var _query={
			deptId:apiParams.deptId,
			startDate:$console.find('#dateStart').val(),
			endDate:$console.find('#dateEnd').val(),
			deptIds:apiParams.deptIds
		};
		if(tabNum == 0){
			urlObj=srcItemList.order.filter(it=>it.index==picked.id);
		}else if(tabNum == 1){
			urlObj=srcItemList.money.filter(it=>it.index==picked.id);		
			_query.isByMoney =1;
		};
		if(urlObj&&urlObj.length==1){
			searchEcharts(_query,urlObj[0].src);
		};
	}
	
	$scope.dropdownTrigger = {
		deptCompany: function(t, p, cb) {
			$.ajax({
				type: 'get',
				url: $http.api('pmsDept/getPmsDeptList', 'zyj'),
				dataType: 'json',
				success: $http.ok(function(xhr) {
					xhr.data.unshift({
						id: '全部',
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
		wd: function(t, p, cb) {
			var data = [
				{
					id: 0,
					name: '按当前进度'
				},
				{
					id: 1,
					name: '按车辆品牌'
				},
				{
					id: 2,
					name: '按牌照类型'
				},
				{
					id: 3,
					name: '按是否进口车'
				},
				{
					id: 4,
					name: '按是否二手车'
				},
				{
					id: 5,
					name: '按经办银行'
				},
				{
					id: 6,
					name: '按业务模式'
				},
				{
					id: 7,
					name: '按是否垫资'
				},
				{
					id: 8,
					name: '按是否贴息'
				},
				{
					id: 9,
					name: '按续保方式'
				}
			];
			var sourceData = {
				items: data,
				id: 'id',
				name: 'name'
			};
			cb(sourceData);
		}
	}
});