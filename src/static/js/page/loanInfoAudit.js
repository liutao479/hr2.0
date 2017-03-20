'use strict';
page.ctrl('loanInfoAudit', function($scope) {
	var $params = $scope.$params,
		$console = $params.refer ? $($params.refer) : render.$console,
		$source = $scope.$source = {},
		apiParams = {};
	var urlStr = "http://192.168.1.108:8080";

	var postUrl = {
		"saveOrderInfo": urlStr+"/loanInfoInput/updLoanOrder",
		"saveCarInfo": urlStr+"/loanInfoInput/updLoanUserCar",
		"saveStageInfo": urlStr+"/loanInfoInput/updLoanUserStage",
		"saveCommonInfo": urlStr+"/loanInfoInput/updLoanUser",
		"saveEmergencyInfo": urlStr+"/loanInfoInput/updLoanEmergencyConact",
		"saveloanPayCardInfo": urlStr+"/loanInfoInput/updLoanPayCard",
		"saveFYXXInfo": urlStr+"/loanInfoInput/updLoanFee",
		"saveQTXX": urlStr+"/loanInfoInput/updLoanIndividuation"
	};

	/**
	* 加载车贷办理数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadLoanList = function(cb) {
		var data={};
			data['taskId']=80872;
			data['frameCode']='T0047';
		$.ajax({
//			 url: $http.api('loan.infoBak'),
			// url: $http.api('loanInfoInput/info','jbs'),
			 url: urlStr+'/loanInfoInput/info',
			data: data,
			dataType: 'json',
			success: $http.ok(function(result) {
				$scope.result = result;
				setupLocation();
				result.data.FQXX.renewalInfo = result.data.FQXX.renewalInfo.split(',');
				render.compile($scope.$el.$tbl, $scope.def.listTmpl, result,true);
				loanFinishedInput();
				loanFinishedSelect();
				loanFinishedCheckbox();
				loanFinishedGps();
				loanFinishedBxxb();
				if(cb && typeof cb == 'function') {
					cb();
				}
			})
		});
	}
	
	
	/**
	* 设置面包屑
	*/
	var setupLocation = function() {
		if(!$scope.$params.path) return false;
		var $location = $console.find('#location');
		$location.data({
			backspace: $scope.$params.path,
			loanUser: $scope.result.data.loanTask.loanOrder.realName,
			current: '贷款信息录入',
			orderDate: $scope.result.data.loanTask.createDateStr
		});
		$location.location();
	}
	/**
	* 页面加载完成对所有带“*”的input进行必填绑定
	*/
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
			var datatype = $(this).data('type');
			if(datatype){
				render.compile(that, $scope.def.selectOpttmpl, dataMap[key], true);
			}
			if(key == 'remitAccountNumber'){
				var data={};
					data['carShopId'] = $("#busiSourceId").val();
				$.ajax({
					url: urlStr+"/demandCarShopAccount/getAccountList",
					data: data,
					dataType: 'json',
					success: $http.ok(function(result) {
						render.compile(that, $scope.def.selectOpttmpl, result.data, function(){
							$("#remitAccountNumberBox").find(".selectOptBox").hide();
						}, true);
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
					$(".selectOptBox").hide()
				}
			});
		});
	}

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
//			selectOptBox.show();
			console.log(selectOptBox);
			
		}
		if(key == 'remitAccountNumber'){
			var data={};
				data['carShopId'] = $("#busiSourceId").val();
			$.ajax({
				url:  urlStr+"/demandCarShopAccount/getAccountList",
				data: data,
				dataType: 'json',
				success: $http.ok(function(result) {
					render.compile(that, $scope.def.selectOpttmpl, result.data, true);
					console.log(result.data);
					var selectOptBox = $(".selectOptBox");
					selectOptBox.attr("id",key);
				})
			})
		}
	})
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
//复选框
//$(document).on('selectstart', '.checkbox-normal', false);
   $(document).on('click', '.checkbox-normal', function() {
   	var keyData = $(this).attr("data-key");
   	var keyCode = $(this).attr("data-code");
   	var keyMark = $(this).attr("data-mark");
   	if(keyData){
   		$(".hklx").each(function(){
   			$(this).removeClass('checked').attr('checked',false);
   			$(this).html('');
   		})
   	}
   	if(keyCode){
   		$(".gzd").each(function(){
   			$(this).removeClass('checked').attr('checked',false);
   			$(this).html('');
   		})
   	}
   	if(keyMark){
   		$(".jzlx").each(function(){
   			$(this).removeClass('checked').attr('checked',false);
   			$(this).html('');
   		})
   	}
   	if(!$(this).attr('checked')) {
   		$(this).addClass('checked').attr('checked',true);
   		$(this).html('<i class="iconfont">&#xe659;</i>');
   	} else {
   		$(this).removeClass('checked').attr('checked',false);
   		$(this).html('');
   	}
   })

