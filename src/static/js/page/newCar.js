'use strict';
page.ctrl('newCar', [], function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		apiParams = {
			
		};

	var loadCarDetail = function(params, cb) {
		
	}


	/***
	* 加载页面模板
	*/
	render.$console.load(router.template('iframe/new-car'), function() {
		$scope.def = {
			infoTmpl: render.$console.find('#mortgageInfoTmpl').html()
		}
		$scope.$el = {
			$tbl: $console.find('#registerPanel')
		}
		loadCarDetail(apiParams);
	});

}