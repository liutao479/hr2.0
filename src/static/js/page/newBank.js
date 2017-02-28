'use strict';
page.ctrl('newBank', [], function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		apiParams = {
			
		};


	/***
	* 加载页面模板
	*/
	render.$console.load(router.template('iframe/new-bank'), function() {
		$scope.def.bankListTmpl = render.$console.find('#bankListTmpl').html()
		$scope.$el = {
			$tab: $console.find('#tabsPanel')
		}
	});

}