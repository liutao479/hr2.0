'use strict';
page.ctrl('newBank', [], function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		apiParams = {
			
		};
	$scope.result = {};
	$scope.result.data = {};
	$scope.bankId = $params.bankId || '';
	$scope.demandBankId = $params.demandBankId || '';
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
				bankId: $scope.bankId
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
	var loadBankData = function() {
		render.compile($scope.$el.$bankDataPanel, $scope.def.bankDataTmpl, $scope.result.data, true);
		setupBankEvt();
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
			current: $params.bankId ? '编辑合作银行' : '新建合作银行'
		});
		$location.location();
	}

	/**
	* dropdown控件
	*/
	function setupDropDown() {
		$console.find('.select').dropdown();
	}

	/**
	 * 加载（银行信息）立即处理事件
	 */
	var setupBankEvt = function() {

		setupDropDown();

		$console.find('#bankDataSave').on('click', function() {
			var _params = {
				bankId: $scope.bankId,
				bankName: $scope.bankName,
				organId: 99
			};
			$.ajax({
				url: $http.api('demandBank/save', 'cyj'),
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
		});
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
					demandBankId: $scope.demandBankId,
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
								url: $http.api('demandBankAccount/del', 'cyj'),
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
	var setupBankRateEvt = function() {
		// 银行费率鼠标失去焦点事件
		$console.find('.rate input').each(function() {
			$(this).on('keyup', function(event) {
				clearNoNum(event,this)
			});
			$(this).on('afterpaste', function(event) {
				clearNoNum(event,this)
			});
		})

		// 银行费率表增加按钮事件
		$console.find('#addBankRate').on('click', function() {
			var that = $(this), flag = 0;
			var $parent = that.parent().parent();
			if($scope.isSecond == undefined) {
				$parent.find('#isSecond').removeClass('error-input').addClass('error-input');
				flag++;
			}
			if($scope.provinceId == undefined) {
				$parent.find('#provinceId').removeClass('error-input').addClass('error-input');
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
				var rate12 = $.trim($parent.find('#rate12').val());
				var rate18 = $.trim($parent.find('#rate18').val());
				var rate24 = $.trim($parent.find('#rate24').val());
				var rate30 = $.trim($parent.find('#rate30').val());
				var rate36 = $.trim($parent.find('#rate36').val());
				var rate48 = $.trim($parent.find('#rate48').val());
				var rate60 = $.trim($parent.find('#rate60').val());
				var _params = {
					demankBankId: $scope.demandBankId, //银行ID
					isSecond: $scope.isSecond, //新车
					provinceId: $scope.provinceId, //省份ID
					provinceName: $scope.provinceName, //省份名称
					interestRate12: parseInt(rate12) || 0, //12期银行基准利率
					interestRate18: parseInt(rate18) || 0, //18期银行基准利率
					interestRate24: parseInt(rate24) || 0, //24期银行基准利率
					interestRate30: parseInt(rate30) || 0, //30期银行基准利率
					interestRate36: parseInt(rate36) || 0,//36期银行基准利率
					interestRate48: parseInt(rate48) || 0, //48期银行基准利率
					interestRate60: parseInt(rate60) || 0 //60期银行基准利率
				};
				console.log(_params);
				$.ajax({
					url: $http.api('demandBankRate/save', 'cyj'),
					type: 'post',
					data: _params,
					dataType: 'json',
					success: $http.ok(function(result) {
						console.log(result);
						loadNewBank(function() {
							loadBankRate();
						})
					})
				})
			}
		})

		// 合作银行费率删除
		$console.find('.deleteBankRate').on('click', function() {
			var that = $(this);
			$.alert({
				title: '提示',
				content: tool.alert('确定删除该条银行费率表吗？'),
				buttons: {
					close: {
						text: '取消',
						btnClass: 'btn-default btn-cancel'
					},
					ok: {
						text: '确定',
						action: function() {
							$.ajax({
								url: $http.api('demandBankRate/del', 'cyj'),
								type: 'post',
								data: {
									demankBankId: $scope.demandBankId, 
									isSecond: that.data('isSecond'), //新车
									provinceId: that.data('provinceId') //省份ID
								},
								dataType: 'json',
								success: $http.ok(function(result) {
									console.log(result);
									loadNewBank(function() {
										loadBankRate();
									});
								})
							})
						}
					}
				}
			});
			
		})

		// 下拉框初始化
		$console.find('#bankRateTable .select').dropdown();
	}
	

	/***
	* 加载页面模板
	*/
	render.$console.load(router.template('iframe/new-bank'), function() {
		$scope.def = {
			bankDataTmpl: render.$console.find('#bankDataTmpl').html(),
			bankAccountTmpl: render.$console.find('#bankAccountTmpl').html(),
			bankRateTmpl: render.$console.find('#bankRateTmpl').html()
		}
		$scope.$el = {
			$bankDataPanel: $console.find('#bankDataPanel'),
			$bankAccountPanel: $console.find('#bankAccountPanel'),
			$bankRatePanel: $console.find('#bankRatePanel')
		}
		setupLocation();
		if($scope.bankId) {
			loadNewBank(function() {
				loadBankData();
				loadBankAccount();
				loadBankRate();
			});
		} else {
			loadBankData();
		}
		
	});

	/**
	 * 下拉框请求数据回调
	 */
	$scope.dropdownTrigger = {
		bankName: function(t, p, cb) {
			$.ajax({
				type: 'post',
				url: $http.api('pmsBank/searchBank', 'cyj'),
				data: {
					// keyWord: undefined
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
		carType: function(t, p, cb) {
			var data = [
				{
					id: 0,
					name: '新车'
				},
				{
					id: 1,
					name: '二手车'
				}
			];
			var sourceData = {
				items: data,
				id: 'id',
				name: 'name'
			};
			cb(sourceData);
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

	$scope.bankPicker = function(picked) {
		console.log(picked);
		$scope.bankId = picked.id;
		$scope.bankName = picked.name;		
	}

	$scope.isSecondPicker = function(picked) {
		console.log(picked);
		this.$el.removeClass('error-input');
		$scope.isSecond = picked.id;
	}

	$scope.areaPicker = function(picked) {
		console.log(picked);
		this.$el.removeClass('error-input');
		$scope.provinceId = picked.id;
		$scope.provinceName = picked.name;
	}

})