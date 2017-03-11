'use strict';
page.ctrl('mortgageAuditDetail', [], function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		apiParams = {
			orderNo: $params.orderNo
		};
	/**
	* 加载抵押审核详情数据
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
					category: 'pledgeApproval',
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

	// 抵押信息获取
	var loadInfo = function(params, cb) {
		$.ajax({
			url: $http.api('loanPledgeInfo/get', 'cyj'),
			type: 'post',
			data: params,
			dataType: 'json',
			success: $http.ok(function(result) {
				console.log(result);
				result.data.disabled = true;
				render.compile($scope.$el.$infoPanel, $scope.def.infoTmpl, result.data, true);
				if(cb && typeof cb == 'function') {
					cb();
				}
			})
		})
	}

	// 审核弹窗确定按钮
	var verifyOrders = function(params, cb) {
		$.ajax({
			url: $http.api('loanPledge/approval/pass', 'cyj'),
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
			url: $http.api('loanPledge/approval/back', 'cyj'),
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
			current: '抵押审核详情',
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
	render.$console.load(router.template('iframe/mortgage-detail'), function() {
		$scope.def = {
			infoTmpl: render.$console.find('#mortgageInfoTmpl').html(),
			listTmpl: render.$console.find('#loanUploadTmpl').html()
		}
		$scope.$el = {
			$tbl: $console.find('#registerPanel'),
			$infoPanel: $console.find('#mortgageInfoPanel')
		}
		loadMortgageDetail(apiParams, function() {
			setupEvt();
		});
		loadInfo(apiParams);
		loadCommitBar(function() {
			setupCommitEvt();
		});
	});


});