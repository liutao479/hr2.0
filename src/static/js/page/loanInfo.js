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
//业务类型	
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
//上牌地
	$(document).on('click', '#selectType', function() {
		var that = $(this);
		$.ajax({
			url: $http.api($http.apiMap.serviceType),
			success: $http.ok(function(result) {
				render.compile(that, $scope.def.selectTypeTmpl, result.data, true);
				$source.selectType = result.data;
				$('#selectTypeIH').val('');
				return false;
			})
		})
	})
	$(document).on('click', '#selectTypeOpt option', function() {
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
	
//点击下拉消失	
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
//点击本地常驻类型复选框
	//主申请人
	$(document).on('click', '#mainPersonRdtype .checkbox', function() {
		$(this).toggleClass('checked');
		returnCheckboxVal();
	})
	function returnCheckboxVal(){
		var data="";
		$('#mainPersonRdtype .checked').each(function(){
			data += $(this).attr("data-value")+",";
		});
		var value = data.substring(0,data.length-1);
		$("#mainPersonTp").val(value);
		console.log($("#mainPersonTp").val());
		return;
	}
	//共同还款人，反担保人



/***
	* 保存按钮
	*/
	$(document).on('click', '#saveOrderInfo', function() {
        var data = $('#orderInfoForm').serializeArray();
        console.log(data);
		$.ajax({
			type: 'POST',
			url: 'http://192.168.0.107',
			data: data,
			dataType: 'text',
			success: function(result){
				console.log("success");
			}
		});
	})
	$(document).on('click', '#saveCarInfo', function() {
        var data = $('#carInfoForm').serializeArray();
        console.log(data);
//		$.ajax({
//			type: 'GET',
//			url: '',
//			data: data,
//			dataType: 'text',
//			success: function(result){
//				console.log("success");
//			}
//		});
	})
	$(document).on('click', '#saveStageInfo', function() {
        var data = $('#stageInfoForm').serializeArray();
        console.log(data);
//		$.ajax({
//			type: 'GET',
//			url: '',
//			data: data,
//			dataType: 'text',
//			success: function(result){
//				console.log("success");
//			}
//		});
	})
	$(document).on('click', '#saveMainInfo', function() {
        var data = $('#mainPersonInfoForm').serializeArray();
        console.log(data);
//		$.ajax({
//			type: 'GET',
//			url: '',
//			data: data,
//			dataType: 'text',
//			success: function(result){
//				console.log("success");
//			}
//		});
	})
//	$(document).on('click', '#saveCommonInfo_'+i, function(i) {
//      var data = $('#commonPersonInfoForm_'+i).serializeArray();
//      console.log(data);
//		$.ajax({
//			type: 'GET',
//			url: '',
//			data: data,
//			dataType: 'text',
//			success: function(result){
//				console.log("success");
//			}
//		});
//	})
//	$(document).on('click', '#saveGuaInfo_'+i, function(i) {
//      var data = $('#guaPersonInfoForm_'+i).serializeArray();
//      console.log(data);
//		$.ajax({
//			type: 'GET',
//			url: '',
//			data: data,
//			dataType: 'text',
//			success: function(result){
//				console.log("success");
//			}
//		});
//	})
	$(document).on('click', '#saveEmergencyInfo', function() {
        var data = $('#emergencyInfoForm').serializeArray();
        console.log(data);
//		$.ajax({
//			type: 'GET',
//			url: '',
//			data: data,
//			dataType: 'text',
//			success: function(result){
//				console.log("success");
//			}
//		});
	})
	$(document).on('click', '#saveloanPayCardInfo', function() {
        var data = $('#loanPayCardInfoForm').serializeArray();
        console.log(data);
		$.ajax({
			type: 'POST',
			url: 'http://192.168.0.107',
			data: data,
			dataType: 'text',
			success: function(result){
				console.log("success");
			}
		});
	})
	$(document).on('click', '#saveLoanFeeInfo', function() {
        var data = $('#loanFeeInfoForm').serializeArray();
        console.log(data);
//		$.ajax({
//			type: 'GET',
//			url: '',
//			data: data,
//			dataType: 'text',
//			success: function(result){
//				console.log("success");
//			}
//		});
	})
	$(document).on('click', '#saveOtherInfo', function() {
        var data = $('#otherInfoForm').serializeArray();
        console.log(data);
//		$.ajax({
//			type: 'GET',
//			url: '',
//			data: data,
//			dataType: 'text',
//			success: function(result){
//				console.log("success");
//			}
//		});
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



