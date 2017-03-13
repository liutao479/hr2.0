'use strict';
page.ctrl('homeMaterialsUpload', function($scope) {
	var $params = $scope.$params,
		$console = $params.refer ? $($params.refer) : render.$console;
		
	$scope.tasks = $params.tasks;
	$scope.activeTaskIdx = $params.selected || 0;

	/**
	* 加载上门材料上传数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadOrderInfo = function(cb) {
		$.ajax({
			// url: 'http://127.0.0.1:8083/mock/loanMaterialUpload',
			// type: flag,
			type: 'post',
			url: $http.api('materials/index', 'zyj'),
			data: {
				// taskId: $scope.$params.taskId
				taskId: 2
			},
			dataType: 'json',
			success: $http.ok(function(result) {
				console.log(result);
				$scope.result = result;
				$scope.result.tasks = $params.tasks.length;
				if($params.path) {
					setupLocation();	
				}
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
			alert('增加征信人员')
		})

		// 增加征信人员
		$console.find('#submitOrder').on('click', function() {
			alert("提交订单");
		})
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

	/**
	 * 加载页面模板
	 */
	$console.load(router.template('iframe/material-upload'), function() {
		$scope.def = {
			listTmpl: $console.find('#loanUploadTmpl').html()
		}
		$scope.$el = {
			$loanPanel: $console.find('#loanUploadPanel')
		}
		loadOrderInfo(function() {
			router.tab($console.find('#tabPanel'), $scope.tasks, $scope.activeTaskIdx, tabChange);
			evt();
		});
	})

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
