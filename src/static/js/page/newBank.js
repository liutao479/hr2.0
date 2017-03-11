'use strict';
page.ctrl('newBank', [], function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		apiParams = {
			
		};
	var apiMap = {
		bankName: 'http://192.168.0.105:8080/demandBank/getListByOrganId'
	}

	/**
	 * 请求编辑/新建银行详情的接口数据
	 */
	var loadNewBank = function(cb) {
		$.ajax({
			url: $http.api('demandBank/detail', 'cyj'),
			type: 'post',
			data: {
				bankId: $params.bankId
			},
			dataType: 'json',
			success: $http.ok(function(result) {
				console.log(result);
				$scope.result = result;
				// render.compile($scope.$el.$bankPanel, $scope.def.bankTmpl, result.data, true);
				if(cb && typeof cb == 'function') {
					cb();
				}
			})
		})
	}

	/**
	 * 加载银行账户信息
	 */
	var loadBankAccount = function() {
		render.compile($scope.$el.$bankAccountPanel, $scope.def.bankAccountTmpl, $scope.result.data, true);
		setupBankAccountEvt();
	}

	/**
	 * 加载银行费率信息
	 */
	var loadBankRate = function() {
		render.compile($scope.$el.$bankRatePanel, $scope.def.bankRateTmpl, $scope.result.data, true);
		setupBankRateEvt();
	}

	/**
	* 设置面包屑
	*/
	var setupLocation = function() {
		if(!$scope.$params.path) return false;
		var $location = $console.find('#location');
		$location.data({
			backspace: $scope.$params.path,
			current: '新建合作银行'
		});
		$location.location();
	}

	/**
	 * 加载（银行账户）立即处理事件
	 */
	var setupBankAccountEvt = function() {
		// 增加银行账户
		$console.find('#addCard').on('click', function() {
			var that = $(this);
			var $parent = that.parent().parent();
			var _accountNumber = $parent.find('.accountNumber input').val();
			var _accountName = $parent.find('.accountName input').val();
			$parent.find('.input-err').remove();
			if(!_accountNumber) {
				$parent.find('.accountNumber').append('<span class="input-err">开户账户不能为空！</span>');
			} 
			if(!_accountName) {
				$parent.find('.accountName').append('<span class="input-err">账户户名不能为空！</span>');
			}
			if(_accountNumber != '' && _accountName != '') {
				console.log(_accountNumber)
				var _params = {
					demandBankId: $params.bankId,
					accountNumber: _accountNumber.trim(),
					accountName: _accountName.trim()
				}
				console.log(_params)
				$.ajax({
					url: $http.api('demandBankAccount/save', 'cyj'),
					type: 'post',
					data: _params,
					dataType: 'json',
					success: $http.ok(function(result) {
						console.log(result);
						loadNewBank(function() {
							loadBankAccount();	
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
	var setupBankRateEvt = function() {
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
						loadBankRate();
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
								loadBankRate();
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
	render.$console.load(router.template('iframe/new-bank'), function() {
		$scope.def = {
			bankAccountTmpl: render.$console.find('#bankAccountTmpl').html(),
			bankRateTmpl: render.$console.find('#bankRateTmpl').html()
		}
		$scope.$el = {
			$bankAccountPanel: $console.find('#bankAccountPanel'),
			$bankRatePanel: $console.find('#bankRatePanel')
		}
		loadNewBank(function() {
			setupLocation();
			loadBankAccount();
			loadBankRate();
		});
	});

})