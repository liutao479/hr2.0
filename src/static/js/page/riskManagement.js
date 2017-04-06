'use strict';
page.ctrl('riskManagement', function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		apiParams = {
			pageNum: $params.pageNum || 1,
		},
		tabList=[
			{text:"风控服务统计"},
			{text:"业务量日统计"},
			{text:"业务量区间统计"},
			{text:"放款调度统计"},
			{text:"逾期情况统计"},
			{text:"报表下载"},
		];
	// 查询列表数据
	var search=function(param,callback){
		$.ajax({
			type: 'get',
			dataType:"json",
			url: $http.api('materialInspection'),
			data: param,
			success: $http.ok(function(result) {
				render.compile($scope.$el.$tab, $scope.def.tabTmpl, tabList, true);
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
		/*饼图start*/
		//var myChart = echarts.init(document.getElementById('piechart'));
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
		//myChart.setOption(option);
		/*饼图end*/
 	};
	// 加载页面模板
	render.$console.load(router.template('iframe/risk-management'), function() {
		$scope.def.tabTmpl = render.$console.find('#roleBarTabTmpl').html();
		$scope.$el = {
			$tab: $console.find('#roleBarTab'),
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
		bankSel: function(t, p, cb) {
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
	$scope.bankPicker=function(val){
		console.log(val)
	};
});