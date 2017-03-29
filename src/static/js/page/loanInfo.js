'use strict';
page.ctrl('loanInfo', function($scope) {
	var $params = $scope.$params,
		$console = $params.refer ? $($params.refer) : render.$console,
		$source = $scope.$source = {},
		apiParams = {};

	var postUrl = {
		"saveDDXX": urlStr+"/loanInfoInput/updLoanOrder",
		"saveCLXX": urlStr+"/loanInfoInput/updLoanUserCar",
		"saveFQXX": urlStr+"/loanInfoInput/updLoanUserStage",
		"saveZJKR": urlStr+"/loanInfoInput/updLoanUser",
		"saveGTHK": urlStr+"/loanInfoInput/updLoanUser",
		"saveFDBR": urlStr+"/loanInfoInput/updLoanUser",
		"saveJJLXR": urlStr+"/loanInfoInput/updLoanEmergencyConact",
		"saveHKKXX": urlStr+"/loanInfoInput/updLoanPayCard",
		"saveFYXX": urlStr+"/loanInfoInput/updLoanFee",
		"saveQTXX": urlStr+"/loanInfoInput/updLoanIndividuation"
	};

	/**
	* 加载车贷办理数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadLoanList = function(cb) {
		var data={};
//			 data['taskId']=80871;
			data['taskId']=$params.taskId;
		$.ajax({
//			 url: $http.api('loan.infoBak'),
//			 url: $http.api('loanInfoInput/info','jbs'),
			 url: urlStr+'/loanInfoInput/info',
			data: data,
			dataType: 'json',
			success: $http.ok(function(result) {
				$scope.result = result;
				setupLocation();
				if(result.data.FQXX && result.data.FQXX.renewalInfo){
					result.data.FQXX.renewalInfo = result.data.FQXX.renewalInfo.split(',');
				}
				render.compile($scope.$el.$tbl, $scope.def.listTmpl, result,true);
				loanFinishedInput();
				loanFinishedCheckbox();
				loanFinishedGps();
				setupEvt();
//				console.log(page.$scope.loanInfo.result.cfgData);
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
				$(this).parent().siblings().find("input").addClass("required");
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
	
	
	/**
	* 绑定立即处理事件
	*/
	var keyType;
	var setupEvt = function($el) {
		$console.find('.check-key').on('click', function() {
			var keyType = $(this).data('key');
			console.log(keyType);
		});
		// 提交
		$console.find('#submitOrder').on('click', function() {
			console.log("提交订单");
			var that = $(this);
			// if( ) {
			// 	//判断必填项是否填全
			// } else {

			// }

			//下面为邹海洋提交接口
			$.confirm({
				title: '提交',
				content: dialogTml.wContent.suggestion,
				useBootstrap: false,
				boxWidth: '500px',
				theme: 'light',
				type: 'purple',
				buttons: {
					'取消': {
			            action: function () {

			            }
			        },
			        '确定': {
			            action: function () {
	            			var _reason = $('#suggestion').val();
	            			console.log(_reason);
	            			if(!_reason) {
	            				$.alert({
	            					title: '提示',
									content: '<div class="w-content"><div>请填写处理意见！</div></div>',
									useBootstrap: false,
									boxWidth: '500px',
									theme: 'light',
									type: 'purple',
									buttons: {
										'确定': {
								            action: function () {
								            }
								        }
								    }
	            				})
	            				return false;
	            			} else {
	            				$.ajax({
									type: 'post',
									url: urlStr+'/loanInfoInput/submit/'+$params.taskId,
//									url: urlStr+'/loanInfoInput/submit/80871',
//									data: {
//										taskId: $params.taskId,
//										orderNo: $params.orderNo,
//										reason: _reason
//									},
									dataType: 'json',
									success: $http.ok(function(xhr) {
										console.log(xhr);
									})
								})
								// 流程跳转
								var params = {
									taskIds: [$params.taskId],
									orderNo: $params.orderNo
								}
								console.log(params)
								$.ajax({
									type: 'post',
									url: $http.api('tasks/complete', 'zyj'),
									data: JSON.stringify(params),
									dataType: 'json',
									contentType: 'application/json;charset=utf-8',
									success: $http.ok(function(result) {
										console.log(result);
										var loanTasks = result.data;
										var taskObj = [];
										for(var i = 0, len = loanTasks.length; i < len; i++) {
											var obj = loanTasks[i];
											taskObj.push({
												key: obj.category,
												id: obj.id,
												name: obj.sceneName
											})
										}
										// target为即将跳转任务列表的第一个任务
										var target = loanTasks[0];
										router.render('loanProcess/' + target.category, {
											taskId: target.id, 
											orderNo: target.orderNo,
											tasks: taskObj,
											path: 'loanProcess'
										});
										// router.render('loanProcess');
										// toast.hide();
									})
								})
//	            				$.ajax({
//									type: 'post',
//									url: $http.api('task/complete', 'jbs'),
//									data: {
//										taskId: $params.taskId,
//										orderNo: $params.orderNo,
//										reason: _reason
//									},
//									dataType: 'json',
//									success: $http.ok(function(result) {
//										console.log(result);
//									})
//								})
	            			}
			            }
			        }
			    }
			})
		})
	}		
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
   $(document).on('click', '.checkbox-normal', function() {
   	var keyData = $(this).attr("data-key");
   	var keyCode = $(this).attr("data-code");
   	var keyMark = $(this).attr("data-mark");
   	if(!$(this).attr('checked')) {
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
   		$(this).addClass('checked').attr('checked',true);
   		$(this).html('<i class="iconfont">&#xe659;</i>');
   	} else {
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
   		$(this).removeClass('checked').attr('checked',false);
   		$(this).html('');
   	}
   })

//gps
	var loanFinishedGps = function(){
		var gps = $("input[name='isInstallGps']").val();
		if(gps != 1){
			$("input[name='gpsNumber1']").parents(".info-key-value-box").hide();
			$("input[name='gpsNumber2']").parents(".info-key-value-box").hide();
		}else{
			$("input[name='gpsNumber1']").parents(".info-key-value-box").show();
			$("input[name='gpsNumber2']").parents(".info-key-value-box").show();
		}
	}
//保险续保
	$(document).on('click', '.select li', function() {
		loanFinishedBxxb();
		loanFinishedGps();
	})
	var loanFinishedBxxb = function(){
		var bxxbInput = $("input[name='renewalMode']").val();
		var repayInput = $("input[name='repayPeriod']").val();
		if(bxxbInput == 1){
			if(!repayInput){
				$.alert({
					title: '提示',
					content: '<div class="w-content"><div>请填写还款期限！</div></div>',
					useBootstrap: false,
					boxWidth: '500px',
					theme: 'light',
					type: 'purple',
					buttons: {
						'确定': {
				            action: function () {
				            }
				        }
				    }
				})
				return false;
			}else{
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
//				$("input[name='renewalMode']").parents('.info-key-value-box').append("<div class='zzz'>11111</div>")
			}
		}else{
			$("#year1").hide();
			$("#year2").hide();
			$("#year3").hide();
			$("#year4").hide();
			$("#year5").hide();
			$("#year6").hide();
//			var zzz = $(".zzz");
//			if(zzz){
//				$(".zzz").remove();
//			}
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
		var btnType = $(this).data('type');
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
//	            params = decodeURI(params,true);
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
	        var dataPost;
	        if(btnType){
	        	dataPost = JSON.stringify(data);
				$.ajax({
					type: 'POST',
					url: postUrl[key],
					data:dataPost,
					dataType:"json",
					contentType : 'application/json;charset=utf-8',
					success: function(result){
						console.log(result.msg);
					}
				});
	        }else{
	        	dataPost = data;
				$.ajax({
					type: 'POST',
					url: postUrl[key],
					data:dataPost,
					dataType:"json",
					success: function(result){
						console.log(result.msg);
					}
				});
	        }
		}
	})
	
	$console.load(router.template('iframe/loanInfo'), function() {
		$scope.def.listTmpl = render.$console.find('#loanlisttmpl').html();
		$scope.def.selectOpttmpl = $console.find('#selectOpttmpl').html();
		$scope.$el = {
			$tbl: $console.find('#loanInfoTable')
		}
		loadLoanList(function(){
			setupDropDown();
		});
		setupEvt();
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
		debugger
		console.log(picked);
		$scope.busiSourceNameId = picked.id;
		$("#numIpt").val('');
		var numSeled = $("#numSel").data('selected');
		if(numSeled){
			numSeled = '';
		}
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
		$("#repayPeriod").val(picked.id);
		loanFinishedrepay();
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
				url: urlStr+'/car/carBrandList',
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
				url: urlStr+'/car/carSeries',
				data: {
					brandId: brandId
				},
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
				url: urlStr+'/car/carSpecs',
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
		selfPicker: function(t, p, cb) {
			var keyType = this.$el.data('key');
			var sourceData = {
				items: dataMap[keyType],
				id: 'value',
				name: 'name'
			};
			cb(sourceData);
		},
		postPicker: function(t, p, cb) {
			var keyType = this.$el.data('key');
			var data={};
			if(keyType == 'busiSourceTypeCode'){
				data['code']='serviceType';
			}else if(keyType == 'businessModel'){
				data['code']='busimode';
			}else if(keyType == 'repayPeriod'){
				data['code']='repaymentTerm';
			}else{	
				data['code']=keyType;
			}
			
			$.ajax({
				url: urlApiMap[keyType],
				data:data,
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
			if(!$scope.busiSourceNameId) {
				$.alert({
					title: '提示',
					content: '<div class="w-content"><div>请填写业务来源方名称！</div></div>',
					useBootstrap: false,
					boxWidth: '500px',
					theme: 'light',
					type: 'purple',
					buttons: {
						'确定': {
				            action: function () {
				            }
				        }
				    }
				})
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
						cb(sourceData);
					})
				})
			}
		},
		demandBankId: function(t, p, cb) {
			$.ajax({
				url: urlStr+"/demandBank/selectBank",
//				data:{
//					'code':'busimode'
//				},
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
		}
	}
});






