'use strict';
page.ctrl('preAuditDataAssistant', function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		apiParams = {
			orderNo: $params.orderNo,
			userId: $params.userId,
			sceneCode: $params.sceneCode
		};
	// 查询列表数据
	var search=function(param,callback){
		$.ajax({
			type: 'post',
			dataType:"json",
			url: $http.api('verifyResult/resultDetail'),
			data: param,
			success: $http.ok(function(result) {
				render.compile($scope.$el.$titleDiv, $scope.def.titleTmpl, result.data.loanUser, true);
				render.compile($scope.$el.$listDiv, $scope.def.listTmpl, result.data.data, true);
				if(callback && typeof callback == 'function') {
					callback();
				};
			})
		});
	};
	// 页面首次载入时绑定事件
 	var evt = function() {
		$scope.$el.$backspace.find("a").click(function() {
			var _href=$(this).data('href');
			if(_href){
				router.render(_href);
			};
		});
 	};
 	
	// 加载页面模板
	render.$console.load(router.template('iframe/pre-audit-dataAssistant'), function() {
		$scope.def.titleTmpl = render.$console.find('#titleTmpl').html();
		$scope.def.listTmpl = render.$console.find('#preAuditDataAssistantTmpl').html();
		$scope.$context=$console.find('#pre-audit-dataAssistant');
		$scope.$el = {
			$titleDiv: $scope.$context.find('#titleDiv'),
			$listDiv: $scope.$context.find('#listDiv'),
			$backspace: $scope.$context.find('#backspace'),
		};
		search(apiParams, function() {
			evt();
		});
	});
});



