'use strict';
page.ctrl('ordersDetail', function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		$source = $scope.$source = {},
		apiParams = {
			process: $params.process || 0,
			page: $params.page || 1,
			pageSize: 20
		};
	var urlStr1 = "http://192.168.0.144:8080";
	var urlStr = "http://127.0.0.1:8083";
	var apiMap = {
//		"sex": urlStr+"/mock/sex",
//		"isSecond": urlStr+"/mock/isSecond",
		"serviceType": urlStr+"/mock/serviceType",
		"brand": urlStr+"/mock/demandBankId",
		"busiSourceType": urlStr+"/mock/busiSourceType",
		"busiArea": urlStr+"/mock/busiArea",
		"busiSourceName": urlStr+"/mock/busiSourceName",
		"busiSourceNameSearch": urlStr+"/mock/searchCarShop",
//		"busiSourceName": urlStr+"/carshop/list",
//		"licenseType": urlStr+"/mock/busiSourceName",
//		"isFinanceLeaseVehicle": urlStr+"/mock/busiSourceName",
//		"isOperationVehicle": urlStr+"/mock/busiSourceName",
		"onLicensePlace": urlStr+"/mock/busiSourceName",
//		"isInstallGps": urlStr+"/mock/yesOrNo",
		"busimode": urlStr+"/mock/busimode",
		"isDiscount": urlStr+"/mock/busiSourceName",
		"carName": urlStr+"/mock/busiSourceName",
		"repaymentTerm": urlStr+"/mock/repaymentTerm",
//		"renewalMode": urlStr+"/mock/busiSourceName",
//		"isAdvanced": urlStr+"/mock/busiSourceName",
		"maritalStatus": urlStr+"/mock/busiSourceName",
//		"houseStatus": urlStr+"/mock/busiSourceName",
//		"isEnterprise": urlStr+"/mock/busiSourceName",
//		"userRelationship": urlStr+"/mock/busiSourceName",
		"remitAccountNumber": urlStr+"/mock/bankNo"
//		"relationship": urlStr+"/mock/busiSourceName"
	};
	var dataMap = {
		    "sex":[
		        {
		            "name":"男",
		            "value":"0"
		        },
		        {
		            "name":"女",
		            "value":"1"
		        }
		    ],
		    "isSecond":[
		        {
		            "name":"新车",
		            "value":"0"
		        },
		        {
		            "name":"二手车",
		            "value":"1"
		        }
		    ],
		    "licenseType":[
		        {
		            "name":"公牌",
		            "value":"0"
		        },
		        {
		            "name":"私牌",
		            "value":"1"
		        }
		    ],
		    "isFinanceLeaseVehicle":[
		        {
		            "name":"是融资租赁车",
		            "value":"0"
		        },
		        {
		            "name":"不是融资租赁",
		            "value":"1"
		        }
		    ],
		    "isOperationVehicle":[
		        {
		            "name":"运营车",
		            "value":"0"
		        },
		        {
		            "name":"非运营车",
		            "value":"1"
		        }
		    ],
		    "isInstallGps":[
		        {
		            "name":"是",
		            "value":"0"
		        },
		        {
		            "name":"否",
		            "value":"1"
		        }
		    ],
		    "isDiscount":[
		        {
		            "name":"贴息",
		            "value":"0"
		        },
		        {
		            "name":"不贴息",
		            "value":"1"
		        }
		    ],
		    "renewalMode":[
		        {
		            "name":"自行承保",
		            "value":"0"
		        },
		        {
		            "name":"单位承保",
		            "value":"1"
		        }
		    ],
		    "renewalModeList":[
		        {
		            "name":"自营",
		            "value":"0"
		        },
		        {
		            "name":"非自营",
		            "value":"1"
		        }
		    ],
		    "isAdvanced":[
		        {
		            "name":"需要垫资",
		            "value":"0"
		        },
		        {
		            "name":"不需要垫资",
		            "value":"1"
		        }
		    ],
		    "maritalStatus":[
		        {
		            "name":"已婚",
		            "value":"0"
		        },
		        {
		            "name":"未婚",
		            "value":"1"
		        }
		    ],
		    "houseStatus":[
		        {
		            "name":"有商品房",
		            "value":"0"
		        },
		        {
		            "name":"有房",
		            "value":"1"
		        }
		    ],
		    "isEnterprise":[
		        {
		            "name":"是企业法人",
		            "value":"0"
		        },
		        {
		            "name":"不是企业法人",
		            "value":"1"
		        }
		    ],
		    "userRelationship":[
		        {
		            "name":"父母",
		            "value":"0"
		        },
		        {
		            "name":"子女",
		            "value":"1"
		        }
		    ],
		    "relationship":[
		        {
		            "name":"同事",
		            "value":"0"
		        },
		        {
		            "name":"朋友",
		            "value":"1"
		        }
		    ]
		};
	var postUrl = {
		"saveOrderInfo": urlStr1+"/loanInfoInput/updLoanOrder",
		"saveCarInfo": urlStr1+"/loanInfoInput/updLoanUserCar",
		"saveStageInfo": urlStr1+"/loanInfoInput/updLoanUserStage",
		"saveCommonInfo": urlStr1+"/loanInfoInput/updLoanUser",
		"saveEmergencyInfo": urlStr1+"/loanInfoInput/updLoanEmergencyConact",
		"saveloanPayCardInfo": urlStr1+"/loanInfoInput/updLoanPayCard",
		"saveFYXXInfo": urlStr1+"/loanInfoInput/updLoanFee",
		"saveQTXX": urlStr1+"/loanInfoInput/updLoanIndividuation"
	};

	/**
	* 加载车贷办理数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadLoanList = function(params, cb) {
		var data={};
			data['taskId']=80871;
		$.ajax({
			url: $http.api('loan.infoBak'),
//			url: $http.api('loanInfoInput/info','jbs'),
			data: data,
			dataType: 'json',
			async:false,
			success: $http.ok(function(result) {
				render.compile($scope.$el.$tbl, $scope.def.listTmpl, result, true);
				if(cb && typeof cb == 'function') {
					cb();
				}
				loanFinishedInput();
				loanFinishedSelect();
				loanFinishedCheckbox();
				loanFinishedGps();
				loanFinishedBxxb();
			})
		});
	}
//页面加载完成对所有输入框进行样式设定
	var loanFinishedCss = function(){
		var boxes = $(".info-key-value-box");
		boxes.each(function(i){
			if(i % 2 == 0){
				$(this).css('text-align','left');
			}else{
				$(this).css('text-align','right');
			}
		});
	}
//页面加载完成对所有带“*”的input进行必填绑定
	var loanFinishedInput = function(){
		$(".info-key").each(function(){
			var jqObj = $(this);
			if(jqObj.has('i').length > 0){
				$(this).siblings().find("input").addClass("required");
			}
			loanFinishedInputReq();
		});
	}
//页面加载完成对所有带“*”的input进行必填绑定,不需要必填的删除required
	var loanFinishedInputReq = function(){
		$("input[type='hidden'],input[type='text']").each(function(){
			var required = $(this).attr("name");
			if(!required){
				$(this).removeClass("required");
			}
		});
	}

//页面加载完成对所有下拉框进行赋值	
	var loanFinishedSelect = function(){
		$(".selecter").each(function(){
			var that =$("div",$(this));
			var key = $(this).data('key');
			var inputSearch = $(".searchInp",$(this));
			if(inputSearch){
				inputSearch.hide();
			};
			var boxKey = key + 'Box';
			$(this).attr("id",boxKey);
			var data={};
                data['code'] = key;
		var datatype = $(this).data('type');
		if(datatype){
			render.compile(that, $scope.def.selectOpttmpl, dataMap[key], true);
		}else{
			$.ajax({
				url: apiMap[key],
				data: data,
				dataType: 'json',
				async:false,
				success: $http.ok(function(result) {
					render.compile(that, $scope.def.selectOpttmpl, result.data, true);
					$source.selectType = result.data;
					var selectOptBox = $(".selectOptBox");
					selectOptBox.attr("id",key);
				})
			})
		}	
			var value1 = $("input",$(this)).val();
			$("li",$(this)).each(function(){
				var val = $(this).data('key');
				var text = $(this).text();
				var keybank = $(this).data('bank');
				var keyname = $(this).data('name');

				if(value1 == val){
					$(this).parent().parent().siblings(".placeholder").html(text);
					$(this).parent().parent().siblings("input").val(val);
					if(keybank && keyname){
						$("#bankName").val(keybank);
						$("#accountName").val(keyname);
					}
					var value2 = $(this).parent().parent().siblings("input").val();
					if(!value2){
						$(this).parent().parent().siblings(".placeholder").html("请选择")
					}
					$(".selectOptBox").hide(); 
				}
			})
		});
	}
	
//模糊搜索
	$(document).on('input','.searchInp', function() {
		var that = $(this).parent().siblings("div");
		var key = $(this).data('key');
		var boxKey = key + 'Box';
		$(this).attr("id",boxKey);
		var data={};
            data['keyword'] = $(this).val();
		$.ajax({
			url: apiMap[key],
			data: data,
			dataType: 'json',
			success: $http.ok(function(result) {
				render.compile(that, $scope.def.selectOpttmpl, result.data, true);
//				$source.selectType = result.data;
				var selectOptBox = $(".selectOptBox");
				that.find('.selectOptBox').show();
				selectOptBox.attr("id",key);
			})
		})
	})
//点击下拉框拉取选项
	$(document).on('click','.selecter', function() {
		var that =$("div",$(this));
		var inputSearch =$(".searchInp",$(this));
		var key = $(this).data('key');
		var boxKey = key + 'Box';
		var datatype = $(this).data('type');
		if(datatype){
			console.log(datatype);
			render.compile(that, $scope.def.selectOpttmpl, dataMap[key], true);
			console.log(dataMap[key]);
			var selectOptBox = $(".selectOptBox",$(this));
			selectOptBox.style.display = 'block';
			console.log(selectOptBox);
			
		}else{
			if(inputSearch){
				inputSearch.show();
			}
			$(this).attr("id",boxKey);
			var data={};
			if(key == 'remitAccountNumber'){
				data['carShopId'] = $("#busiSourceId").val();
			}else{
				data['code'] = key;
			}
			$.ajax({
				url: apiMap[key],
				data: data,
				dataType: 'json',
				success: $http.ok(function(result) {
					render.compile(that, $scope.def.selectOpttmpl, result.data, true);
					console.log(result.data);
					$source.selectType = result.data;
					var selectOptBox = $(".selectOptBox");
					selectOptBox.attr("id",key);
				})
			})
		}
	})
//
	$(document).on('click', '#remitAccountNumber li', function() {
		var keyvalue = $(this).data('key');
		var keybank = $(this).data('bank');
		var keyname = $(this).data('name');
		console.log(keyvalue);
		$("#bankName").val(keybank);
		$("#accountName").val(keyname);
	})
//点击本地常驻类型复选框
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

//gps
	$(document).on('click', '#isInstallGps li', function() {
		loanFinishedGps();
	})
	var loanFinishedGps = function(){
		var gps = $("#gps").val();
		if(gps != 1){
			$("#isInstallGpsBox").removeClass("gps");
			$("#gps1").hide();
			$("#gps2").hide();
		}else{
			$("#isInstallGpsBox").addClass("gps");
			$("#gps1").show();
			$("#gps2").show();
		}
	}
//保险续保
	$(document).on('click', '#renewalModeBox li', function() {
		loanFinishedBxxb();
	})
	var loanFinishedBxxb = function(){
		var bxxbInput = $("#bxxbInput").val();
//		console.log(bxxbInput);
		if(bxxbInput != 1){
			$(".bxxbYear").hide();
		}else{
			$(".bxxbYear").show();
			$(".bxxbYear").each(function (){
				var ipt = $(this).find('input');
				if(ipt.val() == '555'){
					$(this).hide()
				}
			})
		}
	}
//保险续保及还款期限联动
	$(document).on('click', '#repaymentTermBox li', function() {
		loanFinishedrepay();
	})
	var loanFinishedrepay = function(){
		var bxxbInput = $("#repayPeriod").val();
		var bxxbLength = Math.ceil(bxxbInput/12);
		console.log(bxxbLength);
		$(".bxxbyearIpt").each(function(){
			$(this).val('');
			$(this).siblings('.placeholder').html("请选择");
			$(this).parent().parent().hide();
		});
		
		if(bxxbLength == 1){
			$("#year1").show();
			$("#year1").find('input').val(0);
			$("#year1").find('.placeholder').html("自营");
		}else if(bxxbLength == 2){
			$("#year1").show();
			$("#year2").show();
			$("#year1").find('input').val(0);
			$("#year1").find('.placeholder').html("自营");
			$("#year2").find('input').val(0);
			$("#year2").find('.placeholder').html("自营");
		}else if(bxxbLength == 3){
			$("#year1").show();
			$("#year2").show();
			$("#year3").show();
			$("#year1").find('input').val(0);
			$("#year1").find('.placeholder').html("自营");
			$("#year2").find('input').val(0);
			$("#year2").find('.placeholder').html("自营");
			$("#year3").find('input').val(0);
			$("#year3").find('.placeholder').html("自营");
		}else if(bxxbLength == 4){
			$("#year1").show();
			$("#year2").show();
			$("#year3").show();
			$("#year4").show();
			$("#year1").find('input').val(0);
			$("#year1").find('.placeholder').html("自营");
			$("#year2").find('input').val(0);
			$("#year2").find('.placeholder').html("自营");
			$("#year3").find('input').val(0);
			$("#year3").find('.placeholder').html("自营");
			$("#year4").find('input').val(0);
			$("#year4").find('.placeholder').html("自营");
		}else if(bxxbLength == 5){
			$("#year1").show();
			$("#year2").show();
			$("#year3").show();
			$("#year4").show();
			$("#year5").show();
			$("#year1").find('input').val(0);
			$("#year1").find('.placeholder').html("自营");
			$("#year2").find('input').val(0);
			$("#year2").find('.placeholder').html("自营");
			$("#year3").find('input').val(0);
			$("#year3").find('.placeholder').html("自营");
			$("#year4").find('input').val(0);
			$("#year4").find('.placeholder').html("自营");
			$("#year5").find('input').val(0);
			$("#year5").find('.placeholder').html("自营");
		}else{
			$("#year1").show();
			$("#year2").show();
			$("#year3").show();
			$("#year4").show();
			$("#year5").show();
			$("#year6").show();
			$("#year1").find('input').val(0);
			$("#year1").find('.placeholder').html("自营");
			$("#year2").find('input').val(0);
			$("#year2").find('.placeholder').html("自营");
			$("#year3").find('input').val(0);
			$("#year3").find('.placeholder').html("自营");
			$("#year4").find('input').val(0);
			$("#year4").find('.placeholder').html("自营");
			$("#year5").find('input').val(0);
			$("#year5").find('.placeholder').html("自营");
			$("#year6").find('input').val(0);
			$("#year6").find('.placeholder').html("自营");
		}
	}


	/***
	* 保存按钮
	*/
	$(document).on('click', '.saveBtn', function() {
		var isTure = true;
		var requireList = $(this).parent().parent().siblings().find("form").find(".required");
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
			var key = $(this).data('key');
			if(key == 'saveStageInfo'){
				var renewalStr = '';
				var inputList = $(".bxxbyearIpt");
				for(var i=0;i<inputList.length;i++){
					var rene = inputList[i];
					if(rene.value == '555'){
						rene.value = '';
					}
					renewalStr += rene.value+',';
				}
				$("#renewalInfo").val(renewalStr);
			}
			var data;
	        var formList = $(this).parent().parent().siblings().find('form');
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
				url: postUrl[key],
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
	$console.load(router.template('iframe/loan-info-view'), function() {
		$scope.def.listTmpl = $console.find('#loanlisttmpl').html();
		$scope.def.selectOpttmpl = $console.find('#selectOpttmpl').html();
		$scope.$el = {
			$tbl: $console.find('#loanInfoTable')
		}
		loadLoanList(apiParams);
	})
});



