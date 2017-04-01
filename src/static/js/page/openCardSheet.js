'use strict';
page.ctrl('openCardSheet', function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		apiParams = {
			process: $params.process || 0,
			page: $params.page || 1,
			pageSize: 20
		};
	$scope.tasks = $params.tasks || [];
	$scope.activeTaskIdx = $params.selected || 0;

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
				render.compile($scope.$el.$tbl, $scope.def.listTmpl, result.data, true);
				setupLocation();
				loanFinishedInput();
				setupEvt();
				if(cb && typeof cb == 'function') {
					cb();
				}
			})
		})
	}
	/***
	* 上传图片成功后的回调函数
	*/
	$scope.uploadcb = function(self) {
		var imgStr = self.$el.find('.imgs-view').attr('src');
		$("#imgUrl").val(imgStr);
	}
	$scope.deletecb = function(self) {
		$("#imgUrl").val('');
	}	/**
	* 设置面包屑
	*/
	var setupLocation = function() {
		if(!$scope.$params.path) return false;
		var $location = $console.find('#location');
		$location.data({
			backspace: $scope.$params.path,
			loanUser: $scope.result.data.loanTask.loanOrder.realName,
			current: '开卡信息录入',
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
	var setupEvt = function($el) {
		$console.find('.uploadEvt').imgUpload();
		$console.find('#cophone').on('change', function() {
			var cophone = $(this).val();
			var cophone1 = cophone.substring(0,4),
				cophone2 = cophone.substring(cophone.length-8,cophone.length-4),
				cophone3 = cophone.substring(cophone.length-4,cophone.length);
			console.log('第一段：'+cophone1+'，第二段'+cophone2+'，第三段'+cophone3);
			$("#cophozono").val(cophone1);
			$("#cophoneno").val(cophone2);
			$("#cophonext").val(cophone3);
		})
		// 提交
		$console.find('.saveBtn').on('click', function() {
			debugger
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
					if(!$(this).parent().hasClass('info-value')){
						$(this).siblings('.select').addClass("error-input");
						$(this).after('<i class="error-input-tip sel-err">请完善该必填项</i>');
					}else{
						$(this).parent().addClass("error-input");
						$(this).after('<i class="error-input-tip">请完善该必填项</i>');
					}
					console.log($(this).index());
					isTure = false;
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
					url: urlStr+'/icbcCreditCardForm/saveICBCCreditCardForm/'+$params.taskId,
//					data:JSON.stringify(data1),
					data:data1,
					dataType:"json",
//					contentType : 'application/json;charset=utf-8',
					success: function(result){
						console.log("提交订单");
//						var that = $(this);
//						// if( ) {
//						// 	//判断必填项是否填全
//						// } else {
//			
//						// }
//						// 流程跳转
//						var params = {
//							taskIds: [$params.taskId],
//							orderNo: $params.orderNo
//						}
//						console.log(params)
//						$.ajax({
//							type: 'post',
//							url: $http.api('tasks/complete', 'zyj'),
//							data: JSON.stringify(params),
//							dataType: 'json',
//							contentType: 'application/json;charset=utf-8',
//							success: $http.ok(function(result) {
//								console.log(result);
//								var loanTasks = result.data;
//								var taskObj = [];
//								for(var i = 0, len = loanTasks.length; i < len; i++) {
//									var obj = loanTasks[i];
//									taskObj.push({
//										key: obj.category,
//										id: obj.id,
//										name: obj.sceneName
//									})
//								}
//								// target为即将跳转任务列表的第一个任务
//								var target = loanTasks[0];
//								router.render('loanProcess/' + target.category, {
//									taskId: target.id, 
//									orderNo: target.orderNo,
//									tasks: taskObj,
//									path: 'loanProcess'
//								});
//								// router.render('loanProcess');
//								// toast.hide();
//							})
//						})
					}
				});
			}
		})
	}		

//为完善项更改去掉错误提示
	$(document).on('input','input', function() {
		$(this).parents().removeClass("error-input");
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
							taskIds.push(parseInt($params.tasks[0].id));
						}
						var params = {
							taskId: $params.taskId,
							taskIds: taskIds,
							orderNo: $params.orderNo
						}
						var reason = $.trim(this.$content.find('#suggestion').val());
						if(reason) params.reason = reason;
						tasksJump(params, 'complete');
					}
				}
			}
		})
	}
	
	/***
	* 加载页面模板
	*/
	$console.load(router.template('iframe/open-card-sheet'), function() {
		$scope.def.listTmpl = render.$console.find('#openCardSheettmpl').html();
		$scope.def.selectOpttmpl = $console.find('#selectOpttmpl').html();
		$scope.$el = {
			$tbl: $console.find('#openCardSheet')
		}
		loadLoanList(function(){
			console.log('zhixing');
			router.tab($console.find('#tabPanel'), $scope.tasks, $scope.activeTaskIdx, tabChange);
			setupSubmitBar();
			setupDropDown();
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
		selfPicker: function(t, p, cb) {
			var keyType = this.$el.data('key');
			var sourceData = {
				items: dataMap[keyType],
				id: 'value',
				name: 'name'
			};
			cb(sourceData);
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
