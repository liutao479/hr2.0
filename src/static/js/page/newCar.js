'use strict';
page.ctrl('newCar', [], function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		apiParams = {
			
		};
	$scope.result = {};
	$scope.result.data = {};
	$scope.shopId = $params.shopId || '';
	$scope.carShopId = $params.carShopId || '';
	$scope.shopType = '';
	$scope.shopName = '';
	$scope.shopAddress = '';
	$scope.operateBrand = '';

	/**
	 * 加载编辑/新建合作车商详情
	 */
	var loadNewCar = function(cb) {
		$.ajax({
			url: $http.api('demandCarShop/detail', 'cyj'),
			type: 'post',
			data: {
				shopId: $scope.shopId
			},
			dataType: 'json',
			success: $http.ok(function(result) {
				console.log(result);
				$scope.result = result;
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
			current: '新建合作车商'
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

		$console.find('#carDataSave').on('click', function() {
			if($scope.shopType === '' || $scope.shopName === '') {
				$.alert({
					title: '提示',
					content: '请完善必填项',
					useBootstrap: false,
					boxWidth: '500px',
					theme: 'light',
					buttons:{
						ok: {
							text: '确定'
						}
					}
				})
			} else {
				var _params = {
					organId: 99,               				//机构ID
					shopType: $scope.shopType,             //经销商类型 0:4s 1:二级经销商
					shopName: $scope.shopName      //经销商名
				};
				if($scope.shopAddress) {
					_params['shopAddress'] = $scope.shopAddress;
				}
				if($scope.operateBrand) {
					_params['operateBrand'] = $scope.operateBrand;
				}
				console.log(_params);
				$.ajax({
					url: $http.api('demandCarShop/save', 'cyj'),
					type: 'post',
					data: _params,
					dataType: 'json',
					success: $http.ok(function(result) {
						console.log(result);
						$scope.demandBankId = result.data;
						loadNewBank(function() {
							loadBankData();
							loadBankAccount();
							loadBankRate();
						});
					})
				})
			}
			
			
		});
	 }

	/**
	 * 加载（合作车商银行账户）立即处理事件
	 */
	var setupCarAccountEvt = function() {
		// 增加银行账户
		$console.find('#addCarAccount').on('click', function() {
			var that = $(this);
			var $parent = that.parent().parent();
			var _accountBankName = $parent.find('.accountBankName input').val();
			var _accountNumber = $parent.find('.accountNumber input').val();
			var _accountName = $parent.find('.accountName input').val();
			$parent.find('.input-err').remove();
			if(!_accountBankName) {
				$parent.find('.accountBankName').append('<span class="input-err">开户行名称不能为空！</span>');
			} 
			if(!_accountNumber) {
				$parent.find('.accountNumber').append('<span class="input-err">开户账户不能为空！</span>');
			} 
			if(!_accountName) {
				$parent.find('.accountName').append('<span class="input-err">账户户名不能为空！</span>');
			}
			if(_accountBankName != '' && _accountNumber != '' && _accountName != '') {
				var _params = {
					carShopId: $scope.carShopId,
					bankName: _accountBankName.trim(),
					accountNumber: parseInt(_accountNumber.trim()),
					account: _accountName.trim()
				}
				console.log(_params)
				$.ajax({
					url: $http.api('demandCarShopAccount/save', 'cyj'),
					type: 'post',
					data: _params,
					dataType: 'json',
					success: $http.ok(function(result) {
						console.log(result);
						loadNewCar(function() {
							loadCarAccount();	
						})
					})
				})
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
					$parent.find('input').attr('disabled', true);
				});
			} else {
				_params.status = 0;
				stopUseChange(_params, function() {
					that.html('停用').data('status', 0);
					$parent.find('.search-item').removeClass('search-item-disabled');
					$parent.find('input').attr('disabled', false);
				});
			}
			
			
		})

		// 合作银行账户删除
		$console.find('.deleteItem').on('click', function() {
			var that = $(this);
			that.openWindow({
				title: '提示',
				content: '<div>确定删除该条打款账户吗？</div>',
				commit: dialogTml.wCommit.cancelSure
			}, function($dialog) {
				$dialog.find('.w-sure').on('click', function() {
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
							$dialog.remove();
						})
					})
				})
			});
			
		})
	}

	/**
	 * 加载（银行费率表）立即处理事件
	 */
	var setupCarRateEvt = function() {
		// 银行费率表增加按钮事件
		$console.find('#addCarRate').on('click', function() {
			var that = $(this);
			var $parent = that.parent().parent().parent();
			var _carRate = $parent.find('#carRate input').val();
			var _costPolicy = $parent.find('.policy-item').length + 1;
			if(_carRate != undefined) {
				var _params = {
					carShopId: $scope.carShopId,          //经销商ID
					costPolicy: '费率' + _costPolicy,     //新车
					costRate: _carRate      //费率
				}
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
			} else {
				$parent.find('#carRate').append('<span class="input-err">费率不能为空！</span>');
			}
		})

		// 合作银行费率删除
		$console.find('.deleteCarRate').on('click', function() {
			var that = $(this);
			that.openWindow({
				title: '提示',
				content: '<div>确定删除该条车商费率吗？</div>',
				commit: dialogTml.wCommit.cancelSure
			}, function($dialog) {
				$dialog.find('.w-sure').on('click', function() {
					$.ajax({
						url: $http.api('demandCarShopPolicy/del', 'cyj'),
						type: 'post',
						data: {
							policyId: that.data('policyId') 
						},
						dataType: 'json',
						success: $http.ok(function(result) {
							console.log(result);
							$dialog.remove();
							loadNewCar(function() {
								loadCarRate();
							})
						})
					})
				})
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
		if($scope.shopId) {
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
		shopName: function(t, p, cb) {
			$.ajax({
				type: 'post',
				url: $http.api('demandCarShop/getList', 'zyj'),
				data: {
					shopType: $scope.shopType//车商类型   0:4s  1:二级经销商
				}, 	
				dataType: 'json',
				success: $http.ok(function(xhr) {
					var sourceData = {
						items: xhr.data,
						id: 'shopId',
						name: 'shopName'
					};
					cb(sourceData);
				})
			})
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
				data: {
					parentId: 0
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

	/**
	 * 车商类型选定回调
	 */
	$scope.shopTypePicker = function(picked) {
		console.log(picked);
		$scope.shopType = picked.id;
	}

	$scope.shopNamePicker = function(picked) {
		console.log(picked);
		$scope.shopName = picked.name;
	}

	$scope.shopAddressPicker = function(picked) {
		console.log(picked);
		$scope.shopAddress = picked.name;	
	}

	$scope.operateBrandPicker = function(picked) {
		console.log(picked);
		$scope.operateBrand = picked.name;	
	}

})