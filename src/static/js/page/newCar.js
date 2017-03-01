'use strict';
page.ctrl('newCar', [], function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		apiParams = {
			
		};

	/**
	 * 加载编辑/新建合作车商详情
	 */
	var loadNewCar = function(cb) {
		$.ajax({
			url: $http.api('demandBank/detail'),
			type: 'post',
			data: {
				bankId: 1
			},
			dataType: 'json',
			success: $http.ok(function(result) {
				console.log(result);
				setupLocation();
				render.compile($scope.$el.$carPanel, $scope.def.carTmpl, result.data, true);
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
			current: '新建合作车商'
		});
		$location.location();
	}

	/**
	 * 加载立即处理事件
	 */
	var setupEvt = function() {
		$console.find('#addCard').on('click', function() {
			
		})
	}


	/***
	* 加载页面模板
	*/
	render.$console.load(router.template('iframe/new-car'), function() {
		$scope.def = {
			carTmpl: render.$console.find('#carTmpl').html()
		}
		$scope.$el = {
			$carPanel: $console.find('#carPanel')
		}
		loadNewCar(function() {
			setupEvt();
		});
	});

})