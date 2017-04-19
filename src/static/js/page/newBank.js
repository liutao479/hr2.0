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
	 * 加载（银行信息）立即处理事件
	 */
	var setupBankEvt = function() {

		$scope.$el.$bankDataPanel.find('.select').dropdown();

		$console.find('#bankDataSave').on('click', function() {
			if(!$scope.bankId) {
				$.alert({
					title: '提示',
					content: tool.alert('请选择银行！'),
					buttons: {
						ok: {
							text: '确定'
						}
					}
				});
				return false;
			}
			var _params = {
				bankCode: $scope.bankId
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
			var that = $(this),
				$parent = that.parent().parent(),
				$inputs = $parent.find('input'),
				params = {
					demandBankId: parseInt($scope.demandBankId)
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
						$(this).parent().append('<span class="input-err">该项不符合输入规则！（10位汉字）</span>')
					}
				} else {
					params[$(this).data('type')] = value;
					flag++;
				}
			});
			if(flag == 2) {
				console.log(params)
				$.ajax({
					url: $http.api('demandBankAccount/save', 'cyj'),
					type: 'post',
					data: params,
					dataType: 'json',
					success: $http.ok(function(result) {
						console.log(result);
						loadNewBank(function() {
							loadBankAccount();	
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
			var that = $(this), 
				flag = 0,
				$parent = that.parent().parent();
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
				var $rateInputs = $parent.find('.rate input'),
					item = 0,
					_params = {
						demankBankId: $scope.demandBankId, //银行ID
						isSecond: $scope.isSecond, //新车
						provinceId: $scope.provinceId, //省份ID
						provinceName: $scope.provinceName
					};
				$rateInputs.each(function() {
					var value = $.trim($(this).val());
					if(!value) {
						_params[$(this).attr('class')] = 0;
					} else if(value < 0 || value > 100) {
						$(this).parent().removeClass('error-input').addClass('error-input');
						item++;
					} else {
						_params[$(this).attr('class')] = Number(parseFloat(value).toFixed(4));
					}
				});
				if(item == 0) {
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
				} else {
					$.alert({
						title: '提示',
						content: tool.alert('请完善必填项！'),
						buttons: {
							ok: {
								text: '确定'
							}
						}
					});
				}	
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