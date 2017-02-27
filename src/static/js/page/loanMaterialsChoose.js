"use strict";
page.ctrl('loanMaterialsChoose', function($scope) {
	var $console = render.$console;

	
	/**
	* 加载贷款材料选择数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadMaterialsChoose = function(_type, cb) {
		$.ajax({
			type: 'post',
			url: $http.api('materialsChoose/index', 'zyj'),
			data: {
				// taskId: $scope.$params.taskId
				taskId: 80871
			},
			dataType: 'json',
			success: $http.ok(function(result) {
				console.log(result);
				$scope.result = result;
				setupLocation();
				render.compile($scope.$el.$mainPanel, $scope.def.mainTmpl, result.data, true);
				setupEvt();
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
			// loanUser: $scope.result.data.loanTask.loanOrder.realName,
			// orderDate: tool.formatDate($scope.result.data.loanTask.createDate, true)
			loanUser: '张三',
			orderDate: '2017-12-12 11:30'
		});
		$location.location();
	}
	/**
	 * 设置立即处理事件
	 */
	var setupEvt = function() {
		$console.find('.checkbox').checking(function($el) {
			var $items = $el.parent().parent().find('.block-item-data');
			// 复选框回调函数（有问题）
			$el.on('click', function() {
				if($el.attr('checked')) {
					$items.removeClass('selected').addClass('selected');
				} else {
					$items.removeClass('selected');
				}
			})
		});

		$console.find('#submitOrders').on('click', function() {
			var that = $(this);
			that.openWindow({
				title: "提交",
				content: wContent.suggestion,
				commit: wCommit.cancelSure
			}, function() {
				$('.w-sure').on('click', function() {
					alert('确定')
				})
			})
		})
	}


	$console.load(router.template('iframe/loan-material-select'), function() {
		$scope.def.mainTmpl = $console.find('#materialsChooseTmpl').html();
		$scope.$el = {
			$mainPanel: $console.find('#materialsChoosePanel')
		}
		loadMaterialsChoose();
	})
});