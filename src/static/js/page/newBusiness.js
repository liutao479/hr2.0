'use strict';
page.ctrl('newBusiness', function($scope) {
	var $params = $scope.$params,
		$console = render.$console;

	/**
	* 加载产品列表数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadOrderInfo = function(cb) {
		$.ajax({
			type: 'post',
			url: $http.api('product/get', 'cyj'),
			dataType: 'json',
			success: $http.ok(function(result) {
				console.log(result);
				$scope.result = result;
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
	 * 创建订单（提交订单）
	 */
	var setupCommit = function() {
		$.ajax({
			type: 'post',
			url: $http.api('loanOrder/create', 'cyj'),
			dataType: 'json',
			data: {
				productId: $scope.productId
			},
			success: $http.ok(function(result) {
				console.log(result);
				if(!result.data.length) {
					router.render('loanProcess');
					return false;
				}
				router.render('loanProcess/creditMaterialsUpload', {
					taskId: result.data[0].id, 
					orderNo: result.data[0].orderNo,
					tasks: [{
						key: 'creditMaterialsUpload',
						id: result.data[0].id,
						name: '征信材料上传'
					}],
					path: 'loanProcess'
				});
			})
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
			$scope.productId = that.data('id');
			console.log($scope.productId);
		})
	}

	/**
	 * 页面首次加载立即处理事件
	 */
	var evt = function () {
		// 提交订单按钮 
		$console.find('#submitOrders').on('click', function() {
			var that = $(this);
			if(!$scope.productId) {
				$.alert({
					title: '提示',
					content: tool.alert('请选择一种产品！'),
					buttons: {
						ok: {
							text: '确定',
							action: function() {

							}
						}
					}
				})
			} else {
				setupCommit();
			}
		});
	}


	/**
	 * 新建业务时，查找产品列表只有一个则直接创建，否则加载页面选择产品在进行操作
	 */
	loadOrderInfo(function() {
		if($scope.result.data.length == 1) {
			$scope.productId = $scope.result.data[0].productId;
			setupCommit();
		} else {
			$console.load(router.template('iframe/new-business'), function() {
				$scope.def = {
					listTmpl: $console.find('#surviceTypetmpl').html()
				}
				$scope.$el = {
					$loanPanel: $console.find('#surviceTypeTable')
				}
				render.compile($scope.$el.$loanPanel, $scope.def.listTmpl, $scope.result.data, function() {
					setupEvt();
				}, true);
				evt();
			});
		}
	})
	
});
