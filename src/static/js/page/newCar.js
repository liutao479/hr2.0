'use strict';
page.ctrl('newCar', [], function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		apiParams = {
			
		};

	/**
	 * 加载编辑/新建合作车商详情
	 */
	var loadNewCar = function(cb) {
		$.ajax({
			url: $http.api('demandCarShop/detail', 'cyj'),
			type: 'post',
			data: {
				shopId: $params.shopId
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
	 * 加载（银行资料）立即处理事件
	 */
	 var setupCarDataEvt = function() {

	 }

	/**
	 * 加载（银行账户）立即处理事件
	 */
	var setupCarAccountEvt = function() {
		// 增加银行账户
		$console.find('#addCard').on('click', function() {
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
					carShopId: ,
					bankName: ,
					accountNumber: _accountNumber.trim(),
					account: _accountName.trim(),
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
					url: $http.api('demandBankAccount/save', 'cyj'),
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
						url: $http.api('demandBankAccount/del', 'cyj'),
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
		$console.find('#addBankRate').on('click', function() {
			var that = $(this);
			console.log(1);
			$.ajax({
				url: $http.api('demandBankRate/save', 'cyj'),
				type: 'post',
				data: {
					demankBankId: 1, //银行ID
					isSecond: 1, //新车
					provinceId: 110000, //省份ID
					provinceName: '北京市', //省份名称
					interestRate12: 23, //12期银行基准利率
					interestRate18: 23, //18期银行基准利率
					interestRate24: 5, //24期银行基准利率
					interestRate30: 43, //30期银行基准利率
					interestRate36: 43,//36期银行基准利率
					interestRate48: 43, //48期银行基准利率
					interestRate60: 43 //60期银行基准利率
				},
				dataType: 'json',
				success: $http.ok(function(result) {
					console.log(result);
					loadNewBank(function() {
						loadCarRate();
					})
				})
			})
		})

		// 合作银行费率删除
		$console.find('.deleteBankRate').on('click', function() {
			var that = $(this);
			that.openWindow({
				title: '提示',
				content: '<div>确定删除该条银行费率表吗？</div>',
				commit: dialogTml.wCommit.cancelSure
			}, function($dialog) {
				$dialog.find('.w-sure').on('click', function() {
					console.log(1)
					$.ajax({
						url: $http.api('demandBankRate/del', 'cyj'),
						type: 'post',
						data: {
							demankBankId: $params.bankId, //银行ID
							isSecond: that.data('isSecond'), //新车
							provinceId: that.data('provinceId') //省份ID
						},
						dataType: 'json',
						success: $http.ok(function(result) {
							console.log(result);
							$dialog.remove();
							loadNewBank(function() {
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
		loadNewCar(function() {
			loadCarData();
			loadCarAccount();
			loadCarRate();
		});
	});

})