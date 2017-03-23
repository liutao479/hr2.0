'use strict';
page.ctrl('mortgageProcessDetail', [], function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		apiParams = {
			orderNo: $params.orderNo
		};
	/**
	* 加载抵押办理详情数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadMortgageDetail = function(params, cb) {
		$.ajax({
			url: $http.api('loanPledge/index', 'cyj'),
			type: 'post',
			data: params,
			dataType: 'json',
			success: $http.ok(function(result) {
				console.log(result);
				result.data.loanTask = {
					category: 'pledge',
					editable: 1
				}
				$scope.result = result;
				$scope.id = result.data.orderInfo.id;
				setupLocation(result.data.orderInfo);
				setupBackReason(result.data.orderInfo.loanOrderApproval);
				render.compile($scope.$el.$tbl, $scope.def.listTmpl, result.data, true);
				if(cb && typeof cb == 'function') {
					cb();
				}
			})
		})
	}

	/**
	 * 提交按钮接口
	 */
	var submitOrders = function(params, cb) {
		console.log(params);
		$.ajax({
			url: $http.api('loanPledge/sumbit', 'cyj'),
			type: 'post',
			data: JSON.stringify(params),
			dataType: 'json',
			contentType: 'application/json;charset=utf-8',
			success: $http.ok(function(result) {
				console.log(result);
				if(cb && typeof cb == 'function') {
					cb();
				}
			})
		})
	}

	/**
	 * 加载登记证抵押信息
	 */
	var loadInfo = function(params, cb) {
		$.ajax({
			url: $http.api('loanPledgeInfo/get', 'cyj'),
			type: 'post',
			data: params,
			dataType: 'json',
			success: $http.ok(function(result) {
				console.log(result);
				result.disabled = false;
				render.compile($scope.$el.$infoPanel, $scope.def.infoTmpl, result, true);
				if(cb && typeof cb == 'function') {
					cb();
				}
			})
		})
	}

	/**
	* 底部操作按钮区域
	*/	
	var loadCommitBar = function(cb) {
		var buttons = {
			"submit": true,
			"back": false,
			"cancel": false,
			"verify": false
		};
		var $commitBar = $console.find('#commitPanel');
		$commitBar.data({
			back: buttons.back,
			verify: buttons.verify,
			cancel: buttons.cancel,
			submit: buttons.submit
		});
		$commitBar.commitBar();
		if(cb && typeof cb == 'function') {
			cb();
		}
	}

	/**
	* 设置面包屑
	*/
	var setupLocation = function(data) {
		if(!$scope.$params.path) return false;
		var $location = $console.find('#location');
		if(!data) return false;
		$location.data({
			backspace: $scope.$params.path,
			current: '抵押办理详情',
			loanUser: $scope.result.data.orderInfo.realName || '',
			orderDate: tool.formatDate($scope.result.data.orderInfo.pickDate, true) || ''
		});
		$location.location();
	}

	/**
	* 设置退回原因
	*/
	var setupBackReason = function(data) {
		var $backReason = $console.find('#backReason');
		if(!data) {
			$backReason.remove();
			return false;
		} else {
			$backReason.data({
				backReason: data.reason,
				backUser: data.userName,
				backUserPhone: data.phone,
				backDate: tool.formatDate(data.transDate, true)
			});
			$backReason.backReason();
		}
	}

	/**
	* 日历控件
	*/
	var setupDatepicker = function() {
		$scope.$el.$infoPanel.find('.dateBtn').datepicker({
			onpicked: function() {
				if(!$.trim($(this).val())) {
					$(this).removeClass('error-input').addClass('error-input');
				} else {
					$(this).removeClass('error-input');
				}
			}
		});
	}

	/**
	* 登记证材料事件
	*/
	var setupEvt = function() {
		$scope.$el.$tbl.find('.uploadEvt').imgUpload();
	}

	var setupInfoEvt = function() {
		$scope.$el.$infoPanel.find('.input').on('blur', function() {
			if(!$.trim($(this).val())) {
				$(this).removeClass('error-input').addClass('error-input');
			} else {
				$(this).removeClass('error-input');
			}
		});
		setupDatepicker();
	}


	/**
	* 提交栏事件
	*/
	var setupCommitEvt = function() {
		$console.find('#submit').on('click', function() {
			var infoParams = [], list = 0;
			var $tables = $console.find('.field-table');
			$tables.each(function() {
				var item = {}, flag = 0;
				var that = $(this);
				var $inputs = $(this).find('.required');
				$inputs.each(function() {
					if(!$.trim($(this).val())) {
						$(this).removeClass('error-input').addClass('error-input');
					} else {
						item[$(this).data('type')] = $.trim($(this).val());
						$(this).removeClass('error-input');
						flag++;
					}
				});
				if(flag == $inputs.length) {
					list++;
					item.pledgeId = that.data('pledgeId');
					item.id = that.data('id');
					infoParams.push(item);
				}
			});
			if(list == $tables.length) {
				//去做提交
				// console.log(infoParams)
				$.confirm({
					title: '提交',
					content: dialogTml.wContent.suggestion,
					buttons: {
						close: {
							text: '取消',
							btnClass: 'btn-default btn-cancel'
						},
						ok: {
							text: '确定',
							action: function () {
								var _reason = $.trim($('.jconfirm #suggestion').val());
								if(_reason) {
									for(var i = 0, len = infoParams.length; i < len; i++) {
										infoParams[i].reason = _reason;
									}
								}
								// submitOrders(infoParams, function() {
								// 	router.render('mortgageProcess');
								// })
							}
						}
					}
				});
				
			} else {
				$.alert({
					title: '提示',
					content: dialogTml.wContent.complete,
					buttons: {
						ok: {
							text: '确定',
							action: function() {

							}
						}
					}
				})
			}
		})
	}

	/***
	* 加载页面模板
	*/
	render.$console.load(router.template('iframe/mortgage-detail'), function() {
		$scope.def = {
			infoTmpl: render.$console.find('#mortgageInfoTmpl').html(),
			listTmpl: render.$console.find('#loanUploadTmpl').html(),
			commitTmpl: render.$console.find('#commitBarTmpl').html()
		}
		$scope.$el = {
			$tbl: $console.find('#registerPanel'),
			$infoPanel: $console.find('#mortgageInfoPanel'),
			$commitPanel: $console.find('#commitPanel')
		}
		loadMortgageDetail(apiParams, function() {
			setupEvt();
		});
		loadInfo(apiParams, function() {
			setupInfoEvt();
		});
		loadCommitBar(function() {
			setupCommitEvt();
		});
	});


});