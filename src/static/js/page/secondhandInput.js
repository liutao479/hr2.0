'use strict';
page.ctrl('secondhandInput', function($scope) {
	var $console = render.$console,
		$params = $scope.$params;
	/**
	* 加载车贷办理数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadLoanList = function(cb) {
		$.ajax({
			type: 'post',
			url: urlStr + '/loanCarAssess/index',
			data: {
				taskId: $params.taskId
				// taskId:80880
			},
			dataType: 'json',
			success: $http.ok(function(result) {
				console.log(result)
				$scope.result = result;
				render.compile($scope.$el.$tbl, $scope.def.listTmpl, result, true);
				setupLocation();
				loanFinishedInput();
				loanFinishedInputReq();
				setupDatepicker();
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
			current: $scope.result.data.loanTask.taskName,
			orderDate: $scope.result.data.loanTask.createDateStr
		});
		$location.location();
	}

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
		 * 提交
		 */
		$sub.on('taskSubmit', function() {
//			process();
			//先保存数据再提交订单
			 saveData(function() {
			 	process();
			 });
		})

	}

	/**
	 * 任务提交跳转
	 */
	function process() {
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
						console.log(params);
						flow.tasksJump(params, 'complete');
						
					}
				}
			}
		})
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
	/**
	* 页面加载完成对所有带“*”的input进行必填绑定,不需要必填的删除required
	*/
	var loanFinishedInputReq = function(){
		$("input[type='hidden'],input[type='text']").each(function(){
			var required = $(this).attr("name");
			if(!required){
				$(this).removeClass("required");
			}
		});
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
	/**
	* 保存数据
	*/
	var saveData = function(cb) {
		console.log("提交订单");
		var isTure = true;
		var requireList = $(".required");
		requireList.each(function(){
			var value = $(this).val();
			if(!value){
				if(!$(this).parent().hasClass('info-value')){
					if($(this).parent().hasClass('input-date-mid')){
						$(this).parent().addClass("error-input");
						$(this).after('<i class="error-input-tip sel-err">请完善该必填项</i>');
					}else{
						$(this).siblings('.select').addClass("error-input");
						$(this).after('<i class="error-input-tip sel-err">请完善该必填项</i>');
					}
				}else{
					$(this).parent().addClass("error-input");
					$(this).after('<i class="error-input-tip">请完善该必填项</i>');
				}
				isTure = false;
			}
		});
		if(isTure){
//			debugger
			var data;
	        var formList = $('#dataform');
	        var params = formList.serialize();
//          params = decodeURIComponent(params,true);
	        var b = params.replace(/\+/g," ");
			b =  decodeURIComponent(b);
            var paramArray = b.split("&");
            var data1 = {};
            for(var i=0;i<paramArray.length;i++){
                var valueStr = paramArray[i];
                data1[valueStr.split('=')[0]] = valueStr.split('=')[1];
            }
            data = data1;
			$.ajax({
				type: 'post',
				url: $http.api('loanCarAssess/submit/' + $params.taskId, 'jbs'),
//				data: JSON.stringify(data),
				data: data,
				dataType: 'json',
//				contentType: 'application/json;charset=utf-8',
				success: $http.ok(function(xhr) {
					if(xhr.data){
						var iptNode = "<input type='hidden' class='individuationId' name='id'>";
						$("#dataform").append(iptNode);
						$("#dataform").find(".individuationId").val(xhr.data);
					}
					console.log(xhr);
					$.alert({
						title: '提示',
						content: tool.alert('信息已保存！'),
						buttons: {
							'确定': {
					            action: function () {
					            	process()
					            }
					        }
					    }
					})
				}),
				error:function(){
					$.alert({
						title: '提示',
						content: tool.alert(xhr.msg),
						buttons: {
							'确定': {
					            action: function () {
					            }
					        }
					    }
					})
				}
			})				
		}else{
			$.alert({
				title: '提示',
				content: tool.alert('请完善必填项！'),
				buttons: {
					'确定': {
			            action: function () {
			            }
			        }
			    }
			})
			return false;
		}
	}		
	/**
	* 下拉
	*/
	var seleLoad = function(){
		$(".select-text").each(function(){
			$(this).attr('readonly','readonly')
		})
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
	}
	/***
	* 为完善项更改去掉错误提示
	*/
	$(document).on('input','input', function() {
		$(this).parents().removeClass("error-input");
		$(this).siblings("i").remove();
	})
	$(document).on('click','.select', function() {
		$(this).removeClass("error-input");
		$(this).siblings("i").remove();
	})

	$scope.carPicker = function(picked) {
		var carname = $("#carMode").find('.select-text').val();
		$("#carName").val(carname);
	}
	$scope.areaPicker = function(picked) {
		var locationName = $("#location").find('.select-text').val();
		$("#locationName").val(locationName);
		var originAreaName = $("#originArea").find('.select-text').val();
		$("#originAreaName").val(originAreaName);
	}
	/**dropdown 测试*/
	function setupDropDown() {
		$console.find('.select').dropdown();
	}
	var car = {
		brand: function(cb) {
			$.ajax({
				url: urlStr+'/car/carBrandList',
				dataType:'json',
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
				dataType:'json',
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
				dataType:'json',
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
			var sourceData = {
				items: dataMap.yesNo,
				id: 'value',
				name: 'name'
			};
			cb(sourceData);
		}
	}
	var seNotInp = function(){
		$(".select-text").each(function(){
			$(this).attr('readonly','readonly')
		})
	}
	/***
	* 加载页面模板
	*/
	$console.load(router.template('iframe/secondhandInput'), function() {
		$scope.def.listTmpl = render.$console.find('#secondhandInputtmpl').html();
		$scope.def.selectOpttmpl = $console.find('#selectOpttmpl').html();
		$scope.$el = {
			$tbl: $console.find('#secondhandInput')
		}
		loadLoanList(function(){
			setupSubmitBar();
			setupDropDown();
			seleLoad();
			seNotInp();
		});
	});
});



