"use strict";
page.ctrl('loanMaterialsChoose', function($scope) {
	var $params = $scope.$params,
		$console = render.$console;
	// $params.orderNo = 'nfdb2016102421082285';
	// $params.taskId = 80871;
	
	/**
	* 加载贷款材料选择数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadMaterialsChoose = function(cb) {
		$.ajax({
			type: 'post',
			url: $http.api('materialsChoose/index', 'jbs'),
			data: {
				taskId: $params.taskId
				// taskId: 80871
			},
			dataType: 'json',
			success: $http.ok(function(result) {
				console.log(result);
				$scope.result = result;
				setupLocation();
				render.compile($scope.$el.$mainPanel, $scope.def.mainTmpl, result.data.LOANMATERIALS, function() {
					setupEvt();	
				}, true);
				if( cb && typeof cb == 'function' ) {
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
			current: $scope.result.data.loanTask.taskName,
			loanUser: $scope.result.data.loanTask.loanOrder.realName,
			orderDate: $scope.result.data.loanTask.createDateStr
		});
		$location.location();
	}

	/**
	 * 设置立即处理事件
	 */
	var setupEvt = function() {

		// 初始化材料全选按钮
		var $checks = $console.find('.checkbox');
		$checks.each(function() {
			var $itemsSelected = $(this).parent().parent().find('.selected');
			var len = $(this).data('len');
			// 若后面材料项被默认选中的个数和此类别总个数相等，则初始化选中复选框
			if($itemsSelected.length == len) {
				$(this).data('checked', true);
			}

		})

		// 材料项提示文字
		$console.find('.tips-area').hover(function() {
			$(this).find('.tips-content').toggle();
		})

		$console.find('.block-item-data').onselectstart = function(){return false;};
		// 材料项点击事件
		$console.find('.block-item-data').on('click', function() {
			var $parent = $(this).parent().parent();
			if(!$(this).hasClass('selected')) {
				$(this).removeClass('selected').addClass('selected')
			} else {
				$(this).removeClass('selected');
			}
			if($parent.find('.block-item-data').length == $parent.find('.selected').length) {
				$parent.find('.checkbox').addClass('checked').attr('checked', true).html('<i class="iconfont">&#xe659;</i>');
			} else {
				$parent.find('.checkbox').removeClass('checked').attr('checked', false).html('');
			}

		})

		// 初始化复选框
		$checks.checking(function($self) {
			var $items = $self.parent().parent().find('.block-item-data');
			// 复选框回调函数（有问题）
			if($self.attr('checked')) {
				$items.removeClass('selected');
			} else {
				$items.removeClass('selected').addClass('selected');
			}
		});
	}

	/**
	* 设置底部按钮操作栏
	*/
	var setupSubmitBar = function() {
		var $submitBar = $console.find('#submitBar');
		$submitBar.data({
			taskId: $params.taskId
		});
		$submitBar.submitBar(function($el) {
			evt($el);
		});
	}

	/**
	* 底部按钮操作栏事件
	*/
	var evt = function($el) {
		/**
		 * 审核通过按钮
		 */
		$el.find('#taskSubmit').on('click', function() {
			saveData(function() {
				process();
			});
		})
	}

	/**
	 * 跳流程
	 */
	function process() {
		$.confirm({
			title: '提交',
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
						console.log(params);
						tasksJump(params, 'complete');
					}
				}
			}
		})
	}

	/**
	 * 选择项数据保存
	 */
	var saveData = function(cb) {
		// 用于提交所选择的贷款材料项
		var _params = [];
		$console.find('.selected').each(function() {
			var $this = $(this);
			var _item = {
				orderNo: $params.orderNo, //订单号
				materialsCode : $this.data('materialscode'), //材料CODE
				materialsOwnerCode : $this.data('materialsownercode') //材料归属CODE
			}
			_params.push(_item);
		});
		console.log(_params);
		$.ajax({
			type: 'post',
			url: $http.api('materialsChoose/submit/' + $params.taskId, 'jbs'),
			data: JSON.stringify(_params),
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


	$console.load(router.template('iframe/loan-material-select'), function() {
		$scope.def.mainTmpl = $console.find('#materialsChooseTmpl').html();
		$scope.$el = {
			$mainPanel: $console.find('#materialsChoosePanel')
		}
		loadMaterialsChoose(function() {
			setupSubmitBar();
		});
	})
});