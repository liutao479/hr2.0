'use strict';
page.ctrl('newCar', [], function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		apiParams = {
			
		};
	$scope.result = {};
	$scope.result.data = {};
	$scope.shopId = $params.shopId || '';
	$scope.id = $params.id || '';
	$scope.carShopId = $params.carShopId || '';

	/**
	 * 加载编辑/新建合作车商详情
	 */
	var loadNewCar = function(cb) {
		$.ajax({
			url: $http.api('demandCarShop/detail', 'cyj'),
			type: 'post',
			data: {
				id: $scope.id
			},
			dataType: 'json',
			success: $http.ok(function(result) {
				console.log(result);
				$scope.result = result;
				$scope.shopType = result.data.shopType;
				$scope.shopName = result.data.shopName;
				$scope.shopAddress = result.data.shopAddress;
				$scope.operateBrand = result.data.operateBrand;
				// render.compile($scope.$el.$carPanel, $scope.def.carTmpl, result.data, true);
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
			current: $scope.id ? '编辑合作车商' : '新建合作车商'
		});
		$location.location();
	}

	/**
	 * 加载车商资料信息
	 */
	var loadCarData = function() {
		render.compile($scope.$el.$carDataPanel, $scope.def.carDataTmpl, $scope.result.data, true);
		setupCarDataEvt();
	}

	/**
	 * 加载车商打款账户信息
	 */
	var loadCarAccount = function() {
		render.compile($scope.$el.$carAccountPanel, $scope.def.carAccountTmpl, $scope.result.data, true);
		setupCarAccountEvt();
	}

	/**
	 * 加载车商费率信息
	 */
	var loadCarRate = function() {
		render.compile($scope.$el.$carRatePanel, $scope.def.carRateTmpl, $scope.result.data, true);
		setupCarRateEvt();
	}

	/**
	* dropdown控件
	*/
	function setupDropDown() {
		$console.find('.select').dropdown();
	}

	/**
	 * 加载（车商资料）立即处理事件
	 */
	 var setupCarDataEvt = function() {
	 	setupDropDown();

	 	$scope.$el.$carDataPanel.find('#shopName input').on('blur', function() {
	 		if(!$.trim($(this).val())) {
	 			$('#shopName').removeClass('error-input').addClass('error-input');
	 			$scope.shopName = undefined;
	 		} else {
	 			$('#shopName').removeClass('error-input')
	 			$scope.shopName = $.trim($(this).val());
	 		}
	 	})

		$console.find('#carDataSave').on('click', function() {
			console.log($scope)
			var isPost = false;
			var flag = 0;
			if ($scope.shopType == undefined) {
				$scope.$el.$carDataPanel.find('#shopType').removeClass('error-input').addClass('error-input');
				flag++;
			}
			if ($scope.shopName == undefined) {
				$scope.$el.$carDataPanel.find('#shopName').removeClass('error-input').addClass('error-input');
				flag++;
			}
			if(flag > 0) {
				$.alert({
					title: '提示',
					content: tool.alert('请完善必填项！'),
					buttons: {
						ok: {
							text: '确定'
						}
					}
				});
			} else {
				var _params = {
					shopType: $scope.shopType,      //经销商类型 0:4s 1:二级经销商
					shopName: $scope.shopName      //经销商名
				};
				if($scope.shopAddress) {
					_params.shopAddress = $scope.shopAddress;
				}
				if($scope.operateBrand) {
					_params.operateBrand = $scope.operateBrand;
				}
				if($scope.id) {
					_params.id = $scope.id;
				}
				console.log(_params);
				$.ajax({
					url: $http.api('demandCarShop/save', 'cyj'),
					type: 'post',
					data: _params,
					dataType: 'json',
					success: $http.ok(function(result) {
						console.log(result);
						$scope.carShopId = $scope.id= result.data;
						loadNewCar(function() {
							loadCarData();
							loadCarAccount();
							loadCarRate();
						});
					})
				});
			}
		})
	 }

	/**
	 * 加载（合作车商银行账户）立即处理事件
	 */
	var setupCarAccountEvt = function() {
		// 增加银行账户
		$console.find('#addCarAccount').on('click', function() {
			var that = $(this),
				$parent = that.parent().parent(),
				$inputs = $parent.find('input'),
				params = {
					carShopId: parseInt($scope.carShopId)
				},
				flag = 0;
			$parent.find('.input-err').remove();
			$inputs.each(function() {
				var value = $.trim($(this).val());
				if(!value) {
					$(this).parent().append('<span class="input-err">该项不能为空！</span>')
				} else if(!regMap[$(this).data('type')].test(value)) {
					$(this).parent().find('.input-err').remove();
					if($(this).data('type') == 'accountNumber') {
						$(this).parent().append('<span class="input-err">该项不符合输入规则！（16位或者19位卡号）</span>')
					} else {
						$(this).parent().append('<span class="input-err">该项不符合输入规则！</span>')
					}
				} else {
					params[$(this).data('type')] = value;
					flag++;
				}
			});
			if(flag == 3) {
				console.log(params)
				$.ajax({
					url: $http.api('demandCarShopAccount/save', 'cyj'),
					type: 'post',
					data: params,
					dataType: 'json',
					success: $http.ok(function(result) {
						console.log(result);
						loadNewCar(function() {
							loadCarAccount();	
						})
					})
				})
			} else {
				return false;
			}
		})

		// 银行账户停用或者启用按钮事件
		$console.find('.stopUse').on('click', function() {
			var that = $(this);
			var $parent = that.parent().parent();
			var _status = that.data('status');
			var _id = that.data('id');
			var _params = {};
			_params.id = _id;
			// 停用或者启用
			var stopUseChange = function(params, cb) {
				console.log(params)
				$.ajax({
					url: $http.api('demandCarShopAccount/save', 'cyj'),
					type: 'post',
					data: params,
					dataType: 'json',
					success: $http.ok(function(result) {
						console.log(result);
						if(cb && typeof cb == 'function') {
							cb();
						}
					})
				})
			}
			if(_status == 0) {
				_params.status = 1; 
				stopUseChange(_params, function() {
					that.html('启用').data('status', 1);
					$parent.find('.search-item').addClass('search-item-disabled');
				});
			} else {
				_params.status = 0;
				stopUseChange(_params, function() {
					that.html('停用').data('status', 0);
					$parent.find('.search-item').removeClass('search-item-disabled');
				});
			}
			
			
		})

		// 合作银行账户删除
		$console.find('.deleteItem').on('click', function() {
			var that = $(this);
			$.alert({
				title: '提示',
				content: tool.alert('确定删除该条打款账户吗？'),
				buttons: {
					close: {
						text: '取消',
						btnClass: 'btn-default btn-cancel'
					},
					ok: {
						text: '确定',
						action: function() {
							$.ajax({
								url: $http.api('demandCarShopAccount/del', 'cyj'),
								type: 'post',
								data: {
									id: that.data('id')
								},
								dataType: 'json',
								success: $http.ok(function(result) {
									console.log(result);
									that.parent().parent().remove();
								})
							})
						}
					}
				}
			});
		})
	}

	function clearNoNum(event,obj){   
        //响应鼠标事件，允许左右方向键移动   
        event = window.event||event;   
        if(event.keyCode == 37 | event.keyCode == 39){   
            return;   
        }   
        //先把非数字的都替换掉，除了数字和.   
        obj.value = obj.value.replace(/[^\d.]/g,"");   
        //必须保证第一个为数字而不是.   
        obj.value = obj.value.replace(/^\./g,"");   
        //保证只有出现一个.而没有多个.   
        obj.value = obj.value.replace(/\.{2,}/g,".");   
        //保证.只出现一次，而不能出现两次以上   
        obj.value = obj.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");   
      } 

	/**
	 * 加载（银行费率表）立即处理事件
	 */
	var setupCarRateEvt = function() {
		// 车商费率格式校验
		$console.find('#carRate input').on('keyup', function(event) {
			clearNoNum(event,this)
		});
		$console.find('#carRate input').on('afterpaste', function(event) {
			clearNoNum(event,this)
		});
		// 车商费率表增加按钮事件
		$console.find('#addCarRate').on('click', function() {
			var that = $(this);
			var $parent = that.parent().parent().parent();
			var _carRate = $.trim($parent.find('#carRate input').val());
			var _costPolicy = $parent.find('.policy-item').length + 1;
			if(!_carRate) {
				$parent.find('#carRate input-err').remove();
				$parent.find('#carRate').append('<span class="input-err">费率不能为空！</span>');
			} else {
				var _params = {
					carShopId: parseInt($scope.carShopId),          //经销商ID
					costPolicy: '费率' + _costPolicy,     //新车
					costRate: parseFloat(_carRate).toFixed(4)      //费率
				}
				console.log(_params);
				$.ajax({
					url: $http.api('demandCarShopPolicy/save', 'cyj'),
					type: 'post',
					data: _params,
					dataType: 'json',
					success: $http.ok(function(result) {
						console.log(result);
						loadNewCar(function() {
							loadCarRate();
						})
					})
				})
			}
		})

		// 合作银行费率删除
		$console.find('.deleteCarRate').on('click', function() {
			var that = $(this);
			$.confirm({
				title: '提示',
				content: tool.alert('确定删除该条车商费率吗？'),
				buttons: {
					close: {
						text: '取消',
						btnClass: 'btn-default btn-cancel'
					},
					ok: {
						text: '确定',
						action: function () {
							$.ajax({
								url: $http.api('demandCarShopPolicy/del', 'cyj'),
								type: 'post',
								data: {
									policyId: that.data('policyId') 
								},
								dataType: 'json',
								success: $http.ok(function(result) {
									console.log(result);
									loadNewCar(function() {
										loadCarRate();
									})
								})
							})
	           			}
					}
				}

			});
		})
	}
	


	/***
	* 加载页面模板
	*/
	render.$console.load(router.template('iframe/new-car'), function() {
		$scope.def = {
			carDataTmpl: render.$console.find('#carDataTmpl').html(),
			carAccountTmpl: render.$console.find('#carAccountTmpl').html(),
			carRateTmpl: render.$console.find('#carRateTmpl').html()
		}
		$scope.$el = {
			$carDataPanel: $console.find('#carDataPanel'),
			$carAccountPanel: $console.find('#carAccountPanel'),
			$carRatePanel: $console.find('#carRatePanel')
		}
		setupLocation();
		if($scope.id) {
			loadNewCar(function() {
				loadCarData();
				loadCarAccount();
				loadCarRate();
			});
		} else {
			loadCarData();
		}
	});


	/**
	 * 下拉框请求数据回调
	 */
	$scope.dropdownTrigger = {
		shopType: function(t, p, cb) {
			var data = [
				{
					id: 0,
					name: '4s'
				},
				{
					id: 1,
					name: '二级经销商'
				}
			];
			var sourceData = {
				items: data,
				id: 'id',
				name: 'name'
			};
			cb(sourceData);
		},
		operateBrand: function(tab, parentId, cb) {
			$.ajax({
				type: 'post',
				url: $http.api('car/carBrandList', 'cyj'),
				dataType: 'json',
				success: $http.ok(function(xhr) {
					var sourceData = {
						items: xhr.data,
						id: 'brandId',
						name: 'carBrandName'
					};
					cb(sourceData);
				})
			})
		},
		areaSource: function(t, p, cb) {
			$.ajax({
				type: 'post',
				url: $http.api('area/get', 'cyj'),
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

	/**
	 * 车商类型选定回调
	 */
	$scope.shopTypePicker = function(picked) {
		this.$el.removeClass('error-input');
		$scope.shopType = picked.id;
	}

	$scope.shopAddressPicker = function(picked) {
		$scope.shopAddress = picked.name;	
	}

	$scope.operateBrandPicker = function(picked) {
		$scope.operateBrand = picked.name;	
	}

})