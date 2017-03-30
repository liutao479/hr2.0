'use strict';
page.ctrl('loanInfo', function($scope) {
	var $params = $scope.$params,
		$console = $params.refer ? $($params.refer) : render.$console,
		$source = $scope.$source = {},
		apiParams = {};
	$scope.tasks = $params.tasks || [];
	$scope.activeTaskIdx = $params.selected || 0;

	var postUrl = {
		"saveDDXX": $http.api('loanInfoInput/updLoanOrder', 'jbs'),
		"saveCLXX": $http.api('loanInfoInput/updLoanUserCar', 'jbs'),
		"saveFQXX": $http.api('loanInfoInput/updLoanUserStage', 'jbs'),
		"saveZJKR": $http.api('loanInfoInput/updLoanUser', 'jbs'),
		"saveGTHK": $http.api('loanInfoInput/updLoanUser', 'jbs'),
		"saveFDBR": $http.api('loanInfoInput/updLoanUser', 'jbs'),
		"saveJJLXR": $http.api('loanInfoInput/updLoanEmergencyConact', 'jbs'),
		"saveHKKXX": $http.api('loanInfoInput/updLoanPayCard', 'jbs'),
		"saveFYXX": $http.api('loanInfoInput/updLoanFee', 'jbs'),
		"saveQTXX": $http.api('loanInfoInput/updLoanIndividuation', 'jbs')
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
			url: $http.api('loanInfoInput/info','jbs'),
			data: data,
			dataType: 'json',
			success: $http.ok(function(result) {
				$scope.result = result;
				$scope.result.tasks = $params.tasks ? $params.tasks.length : 1;
				console.log(result)
				setupLocation();
				if(result.data.FQXX && result.data.FQXX.renewalInfo){
					result.data.FQXX.renewalInfo = result.data.FQXX.renewalInfo.split(',');
				}
				render.compile($scope.$el.$tbl, $scope.def.listTmpl, result,true);
				loanFinishedInput();
				loanFinishedCheckbox();
				loanFinishedGps();
				loanFinishedBxxb();
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
			current: $scope.result.data.loanTask.taskName,
			orderDate: $scope.result.data.loanTask.createDateStr
		});
		$location.location();
	}

	/**
	* 并行任务切换触发事件
	* @params {int} idx 触发的tab下标
	* @params {object} item 触发的tab对象
	*/
	var tabChange = function (idx, item) {
		console.log(item);
		router.render('loanProcess/' + item.key, {
			tasks: $scope.tasks,
			taskId: $scope.tasks[idx].id,
			orderNo: $params.orderNo,
			selected: idx,
			path: 'loanProcess'
		});
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
<<<<<<< HEAD

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
					type: 'post',
					url: $http.api('demandCarShopAccount/getAccountList', 'jbs'),
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
				type: 'post',
				url: $http.api('demandCarShopAccount/getAccountList', 'jbs'),
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

	/**
	* 设置底部按钮操作栏
	*/
	var setupSubmitBar = function() {
		var $submitBar = $console.find('#submitBar');
		$submitBar.data({
			taskId: $params.taskId
		});
		$submitBar.submitBar(function($el) {
			evt($el);
		});
	}

	/**
	* 底部按钮操作栏事件
	*/
	var evt = function($el) {

		/**
		 * 订单退回的条件选项分割
		 */
		var taskJumps = $scope.result.data.loanTask.taskJumps;
		for(var i = 0, len = taskJumps.length; i < len; i++) {
			taskJumps[i].jumpReason = taskJumps[i].jumpReason.split(',');
		}

		/**
		 * 退回订单按钮
		 */
		$el.find('#backOrder').on('click', function() {
			var that = $(this);
			console.log($scope.result.data.loanTask.taskJumps)
			$.alert({
				title: '退回订单',
				content: doT.template(dialogTml.wContent.back)($scope.result.data.loanTask.taskJumps),
				onContentReady: function() {
					dialogEvt(this.$content);
				},
				buttons: {
					close: {
						text: '取消',
						btnClass: 'btn-default btn-cancel'
					},
					ok: {
						text: '确定',
						action: function () {
							var _reason = $.trim(this.$content.find('#suggestion').val());
							this.$content.find('.checkbox-radio').each(function() {
								if($(this).hasClass('checked')) {
									$scope.jumpId = $(this).data('id');
								}
							})

							if(!_reason) {
								$.alert({
									title: '提示',
									content: tool.alert('请填写处理意见！'),
									buttons: {
										ok: {
											text: '确定',
											action: function() {
											}
										}
									}
								});
								return false;
							} 
							if(!$scope.jumpId) {
								$.alert({
									title: '提示',
									content: tool.alert('请至少选择一项原因！'),
									buttons: {
										ok: {
											text: '确定',
											action: function() {
											}
										}
									}
								});
								return false;
							}
							var _params = {
								taskId: $params.taskId,
								jumpId: $scope.jumpId,
								reason: _reason
							}
							console.log(_params)
							$.ajax({
								type: 'post',
								url: $http.api('task/jump', 'zyj'),
								data: _params,
								dataType: 'json',
								success: $http.ok(function(result) {
									console.log(result);
									
									// router.render('loanProcess');
									// toast.hide();
								})
							})
						}
					}
				}
			})
		});
		/**
		 * 提交按钮按钮
		 */
		$el.find('#taskSubmit').on('click', function() {
			process();
		})
	}

	/**
	 * 跳流程
	 */
	function process() {
		$.confirm({
			title: '提交',
			content: dialogTml.wContent.suggestion,
			buttons: {
				close: {
					text: '取消',
					btnClass: 'btn-default btn-cancel',
					action: function() {}
				},
				ok: {
					text: '确定',
					action: function () {
						var taskIds = [];
						for(var i = 0, len = $params.tasks.length; i < len; i++) {
							taskIds.push(parseInt($params.tasks[i].id));
						}
						var params = {
							taskId: $params.taskId,
							taskIds: taskIds,
							orderNo: $params.orderNo
						}
						var reason = $.trim(this.$content.find('#suggestion').val());
						if(reason) params.reason = reason;
						console.log(params);
						tasksJump(params, 'complete');
					}
				}
			}
		})
	}

	/**
	 * 取消订单弹窗内事件逻辑处理
	 */
	var dialogEvt = function($dialog) {
		var $reason = $dialog.find('#suggestion');
		$scope.$checks = $dialog.find('.checkbox').checking();
		// 复选框
		$scope.$checks.filter('.checkbox-normal').each(function() {
			var that = this;
			that.$checking.onChange(function() {
				//用于监听意见有一个选中，则标题项选中
				var flag = 0;
				var str = '';
				$(that).parent().parent().find('.checkbox-normal').each(function() {
					if($(this).attr('checked')) {
						str += $(this).data('value') + ',';
						flag++;
					}
				})
				str = '#' + str.substring(0, str.length - 1) + '#';				
				$reason.val(str);
				if(flag > 0) {
					$(that).parent().parent().find('.checkbox-radio').removeClass('checked').addClass('checked').attr('checked', true);
				} else {
					$reason.val('');
					$(that).parent().parent().find('.checkbox-radio').removeClass('checked').attr('checked', false);
				}
				$(that).parent().parent().siblings().find('.checkbox').removeClass('checked').attr('checked', false);

				// if()
			});
		})

		// 单选框
		$scope.$checks.filter('.checkbox-radio').each(function() {
			var that = this;
			that.$checking.onChange(function() {
				$reason.val('');
				$(that).parent().parent().find('.checkbox-normal').removeClass('checked').attr('checked', false);
				$(that).parent().parent().siblings().find('.checkbox').removeClass('checked').attr('checked', false);
			});
		})
	}


	/**
	 * 加载页面模板
	 */
	$console.load(router.template('iframe/loanInfo'), function() {
		$scope.def.listTmpl = render.$console.find('#loanlisttmpl').html();
		$scope.def.selectOpttmpl = $console.find('#selectOpttmpl').html();
		$scope.$el = {
			$tbl: $console.find('#loanInfoTable')
		}
		loadLoanList(function(){
			router.tab($console.find('#tabPanel'), $scope.tasks, $scope.activeTaskIdx, tabChange);
			setupSubmitBar();
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
				type: 'post',
				url: $http.api('car/carBrandList', 'jbs'),
				dataType: 'json',
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
				type: 'post',
				url: $http.api('car/carSeries', 'jbs'),
				dataType: 'json',
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
				type: 'post',
				url: $http.api('car/carSpecs', 'jbs'),
				dataType: 'json',
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
				type: 'post',
				url: $http.api('area/get', 'jbs'),
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
				type: 'post',
				url: $http.api('area/get', 'jbs'),
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
				type: 'post',
				url: $http.api('area/get', 'jbs'),
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
				type: 'post',
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
					content: tool.alert('请填写业务来源方名称！'),
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
					type: 'post',
					url: $http.api('demandCarShopAccount/getAccountList', 'jbs'),
					data:{
						'carShopId': $scope.busiSourceNameId
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
				type: 'post',
				url: $http.api('demandBank/selectBank', 'jbs'),
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






