'use strict';
page.ctrl('preAuditDataAssistant', function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		apiParams = {
			pageNum: $params.pageNum || 1,
		};
	// 查询列表数据
	var search=function(param,callback){
		$.ajax({
			type: 'get',
			dataType:"json",
			url: $http.api('materialInspection'),
			data: param,
			success: $http.ok(function(result) {
				//render.compile($scope.$el.$tab, $scope.def.tabTmpl, result.data, true);
				if(callback && typeof callback == 'function') {
					callback();
				};
			})
		});
	};
	// 页面首次载入时绑定事件
 	var evt = function() {
	/*	$console.off("click",".gocheck").on("click",".gocheck", function() {
			
		});*/
 	};
 	
	// 加载页面模板
	render.$console.load(router.template('iframe/pre-audit-dataAssistant'), function() {
		$scope.def.tabTmpl = render.$console.find('#preAuditDataAssistantTmpl').html();
		$scope.$el = {
			//$tab: $console.find('#roleBarTab'),
		};
		search(apiParams, function() {
			evt();
		});
	});
});



