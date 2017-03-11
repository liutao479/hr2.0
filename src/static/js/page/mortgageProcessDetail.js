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
				// console.log(result.data.backApprovalInfo)
				setupBackReason(result.data.orderInfo.loanOrderApproval);
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
			url: $http.api('loanPledge/sumbit', 'cyj'),
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

	// 抵押信息获取
	var loadInfo = function(params, cb) {
		$.ajax({
			url: $http.api('loanPledgeInfo/get', 'cyj'),
			type: 'post',
			data: params,
			dataType: 'json',
			success: $http.ok(function(result) {
				console.log(result);
				result.data.disabled = false;
				render.compile($scope.$el.$infoPanel, $scope.def.infoTmpl, result.data, true);
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
			url: $http.api('processCommit'),
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
				backUser: data.roleName,
				backUserPhone: data.phone,
				backDate: tool.formatDate(data.transDate, true)
			});
			$backReason.backReason();
		}
	}

	/**
	* 登记证材料事件
	*/
	var setupEvt = function() {
		$scope.$el.$tbl.find('.uploadEvt').imgUpload();
	}

	/**
	* 提交栏事件
	*/
	var setupCommitEvt = function() {
		$console.find('#submit').on('click', function() {
			var that = $(this);
			that.openWindow({
				title: '提交',
				content: dialogTml.wContent.suggestion,
				commit: dialogTml.wCommit.cancelSure
			}, function($dialog) {
				$dialog.find('.w-sure').on('click', function() {
					var _params = {
						pledgeId: $scope.id,
						reason: $dialog.find('#suggestion').val().trim(),
						pledgee: $console.find('#pledgee').val().trim(), //抵押权人
						idCard: $console.find('#idCard').val().trim(), //身份证号码
						pledgeDept: $console.find('#pledgeDept').val().trim(), //登记机关
						pledgeDate: new Date($console.find('#pledgeDate').val().trim()), //抵押登记日期
						vehileRegNo: $console.find('#vehileRegNo').val().trim(), //机动车登记编号
						unPledgeDate: new Date($console.find('#unPledgeDate').val().trim()), //解除登记日期
						cardName: $console.find('#cardName').val().trim() //身份证明名称
					}
					console.log(_params);
					submitOrders(_params, function() {
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
		console.log(apiParams);
		loadInfo(apiParams);
		loadCommitBar(function() {
			setupCommitEvt();
		});
	});


});