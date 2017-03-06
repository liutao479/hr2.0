'use strict';
page.ctrl('loanMaterialsUpload', function($scope) {
	var $console = render.$console,
		$params = $scope.$params;
	
	/**
	* 加载贷款材料上传数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadOrderInfo = function(cb) {
		$.ajax({
			// url: 'http://127.0.0.1:8083/mock/loanMaterialUpload',
			// type: flag,
			type: 'post',
			url: $http.api('loanMaterials/index', 'zyj'),
			data: {
				// taskId: $scope.$params.taskId
				taskId: 1
			},
			dataType: 'json',
			success: $http.ok(function(result) {
				console.log(result);
				$scope.result = result;
				$scope.$params.orderNo = result.data.loanTask.orderNo;
				// 编译面包屑
				setupLocation();
				// 设置退回原因
				setupBackReason(result.data.loanTask.backApprovalInfo);
				render.compile($scope.$el.$loanPanel, $scope.def.listTmpl, result, true);
				setupEvt();
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
			current: $scope.result.cfgData.name,
			loanUser: $scope.result.data.loanTask.loanOrder.realName,
			orderDate: tool.formatDate($scope.result.data.loanTask.createDate, true)
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
	 * 立即处理事件
	 */
	var setupEvt = function () {
		// 增加征信人员
		$console.find('#addCreditUser').on('click', function() {
			var that = $(this);
			that.openWindow({
				title: "增加征信人员",
				remind: dialogTml.wRemind.addCreditUsers,
				content: dialogTml.wContent.addCreditUsers,
				commit: dialogTml.wCommit.cancelSure
			}, function($dialog) {
				var addUserType;
				$scope.$checks = $dialog.find('.checkbox').checking();
				$scope.$checks.each(function() {
					var _this = this;
					_this.$checking.onChange(function() {
						if(!$(_this).attr('checked') && $dialog.find('.checkbox').not($(_this)).attr('checked')) {
							$dialog.find('.checkbox').not($(_this)).removeClass('checked').attr('checked', false).html('');
						}
					});
				})
					// var $this = $(this);
					// if($this.data('checked')) {
					// 	addUserType = $this.data('type');
					// 	console.lof($checks.not($this))
					// 	$checks.not($this).removeClass('checked').html('');
					// }
					// this.onChange(function() {
					// 	$checks.not(this).removeClass('checked').html('');
					// })
				// });

				$dialog.find('.w-sure').on('click', function() {
					// var _params = {
					// 	orderNo: $params.orderNo,
					// 	userType: 
					// }
					// $.ajax({
					// 	type: 'post',
					// 	url: $http.api('loanMaterials/index', 'zyj'),
					// 	data: {
					// 		taskId: 80871
					// 	},
					// 	dataType: 'json',
					// 	success: $http.ok(function(result) {
					// 		console.log(result);
					// 	})
					// })
				})
			})
		})

		// 提交订单按钮 
		$console.find('#submitOrders').on('click', function() {
			var that = $(this);
			that.openWindow({
				title: "提交",
				content: dialogTml.wContent.suggestion,
				commit: dialogTml.wCommit.cancelSure
			}, function($dialog) {
				$dialog.find('.w-sure').on('click', function() {
					// 先做判空以及必填校验再提交节点
					var $uploadEvts = $scope.$el.$loanPanel.find('.uploadEvt');
					$uploadEvts.each(function() {

					})
					var _params = $dialog.find('#suggestion').val().trim();


					// $.ajax({
					// 	type: 'post',
					// 	url: $http.api('materials/submit/' + $params.taskId, 'zyj'),
					// 	dataType: 'json',
					// 	success: $http.ok(function(result) {
					// 		console.log(result);
					// 	})
					// })
				})
			})
		});

		// 图片控件
		$scope.$el.$loanPanel.find('.uploadEvt').imgUpload();
	}


	$console.load(router.template('iframe/loan-material-upload'), function() {
		$scope.def.listTmpl = $console.find('#loanUploadTmpl').html();
		$scope.$el = {
			$loanPanel: $console.find('#loanUploadPanel')
		}
		loadOrderInfo();
	})
});
