'use strict';
page.ctrl('secondhandInput', function($scope) {
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
	* @params {function} cb 回调函数
	*/
	var loadLoanList = function(cb) {
		var params = {
			taskId:80880
		}
		$.ajax({
			url: urlStr+'/loanCarAssess/index',
			data: params,
			dataType: 'json',
			success: $http.ok(function(result) {
				$scope.result = result;
				render.compile($scope.$el.$tbl, $scope.def.listTmpl, result, true);
				setupLocation();
				loanFinishedInput();
				loanFinishedInputReq();
				setupEvt();
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
			current: '二手车信息录入',
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
	* 绑定立即处理事件
	*/
	var setupEvt = function($el) {
		// 提交
		$console.find('#submitOrder').on('click', function() {
			console.log("提交订单");
			var isTure = true;
			var that = $(this);
			var requireList = $(".required");
			requireList.each(function(){
				var value = $(this).val();
				if(!value){
					$(this).parent().addClass("error-input");
					$(this).after('<i class="error-input-tip">请完善该必填项</i>');
					console.log($(this).index());
					isTure = false;
				}
			});
			if(isTure){
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
									var data;
							        var formList = $(this).parents().find('form');
							        var params = formList.serialize();
						            params = decodeURIComponent(params,true);
						            var paramArray = params.split("&");
						            var data1 = {};
						            for(var i=0;i<paramArray.length;i++){
						                var valueStr = paramArray[i];
						                data1[valueStr.split('=')[0]] = valueStr.split('=')[1];
						            }
						            data = data1;
		            				$.ajax({
										type: 'post',
//										url: urlStr+'/loanInfoInput/submit/'+$params.taskId,
										url: urlStr+'/loanInfoInput/submit/80871',
										data: data,
										dataType: 'json',
										success: $http.ok(function(xhr) {
											console.log(xhr);
										})
									})
		            				$.ajax({
										type: 'post',
										url: $http.api('task/complete', 'jbs'),
										data: {
											taskId: $params.taskId,
											orderNo: $params.orderNo,
											reason: _reason
										},
										dataType: 'json',
										success: $http.ok(function(result) {
											console.log(result);
										})
									})
		            			}
				            }
				        }
				    }
				})				
			}else{
				$.alert({
					title: '提示',
					content: '<div class="w-content"><div>请完善必填项！</div></div>',
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

	$scope.carPicker = function(picked) {
		console.log(picked);
//		var carName = picked.品牌.name+'-'+picked.车系.name+'-'picked.车型.name;
		var carName = picked.品牌.name;
//		$("#carName").val(carName);
		console.log(carName);
	}
	$scope.areaPicker = function(picked) {
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
		}
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
			setupDropDown();
		});
	});
});



