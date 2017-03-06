'use strict';
page.ctrl('loanMaterialsUpload', function($scope) {
	var $console = render.$console,
		$params = $scope.$params;
	$scope.tasks = $params.tasks;
	$scope.activeTaskIdx = $params.selected || 0;

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
			url: $http.api('loanMaterials/index'),
			data: {
				// taskId: $scope.$params.taskId
				taskId: 1
			},
			dataType: 'json',
			success: $http.ok(function(result) {
				console.log(result);
				$scope.result = result;
				// 编译面包屑
				setupLocation();
				// 设置退回原因
				setupBackReason(result.data.loanTask.backApprovalInfo);

				render.compile($scope.$el.$loanPanel, $scope.def.listTmpl, result, true);
				setupEvent();
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

	// 编译完成后绑定事件
	var setupEvent = function () {

		$console.find('#addCreditUser').on('click', function() {
			$.ajax({
				// url: 'http://127.0.0.1:8083/mock/loanMaterialUpload',
				// type: flag,
				type: 'post',
				url: $http.apiMap.materialUpdate,
				data: {
					// 参数1：id 材料id （必填）
					// 参数2：materialsType 材料类型 0图片1视频
					// 参数3：sceneCode 场景编码 
					// 参数4：userId 材料所属用户
					// 参数5：ownerCode 材料归属类型
					// 参数6：materialsPic 材料地址（必填）
				},
				dataType: 'json',
				success: $http.ok(function(result) {
					console.log(result);
					
				})
			})
		})
		$scope.$el.$loanPanel.find('.uploadEvt').imgUpload();
	}
	/**
	* 并行任务切换触发事件
	* @params {int} idx 触发的tab下标
	* @params {object} item 触发的tab对象
	*/
	var tabChange = function (idx, item) {
		console.log('saveData:' + $scope.activeTaskIdx);
		router.render('loanProcess/' + item.key, {
			tasks: $scope.tasks,
			selected: idx,
			path: 'loanProcess'
		});
	}

	/**
	 * 提交订单按钮
	 */
	$(document).on('click', '#submitOrders', function() {
		var that = $(this);
		that.openWindow({
			title: "提交",
			content: wContent.suggestion,
			commit: wCommit.cancelNext
		}, function() {
			$('.w-next').on('click', function() {
				alert('下一步');
			})
		})
	});

	/**
	 * 增加征信人员按钮
	 */
	$(document).on('click', '#addCreditUser', function() {
		var that = $(this);
		that.openWindow({
			title: "增加征信人员",
			remind: wRemind.addCreditUsers,
			content: wContent.addCreditUsers,
			commit: wCommit.cancelSure
		}, function() {
			var addUserType;
			var $checkboxs = $('.dialog').find('div[name="addCreditUsers"]');
			$('.dialog').find('.checkbox').checking(function() {
				$checkboxs.on('click', function() {
					var $this = $(this);
					if($checkboxs.not($(this)).attr('checked')) {
						$checkboxs.not($(this)).removeClass('checked').attr('checked', false).html();
					}
				})
			});
			$('.w-sure').on('click', function() {
				$checkboxs.each(function() {
					if($(this).attr('checked')) addUserType = $(this).data('type');
				})
				alert('退回人员类型：' + addUserType)
			})
		})
	});

	$console.load(router.template('iframe/loan-material-upload'), function() {
		$scope.def.listTmpl = $console.find('#loanUploadTmpl').html();
		$scope.$el = {
			$loanPanel: $console.find('#loanUploadPanel')
		}
		router.tab($console.find('#tabPanel'), $scope.tasks, $scope.activeTaskIdx, tabChange);
		//setupTaskNavigator($scope.tasks, $scope.activeTaskIdx);
		loadOrderInfo();
	})
});
