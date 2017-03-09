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
			url: $http.api('loanMaterials/index', 'zyj'),
			data: {
				// taskId: $scope.$params.taskId
				taskId: 1
			},
			dataType: 'json',
			success: $http.ok(function(result) {
				console.log(result);
				$scope.result = result;
				$scope.result.tasks = $params.tasks.length;
				$scope.$params.orderNo = result.data.loanTask.orderNo;
				setupLocation();
				setupBackReason(result.data.loanTask.backApprovalInfo);
				render.compile($scope.$el.$loanPanel, $scope.def.listTmpl, result, function() {
					setupEvt();
				}, true);
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
			current: $scope.result.data.loanTask.sceneName,
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
	 * 页面首次加载立即处理事件
	 */
	var evt = function () {
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
	}


	/**
	 * 多次渲染页面立即处理事件
	 */
	var setupEvt = function() {
		// 图片控件
		$scope.$el.$loanPanel.find('.uploadEvt').imgUpload();
	}

	/**
	* 并行任务切换触发事件
	* @params {int} idx 触发的tab下标
	* @params {object} item 触发的tab对象
	*/
	var tabChange = function (idx, item) {
		console.log(item);
		router.render('loanProcess/' + item.key, {
			tasks: $scope.tasks,
			selected: idx,
			path: 'loanProcess'
		});
	}

	$console.load(router.template('iframe/loan-material-upload'), function() {
		$scope.def = {
			listTmpl: $console.find('#loanUploadTmpl').html()
		}
		$scope.$el = {
			$loanPanel: $console.find('#loanUploadPanel')
		}
		//setupTaskNavigator($scope.tasks, $scope.activeTaskIdx);
		loadOrderInfo(function() {
			router.tab($console.find('#tabPanel'), $scope.tasks, $scope.activeTaskIdx, tabChange);
			evt();
		});
	});

	/**
	 * 监听其它材料最后一个控件的名称
	 */
	var otherMaterialsListen = function() {
		var $imgel = $console.find('.otherMaterials .uploadEvt');
		$imgel.last().data('name', '其它材料' + $imgel.length);
		$imgel.last().data('count', $imgel.length);
		$imgel.last().find('.input-text input').val('其它材料' + $imgel.length);
	}
	
	/***
	* 删除图片后的回调函数
	*/
	$scope.deletecb = function(self) {
		self.$el.remove();
		otherMaterialsListen();
	}

	/***
	* 上传图片成功后的回调函数
	*/
	$scope.uploadcb = function(self) {
		self.$el.after(self.outerHTML);
		otherMaterialsListen();
		self.$el.next().imgUpload();

	}
});
