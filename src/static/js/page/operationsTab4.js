'use strict';
page.ctrl('operationsTab4', ['vendor/echarts.min'], function($scope) {
	var $params = $scope.$params,
		$console = $params.refer ? $($params.refer) : render.$console,
		selValObj={},
		savedQuery={},/*全局保存查询的条件*/
		apiParams = {
			pageNum: 1
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
	* 初始进入时加载运营分析信息表数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadLoanList = function(params, cb) {
		console.log(params);
		$.ajax({
			type:'post',
			dataType:'json',
			headers:'',
			url: $http.api('statisticsPic/InitLoanScheduling.html', 'operations'),
			data: {'deptId':apiParams.deptId},
			success: $http.ok(function(result) {
				var data=result.data;
				debugger
				$scope.$el.$startTime.val(data.startDate);
				$scope.$el.$endTime.val(data.endDate);
				$scope.$el.$startTimeContent.text(data.startDate);
				$scope.$el.$endTimeContent.text(data.endDate);
				$scope.$el.$startTimeContent2.text(data.startDate);
				$scope.$el.$endTimeContent2.text(data.endDate);
				$scope.$el.$financeReleasedTotal.text(data.LoanScheduling.financeReleasedTotal);
				$scope.$el.$financeReleasedAccountTotal.text(data.LoanScheduling.financeReleasedAccountTotal);
				//$scope.$el.$bankLendersTotal.text(data.LoanScheduling.bankLendersTotal);
				//$scope.$el.$bankLendersAccountTotal.text(data.LoanScheduling.bankLendersAccountTotal);
				$scope.$el.$financeAccountTotal.text(data.LoanScheduling.financeAccountTotal);
				$scope.$el.$financeAmountTotal.text(data.LoanScheduling.financeAmountTotal);
				$scope.$el.$selfFinanceAccountTotal.text(data.LoanScheduling.selfFinanceAccountTotal);
				$scope.$el.$selfFinanceAmountTotal.text(data.LoanScheduling.selfFinanceAmountTotal);
				// 下拉功能数据
				$scope.dropdownTrigger = {
					deptCompany: function(t, p, cb) {
						$.ajax({
							type: 'get',
							url: $http.api('pmsDept/getPmsDeptList', 'zyj'),
							dataType: 'json',
							jsonp: 'callback',
							headers:'',
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
					BankSel: function(t, p, cb) {
						debugger
						var sourceData = {
							items: data.bankList,
							id: 'id',
							name: 'name'
						};
						cb(sourceData);
					}
				};
				// 下拉回调
				$scope.deptCompanyPicker=function(val){
					selValObj.deptIds=val.id;
				};
				$scope.BankPicker=function(val){
					selValObj.bankId=val.id;
				};
				$console.find('.select').dropdown();
				
				render.compile($scope.$el.$table, $scope.def.listTmpl, data.loanSchedulingList, true);
				setupPaging(data.page, true);
				if(cb && typeof cb == 'function') {
					cb();
				}
			})
		});
	}
	
	/**
	* 点击搜索按钮时加载运营分析信息表数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadLoanListSearch = function(params, cb) {
		debugger
		var data=params.data;
		$scope.$el.$startTimeContent.text($scope.$el.$startTime.val());
		$scope.$el.$endTimeContent.text($scope.$el.$endTime.val());
		$scope.$el.$startTimeContent2.text($scope.$el.$startTime.val());
		$scope.$el.$endTimeContent2.text($scope.$el.$endTime.val());
		$scope.$el.$financeReleasedTotal.text(data.LoanScheduling.financeReleasedTotal);
		$scope.$el.$financeReleasedAccountTotal.text(data.LoanScheduling.financeReleasedAccountTotal);
		//$scope.$el.$bankLendersTotal.text(data.LoanScheduling.bankLendersTotal);
		//$scope.$el.$bankLendersAccountTotal.text(data.LoanScheduling.bankLendersAccountTotal);
		$scope.$el.$financeAccountTotal.text(data.LoanScheduling.financeAccountTotal);
		$scope.$el.$financeAmountTotal.text(data.LoanScheduling.financeAmountTotal);
		$scope.$el.$selfFinanceAccountTotal.text(data.LoanScheduling.selfFinanceAccountTotal);
		$scope.$el.$selfFinanceAmountTotal.text(data.LoanScheduling.selfFinanceAmountTotal);
		
		render.compile($scope.$el.$table, $scope.def.listTmpl, data.loanSchedulingList, true);
		setupPaging(data.page, true);
		if(cb && typeof cb == 'function') {
			cb();
		}
	
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
	var evt=function(){
		debugger
		$scope.$el.$searchBtn.click(function(){
			debugger
			savedQuery={
				startDate:$scope.$el.$startTime.val(),
				endDate:$scope.$el.$endTime.val(),
				deptId: apiParams.deptId,
				bankId:selValObj.bankId,
				deptIds:selValObj.deptIds
			};
			$.ajax({
				type:'post',
				dataType:'json',
				url: $http.api('statisticsPic/queryLoanScheduling.html', 'operations'),
				data: savedQuery,
				success: $http.ok(function(res) {
					loadLoanListSearch(res);
				})
			});			
		});
	};
	/***
	* 加载页面模板
	*/
	$console.load(router.template('iframe/operationsTab4'), function() {
		$scope.def = {
			listTmpl : $console.find('#operationsAnalysisListTmpl').html()
		}
		$scope.$context=$console.find("#operations-analysis");
		$scope.$el = {
			$startTime: $scope.$context.find('#dateStart'),
			$endTime: $scope.$context.find('#dateEnd'),
			$startTimeContent:$scope.$context.find('#dateStartContent'),
			$endTimeContent:$scope.$context.find('#dateEndContent'),
			$startTimeContent2:$scope.$context.find('#dateStartContent2'),
			$endTimeContent2:$scope.$context.find('#dateEndContent2'),
			$financeReleasedTotal:$scope.$context.find('#financeReleasedTotal'),
			$financeReleasedAccountTotal:$scope.$context.find('#financeReleasedAccountTotal'),
			//$bankLendersTotal:$scope.$context.find('#bankLendersTotal'),
			//$bankLendersAccountTotal:$scope.$context.find('#bankLendersAccountTotal'),
			$financeAccountTotal:$scope.$context.find('#financeAccountTotal'),
			$financeAmountTotal:$scope.$context.find('#financeAmountTotal'),
			$selfFinanceAccountTotal:$scope.$context.find('#selfFinanceAccountTotal'),
			$selfFinanceAmountTotal:$scope.$context.find('#selfFinanceAmountTotal'),
			$table: $scope.$context.find('#operationsAnalysisTable'),
			$searchBtn: $scope.$context.find('#search'),
			$paging: $console.find('#pageToolbar')
		}
		// 日期控件
		$console.find('.dateBtn').datepicker();
		getDeptId(function() {
			loadLoanList(apiParams,function(){
				evt();
			});
		});
	});

	/**
	 * 分页
	 */
	$scope.paging = function(_page, _size, $el, cb) {
		apiParams.page = _page;
		loadLoanListSearch(apiParams);
		cb();
	}
	
});