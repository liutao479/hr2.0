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
		data['taskId']=$params.taskId;
		$.ajax({
			url: $http.api('loanInfoInput/info','jbs'),
			data: data,
			dataType: 'json',
			success: $http.ok(function(result) {
				$scope.result = result;
				if(result.data.DDXX.busiSourceId){
					$scope.busiSourceNameId = result.data.DDXX.busiSourceId
				};
				$scope.result.tasks = $params.tasks ? $params.tasks.length : 1;
				setupLocation();
				setupBackReason($scope.result.data.loanTask.backApprovalInfo);
				if(result.data.FQXX && result.data.FQXX.renewalInfo){
					result.data.FQXX.renewalInfo = result.data.FQXX.renewalInfo.split(',');
				}
				render.compile($scope.$el.$tbl, $scope.def.listTmpl, result, true);
				render.compile($scope.$el.$sideBar, $scope.def.siderBarTmpl, result, function() {
					$('.remind-content').css('min-height', '550px');
					$scope.$el.$sideBar.find('li').not(".last").hover(function() {
						$(this).toggleClass('hover');
						// $scope.$el.$sideBar.find('.sideBar-content').hide();
						$(this).find('.sideBar-content').toggle();
					});
					 //鼠标点击
					var mark = 1;
					$scope.$el.$sideBar.find('li').not(".last").click(function() {
						mark = 2; //改变标记
						//点击右侧边导航 然后跳到指定的区块
						var $index = $(this).index(); //找到了对应的序列号
						//alert($index);
						var $top = $console.find(".panel-loan").eq($index).offset().top; //获取制定Louti与浏览器上面的距离)
						//alert($top);
						$("body,html").animate({
							scrollTop: $top - 75
						}, 500, function() {
							mark = 1;
						}); //浏览器滚动的高度
					});
					 //浏览器串口滚动事件
					// $(window).scroll(function() {
					// 	if (mark == 1) {
					// 		var $t = $(this).scrollTop(); //获取滚动条滚动的高度
					// 		//document.title = $t;
					// 		// if ($t > 1000) { //通过滚动条来判断
					// 		// 	$("#LoutiNav").fadeIn(); //淡入 导航慢慢显示出来
					// 		// } else {
					// 		// 	$("#LoutiNav").fadeOut(); //淡出 导航慢慢消失
					// 		// }
					// 		var $obj = $console.find(".panel-loan");
					// 		//循环每一个区块 然后找到最先满足条件的那个 区块
					// 		$obj.each(function() {
					// 			var $index = $(this).index();
					// 			//楼层与浏览器上面的高度
					// 			var $height = $obj.eq($index).offset().top + $(this).height() / 2;
					// 			//alert($height) 
					// 			// document.title = $t + "--" + $height;
					// 			if ($t < $height) {
					// 				$scope.$el.$sideBar.find('.sideBar-content').hide();
					// 				$scope.$el.$sideBar.find('.sideBar-content').eq($index).show();
					// 				return false;
					// 			}
					// 		});
					// 	}
					// });
					//点击 Top按钮 跳转到浏览器顶部
					$scope.$el.$sideBar.find('li.last').click(function() {
						$("body,html").animate({
							scrollTop: 0
						}, 500, function() {
							mark = 1;
						});
					});
				}, true);
				loanFinishedCheckbox();
				loanFinishedGps();
				loanFinishedBxxb();
				setupEvt();
				loanFinishedInput();
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
	* 设置退回原因
	*/
	var setupBackReason = function(data) {
		var $backReason = $console.find('#backReason');
		if(!data) {
			$backReason.remove();
			return false;
		} else {
			$backReason.data({
				backReason: data.reason,
				backUser: data.userName,
				backUserPhone: data.phone,
				backDate: tool.formatDate(data.transDate, true)
			});
			$backReason.backReason();
		}
	}

	/**
	* 并行任务切换触发事件
	* @params {int} idx 触发的tab下标
	* @params {object} item 触发的tab对象
	*/
	var tabChange = function (idx, item) {
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
	var seNotInp = function(){
		$(".select-text").each(function(){
			$(this).attr('readonly','readonly')
		})
	}
	
	/**
	* 绑定立即处理事件
	*/
	var keyType;
	var setupEvt = function($el) {
		$console.find('input[type="text"]').on('change', function() {
			var thisName = $(this).attr('name'),
				that = $(this);
			if(thisName == 'carPrice' || thisName == 'systemCarPrice' ){
				var thisVal = that.val();
				var reg =  /^0\.([1-9]|\d[1-9])$|^[1-9]\d{0,8}\.\d{0,2}$|^[1-9]\d{0,8}$/;
				if(!reg.test(thisVal)){
					$(this).parent().addClass("error-input");
					$(this).after('<i class="error-input-tip sel-err">请填写小于10亿最多两位小数的数字</i>');
					
				}
			}
			if( thisName == 'sfMoney' || thisName == 'sfProportion' || thisName == 'commissionFeeRate' || thisName == 'loanMoney' || thisName == 'stageMoney' || thisName == 'bankBaseRates' || thisName == 'bankFeeMoney' || thisName == 'contractSfMoney' || thisName == 'firstMonthMoney' || thisName == 'contractSfRatio' || thisName == 'loanFeeMoney' || thisName == 'bareRate' || thisName == 'monthIncomeMoney' || thisName == 'balance' || thisName == 'averageDailyBalance'){
				var thisVal = that.val();
				var reg =  /^0\.([1-9]|\d[1-9])$|^[1-9]\d{0,8}\.\d{0,4}$|^[1-9]\d{0,8}$/;
				if(!reg.test(thisVal)){
					$(this).parent().addClass("error-input");
					$(this).after('<i class="error-input-tip sel-err">请填写小于10亿最多四位小数的数字</i>');
					
				}
			}
			if( thisName == 'advancedMoney' ){
				var thisVal = that.val();
				var reg =  /^([0-9]|\d[1-9])$|^[1-9]\d{0,8}\.\d{0,4}$|^[1-9]\d{0,8}$/;
				if(!reg.test(thisVal)){
					$(this).parent().addClass("error-input");
					$(this).after('<i class="error-input-tip sel-err">请填写小于10亿最多四位小数的数字</i>');
					
				}
			}
			if( thisName == 'familyTel' || thisName == 'companyTel' ){
				var thisVal = that.val();
				var reg = /^0\d{2,3}-\d{7,8}(-\d{1,6})?$/;
				if(!reg.test(thisVal)){
					$(this).parent().addClass("error-input");
					$(this).after('<i class="error-input-tip sel-err">0000-12345678-8888(如有分机号)</i>');
					
				}
			}
			if( thisName == 'familyZipcode' || thisName == 'companyZipcode' ){
				var thisVal = that.val();
				var reg = /^[1-9][0-9]{5}$/;
				if(!reg.test(thisVal)){
					$(this).parent().addClass("error-input");
					$(this).after('<i class="error-input-tip sel-err">邮政编码格式不正确</i>');
					
				}
			}
			if( thisName == 'phone'){
				var thisVal = that.val();
				var reg = /^((0\d{2,3}-\d{7,8})|(\d{11}))$/;
				if(!reg.test(thisVal)){
					$(this).parent().addClass("error-input");
					$(this).after('<i class="error-input-tip sel-err">请正常填写手机号或常规电话号码。</i>');
					
				}
			}
		})
		$('i').each(function(){
			var dataNum = $(this).data('num');
			var that = $(this);
			if(dataNum){
				var jjlxr = '';
				var cfgNum = $scope.result.cfgData.frames[0].sections;
				for(var i=0;i<cfgNum.length;i++){
					var cfgItem = cfgNum[i];
					if(cfgItem.code == 'JJLXR'){
						for(var j=0;j<cfgItem.segments.length;j++){
							var itemCode = cfgItem.segments[j];
							jjlxr = itemCode.code;
							if(dataNum == jjlxr){
								if(itemCode.empty != '0'){
									that.remove();
								}
							}
						}
					}
				}
			}
		})
		$console.find('.checkbox-normal').on('click', function() {
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
		   	var boxChecked = $(this).parents('.info-key-check-box').find('.checked');
		   	var renewalStr = '';
			for(var i=0;i<boxChecked.length;i++){
				var rene = boxChecked[i];
//				if(rene.hasClass('checked')){
//			        rene.value = '';
//				}
				renewalStr += rene.getAttribute('data-value')+',';
			}
//			debugger
			$("input[name='residentType']").val(renewalStr);
	    })


	    /***
		* 保存按钮
		*/
		$console.find('.saveBtn').on('click', function() {
			var $btn = $(this);
			var isTure = true;
			var btnType = $(this).data('type');
			var requireList = $(this).parent().parent().siblings().find("form").find(".required");
			requireList.each(function(){
				$('.sel-err').remove();
				var value = $(this).val();
				if(!value){
					if(!$(this).parent().hasClass('info-value') && !$(this).parent().hasClass('info-check-box')){
						$(this).siblings('.select').addClass("error-input");
						$(this).after('<i class="error-input-tip sel-err">请完善该必填项</i>');
					}else{
						$(this).parent().addClass("error-input");
						$(this).after('<i class="error-input-tip">请完善该必填项</i>');
					}
					isTure = false;
				}
			});
			if(isTure){
				var key = $(this).data('key');
				if(key == 'saveFQXX'){
					var renewalStr = '';
					var inputList = $(".bxxbyearIpt");
					for(var i=0;i<inputList.length;i++){
						var rene = inputList[i];
						if(rene.parentNode.parentNode.parentNode.parentNode.parentNode.style.display == 'none'){
					        rene.value = '';
						}
						renewalStr += rene.value+',';
					}
					$("input[name='renewalInfo']").val(renewalStr);
				}
				var data;
		        var formList = $(this).parent().parent().siblings().find('form');
		        if(formList.length == 1){
			        var params = formList.serialize();
			        var b = params.replace(/\+/g," ");
					b =  decodeURIComponent(b);
//		            params = decodeURIComponent(params,true);
		            var paramArray = b.split("&");
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
				        var b = params.replace(/\+/g," ");
						b =  decodeURIComponent(b);
//			            params = decodeURIComponent(params,true);
			            var paramArray = b.split("&");
			            var data1 = {};
			            for(var i=0;i<paramArray.length;i++){
			                var valueStr = paramArray[i];
			                data1[valueStr.split('=')[0]] = valueStr.split('=')[1];
			            }
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
						success: $http.ok(function(result){
							if(result.data){
								if(key == 'saveQTXX'){
									var formlist = $btn.parent().parent().siblings('panel-detail-content-layout').find('form');
									formList.each(function(){
										var iptNode = "<input type='hidden' class='individuationId' name='individuationId'>";
										$(this).append(iptNode);
										$(this).find(".individuationId").val(result.data);
									})
								}
							}
							$.alert({
								title: '提示',
								content: tool.alert('保存成功'),
								buttons: {
									'确定': {
							            action: function () {
							            }
							        }
							    }
							})
						})
					});
		        }else{
		        	dataPost = data;
					$.ajax({
						type: 'POST',
						url: postUrl[key],
						data:dataPost,
						dataType:"json",
						success: $http.ok(function(result){
							if(result.data){
								if(key == 'saveCLXX'){
									var formlist = $btn.parent().parent().siblings('panel-detail-content-layout').find('form');
									formList.each(function(){
										var iptNode = "<input type='hidden' class='carId' name='carId'>";
										$(this).append(iptNode);
										$(this).find(".carId").val(result.data);
									})
								}
								if(key == 'saveHKKXX'){
									var formlist = $btn.parent().parent().siblings('panel-detail-content-layout').find('form');
									formList.each(function(){
										var iptNode = "<input type='hidden' class='id' name='id'>";
										$(this).append(iptNode);
										$(this).find(".id").val(result.data);
									})
								}
								if(key == 'saveFQXX'){
									var formlist = $btn.parent().parent().siblings('panel-detail-content-layout').find('form');
									formList.each(function(){
										var iptNode = "<input type='hidden' class='stageId' name='stageId'>";
										$(this).append(iptNode);
										$(this).find(".stageId").val(result.data);
									})
								}
							}
							$.alert({
								title: '提示',
								content: tool.alert('保存成功'),
								buttons: {
									'确定': {
							            action: function () {
							            }
							        }
							    }
							})
						})
					});
		        }
			}else{
				$.alert({
					title: '提示',
					content: tool.alert('请完善相关必填项！'),
					buttons: {
						ok: {
							text: '确定',
							action: function() {
							}
						}
					}
				});
			}
		})
	}		
	var loanFinishedCheckbox = function(){
		$(".info-key-check-box").each(function(){
			var that =$("input",$(this));
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

	$(document).on('click', '.select li', function() {
		loanFinishedBxxb();
		loanFinishedGps();
	})
	var loanFinishedGps = function(){
		var gps = $("input[name='isInstallGps']").val();
		if(gps != 1){
			$("input[name='gpsNumber1']").removeClass('required');
			$("input[name='gpsNumber2']").removeClass('required');
			$("input[name='gpsNumber1']").parents(".info-key-value-box").hide();
			$("input[name='gpsNumber2']").parents(".info-key-value-box").hide();
		}else{
			$("input[name='gpsNumber1']").addClass('required');
			$("input[name='gpsNumber2']").addClass('required');
			$("input[name='gpsNumber1']").parents(".info-key-value-box").show();
			$("input[name='gpsNumber2']").parents(".info-key-value-box").show();
		}
	}
	var loanFinishedBxxb = function(){
		var bxxbInput = $("input[name='renewalMode']").val();
		var repayInput = $("input[name='repayPeriod']").val();
		var bxxbLength = Math.ceil(repayInput/12);
		if(bxxbInput == 1){
			if(!repayInput){
				$.alert({
					title: '提示',
					content: '<div class="w-content"><div>请填写还款期限！</div></div>',
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
					$("#year2").hide();
					$("#year3").hide();
					$("#year4").hide();
					$("#year5").hide();
					$("#year6").hide();
				}else if(bxxbLength == 2){
					$("#year1").show();
					$("#year2").show();
					$("#year3").hide();
					$("#year4").hide();
					$("#year5").hide();
					$("#year6").hide();
				}else if(bxxbLength == 3){
					$("#year1").show();
					$("#year2").show();
					$("#year3").show();
					$("#year4").hide();
					$("#year5").hide();
					$("#year6").hide();
				}else if(bxxbLength == 4){
					$("#year1").show();
					$("#year2").show();
					$("#year3").show();
					$("#year4").show();
					$("#year5").hide();
					$("#year6").hide();
				}else if(bxxbLength == 5){
					$("#year1").show();
					$("#year2").show();
					$("#year3").show();
					$("#year4").show();
					$("#year5").show();
					$("#year6").hide();
				}else{
					$("#year1").show();
					$("#year2").show();
					$("#year3").show();
					$("#year4").show();
					$("#year5").show();
					$("#year6").show();
				}
			}
		}else{
			$("#year1").hide();
			$("#year2").hide();
			$("#year3").hide();
			$("#year4").hide();
			$("#year5").hide();
			$("#year6").hide();
		}
	}
	
	/**
	* 日历控件
	*/
	var setupDatepicker = function() {
		$console.find('.dateBtn').datepicker({
			onpicked: function() {
				$(this).parents().removeClass("error-input");
				$(this).siblings("i").remove();
			}
		});
	}
	
	/***
	* 为完善项更改去掉错误提示
	*/
	$(document).on('input','input', function() {
		$(this).parents().removeClass("error-input");
		$(this).siblings("i").remove();
	})
	$(document).on('click','.loan-info .checkbox', function() {
		$(this).parents().removeClass("error-input");
		$(this).parent().parent().parent().siblings("i").remove();
	})
	$(document).on('click','.select', function() {
		$(this).removeClass("error-input");
		$(this).siblings("i").remove();
	})

	/**
	* 设置底部按钮操作栏
	*/
	var setupSubmitBar = function() {
		var $submitBar = $console.find('#submitBar');
		$submitBar.data({
			taskId: $params.taskId
		});
		$submitBar.submitBar();
		var $sub = $submitBar[0].$submitBar;

		/**
		 * 退回订单
		 */
		$sub.on('backOrder', function() {
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
									var flag = 0;
									$(this).parent().parent().find('.checkbox-normal').each(function() {
										if($(this).hasClass('checked')) {
											flag++;
										}
									})
									if(flag > 0) {
										$scope.jumpId = $(this).data('id');
									}
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
							$.ajax({
								type: 'post',
								url: $http.api('task/jump', 'zyj'),
								data: _params,
								dataType: 'json',
								success: $http.ok(function(result) {
									router.render('loanProcess');
									// toast.hide();
								})
							})
						}
					}
				}
			})
		})

		/**
		 * 提交
		 */
		$sub.on('taskSubmit', function() {
			process();
		})
	}

	/**
	 * 任务提交跳转
	 */
	function process() {
		$.ajax({
			type: 'post',
			url: $http.api('loanInfoInput/checkLoanInput/' + $params.taskId, true),
			dataType: 'json',
			success: $http.ok(function(xhr) {
				$.confirm({
					title: '提交订单',
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
								var that = this;
		        				$.ajax({
									type: 'post',
									url: urlStr+'/loanInfoInput/submit/' + $params.taskId,
									dataType: 'json',
									success: $http.ok(function(xhr) {
										var taskIds = [];
										for(var i = 0, len = $params.tasks.length; i < len; i++) {
											taskIds.push(parseInt($params.tasks[i].id));
										}
										var params = {
											taskId: $params.taskId,
											taskIds: taskIds,
											orderNo: $params.orderNo
										}
										var reason = $.trim(that.$content.find('#suggestion').val());
										if(reason) params.reason = reason;
										flow.tasksJump(params, 'complete');
									})
								})
							}
						}
					}
				})
			})
		})
	}

	/**
	 * 退回订单弹窗内事件逻辑处理
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
	 * 首次加载页面时绑定的事件（底部提交按钮）
	 */
	var evt = function() {
		/**
		 * 订单退回的条件选项分割
		 */
		var taskJumps = $scope.result.data.loanTask.taskJumps;
		for(var i = 0, len = taskJumps.length; i < len; i++) {
			taskJumps[i].jumpReason = taskJumps[i].jumpReason.split(',');
		}
	}

	/**
	* 下拉
	*/
	var seleLoad = function(){
		$(".select").each(function(){
			var $that = $(this);
			var selected = $(this).data('selected');
			var re = /^[0-9]+.?[0-9]*$/;
			if((selected && re.test(selected)) || selected=='0'){
				$(this).find('.arrow-trigger').click();
				var lilist = $(this).find('li');
				$("li",$(this)).each(function(){
					var idx = $(this).data('id');
					if(selected == idx){
						$that.find('.select-text').val($(this).text());
						$(this).click();
						$that.find('.select-box').hide();
					}
				})
			}
		})
		$('.info-key-check-box').each(function(){
			var edit = $(this).data('edit');
			if(edit == '0'){
				$(this).addClass('pointDisabled');
				$(this).find('input').removeClass('required');
			}else{
				$(this).removeClass('pointDisabled');
			}
		})
		$('.info-key-value-box').each(function(){
			var edit = $(this).data('edit');
			if(edit == '0'){
				$(this).addClass('pointDisabled');
				$(this).find('input').removeClass('required');
			}else{
				$(this).removeClass('pointDisabled');
			}
		})
		$(".reneDiv").each(function(){
			var edit = $(this).data('edit');
			if(edit == '0'){
				$(this).addClass('pointDisabled');
				$(this).find('input').removeClass('required');
			}else{
				$(this).removeClass('pointDisabled');
			}
		});
	}
	var noWrite = function(){
		$(".pointDisabled").each(function(){
			$(this).find('input').attr('readonly','readonly')
		})
	}
	/**
	 * 加载页面模板
	 */
	$console.load(router.template('iframe/loanInfo'), function() {
		$scope.def.listTmpl = render.$console.find('#loanlisttmpl').html();
		$scope.def.selectOpttmpl = $console.find('#selectOpttmpl').html();
		$scope.def.siderBarTmpl = $console.find('#siderBarTmpl').html();
		$scope.$el = {
			$tbl: $console.find('#loanInfoTable'),
			$sideBar: $console.find('#sideBar')
		}
		loadLoanList(function(){
			router.tab($console.find('#tabPanel'), $scope.tasks, $scope.activeTaskIdx, tabChange);
			setupSubmitBar();
			setupDropDown();
			evt();
			seleLoad();
			seNotInp();
			setupDatepicker();
			noWrite();
		});
	});

	$scope.selfPicker = function(picked) {
		var isDiscount = $("#isDiscount").val();
		
		if(isDiscount != '1'){
			$("#discountRate").parents('.info-key-value-box').hide();
			$("#discountRate").find('input').removeClass('required').val('0');
			$("#discountMoney").parents('.info-key-value-box').hide();
			$("#discountMoney").find('input').removeClass('required').val('0');
		}else{
			$("#discountRate").parents('.info-key-value-box').show();
			$("#discountRate").find('input').addClass('required');
			$("#discountMoney").parents('.info-key-value-box').show();
			$("#discountMoney").find('input').addClass('required');
		}
	}
	$scope.areaPicker = function(picked) {
	}
	$scope.serviceTypePicker = function(picked) {
	}
	$scope.brandPicker = function(picked) {
	}
	$scope.busiSourceTypePicker = function(picked) {
	}
	$scope.busiSourceNamePicker = function(picked) {
		$scope.busiSourceNameId = picked.id;
		$("#numIpt").val('');
		$("#bankName").val('');
		$("#accountName").val('');
		$("#numSel").find('.select-text').hide();
		
		var numSeled = $("#numSel").data('selected');
		if(numSeled){
			numSeled = '';
		}
	}
	$scope.remitAccountNumberPicker = function(picked) {
		$("#numSel").find('.select-text').show();
		$("#bankName").val(picked.bankName)
		$("#accountName").val(picked.accountName)
	}
	$scope.busimodePicker = function(picked) {
	}
	$scope.repaymentTermPicker = function(picked) {
		$("#repayPeriod").val(picked.id);
		loanFinishedrepay();
	}
	$scope.carPicker = function(picked) {
		var pirce = picked['车型'].price;
		if(pirce){
			$("#systemCarPrice").val(pirce);
		}else{
			$("#systemCarPrice").val('0');
		}
		var carname = $("#carMode").find('.select-text').val();
		$("#carName").val(carname);
		
	}
	$scope.bankPicker = function(picked) {
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
				success: $http.ok(function(xhr) {
					var sourceData = {
						items: xhr.data,
						id: 'brandId',
						name: 'carBrandName'
					}
					cb(sourceData);
				})
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
				success: $http.ok(function(xhr) {
					var sourceData = {
						items: xhr.data,
						id: 'id',
						name: 'serieName'
					}
					cb(sourceData);
				})
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
				success: $http.ok(function(xhr) {
					var sourceData = {
						items: xhr.data,
						id: 'carSerieId',
						name: 'specName',
						price: 'advisePrics'
					};
					cb(sourceData);
				})
			})
		}
	}

	var areaSel = {
		province: function(cb) {
			$.ajax({
				type: 'post',
				url: $http.api('area/get', 'jbs'),
				dataType:'json',
				success: $http.ok(function(xhr) {
					var sourceData = {
						items: xhr.data,
						id: 'areaId',
						name: 'name'
					};
					cb(sourceData);
				})
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
				success: $http.ok(function(xhr) {
					var sourceData = {
						items: xhr.data,
						id: 'areaId',
						name: 'name'
					}
					cb(sourceData);
				})
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
				success: $http.ok(function(xhr) {
					var sourceData = {
						items: xhr.data,
						id: 'areaId',
						name: 'name'
					};
					cb(sourceData);
				})
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
				case "区/县":
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
				data['code']='busiSourceType';
			}else if(keyType == 'businessModel'){
				data['code']='busimode';
			}else if(keyType == 'serviceTypeCode'){
				data['code']='serviceType';
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
							id: 'account',
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
						id: 'id',
						name: 'bankName'
					};
					cb(sourceData);
				})
			})
		}
	}
});






