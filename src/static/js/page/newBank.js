'use strict';
page.ctrl('newBank', [], function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		apiParams = {
			
		};
	var apiMap = {
		bankName: 'http://192.168.0.105:8080/demandBank/getListByOrganId'
	}

	/**
	 * 加载编辑/新建银行详情
	 */
	var loadNewBank = function(cb) {
		$.ajax({
			url: $http.api('demandBank/detail', 'cyj'),
			type: 'post',
			data: {
				bankId: 1
			},
			dataType: 'json',
			success: $http.ok(function(result) {
				console.log(result);
				setupLocation();
				render.compile($scope.$el.$bankPanel, $scope.def.bankTmpl, result.data, true);
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
			current: '新建合作银行'
		});
		$location.location();
	}

	/**
	 * 加载立即处理事件
	 */
	var setupEvt = function() {
		$console.find('#addCard').on('click', function() {
			
		})

		$console.find('.stopUse').on('click', function() {
			alert('停用或者启用');
		})

		$console.find('.deleteItem').on('click', function() {
			alert('删除一条账户');
		})
	}
	

	/***
	* 加载页面模板
	*/
	render.$console.load(router.template('iframe/new-bank'), function() {
		$scope.def = {
			bankTmpl: render.$console.find('#bankTmpl').html()
		}
		$scope.$el = {
			$bankPanel: $console.find('#bankPanel')
		}
		loadNewBank(function() {
			setupEvt();
		});
	});

})