'use strict';
page.ctrl('loanInfo', function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		$source = $scope.$source = {},
		apiParams = {
			process: $params.process || 0,
			page: $params.page || 1,
			pageSize: 20
		};
	/**
	* 加载车贷办理数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadLoanList = function(params, cb) {
		$.ajax({
			url: $http.api($http.apiMap.loanInfo),
			data: params,
			success: $http.ok(function(result) {
				render.compile($scope.$el.$tbl, $scope.def.listTmpl, result.data, true);
				if(cb && typeof cb == 'function') {
					cb();
				}
			})
		})
	}
	
	$(document).on('click', '#selectType', function() {
		var that = $(this);
//		if($source.selectType) {
//			alert(1);
////			$('#selectTypeOpt').show();
//			return true;
//		}
		$.ajax({
			url: $http.api($http.apiMap.serviceType),
			success: $http.ok(function(result) {
				render.compile(that, $scope.def.selectTypeTmpl, result.data, true);
				$source.selectType = result.data;
//				$('#selectTypeOpt').show();
//				$('#selectType').text("请选择");
				$('#selectTypeIH').val('');
				return false;
			})
		})
//		$('#selectTypeOpt').show();
	})
	$(document).on('click', '#selectTypeOpt li', function() {
		var value = $(this).val();
		var text = $(this).text();
		$('#selectTypeIH').val(value);
		$('#selectType').html(text);
		var value1 = $('#selectTypeIH').val();
		if(value1 == 0){
			$('#selectType').html("请选择");
		}
		return false;
	})
	$(document).bind("click",function(e){ 
		var target = $(e.target); 
		if(target.closest("#selectTypeOpt").length == 0){ 
			$("#selectTypeOpt").hide(); 
			var value1 = $('#selectTypeIH').val();
			if(value1 == 0){
				$('#selectType').html("请选择");
			}
			return false;
		} 
	}) 	
	/***
	* 加载页面模板
	*/
	render.$console.load(router.template('loan-info'), function() {
		$scope.def.listTmpl = render.$console.find('#loanlisttmpl').html();
		$scope.def.selectTypeTmpl =  render.$console.find('#selectTypetmpl').html();
		$scope.$el = {
			$tbl: $console.find('#loanInfoTable'),
				  
		}
		if($params.process) {
			
		}
		loadLoanList(apiParams);
	});
});



