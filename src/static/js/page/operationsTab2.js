'use strict';
page.ctrl('operationsTab2', ['vendor/echarts.min'], function($scope) {
	var $params = $scope.$params,
		$console = $params.refer ? $($params.refer) : render.$console,
		apiParams = {
			deptId:62
		};
	/**
	 * 首次加载页面绑定立即处理事件
	 */
	var evt = function() {
		$console.find('#search').on('click',function(){
			searchlist(apiParams);
		});
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
	var setEcharts=function(_listName,_seriesList,_xAxisList){
		/*折线图start*/
		var myChart = echarts.init(document.getElementById('linechart'));                    
		var option = {
    			    title : {
    			        text: '',
    			        subtext: ''
    			    },
    			    tooltip : {
    			    	show: true,
            	    	trigger: 'item'
    			    },
    			    legend: {
    			        data:_listName
    			    },
    			  	dataZoom: {
    			        show: true,
    			        start : 0
    			    },
    			    toolbox: {
    			        show : true,
    			        feature : {
//    			            mark : {show: true},
    			            dataView : {show: true, readOnly: false},
    			            magicType : {show: true, type: ['line', 'bar']},
    			            restore : {show: true},
    			            saveAsImage : {show: true}
    			        }
    			    },
    			    calculable : true,
    			    xAxis : [
    			        {
    			            type : 'category',
    			            boundaryGap : true,
    			            data : _xAxisList
    			        }
    			    ],
    			    yAxis : [
    			        {
    			            type : 'value',
    			            axisLabel : {
    			                formatter: '{value} 万'
    			            }
    			        }
    			    ],
    			    series : _seriesList
    			};
		myChart.setOption(option);
		/*折线图end*/
	};

	// 查询列表数据
	var searchlist=function(apiParams,cb){
//		debugger
		$.ajax({
			type: 'post',
			url: 'http://192.168.1.55:8080/statisticsPic/queryStatisticsByDayTime.html',
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

	/***
	* 加载页面模板
	*/
	$console.load(router.template('iframe/operationsTab2'), function() {
		$scope.def = {
			listTmpl : $console.find('#operateAnatmpl').html()
		}
		setupDatepicker();
		setupDropDown();
		searchlist(apiParams,function(){
			evt();
		});
		// loadLoanList(apiParams);
	});

	/**
	 * 分页
	 */
	$scope.paging = function(_page, _size, $el, cb) {
		apiParams.page = _page;
		loadLoanList(apiParams);
		cb();
	}
	//分公司ID
	$scope.deptCompanyPicker = function(picked) {
		if(picked.id == '全部') {
			delete apiParams.deptId;
			return false;
		}
		apiParams.deptIds = picked.id;
	}
	//当前进度
	$scope.categoryPicker = function(picked) {
		if(picked.id == '全部') {
			delete apiParams.progressCode;
			return false;
		}
		debugger
		apiParams.progressCode = picked.id;
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
		category: function(t, p, cb) {
			$.ajax({
				type: 'post',
				url: $http.api('product/taskNameCode', 'zyj'),
				dataType: 'json',
				success: $http.ok(function(xhr) {
					xhr.data.unshift({
						taskCode: '全部',
						taskName: '全部'
					});
					var sourceData = {
						items: xhr.data,
						id: 'taskCode',
						name: 'taskName'
					};
					cb(sourceData);
				})
			})
		}
	}
});