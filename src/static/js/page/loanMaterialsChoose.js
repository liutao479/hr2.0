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
			current: '贷款材料选择',
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

	var evt = function() {
		// 底部操作按钮事件
		$console.find('#submitOrder').on('click', function() {
			alert(1);
			var that = $(this);
			// saveData(function() {
				// 保存完数据用于提交订单
				$.confirm({
					title: '提交',
					content: dialogTml.wContent.suggestion,
					buttons: {
						'取消': {
				            action: function () {}
				        },
				        '确定': {
				            action: function () {
				            	// 流程跳转
	            				var params = {
									taskIds: [$params.taskId],
									orderNo: $params.orderNo
								}
								console.log(params)
								$.ajax({
									type: 'post',
									url: $http.api('tasks/complete', 'zyj'),
									data: JSON.stringify(params),
									dataType: 'json',
									contentType: 'application/json;charset=utf-8',
									success: $http.ok(function(result) {
										console.log(result);
										var loanTasks = result.data;
										var taskObj = [];
										for(var i = 0, len = loanTasks.length; i < len; i++) {
											var obj = loanTasks[i];
											taskObj.push({
												key: obj.category,
												id: obj.id,
												name: obj.sceneName
											})
										}
										// target为即将跳转任务列表的第一个任务
										var target = loanTasks[0];
										router.render('loanProcess/' + target.category, {
											taskId: target.id, 
											orderNo: target.orderNo,
											tasks: taskObj,
											path: 'loanProcess'
										});
										// router.render('loanProcess');
										// toast.hide();
									})
								})
	            				// router.render('loanProcess');
				            }
				        }
				    }
				})
			// });
			
		})
	}

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
			console.log(1);
			evt();
		});
	})
});