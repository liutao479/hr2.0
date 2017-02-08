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
	var apiMap = {
		"sex": "http://127.0.0.1:8083/mock/sex",
		"isSecond": "http://127.0.0.1:8083/mock/isSecond",
		"serviceType": "http://127.0.0.1:8083/mock/serviceType",
		"demandBankId": "http://127.0.0.1:8083/mock/demandBankId",
		"busiSourceType": "http://127.0.0.1:8083/mock/busiSourceType",
		"busiArea": "http://127.0.0.1:8083/mock/busiArea",
		"busiSourceName": "http://127.0.0.1:8083/mock/busiSourceName"
		}
	
	/**
	* 加载车贷办理数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadLoanList = function(params, cb) {
		$.ajax({
			url: $http.api($http.apiMap.loanInfo),
			data: params,
			async:false,
			success: $http.ok(function(result) {
				render.compile($scope.$el.$tbl, $scope.def.listTmpl, result, true);
				if(cb && typeof cb == 'function') {
					cb();
				}
				loanFinishedSelect();
				loanFinishedCheckbox();
			})
		});
		
	}
//页面加载完成对所有下拉框进行赋值	
	var loanFinishedSelect = function(){
		$(".selecter").each(function(){
			var that =$("div",$(this));
			var key = $(this).data('key');
			var boxKey = key + 'Box';
			$(this).attr("id",boxKey);
   			//console.log(key);
			$.ajax({
				url: apiMap[key],
				data: $params,
				async:false,
				success: $http.ok(function(result) {
					render.compile(that, $scope.def.selectOpttmpl, result.data, true);
					$source.selectType = result.data;
					var selectOptBox = $(".selectOptBox");
					selectOptBox.attr("id",key);
				})
			})
			var value1 = $("input",$(this)).val();
			$("li",$(this)).each(function(){
				var val = $(this).val();
				var text = $(this).text();
				//console.log("fu"+value1+",zi"+val);
				if(value1 == val){
					$(this).parent().parent().siblings(".placeholder").html(text);
					$(this).parent().parent().siblings("input").val(val);
					var value2 = $(this).parent().parent().siblings("input").val();
					if(!value2){
						$(this).parent().parent().siblings(".placeholder").html("请选择")
					}
					$(".selectOptBox").hide(); 
				}
			})
			
		});
	}
	
//点击下拉框拉取选项	
	$(document).on('click','.selecter', function() {
		var that =$("div",$(this));
		var key = $(this).data('key');
		var boxKey = key + 'Box';
		$(this).attr("id",boxKey);
// 		//console.log(key);
		$.ajax({
			url: apiMap[key],
			data: $params,
			success: $http.ok(function(result) {
				render.compile(that, $scope.def.selectOpttmpl, result.data, true);
				$source.selectType = result.data;
				var selectOptBox = $(".selectOptBox");
				selectOptBox.attr("id",key);
			})
		})
	})
	//点击下拉选项
	$(document).on('click', '.selectOptBox li', function() {
		var value = $(this).val();
		var text = $(this).text();
		$(this).parent().parent().siblings(".placeholder").html(text);
		$(this).parent().parent().siblings("input").val(value);
		var value1 = $(this).parent().parent().siblings("input").val();
		if(!value1){
			$(this).parent().parent().siblings(".placeholder").html("请选择")
		}
		$(".selectOptBox").hide(); 
		return false;
	})
//点击下拉消失	
	$(document).on("click",function(e){ 
		var target = $(e.target);
		if(target.closest(".selectOptBox").length == 0){ 
			$(".selectOptBox").hide(); 
			return false;
		}
	})

//点击本地常驻类型复选框
	//主申请人
	$(document).on('click', '.checkbox', function() {
		returnCheckboxVal();
	})
	function returnCheckboxVal(){
		$(".info-key-check-box").each(function(){
			var data="";
			$('.checked',$(this)).each(function(){
				data += $(this).attr("data-value")+",";
			});
			var value = data.substring(0,data.length-1);
			$("input",$(this)).val(value);
			return;
		})
	}
	var loanFinishedCheckbox = function(){
		$(".info-key-check-box").each(function(){
			var that =$("input",$(this)),
				checkBox =$("div.checkbox",$(this));
			var data={};
			data = that.val().split(",");
			$(".checkbox",$(this)).each(function(){
				var thisVal = $(this).data('value');
				var div = $(this);
				$.each(data,function(n,value){
					if(value == thisVal){
						div.addClass('checked').attr('checked',true);
						div.html('<i class="iconfont">&#xe659;</i>');
					}
				});
			})
		})
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
				//console.log("success");
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
//				//console.log("success");
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
//				//console.log("success");
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
//				//console.log("success");
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
//				//console.log("success");
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
//				//console.log("success");
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
//				//console.log("success");
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
				//console.log("success");
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
//				//console.log("success");
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
//				//console.log("success");
//			}
//		});
	})
	
	/***
	* 加载页面模板
	*/
	render.$console.load(router.template('loan-info'), function() {
		$scope.def.listTmpl = render.$console.find('#loanlisttmpl').html();
		$scope.def.selectOpttmpl =  render.$console.find('#selectOpttmpl').html();
		$scope.$el = {
			$tbl: $console.find('#loanInfoTable'),
				  
		}
		if($params.process) {
			
		}
		loadLoanList(apiParams);
	});
});



