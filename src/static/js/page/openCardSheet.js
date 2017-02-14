'use strict';
page.ctrl('openCardSheet', function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		apiParams = {
			process: $params.process || 0,
			page: $params.page || 1,
			pageSize: 20
		};
//	var urlStr = "http://192.168.0.135:8080";
	var urlStr = "http://127.0.0.1:8083";
	var apiMap = {
		"dealerName": urlStr+"/mock/sex",
		"dealerId": urlStr+"/mock/busiSourceName",
		"sex": urlStr+"/mock/sex",
		"hprovince": urlStr+"/mock/province",
		"hcity": urlStr+"/mock/city",
		"hcounty": urlStr+"/mock/country",
		"cprovince": urlStr+"/mock/province",
		"ccity": urlStr+"/mock/city",
		"ccounty": urlStr+"/mock/country",
		"isSecond": urlStr+"/mock/busiSourceName"
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
	var loadLoanList = function(params, cb) {
		var data={};
			data['taskId']=80871;
		$.ajax({
			url: $http.api($http.apiMap.cardAudit),
			data: data,
			success: $http.ok(function(result) {
				render.compile($scope.$el.$tbl, $scope.def.listTmpl, result.data, true);
				if(cb && typeof cb == 'function') {
					cb();
				}
				loanFinishedInput();
				loanFinishedSelect();
			})
		})
	}
//页面加载完成对所有带“*”的input进行必填绑定
	var loanFinishedInput = function(){
		$(".info-key").each(function(){
			var requiredStar = $(this).find("i");
			if(requiredStar){
				$(this).siblings().find("input").addClass("required");
			}
		});
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
				async:false,
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
					$(this).parent().parent().siblings(".placeholder").attr('title',val);
					var value2 = $(this).parent().parent().siblings("input").val();
					if(!value2){
						$(this).parent().parent().siblings(".placeholder").html("请选择")
					}
					$(".selectOptBox").hide(); 
				}
			})
			
		});
	}
//点击详细地址显示地址框
	$(document).on('click','.addInput', function() {
		$(this).siblings(".addressDetail").show();
	})
	$(document).on('click','.addressDetail > .info-value', function() {
		var divOP = $('.opcity0');
		if(divOP){
			console.log('chufaleshijiang');
			$(this).next().removeClass('pointDisabled');
		}
	})
    
	$(document).on('click','.addComplete', function() {
		var valInput = $(this).siblings().find('input');
		valInput.each(function(){ 
			if(!$(this).val()){
				alert("请完善地址");
				return false;
			}else{
				var provincetext = $('#shprovince').siblings('.placeholder').text();
				var citytext = $('#shcity').siblings('.placeholder').text();
				var countrytext = $('#shcounty').siblings('.placeholder').text();
				var addresstext = $('#shaddress').val();
				$('#hprovince').val(provincetext);
				$('#hcity').val(citytext);
				$('#hcounty').val(countrytext);
				$('#haddress').val(addresstext);
				console.log($('#hcounty').val());
//				$(this).parent(".addressDetail").hide();
			}
		})
//		$(this).parent(".addressDetail").hide();
	})
//模糊搜索
	$(document).on('input','.searchInp', function() {
		var that = $(this).parent().siblings(".selecter").find("div");
		var key = $(this).data('key');
		var boxKey = key + 'Box';
		$(this).attr("id",boxKey);
		var data={};
            data['code'] = key;
		$.ajax({
			url: apiMap[key],
			data: data,
			dataType: 'json',
			success: $http.ok(function(result) {
				render.compile(that, $scope.def.selectOpttmpl, result.data, true);
//				$source.selectType = result.data;
				var selectOptBox = $(".selectOptBox");
				selectOptBox.attr("id",key);
			})
		})
	})
//点击下拉框拉取选项	
	$(document).on('click','.selecter', function() {
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
			success: $http.ok(function(result) {
				render.compile(that, $scope.def.selectOpttmpl, result.data, true);
//				$source.selectType = result.data;
				var selectOptBox = $(".selectOptBox");
				selectOptBox.attr("id",key);
			})
		})
	})
	/***
	* 保存按钮
	*/
	$(document).on('click', '.saveBtn', function() {
		var isTure = true;
		var requireList = $("#dataform").find(".required");
		requireList.each(function(){
			var value = $(this).val();
			if(!value){
				$(this).parent().addClass("error-input");
				$(this).after('<i class="error-input-tip">请完善该必填项</i>');
				console.log($(this).index());
				isTure = false;
				return false;
			}
		});
		if(isTure){
	        var params = $("#dataform").serialize();
            params = decodeURIComponent(params,true);
            var paramArray = params.split("&");
            var data1 = {};
            for(var i=0;i<paramArray.length;i++){
                var valueStr = paramArray[i];
                data1[valueStr.split('=')[0]] = valueStr.split('=')[1];
            }
			console.log(data1);
	        
			$.ajax({
				type: 'POST',
				url: '127.0.0.1',
				data:JSON.stringify(data1),
				dataType:"json",
				contentType : 'application/json;charset=utf-8',
				success: function(result){
					console.log(result.msg);
				}
			});
		}
	})
	
	/***
	* 加载页面模板
	*/
	render.$console.load(router.template('open-card-sheet'), function() {
		$scope.def.listTmpl = render.$console.find('#openCardSheettmpl').html();
		$scope.def.selectOpttmpl =  render.$console.find('#selectOpttmpl').html();
		$scope.$el = {
			$tbl: $console.find('#openCardSheet'),
		}
		if($params.process) {
			
		}
		loadLoanList(apiParams);
	});
});

