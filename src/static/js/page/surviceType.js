'use strict';
page.ctrl('surviceType', function($scope) {
	var $console = render.$console,
		$params = $scope.$params;

	/**
	* 加载业务模式选择数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadLoanList = function(cb) {
		$.ajax({
			type: 'post',
			url: $http.api('serviceType/index', 'cyj'),
			data: {
				taskId: $params.taskId
			},
			dataType: 'json',
			success: $http.ok(function(result) {
				console.log(result);
				$scope.result = result;
				setupLocation();
				render.compile($scope.$el.$tbl, $scope.def.listTmpl, result.data.DATA, function() {
					setupEvt();
				}, true);
				if(cb && typeof cb == 'function') {
					cb();
				}
			})
		});
	}

	/**
	* 设置面包屑
	*/
	var setupLocation = function() {
		if(!$scope.$params.path) return false;
		var $location = $console.find('#location');
		$location.data({
			backspace: $scope.$params.path,
			current: $scope.result.data.loanTask.taskName,
			loanUser: $scope.result.data.loanTask.loanOrder.realName,
			orderDate: $scope.result.data.loanTask.loanOrder.createDateStr
		});
		$location.location();
	}


	/**
	* 设置底部按钮操作栏
	*/
	var setupSubmitBar = function() {
		var $submitBar = $console.find('#submitBar');
		$submitBar.data({
			taskId: $params.taskId
		});
		$submitBar.submitBar();
		var $sub = $submitBar[0].$submitBar;

		/**
		 * 提交订单
		 */
		$sub.on('taskSubmit', function() {
			saveData(function() {
				process();
			});
		})
	}

	/**
	 * 任务提交跳转
	 */
	function process() {
		$.confirm({
			title: '提交订单',
			content: dialogTml.wContent.suggestion,
			buttons: {
				close: {
					text: '取消',
					btnClass: 'btn-default btn-cancel',
					action: function() {}
				},
				ok: {
					text: '确定',
					action: function () {
						var taskIds = [];
						for(var i = 0, len = $params.tasks.length; i < len; i++) {
							taskIds.push(parseInt($params.tasks[i].id));
						}
						var params = {
							taskId: $params.taskId,
							taskIds: taskIds,
							orderNo: $params.orderNo
						}
						var reason = $.trim(this.$content.find('#suggestion').val());
						if(reason) params.reason = reason;
						flow.tasksJump(params, 'complete');
					}
				}
			}
		})
	}


	/**
	 * 页面渲染后执行的事件
	 */
	var setupEvt = function() {
		var $items = $console.find('.choose-items');
		$items.on('click', function() {
			var that = $(this);
			$items.removeClass('choose-items-active');
			that.removeClass('choose-items-active').addClass('choose-items-active');
			$scope.serviceTypeCode = that.data('code');
			console.log($scope.serviceTypeCode);
		})
	}

	/**
	 * 业务类型更新提交
	 */
	function saveData(cb) {
		if(!$scope.serviceTypeCode) {
			$.alert({
				title: '提示',
				content: tool.alert('请选择业务类型！'),
				buttons: {
					ok: {
						text: '确定',
						action: function() {}
					}
				}
			})
			return false;
		}
		$.ajax({
			type: 'post',
			url: $http.api('serviceType/submit/' + $params.taskId, 'cyj'),
			data: {
				serviceTypeCode: $scope.serviceTypeCode,
				orderNo: $params.orderNo
			},
			dataType:"json",
			success: function(result){
				console.log(result);
				if(cb && typeof cb == 'function') {
					cb();
				}
			}
		});
	}
	
	/***
	* 加载页面模板
	*/
	$console.load(router.template('iframe/surviceType'), function() {
		$scope.def.listTmpl = $console.find('#surviceTypetmpl').html();
		$scope.$el = {
			$tbl: $console.find('#surviceTypeTable')
		}
		loadLoanList(function() {
			setupSubmitBar();
		});
	});
});



