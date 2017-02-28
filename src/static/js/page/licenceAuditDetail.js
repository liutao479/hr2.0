'use strict';
page.ctrl('licenceAuditDetail', [], function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		apiParams = {
			orderNo: $params.orderNo
		};
	/**
	* 加载上牌审核详情数据
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
					category: 'registrationApproval',
					editable: 0
				}
				$scope.result = result;
				$scope.orderNo = result.data.orderInfo.orderNo;//订单号
				setupLocation(result.data.orderInfo);
				// console.log(result.data.backApprovalInfo)
				setupBackReason(result.data.backApprovalInfo);
				render.compile($scope.$el.$tbl, $scope.def.listTmpl, result.data, true);
				if(cb && typeof cb == 'function') {
					cb();
				}
			})
		})
	}

	// 审核弹窗确定按钮
	var verifyOrders = function(params, cb) {
		$.ajax({
			url: $http.api('loanRegistration/approval/pass', 'cyj'),
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

	// 退回弹窗确定按钮
	var backOrders = function(params, cb) {
		$.ajax({
			url: $http.api('loanRegistration/approval/back', 'cyj'),
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
		$.ajax({
			url: $http.api('auditCommit'),
			// type: 'post',
			// data: params,
			// dataType: 'json',
			success: $http.ok(function(result) {
				console.log(result);
				var $commitBar = $console.find('#commitPanel');
				$commitBar.data({
					back: result.data.back,
					verify: result.data.verify,
					cancel: result.data.cancel,
					submit: result.data.submit
				});
				$commitBar.commitBar();
				if(cb && typeof cb == 'function') {
					cb();
				}
			})
		})
		
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
			current: '上牌审核详情',
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
		// 审核退回
		$console.find('#back').on('click', function() {
			var that = $(this);
			that.openWindow({
				title: '退回订单',
				content: dialogTml.wContent.suggestion,
				commit: dialogTml.wCommit.cancelSure
			}, function($dialog) {
				$dialog.find('.w-sure').on('click', function() {
					var _params = {
						orderNo: $scope.orderNo,
						reason: $dialog.find('#suggestion').val()
					}
					console.log(_params);
					backOrders(_params, function() {
						$dialog.remove();
					});
				})
			})
		})

		// 审核通过
		$console.find('#verify').on('click', function() {
			var that = $(this);
			that.openWindow({
				title: '审核通过',
				content: dialogTml.wContent.suggestion,
				commit: dialogTml.wCommit.cancelSure
			}, function($dialog) {
				$dialog.find('.w-sure').on('click', function() {
					var _params = {
						orderNo: $scope.orderNo,
						reason: $dialog.find('#suggestion').val()
					}
					verifyOrders(_params, function() {
						$dialog.remove();
					});
				})
			})
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