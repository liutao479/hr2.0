'use strict';
page.ctrl('checkAudit', function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		apiParams = {
			process: $params.process || 0,
			page: $params.page || 1,
			pageSize: 20
		};
	var urlStr1 = "http://192.168.0.134:8080";
	var urlStr = "http://127.0.0.1:8083";
//	var urlStr1 = "http://127.0.0.1:8083";
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
	var rendMap = {
		"phoneAudit": "phoneAudit.js",
		"loanInfo": "loanInfo.js",
		}
	/**
	* 设置面包屑
	*/
	var setupLocation = function(loanUser) {
		if(!$scope.$params.path) return false;
		var $location = $console.find('#location');
		var _orderDate = tool.formatDate($scope.$params.date, true);
		$location.data({
			backspace: $scope.$params.path,
			loanUser: loanUser,
			current: '审核列表',
			orderDate: _orderDate
		});
		$location.location();
	}
	/**
	* 加载车贷办理数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadLoanList = function(params, cb) {
		$.ajax({
			url: $http.api('phoneAudit'),
			data: params,
			success: $http.ok(function(result) {
//				$scope.result = result;
//				// 启动面包屑
//				var _loanUser = $scope.result.data[0].loanUserCredits[0].userName;
//				setupLocation(_loanUser);
//				render.compile($scope.$el.$tbl, $scope.def.listTmpl, result.data, true);
//				if(cb && typeof cb == 'function') {
//					cb();
//				}
//				loanFinishedSelect();
			})
		})
	}
//页面加载完成对所有下拉框进行赋值	
	var loanFinishedSelect = function(){
		$(".selecter").each(function(){
			$("li",$(this)).each(function(){
				var selected = $(this).data('select');
				var val = $(this).data('key');
				var text = $(this).text();
				if(selected){
					$(this).parent().parent().siblings(".placeholder").html(text);
					$(this).parent().parent().siblings("input").val(val);
					$(this).parent().parent().siblings(".placeholder").attr('title',val);
					var value2 = $(this).parent().parent().siblings("input").val();
					if(!value2){
						$(this).parent().parent().siblings(".placeholder").html("请选择")
					}
				}
			})
			$(".selectOptBox1").hide(); 
		});
	}
//点击下拉框拉取选项	
	$(document).on('click','.selecter', function() {
		$(".selectOptBox1",$(this)).show();
	})
	
//	$(document).on('click','#aaa', function() {
//		$.getScript("static/js/page/phoneAudit.js", function() {
//			$("#eleCheck").load("iframe/phoneAudit.html");
//		);
//	})
	
	
	
	//点击下拉选项赋值zhy
	$(document).on('click', '.selectOptBox1 li', function() {
		var value = $(this).data('key');
		var text = $(this).text();
		console.log(value);
		$(this).parent().parent().siblings(".placeholder").html(text);
		$(this).parent().parent().siblings(".placeholder").attr('title',text);
		$(this).parent().parent().siblings("input").val(value);
		var value1 = $(this).parent().parent().siblings("input").val();
		if(!value1){
			$(this).parent().parent().siblings(".placeholder").html("请选择");
		}else{
			$(this).parent().parent().parent().removeClass("error-input");
			$(this).parent().parent().siblings("i").remove();
//			$(this).parent().parent().after("<div class='opcity0'>这个是新增的div</div>");
		}
		$(".selectOptBox1").hide();
		return false;
	})
	/***
	* 保存按钮
	*/
	$(document).on('click', '.saveBtn', function() {
		var isTure = true;
		var requireList = $(this).parent().siblings().find("form").find(".required");
		requireList.each(function(){
			var value = $(this).val();
			if(!value){
				$(this).parent().addClass("error-input");
				$(this).after('<i class="error-input-tip">请完善该必填项</i>');
				console.log($(this).index());
				isTure = false;
//				return false;
			}
		});
		if(isTure){
			var data;
	        var formList = $(this).parent().siblings().find('form');
	        console.log("form的个数为："+formList.length);
	        if(formList.length == 1){
		        var params = formList.serialize();
	            params = decodeURIComponent(params,true);
	            var paramArray = params.split("&");
	            var data1 = {};
	            for(var i=0;i<paramArray.length;i++){
	                var valueStr = paramArray[i];
	                data1[valueStr.split('=')[0]] = valueStr.split('=')[1];
	            }
	            data = data1;
	        }else{
	        	data = [];
		        formList.each(function(index){
			        var params = $(this).serialize();
		            params = decodeURIComponent(params,true);
		            var paramArray = params.split("&");
		            var data1 = {};
		            for(var i=0;i<paramArray.length;i++){
		                var valueStr = paramArray[i];
		                data1[valueStr.split('=')[0]] = valueStr.split('=')[1];
		            }
					console.log(data1);
					data[index]=data1;
		        })
	        }
	        console.log(data);
	        
			$.ajax({
				type: 'POST',
				url: '127.0.0.1',
				data:JSON.stringify(data),
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
	$console.load(router.template('iframe/checkAudit'), function() {
//		$scope.def.tabTmpl = $console.find('#checkResultTabsTmpl').html();
		$scope.def.listTmpl = $console.find('#eleChecktmpl').html();
//		$scope.def.selectOpttmpl = $console.find('#selectOpttmpl').html();
		$scope.$el = {
//			$tab: $console.find('#checkTabs'),
			$tbl: $console.find('#eleCheck')
		}
//		loadLoanList(apiParams);
	})
});



