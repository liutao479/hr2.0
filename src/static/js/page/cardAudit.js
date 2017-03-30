'use strict';
page.ctrl('cardAudit', function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		apiParams = {
			process: $params.process || 0,
			page: $params.page || 1,
			pageSize: 20
		};
	/**
	* 加载车贷办理数据
	* @params {object} params 请求参数
	* @params {function} cb 回调ck函数
	*/
	var loadLoanList = function(cb) {
		var data={};
			data['taskId']=$params.taskId;
		$.ajax({
			url: urlStr+'/icbcCreditCardForm/queryICBCCreditCardForm',
			data: data,
			dataType: 'json',
			success: $http.ok(function(result) {
				$scope.result = result;
				render.compile($scope.$el.$tbl, $scope.def.listTmpl, result.data.creditCard, true);
				setupLocation();
				loanFinishedInput();
				loanFinishedInputPic();
				loanFinishedSelect();
				if(cb && typeof cb == 'function') {
					cb();
				}
			})
		})
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
			current: '开卡信息审核',
			orderDate: $scope.result.data.loanTask.createDateStr
		});
		$location.location();
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
//页面加载完成对所有带“*”的input进行必填绑定,不需要必填的删除required
	var cannotClick = function(){
		$(".info-key-value-box").each(function(){
			$(this).addClass("pointDisabled");
		});
	}
//页面加载完成对图片上传框进行设置
	var loanFinishedInputPic = function(){
		var imgSrc = $("#creditCardImgUrl").val();
		if(!imgSrc){
			$("#preview").hide();
		}else{
			$("#preview").show();
			$("#preview").attr('src',imgSrc);
		}
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
	})
//单位电话特殊处理
	$(document).on('change','#cophone', function() {
		var cophone = $(this).val();
		var cophone1 = cophone.substring(0,4),
			cophone2 = cophone.substring(cophone.length-8,cophone.length-4),
			cophone3 = cophone.substring(cophone.length-4,cophone.length);
		console.log('第一段：'+cophone1+'，第二段'+cophone2+'，第三段'+cophone3);
		$("#cophozono").val(cophone1);
		$("#cophoneno").val(cophone2);
		$("#cophonext").val(cophone3);
	})

//为完善项更改去掉错误提示
	$(document).on('input','input', function() {
		$(this).parents().removeClass("error-input");
		$(this).siblings("i").remove();
	})
	
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
		var adKey = $(this).data('key');
		var valInput = $(this).siblings().find('input');
		valInput.each(function(){ 
			if(!$(this).val()){
				alert("请完善地址");
				return false;
			}else{
				if(adKey == 'had'){
					var provincetext = $('#shprovince').siblings('.placeholder').text();
					var citytext = $('#shcity').siblings('.placeholder').text();
					var countrytext = $('#shcounty').siblings('.placeholder').text();
					var addresstext = $('#shaddress').val();
					$('#hprovince1').val(provincetext);
					$('#hcity1').val(citytext);
					$('#hcounty1').val(countrytext);
					$('#haddress1').val(addresstext);
					console.log($('#hcounty1').val());
					var commentext = '';
					    commentext = $('#hprovince1').val()+$('#hcity1').val()+$('#hcounty1').val()+$('#haddress1').val();
				    $("#homeAdd").val(commentext);
				    $("#homeAdd").attr('title',commentext);
				}else{
					var provincetext = $('#scprovince').siblings('.placeholder').text();
					var citytext = $('#sccity').siblings('.placeholder').text();
					var countrytext = $('#sccounty').siblings('.placeholder').text();
					var addresstext = $('#scaddress').val();
					$('#cprovince1').val(provincetext);
					$('#ccity1').val(citytext);
					$('#ccounty1').val(countrytext);
					$('#caddress1').val(addresstext);
					console.log($('#ccounty1').val());
					var commentext = '';
					    commentext = $('#cprovince1').val()+$('#ccity1').val()+$('#ccounty1').val()+$('#caddress1').val();
				    $("#comeAdd").val(commentext);
				    $("#comeAdd").attr('title',commentext);
				}
			    $(this).parent().parent().parent(".addressDetail").hide();
			}
		})
//		$(this).parent(".addressDetail").hide();
	})
//模糊搜索
//	$(document).on('input','.searchInp', function() {
//		var that = $(this).parent().siblings(".selecter").find("div");
//		var key = $(this).data('key');
//		var boxKey = key + 'Box';
//		$(this).attr("id",boxKey);
//		var data={};
//          data['code'] = key;
//		$.ajax({
//			url: apiMap[key],
//			data: data,
//			dataType: 'json',
//			success: $http.ok(function(result) {
//				render.compile(that, $scope.def.selectOpttmpl, result.data, true);
////				$source.selectType = result.data;
//				var selectOptBox = $(".selectOptBox");
//				selectOptBox.attr("id",key);
//			})
//		})
//	})
	/***
	* 保存按钮
	*/
	$(document).on('click', '.saveBtn', function() {
		var email = $("#email").val();
		if(!email){
			$("#emladdrf").val(0);
		}else{
			$("#emladdrf").val(1);
		}
		var isTure = true;
		var requireList = $("#dataform").find(".required");
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
				url: urlStr+'/icbcCreditCardForm/saveICBCCreditCardForm',
				data:JSON.stringify(data1),
				dataType:"json",
				contentType : 'application/json;charset=utf-8',
				success: function(result){
					console.log(result.msg);
				}
			});
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
		 * 审核通过按钮
		 */
		$el.find('#approvalPass').on('click', function() {
			process();
		})

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
									
									router.render('loanProcess');
									// toast.hide();
								})
							})
						}
					}
				}
			})
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
							taskIds.push(parseInt($params.tasks[0].id));
						}
						var params = {
							taskId: $params.taskId,
							taskIds: taskIds,
							orderNo: $params.orderNo
						}
						var reason = $.trim(this.$content.find('#suggestion').val());
						if(reason) params.reason = reason;
						tasksJump(params, 'approval');
					}
				}
			}
		})
	}


	/**
	 * 退回订单弹窗内逻辑
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
	
	/***
	* 加载页面模板
	*/
	$console.load(router.template('iframe/cardAudit'), function() {
		$scope.def.listTmpl = render.$console.find('#openCardSheettmpl').html();
		$scope.def.selectOpttmpl = $console.find('#selectOpttmpl').html();
		$scope.$el = {
			$tbl: $console.find('#openCardSheet')
		}
		loadLoanList(function(){
			console.log('zhixing');
			setupSubmitBar();
			setupDropDown();
			cannotClick();

		});
		
	});

	

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
		dealerId: function(t, p, cb) {
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
		repayPeriod: function(t, p, cb) {
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