//gps
	$(document).on('click', '#isInstallGpsBox li', function() {
		loanFinishedGps();
	})
	var loanFinishedGps = function(){
		var gps = $("#gps").val();
		if(gps != 1){
			$("#isInstallGpsBox").removeClass("gpssel");
			$("#gps1").hide();
			$("#gps2").hide();
		}else{
			$("#isInstallGpsBox").addClass("gpssel");
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
			loanFinishedrepay();
		}
	}
	
//日期选择
	$(document).on('click', '.dateBtn', function() {
		$('#loaningDate').datepicker();
	})
	

//保险续保及还款期限联动
//	$(document).on('click', '.repaymentTermBox .select-box .select-area li', function() {
//		loanFinishedrepay();
//	})
	var loanFinishedrepay = function(){
		var bxxbInput = $("#repayPeriod").val();
		var bxxbLength = Math.ceil(bxxbInput/12);
		var bxxbInputShow = $("#bxxbInput").val();
		if(bxxbInputShow != 1){
			$(".bxxbYear").hide();
		}else{
			$(".bxxbyearIpt").each(function(){
				$(this).val('');
				$(this).siblings('.placeholder').html("请选择");
				$(this).parent().parent().hide();
			});
			
			if(bxxbLength == 1){
				$("#year1").show();
				$("#year1").find('input').val(1);
				$("#year1").find('.placeholder').html("单位承保");
			}else if(bxxbLength == 2){
				$("#year1").show();
				$("#year2").show();
				$("#year1").find('input').val(1);
				$("#year1").find('.placeholder').html("单位承保");
				$("#year2").find('input').val(1);
				$("#year2").find('.placeholder').html("单位承保");
			}else if(bxxbLength == 3){
				$("#year1").show();
				$("#year2").show();
				$("#year3").show();
				$("#year1").find('input').val(1);
				$("#year1").find('.placeholder').html("单位承保");
				$("#year2").find('input').val(1);
				$("#year2").find('.placeholder').html("单位承保");
				$("#year3").find('input').val(1);
				$("#year3").find('.placeholder').html("单位承保");
			}else if(bxxbLength == 4){
				$("#year1").show();
				$("#year2").show();
				$("#year3").show();
				$("#year4").show();
				$("#year1").find('input').val(1);
				$("#year1").find('.placeholder').html("单位承保");
				$("#year2").find('input').val(1);
				$("#year2").find('.placeholder').html("单位承保");
				$("#year3").find('input').val(1);
				$("#year3").find('.placeholder').html("单位承保");
				$("#year4").find('input').val(1);
				$("#year4").find('.placeholder').html("单位承保");
			}else if(bxxbLength == 5){
				$("#year1").show();
				$("#year2").show();
				$("#year3").show();
				$("#year4").show();
				$("#year5").show();
				$("#year1").find('input').val(1);
				$("#year1").find('.placeholder').html("单位承保");
				$("#year2").find('input').val(1);
				$("#year2").find('.placeholder').html("单位承保");
				$("#year3").find('input').val(1);
				$("#year3").find('.placeholder').html("单位承保");
				$("#year4").find('input').val(1);
				$("#year4").find('.placeholder').html("单位承保");
				$("#year5").find('input').val(1);
				$("#year5").find('.placeholder').html("单位承保");
			}else{
				$("#year1").show();
				$("#year2").show();
				$("#year3").show();
				$("#year4").show();
				$("#year5").show();
				$("#year6").show();
				$("#year1").find('input').val(1);
				$("#year1").find('.placeholder').html("单位承保");
				$("#year2").find('input').val(1);
				$("#year2").find('.placeholder').html("单位承保");
				$("#year3").find('input').val(1);
				$("#year3").find('.placeholder').html("单位承保");
				$("#year4").find('input').val(1);
				$("#year4").find('.placeholder').html("单位承保");
				$("#year5").find('input').val(1);
				$("#year5").find('.placeholder').html("单位承保");
				$("#year6").find('input').val(1);
				$("#year6").find('.placeholder').html("单位承保");
			}
		}	
	}
	
	
	/***
	* 为完善项更改去掉错误提示
	*/
	$(document).on('input','input', function() {
		$(this).parents().removeClass("error-input");
		$(this).siblings("i").remove();
	})


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
//				return false;
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
	
	$console.load(router.template('iframe/loanInfoAudit'), function() {
		$scope.def.listTmpl = render.$console.find('#loanlisttmpl').html();
		$scope.def.selectOpttmpl = $console.find('#selectOpttmpl').html();
		$scope.$el = {
			$tbl: $console.find('#loanAudit')
		}
		loadLoanList(function(){
			console.log('zhixing');
			setupDropDown();
		});
		
		
	});
	
	$scope.areaPicker = function(picked) {
		console.log(picked);
	}
	$scope.serviceTypePicker = function(picked) {
		console.log(picked);
	}
	$scope.brandPicker = function(picked) {
		console.log(picked);
	}
	$scope.busiSourceTypePicker = function(picked) {
		console.log(picked);
	}
	$scope.busiSourceNamePicker = function(picked) {
		console.log(picked);
		$scope.busiSourceNameId = picked.id
	}
	$scope.remitAccountNumberPicker = function(picked) {
		console.log(picked);
		$("#bankName").val(picked.bankName)
		$("#accountName").val(picked.accountName)
	}
	$scope.busimodePicker = function(picked) {
		console.log(picked);
	}
	$scope.repaymentTermPicker = function(picked) {
		console.log(picked);
	}
	$scope.carPicker = function(picked) {
		console.log(picked);
	}
	$scope.bankPicker = function(picked) {
		console.log(picked);
	}
	
	/**dropdown 测试*/
	function setupDropDown() {
		$console.find('.select').dropdown();
	}
	var car = {
		brand: function(cb) {
			$.ajax({
				url: 'http://localhost:8083/mock/carBrandlist',
				success: function(xhr) {
					var sourceData = {
						items: xhr.data,
						id: 'brandId',
						name: 'carBrandName'
					}
					cb(sourceData);
				}
			})
		},
		series: function(brandId, cb) {
			$.ajax({
				url: 'http://localhost:8083/mock/carSeries',
				data: {brandId: brandId},
				success: function(xhr) {
					var sourceData = {
						items: xhr.data,
						id: 'id',
						name: 'serieName'
					}
					cb(sourceData);
				}
			})
		},
		specs: function(seriesId, cb) {
			$.ajax({
				url: 'http://localhost:8083/mock/carSpecs',
				data: {
					serieId: seriesId
				},
				success: function(xhr) {
					var sourceData = {
						items: xhr.data,
						id: 'carSerieId',
						name: 'specName'
					};
					cb(sourceData);
				}
			})
		}
	}

	var areaSel = {
		province: function(cb) {
			$.ajax({
				url: urlStr+'/area/get',
				dataType:'json',
				success: function(xhr) {
					var sourceData = {
						items: xhr.data,
						id: 'areaId',
						name: 'name'
					};
					console.log('省：'+sourceData);
					cb(sourceData);
				}
			})
		},
		city: function(areaId, cb) {
			$.ajax({
				url: urlStr+'/area/get',
				data: {
					parentId: areaId
				},
				dataType: 'json',
				success: function(xhr) {
					var sourceData = {
						items: xhr.data,
						id: 'areaId',
						name: 'name'
					}
					cb(sourceData);
				}
			})
		},
		country: function(areaId, cb) {
			$.ajax({
				url: urlStr+'/area/get',
				data: {
					parentId: areaId
				},
				dataType: 'json',
				success: function(xhr) {
					var sourceData = {
						items: xhr.data,
						id: 'areaId',
						name: 'name'
					};

					cb(sourceData);
				}
			})
		}
	}

	$scope.dropdownTrigger = {
		car: function(tab, parentId, cb) {
			if(!cb && typeof cb != 'function') {
				cb = $.noop;
			}
			if(!tab) return cb();
			switch (tab) {
				case '品牌':
					car.brand(cb);
					break;
				case "车系":
					car.series(parentId, cb);
					break;
				case "车型":
					car.specs(parentId, cb);
					break;
				default:
					break;
			}
		},
		areaSel: function(tab, parentId, cb) {
			if(!cb && typeof cb != 'function') {
				cb = $.noop;
			}
			if(!tab) return cb();
			switch (tab) {
				case '省':
					areaSel.province(cb);
					break;
				case "市":
					areaSel.city(parentId, cb);
					break;
				case "区":
					areaSel.country(parentId, cb);
					break;
				default:
					break;
			}
		},
		serviceType: function(t, p, cb) {
			$.ajax({
				url: urlStr+'/loanConfigure/getItem',
				data:{
					'code':'serviceType'
				},
				dataType: 'json',
				success: $http.ok(function(xhr) {
					var sourceData = {
						items: xhr.data,
						id: 'value',
						name: 'name'
					};
					cb(sourceData);
				})
			})
		}
		,
		brand: function(t, p, cb) {
			$.ajax({
				url: urlStr+"/demandBank/selectBank",
				data:{
					'code':'brand'
				},
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
		busiSourceType: function(t, p, cb) {
			$.ajax({
				url: urlStr+"/loanConfigure/getItem",
				data:{
					'code':'busiSourceType'
				},
				dataType: 'json',
				success: $http.ok(function(xhr) {
					var sourceData = {
						items: xhr.data,
						id: 'value',
						name: 'name'
					};
					cb(sourceData);
				})
			})
		},
		busiSourceName: function(t, p, cb) {
			$.ajax({
				url: urlStr+"/carshop/list",
				data:{
					'code':'busiSourceName'
				},
				dataType: 'json',
				success: $http.ok(function(xhr) {
					var sourceData = {
						items: xhr.data,
						id: 'value',
						name: 'name'
					};
					cb(sourceData);
				})
			})
		},
		remitAccountNumber: function(t, p, cb) {
			if(!$scope.busiSourceNameId){
				alert("填写前面");
				return false;
			}else{
				$.ajax({
					url: urlStr+"/demandCarShopAccount/getAccountList",
					data:{
						'carShopId':$scope.busiSourceNameId
					},
					dataType: 'json',
					success: $http.ok(function(xhr) {
						var sourceData = {
							items: xhr.data,
							id: 'id',
							name: 'account',
							accountName: 'accountName',
							bankName: 'bankName'
						};
						console.log(sourceData);
						cb(sourceData);
					})
				})
			}
		},
		busimode: function(t, p, cb) {
			$.ajax({
				url: urlStr+"/loanConfigure/getItem",
				data:{
					'code':'busimode'
				},
				dataType: 'json',
				success: $http.ok(function(xhr) {
					var sourceData = {
						items: xhr.data,
						id: 'value',
						name: 'name'
					};
					cb(sourceData);
				})
			})
		},
		repaymentTerm: function(t, p, cb) {
			$.ajax({
				url: urlStr+"/loanConfigure/getItem",
				data:{
					'code':'repaymentTerm'
				},
				dataType: 'json',
				success: $http.ok(function(xhr) {
					var sourceData = {
						items: xhr.data,
						id: 'value',
						name: 'name'
					};
					cb(sourceData);
				})
			})
		}
	}

	
	
	
});






