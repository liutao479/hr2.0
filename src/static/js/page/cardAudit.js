'use strict';
page.ctrl('cardAudit', function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		apiParams = {
			process: $params.process || 0,
			page: $params.page || 1,
			pageSize: 20
		};
	var urlStr = "http://192.168.0.108:8080";
//	var urlStr = "http://127.0.0.1:8083";
	var apiMap = {
		"sex": urlStr+"/mock/sex",
		"isSecond": urlStr+"/mock/isSecond",
		"serviceType": urlStr+"/mock/serviceType",
		"demandBankId": urlStr+"/mock/demandBankId",
		"busiSourceType": urlStr+"/mock/busiSourceType",
		"busiArea": urlStr+"/mock/busiArea",
		"busiSourceName": urlStr+"/mock/busiSourceName",
//		"busiSourceName": urlStr+"/carshop/list",
		"licenseType": urlStr+"/mock/busiSourceName",
		"isFinanceLeaseVehicle": urlStr+"/mock/busiSourceName",
		"isOperationVehicle": urlStr+"/mock/busiSourceName",
		"onLicensePlace": urlStr+"/mock/busiSourceName",
		"isInstallGps": urlStr+"/mock/yesOrNo",
		"businessModel": urlStr+"/mock/busiSourceName",
		"isDiscount": urlStr+"/mock/busiSourceName",
		"carName": urlStr+"/mock/busiSourceName",
		"repayPeriod": urlStr+"/mock/busiSourceName",
		"renewalMode": urlStr+"/mock/busiSourceName",
		"isAdvanced": urlStr+"/mock/busiSourceName",
		"maritalStatus": urlStr+"/mock/busiSourceName",
		"houseStatus": urlStr+"/mock/busiSourceName",
		"isEnterprise": urlStr+"/mock/busiSourceName",
		"userRelationship": urlStr+"/mock/busiSourceName",
		"relationship": urlStr+"/mock/busiSourceName"
		}
	var postUrl = {
		"saveOrderInfo": urlStr+"/loanInfoInput/updLoanOrder",
		"saveCarInfo": urlStr+"/loanInfoInput/updLoanUserCar",
		"saveStageInfo": urlStr+"/loanInfoInput/updLoanUserStage",
		"saveCommonInfo": urlStr+"/loanInfoInput/updLoanUser",
		"saveEmergencyInfo": urlStr+"/loanInfoInput/updLoanEmergencyConact",
		"saveloanPayCardInfo": urlStr+"/loanInfoInput/updLoanPayCard",
		"saveFYXXInfo": urlStr+"/loanInfoInput/updLoanFee",
		"saveQTXX": urlStr+"/loanInfoInput/updLoanIndividuation"
		}
	/**
	* 加载车贷办理数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadLoanList = function(cb) {
		var data={};
			data['taskId']=80871;
		$.ajax({
			url: urlStr+'/icbcCreditCardForm/queryICBCCreditCardForm',
			data: data,
			success: $http.ok(function(result) {
				render.compile($scope.$el.$tbl, $scope.def.listTmpl, result.data, true);
				loanFinishedSelect();
				if(cb && typeof cb == 'function') {
					cb();
				}
			})
		})
	}

//页面加载完成对所有下拉框进行赋值	
	var loanFinishedSelect = function(){
		$(".selecter").each(function(){
			var that =$("div",$(this));
			var key = $(this).data('key');
			var boxKey = key + 'Box';
			$(this).attr("id",boxKey);
			var data={};
                data['code'] = key;
			$.ajax({
				url: apiMap[key],
				data: data,
				dataType: 'json',
				  ,
				success: $http.ok(function(result) {
					render.compile(that, $scope.def.selectOpttmpl, result.data, true);
//					$source.selectType = result.data;
					var selectOptBox = $(".selectOptBox");
					selectOptBox.attr("id",key);
				})
			})
			var value1 = $("input",$(this)).val();
			$("li",$(this)).each(function(){
				var val = $(this).val();
				var text = $(this).text();
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
	
	/***
	* 加载页面模板
	*/
	$console.load(router.template('cardAudit'), function() {
		$scope.def.listTmpl = render.$console.find('#openCardSheettmpl').html();
		$scope.def.selectOpttmpl =  $console.find('#selectOpttmpl').html();
		$scope.$el = {
			$tbl: $console.find('#openCardSheet'),
		}
		loadLoanList();
	});
});



