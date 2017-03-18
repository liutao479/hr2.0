'use strict';
page.ctrl('licenceProcessDetail', [], function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		apiParams = {
			orderNo: $params.orderNo
		};
	/**
	* 加载上牌办理详情数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadLicenceDetail = function(params, cb) {
		$.ajax({
			url: $http.api('loanRegistration/index', 'cyj'),
			type: 'post',
			data: params,
			dataType: 'json',
			success: $http.ok(function(result) {
				console.log(result);
				result.data.loanTask = {
					category: 'registration',
					editable: 1
				}
				$scope.result = result;
				$scope.id = result.data.orderInfo.id;

				setupLocation(result.data.orderInfo);
				setupBackReason(result.data.orderInfo.loanOrderApproval);

				// 编译两个抵押证
				render.compile($scope.$el.$tbl, $scope.def.listTmpl, result.data, true);
				if(cb && typeof cb == 'function') {
					cb();
				}
			})
		})
	}

	// 弹窗确定
	var submitOrders = function(params, cb) {
		$.ajax({
			url: $http.api('loanRegistration/sumbit', 'cyj'),
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
			current: '上牌办理详情',
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
				backUser: data.roleName,
				backUserPhone: data.phone,
				backDate: tool.formatDate(data.transDate, true)
			});
			$backReason.backReason();
		}
	}

	var setupEvt = function() {
		$scope.$el.$tbl.find('.uploadEvt').imgUpload();
	}

	/**
	* 提交栏事件
	*/
	var setupCommitEvt = function() {
		$console.find('#submit').on('click', function() {
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
							var _reason = $.trim($('.jconfirm #suggestion').val()), 
								_params = {
									id: $scope.id
								};
							if(_reason) {
								_params.reason = _reason;
							}
							submitOrders(_params, function() {
								router.render('licenceProcess');
							});
						}
					}
				}
			});
		})
	}

	/***
	* 加载页面模板
	*/
	render.$console.load(router.template('iframe/licence-detail'), function() {
		$scope.def.listTmpl = render.$console.find('#loanUploadTmpl').html();
		$scope.$el = {
			$tbl: $console.find('#registerPanel')
		}
		loadLicenceDetail(apiParams, function() {
			setupEvt();
		});
		loadCommitBar(function() {
			setupCommitEvt();
		});
	});


});